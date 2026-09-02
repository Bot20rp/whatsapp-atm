package main

import (
	"whatsapp-crm/internal/config"
	"whatsapp-crm/internal/server"
)

func main() {
	cfg := config.Load()
	server.Run(cfg)
}
