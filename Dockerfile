FROM node:26-slim@sha256:f879737cd65b6dbf82bc34572bcc88b3580cebd2ba067619febfb0ed5acddd0b

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
