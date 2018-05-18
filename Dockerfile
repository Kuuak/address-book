FROM node:8-alpine

WORKDIR /var/www/address-book

COPY . .

RUN npm install
RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "start" ]