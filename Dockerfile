# syntax=docker/dockerfile:1
# SCAM-01: produkcyjny obraz wieloetapowy. Wcześniej obraz uruchamiał serwer deweloperski
# (`next dev`) jako root na 0.0.0.0, z `npm install` zamiast odtwarzalnego `npm ci`.

FROM node:24-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# patch-package (postinstall) potrzebuje katalogu z łatkami.
COPY patches ./patches
RUN npm ci

# Etap deweloperski — tylko dla docker-compose (hot reload z zamontowanym kodem).
FROM deps AS dev
COPY . .
RUN mkdir -p .next && chown -R node:node /app
USER node
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]

FROM deps AS build
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
