import { Formatter } from "../cli/format.ts";

type JSONRPCResponse<K extends string, T> = {
  jsonrpc: string;
  id: string;
  result: {
    [key in K]: T;
  };
  error: Record<string, unknown>;
};

function createJSONRPCClient(url: string, auth?: string) {
  const headers: Record<string, string> = {};

  if (auth) {
    headers["Authorization"] = auth;
  }

  function req<K extends string, T>(
    method: string,
    params?: Record<string, unknown>
  ): Promise<JSONRPCResponse<K, T>> {
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
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          let message = `Something went while executing the request: ${method}`;
          if (data.error.data) {
            message = data.error.data as string;
          }

          throw new Error(message);
        }

        return data;
      })
      .catch((error) => {
        console.error(Formatter.error(error));

        throw error;
      });
  }

  return req;
}

export { createJSONRPCClient };
