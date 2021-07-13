FROM node:current-alpine as builder

WORKDIR /
COPY ./package.json ./package.json
RUN npm install  --save --legacy-peer-deps --loglevel=error

COPY ./public ./public
COPY ./src ./src

COPY ./craco.config.js ./craco.config.js
COPY ./tailwind.config.js ./tailwind.config.js
ENV REACT_APP_BACKEND=https://api.imaps.goodwright.com
ENV REACT_APP_DATA=https://data.imaps.goodwright.com
ENV REACT_APP_FILES=https://files.imaps.goodwright.com
RUN npm run build

FROM zzswang/docker-nginx-react:latest
COPY --from=builder /build /app