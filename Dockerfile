# Use Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the project (only needed if using TypeScript)
RUN npm run build

# Expose the port (matches your Express server)
EXPOSE 8000

# Start the server
CMD ["node", "dist/server.js"]
