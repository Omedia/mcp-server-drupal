import "@std/dotenv/load";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Server } from "./server.ts";
import { createDrupalProxy } from "./drupal/client.ts";
import { flags, setup } from "./cli/args.ts";
import { preflight } from "./drupal/preflight.ts";
import {
  CallToolRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Formatter } from "./cli/format.ts";
import { Auth } from "./drupal/auth.ts";

if (import.meta.main) {
  setup();
  Auth.validate();

  const transport = new StdioServerTransport();
  const auth = Auth.isEnabled() ? Auth.header() : undefined;
  const client = createDrupalProxy(flags["drupal-url"]!, auth);
  const instruments = await preflight(client);

  for (const { data, key, schema } of instruments) {
    // deno-lint-ignore require-await
    Server.setRequestHandler(schema, async () => {
      return {
        [key]: data,
      };
    });
  }

  Server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return await client.call(request.params.name, request.params.arguments);
  });

  Server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    return await client.read({
      uri: request.params.uri,
    });
  });

  await Server.connect(transport)
    .then(() => {
      console.error(Formatter.info("Drupal MCP server is running on STDIO"));
    })
    .catch((error) => {
      console.error(Formatter.error(error));
      Deno.exit(1);
    });
}
