# USE THIS to debug!
# CMD ["/bin/sh", "-c", "pwd; ls -la; pwd;"]

FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json  ./
RUN npm install

COPY index.js state.js ./
COPY lib/ ./lib
COPY routes/ ./routes/
COPY middleware/ ./middleware/
COPY setup/ ./setup/
EXPOSE 3000

# this run time
CMD [ "npm","run", "start-dev"]
# CMD ["/bin/sh", "-c", "echo 'pwd'; pwd; ls -la; echo 'end pwd';"]