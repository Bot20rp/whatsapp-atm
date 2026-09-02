package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"whatsapp-crm/internal/config"
)

type Client struct {
	cfg    *config.Config
	http   *http.Client
	baseURL string
}

func New(cfg *config.Config) *Client {
	return &Client{
		cfg:  cfg,
		http: &http.Client{},
		baseURL: fmt.Sprintf(
			"https://graph.facebook.com/%s/%s",
			cfg.WhatsAppAPIVersion,
			cfg.WhatsAppPhoneNumberID,
		),
	}
}

type MessageRequest struct {
	MessagingProduct string      `json:"messaging_product"`
	To               string      `json:"to"`
	Type             string      `json:"type"`
	Text             *TextBody   `json:"text,omitempty"`
	Template         *TemplateBody `json:"template,omitempty"`
}

type TextBody struct {
	Body string `json:"body"`
}

type TemplateBody struct {
	Name     string         `json:"name"`
	Language TemplateLang   `json:"language"`
}

type TemplateLang struct {
	Code string `json:"code"`
}

type MessageResponse struct {
	Messages []struct {
		ID string `json:"id"`
	} `json:"messages"`
}

func (c *Client) doRequest(reqBody interface{}) (*MessageResponse, error) {
	body, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequest("POST", c.baseURL+"/messages", bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.cfg.WhatsAppAccessToken)

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API error (%d): %s", resp.StatusCode, string(respBody))
	}

	var msgResp MessageResponse
	if err := json.Unmarshal(respBody, &msgResp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	return &msgResp, nil
}

func (c *Client) SendTextMessage(to, message string) (*MessageResponse, error) {
	return c.doRequest(MessageRequest{
		MessagingProduct: "whatsapp",
		To:               to,
		Type:             "text",
		Text:             &TextBody{Body: message},
	})
}

func (c *Client) SendTemplateMessage(to, templateName, langCode string) (*MessageResponse, error) {
	return c.doRequest(MessageRequest{
		MessagingProduct: "whatsapp",
		To:               to,
		Type:             "template",
		Template: &TemplateBody{
			Name:     templateName,
			Language: TemplateLang{Code: langCode},
		},
	})
}
