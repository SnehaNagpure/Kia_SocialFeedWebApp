FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
WORKDIR /app/src
EXPOSE 5000
ENV PORT=5000
CMD ["node", "app.js"] 