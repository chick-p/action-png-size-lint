FROM node:24-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends zopfli=1.0.3-1 && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/local/src/image-actions
WORKDIR /usr/local/src/image-actions

COPY package.json package-lock.json /usr/local/src/image-actions/
RUN npm ci

# copy in src
COPY index.js /usr/local/src/image-actions/

ENTRYPOINT ["node", "/usr/local/src/image-actions/index.js"]
