FROM node:18
WORKDIR /home/app/
COPY . /home/app/
RUN npm install --save-prod
RUN npm run build
EXPOSE 8080
