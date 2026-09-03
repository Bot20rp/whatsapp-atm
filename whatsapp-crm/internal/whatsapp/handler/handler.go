package handler

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"whatsapp-crm/internal/config"
	"whatsapp-crm/internal/whatsapp/service"
)

type Handler struct {
	cfg     *config.Config
	service *service.Service
}

func New(cfg *config.Config, svc *service.Service) *Handler {
	return &Handler{cfg: cfg, service: svc}
}

func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/webhook", h.HandleWebhook)
	mux.HandleFunc("/send", h.HandleSendMessage)
	mux.HandleFunc("/send-template", h.HandleSendTemplate)
	mux.HandleFunc("/conversations", h.HandleConversations)
	mux.HandleFunc("/messages", h.HandleMessages)
}

func (h *Handler) HandleConversations(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	writeJSON(w, h.service.ListConversations())
}

func (h *Handler) HandleMessages(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var payload SendMessagePayload
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil || payload.To == "" || payload.Message == "" {
			http.Error(w, "to and message are required", http.StatusBadRequest)
			return
		}
		if err := h.service.SendTextMessage(payload.To, payload.Message); err != nil {
			http.Error(w, err.Error(), http.StatusBadGateway)
			return
		}
		messages := h.service.GetMessages("conv_"+payload.To, payload.To)
		writeJSON(w, messages[len(messages)-1])
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	id := r.URL.Query().Get("conversation_id")
	to := r.URL.Query().Get("to")
	writeJSON(w, h.service.GetMessages(id, to))
}

func writeJSON(w http.ResponseWriter, value interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(value)
}

func (h *Handler) HandleWebhook(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		h.handleVerification(w, r)
		return
	}
	h.handleMessage(w, r)
}

func (h *Handler) handleVerification(w http.ResponseWriter, r *http.Request) {
	mode := r.URL.Query().Get("hub.mode")
	token := r.URL.Query().Get("hub.verify_token")
	challenge := r.URL.Query().Get("hub.challenge")

	if mode == "subscribe" && token == h.cfg.WhatsAppVerifyToken {
		log.Println("Webhook verified successfully")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(challenge))
		return
	}

	log.Println("Webhook verification failed")
	http.Error(w, "Forbidden", http.StatusForbidden)
}

func (h *Handler) handleMessage(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	var payload map[string]interface{}
	if err := json.Unmarshal(body, &payload); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	go h.processWebhookPayload(payload)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

func (h *Handler) processWebhookPayload(payload map[string]interface{}) {
	entry, ok := payload["entry"].([]interface{})
	if !ok || len(entry) == 0 {
		return
	}

	firstEntry, ok := entry[0].(map[string]interface{})
	if !ok {
		return
	}

	changes, ok := firstEntry["changes"].([]interface{})
	if !ok || len(changes) == 0 {
		return
	}

	change, ok := changes[0].(map[string]interface{})
	if !ok {
		return
	}

	value, ok := change["value"].(map[string]interface{})
	if !ok {
		return
	}

	messages, ok := value["messages"].([]interface{})
	if !ok || len(messages) == 0 {
		return
	}

	msg, ok := messages[0].(map[string]interface{})
	if !ok {
		return
	}

	from, _ := msg["from"].(string)

	text, ok := msg["text"].(map[string]interface{})
	if !ok {
		return
	}
	body, _ := text["body"].(string)

	if err := h.service.HandleIncomingMessage(from, body); err != nil {
		log.Printf("Error handling message: %v", err)
	}
}

type SendMessagePayload struct {
	To      string `json:"to"`
	Message string `json:"message"`
}

func (h *Handler) HandleSendMessage(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var payload SendMessagePayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	if payload.To == "" || payload.Message == "" {
		http.Error(w, "to and message are required", http.StatusBadRequest)
		return
	}

	if err := h.service.SendTextMessage(payload.To, payload.Message); err != nil {
		log.Printf("Error sending message to %s: %v", payload.To, err)
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "sent"})
}

type SendTemplatePayload struct {
	To           string `json:"to"`
	TemplateName string `json:"template_name"`
	LangCode     string `json:"lang_code"`
}

func (h *Handler) HandleSendTemplate(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var payload SendTemplatePayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	if payload.To == "" || payload.TemplateName == "" {
		http.Error(w, "to and template_name are required", http.StatusBadRequest)
		return
	}

	if payload.LangCode == "" {
		payload.LangCode = "es"
	}

	if err := h.service.SendTemplateMessage(payload.To, payload.TemplateName, payload.LangCode); err != nil {
		http.Error(w, "Failed to send template", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "sent"})
}
