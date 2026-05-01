# Use Node.js 18 as the base image
FROM node:18-slim

# Install Python and essential build tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the entire project to the container
# (We need both backend and ai_integration)
COPY . .

# Install Node.js dependencies for backend
WORKDIR /app/backend
RUN npm install

# Install Python dependencies
WORKDIR /app/ai_integration
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Set the working directory back to backend
WORKDIR /app/backend

# Expose the port the app runs on
EXPOSE 5000

# Command to start the application
CMD ["node", "server.js"]
