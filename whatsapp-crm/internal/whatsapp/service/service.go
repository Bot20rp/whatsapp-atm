package service

import (
	"fmt"
	"log"
	"sort"
	"sync"
	"time"
	"whatsapp-crm/internal/whatsapp/client"
)

type Service struct {
	client        *client.Client
	mu            sync.RWMutex
	conversations map[string]*Conversation
}

func New(c *client.Client) *Service {
	return &Service{client: c, conversations: make(map[string]*Conversation)}
}

type Conversation struct {
	ID                     string    `json:"id"`
	ContactoNombre         string    `json:"contactoNombre"`
	ContactoTelefono       string    `json:"contactoTelefono"`
	UltimoMensaje          string    `json:"ultimoMensaje"`
	UltimoMensajeTimestamp string    `json:"ultimoMensajeTimestamp"`
	NoLeidos               int       `json:"noLeidos"`
	Estado                 string    `json:"estado"`
	Mensajes               []Message `json:"mensajes,omitempty"`
}

type Message struct {
	ID               string `json:"id"`
	ConversacionID   string `json:"conversacionId"`
	ContactoTelefono string `json:"contactoTelefono"`
	Contenido        string `json:"contenido"`
	Remitente        string `json:"remitente"`
	NombreEmisor     string `json:"nombreEmisor"`
	Timestamp        string `json:"timestamp"`
	Estado           string `json:"estado"`
	Tipo             string `json:"tipo"`
}

func conversationID(to string) string { return "conv_" + to }

func (s *Service) ensureConversation(to string) *Conversation {
	conversation, ok := s.conversations[to]
	if !ok {
		conversation = &Conversation{ID: conversationID(to), ContactoNombre: to, ContactoTelefono: to, Estado: "human"}
		s.conversations[to] = conversation
	}
	return conversation
}

func (s *Service) recordMessage(to, content, sender, senderName, status string) Message {
	now := time.Now().UTC().Format(time.RFC3339Nano)
	message := Message{ID: fmt.Sprintf("msg_%d", time.Now().UnixNano()), ConversacionID: conversationID(to), ContactoTelefono: to, Contenido: content, Remitente: sender, NombreEmisor: senderName, Timestamp: now, Estado: status, Tipo: "texto"}
	conversation := s.ensureConversation(to)
	conversation.Mensajes = append(conversation.Mensajes, message)
	conversation.UltimoMensaje = content
	conversation.UltimoMensajeTimestamp = now
	if sender == "customer" {
		conversation.NoLeidos++
	}
	return message
}

func (s *Service) HandleIncomingMessage(from, message string) error {
	log.Printf("Message from %s: %s", from, message)
	s.mu.Lock()
	s.recordMessage(from, message, "customer", from, "entregado")
	s.mu.Unlock()
	return nil
}

func (s *Service) SendTextMessage(to, message string) error {
	_, err := s.client.SendTextMessage(to, message)
	if err != nil {
		return err
	}
	s.mu.Lock()
	s.recordMessage(to, message, "agent", "Carlos Morales", "enviado")
	s.mu.Unlock()
	return err
}

func (s *Service) ListConversations() []Conversation {
	s.mu.RLock()
	defer s.mu.RUnlock()
	result := make([]Conversation, 0, len(s.conversations))
	for _, conversation := range s.conversations {
		copy := *conversation
		copy.Mensajes = nil
		result = append(result, copy)
	}
	sort.Slice(result, func(i, j int) bool { return result[i].UltimoMensajeTimestamp > result[j].UltimoMensajeTimestamp })
	return result
}

func (s *Service) GetMessages(id, to string) []Message {
	s.mu.RLock()
	defer s.mu.RUnlock()
	if to != "" {
		conversation, ok := s.conversations[to]
		if !ok || conversation.ID != id { return []Message{} }
		return append([]Message(nil), conversation.Mensajes...)
	}
	for _, conversation := range s.conversations {
		if conversation.ID == id { return append([]Message(nil), conversation.Mensajes...) }
	}
	return []Message{}
}

func (s *Service) SendTemplateMessage(to, templateName, langCode string) error {
	_, err := s.client.SendTemplateMessage(to, templateName, langCode)
	return err
}
