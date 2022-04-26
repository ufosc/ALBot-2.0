FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install ts-node globally, otherwise it won't work
RUN npm i -g ts-node

# Install only production dependencies
RUN npm i --only=production

# Bundle app source
COPY . .

EXPOSE 8080
RUN npm run deploy-commands
CMD ["npm", "run", "start"]