import {
  Resource,
  ResourceTemplate,
  Tool,
} from "@modelcontextprotocol/sdk/types.ts";
import { composeMCPEndpoint } from "./helpers.ts";
import { createJSONRPCClient } from "./json_rpc.ts";

enum MCPMethods {
  TOOLS = "tools/list",
  RESOURCES = "resources/list",
  TEMPLATES = "resources/templates/list",
  CALL = "tools/call",
  READ = "resources/read",
}

export type DrupalProxy = ReturnType<typeof createDrupalProxy>;

function createDrupalProxy(base: string, auth?: string) {
  const url = composeMCPEndpoint(base);
  const call = createJSONRPCClient(url, auth);

  return {
    async tools(): Promise<Tool[]> {
      const data = await call<"tools", Tool[]>(MCPMethods.TOOLS);
      return data.result.tools;
    },
    async resources(): Promise<Resource[]> {
      const data = await call<"resources", Resource[]>(MCPMethods.RESOURCES);

      return data.result.resources;
    },
    async templates(): Promise<ResourceTemplate[]> {
      const data = await call<"resourceTemplates", ResourceTemplate[]>(
        MCPMethods.TEMPLATES
      );
      return data.result.resourceTemplates;
    },
    async call(name: string, args?: Record<string, unknown>) {
      const data = await call<"_", unknown>(MCPMethods.CALL, {
        name,
        arguments: args,
      });
      return data.result;
    },
    async read(params: Record<string, unknown>) {
      const data = await call<"_", unknown>(MCPMethods.READ, params);
      return data.result;
    },
  };
}

export { createDrupalProxy };
