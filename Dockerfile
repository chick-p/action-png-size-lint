FROM node:24-slim@sha256:dc26ae92c9fb15cf6b1d63e20f0944b2efe0f115b20e00be48fb23fceb061c54

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
