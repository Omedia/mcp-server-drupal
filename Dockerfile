FROM denoland/deno:2.1.5

LABEL org.opencontainers.image.source=https://github.com/Omedia/mcp-server-drupal
LABEL org.opencontainers.image.description="MCP Server for Drupal"
LABEL org.opencontainers.image.licenses=MIT

WORKDIR /app

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY deno.jsonc deno.lock ./
COPY src ./src

USER deno

RUN deno cache src/mod.ts

ENTRYPOINT ["/entrypoint.sh"]
