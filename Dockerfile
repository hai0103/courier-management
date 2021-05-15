FROM keymetrics/pm2:14-alpine
# Bundle APP files
WORKDIR /app
COPY package.json .
RUN npm install
ENTRYPOINT [ "pm2-runtime", "start", "pm2.json" ]