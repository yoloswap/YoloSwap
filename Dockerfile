FROM node:8 as build-env
COPY . /yolo/
WORKDIR /yolo
RUN npm install

FROM node:8-slim
COPY --from=build-env /yolo /yolo
WORKDIR /yolo/server
EXPOSE 3002
CMD ["node", "server.js"]
