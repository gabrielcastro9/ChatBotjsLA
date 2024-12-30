# Use uma imagem do Node.js com Puppeteer
FROM node:18-slim

# Instale as dependências do Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Instale as dependências do seu projeto
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copie o código do seu bot
COPY . .

# Inicie o bot
CMD ["node", "index.js"]
