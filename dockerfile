# Stage=Build
FROM node:16.5.0-alpine AS builder
RUN apk update && apk --no-cache add python make g++
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
COPY ./ ./
RUN ls -a
RUN yarn install 
RUN yarn build 

# Stage=Execute
FROM node:16.5.0-alpine 
WORKDIR /usr/src/app
RUN apk add yarn
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY --from=builder /usr/src/app/dist ./
EXPOSE 8000
CMD ["node", "index.js"]





