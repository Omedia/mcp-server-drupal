import {
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Formatter } from "../cli/format.ts";
import { DrupalProxy } from "./client.ts";

async function preflight(client: DrupalProxy) {
  try {
    const [tools, resources, templates] = await Promise.all([
      client.tools(),
      client.resources(),
      client.templates(),
    ]);

    const available = [
      { data: tools, key: "tools", schema: ListToolsRequestSchema },
      { data: resources, key: "resources", schema: ListResourcesRequestSchema },
      {
        data: templates,
        key: "resourceTemplates",
        schema: ListResourceTemplatesRequestSchema,
      },
    ].filter(({ data }) => data.length);

    if (!available.length) {
      console.error(
        Formatter.error(
          "No available instruments were found during the preflight check"
        )
      );
      Deno.exit(1);
    }

    return available;
  } catch (error) {
    console.error(Formatter.error(error));
    Deno.exit(1);
  }
}

export { preflight };
