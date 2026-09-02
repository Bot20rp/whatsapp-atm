# WhatsApp CRM

Backend en Go para automatizar mensajes mediante el consumo de la WhatsApp Cloud API.

## Inicio

```bash
# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales de Meta Developer

# Ejecutar
go run cmd/api/main.go
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/webhook` | Verificación del webhook |
| POST | `/webhook` | Recepción de mensajes |
| POST | `/send` | Enviar mensaje de texto (`{"to":"549...","message":"Hola"}`) |
| POST | `/send-template` | Enviar template (`{"to":"549...","template_name":"hello_world","lang_code":"es"}`) |
| GET | `/health` | Health check |
