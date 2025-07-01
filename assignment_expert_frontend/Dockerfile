# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the Vite dev port
EXPOSE 5173

# Run Vite development server
CMD ["npm", "run", "dev"]
