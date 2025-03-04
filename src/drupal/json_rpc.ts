import { Formatter } from "../cli/format.ts";

type JSOnRPCResponse<K extends string, T> = {
  jsonrpc: string;
  id: string;
  result: {
    [key in K]: T;
  };
};

function createJSONRPCClient(url: string, auth?: string) {
  const headers: Record<string, string> = {};

  if (auth) {
    headers["Authorization"] = auth;
  }

  function req<K extends string, T>(
    method: string,
    params?: Record<string, unknown>
  ): Promise<JSOnRPCResponse<K, T>> {
    const request = new Request(url, {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        method,
        params: params,
      }),
      headers: headers,
    });

    return fetch(request)
      .then((response) => response.json())
      .catch((error) => {
        console.error(Formatter.error(error));
      });
  }

  return req;
}

export { createJSONRPCClient };
