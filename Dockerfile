FROM node:24-slim@sha256:03eae3ef7e88a9de535496fb488d67e02b9d96a063a8967bae657744ecd513f2

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
