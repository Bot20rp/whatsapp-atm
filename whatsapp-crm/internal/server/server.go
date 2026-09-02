package server

import (
	"log"
	"net/http"
	"whatsapp-crm/internal/config"
	"whatsapp-crm/internal/whatsapp/client"
	"whatsapp-crm/internal/whatsapp/handler"
	"whatsapp-crm/internal/whatsapp/service"
)

func Run(cfg *config.Config) {
	waClient := client.New(cfg)
	waService := service.New(waClient)
	waHandler := handler.New(cfg, waService)

	mux := http.NewServeMux()
	waHandler.RegisterRoutes(mux)
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`))
	})

	addr := ":" + cfg.AppPort
	log.Printf("Server starting on %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
