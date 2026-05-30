FROM node:18-alpine

WORKDIR /app

# Install backend deps
COPY server/package*.json ./server/
RUN cd server && npm install

# Install frontend deps
COPY client/package*.json ./client/
RUN cd client && npm install

COPY . .

# Build frontend after source files are copied
RUN cd client && npm run build

EXPOSE 5000

CMD ["node", "server/server.js"]
