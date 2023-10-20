FROM node:21-slim

RUN mkdir -p /usr/local/src/image-actions
WORKDIR /usr/local/src/image-actions

COPY package.json package-lock.json /usr/local/src/image-actions/
RUN npm install

# copy in src
COPY index.js /usr/local/src/image-actions/

ENTRYPOINT ["node", "/usr/local/src/image-actions/index.js"]
