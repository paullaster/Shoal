# build stage
FROM node:21.6.2-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

# Add nginx config
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# RUN envsubst /app < /temp/prod.conf > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]