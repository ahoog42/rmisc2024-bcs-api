FROM node:20-bookworm-slim AS node
FROM node AS builder
WORKDIR /app            
COPY package*.json ./   
RUN npm i
COPY . .                

FROM node AS final
ENV NODE_ENV production
RUN apt update && apt install -y \
		&& rm -rf /var/lib/apt/lists/*
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
COPY --chown=node:node --from=builder /app .
EXPOSE 3001
ENTRYPOINT ["node", "./bin/www"] 