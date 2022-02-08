FROM node:14.18.3

RUN mkdir -p /var/app
WORKDIR /var/app

# Install dependencies
COPY package.json ./
COPY .npmrc ./
RUN npm i

# Build
COPY . .
RUN npm run build

# Release
EXPOSE 80

CMD [ "node", "server" ]