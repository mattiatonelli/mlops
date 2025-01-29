FROM node:lts-alpine3.18

WORKDIR /frontend

RUN npx create-vite@latest . --template react-ts && \
    npm install && \
    npm install lucide-react

COPY src/components/ src/shared/ src/App.tsx src/main.tsx /src/

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]