#!/bin/bash

# Generate self-signed certificate for local HTTPS development
openssl req -x509 -newkey rsa:4096 -keyout localhost-key.pem -out localhost.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

echo "Self-signed certificate generated!"
echo "You can now run: node local-https-server.js"
echo "Access your app at: https://localhost:3001"
