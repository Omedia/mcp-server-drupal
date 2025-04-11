FROM denoland/deno:2.1.5

LABEL org.opencontainers.image.source=https://github.com/Omedia/mcp-server-drupal
LABEL org.opencontainers.image.description="MCP Server for Drupal"
LABEL org.opencontainers.image.licenses=MIT

WORKDIR /app

COPY deno.jsonc deno.lock ./
COPY src ./src

USER deno

RUN deno cache src/mod.ts

ENTRYPOINT ["deno", "run", "--allow-net", "--allow-read","--allow-env" ,"src/mod.ts"]
