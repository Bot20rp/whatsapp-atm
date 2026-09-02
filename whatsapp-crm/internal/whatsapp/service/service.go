package service

import (
	"log"
	"whatsapp-crm/internal/whatsapp/client"
)

type Service struct {
	client *client.Client
}

func New(c *client.Client) *Service {
	return &Service{client: c}
}

func (s *Service) HandleIncomingMessage(from, message string) error {
	log.Printf("Message from %s: %s", from, message)

	reply := "Gracias por tu mensaje. Te responderemos pronto."
	_, err := s.client.SendTextMessage(from, reply)
	if err != nil {
		log.Printf("Error sending reply to %s: %v", from, err)
		return err
	}

	log.Printf("Reply sent to %s", from)
	return nil
}

func (s *Service) SendTextMessage(to, message string) error {
	_, err := s.client.SendTextMessage(to, message)
	return err
}

func (s *Service) SendTemplateMessage(to, templateName, langCode string) error {
	_, err := s.client.SendTemplateMessage(to, templateName, langCode)
	return err
}
