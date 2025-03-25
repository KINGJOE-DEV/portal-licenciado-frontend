# Etapa de construção do aplicativo
FROM node:16.15.1-alpine AS builder

WORKDIR /app

COPY . .

# Instalando dependências e construindo o aplicativo React
RUN yarn install && yarn build

# Etapa de execução do Nginx
FROM nginx

COPY ./nginx.conf /etc/nginx/nginx.conf

# Copia o código construído do aplicativo React da etapa de construção para o diretório de conteúdo do Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Define as permissões apropriadas para o diretório de conteúdo do Nginx
RUN chmod -R 755 /usr/share/nginx/html
