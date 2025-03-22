# MCP Server for Drupal

![image](https://github.com/user-attachments/assets/3fc18e9b-acd6-4490-8f43-504d812354dc)

This is a typescript based companion
[Model Context Protocol(MCP)](https://modelcontextprotocol.io/introduction)
server for the [Drupal MCP module](https://www.drupal.org/project/mcp) that
works with the `STDIO` transport. In order to use `SSE` transport this server is
not required.

> [!IMPORTANT]
> Both the Drupal module and this server are in active development. Use them at
> your own risk.

## Installation and Usage

- Download the binary for your system from the
  [releases](https://github.com/Omedia/mcp-server-drupal/releases) page

- To use it with [Claude Desktop](https://claude.ai/download) you need to add
  the server config in the `claude_desktop_config.json` file. The file is
  located at the following path:

  - On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
  - On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

  ```json
  {
    "mcpServers": {
      "mcp-server-drupal": {
        "command": "__BINARY_PATH__",
        "args": ["--drupal-url", "__DRUPAL_BASE_URL__"],
        "env": {}
      }
    }
  }
  ```

  - `--drupal-url` is a required argument
  - Replace `__BINARY_PATH__` with the path to the downloaded binary
  - Replace `__DRUPAL_BASE_URL__` with the base URL of your Drupal site

- To check the server and sdk version run the following command:

```bash
mcp-server-drupal --version
```

- To check the available commands run the following command:

```bash
mcp-server-drupal --help
```

### Alternative usage

The server is also available as a deno module on [JSR](https://jsr.io/@omedia/mcp-server-drupal) so you can use via `npx`

```bash

{
  "mcpServers": {
    "mcp-server-drupal": {
      "command": "npx",
      "args": [
        "-y",
        "deno",
        "run",
        "-A",
        "jsr:@omedia/mcp-server-drupal@<VERSION>",
        "--drupal-url",
        "__DRUPAL_BASE_URL__"
      ],
      "env": {}
    }
  }
}
```


## Authentication

The server supports both authentication via environment variables. You can use either a auth token or a basic auth with username and password combination . The following environment variables are supported:

- `DRUPAL_AUTH_TOKEN`: The authentication token.
- `DRUPAL_AUTH_USER`: The username for authentication.
- `DRUPAL_AUTH_PASSWORD`: The password for authentication.

> [!NOTE]
> Make sure to turn the authentication on the Drupal MCP module settings page.

> [!NOTE]
> If both `DRUPAL_AUTH_TOKEN` and `DRUPAL_AUTH_USER`/`DRUPAL_AUTH_PASSWORD` are set, the token will be used over the username and password.

Example usage with token:

```json
{
  "mcpServers": {
    "mcp-server-drupal": {
      "command": "__BINARY_PATH__",
      "args": ["--drupal-url", "__DRUPAL_BASE_URL__"],
      "env": {
        "DRUPAL_AUTH_TOKEN": "<AUTH_TOKEN>"
      }
    }
  }
}
```

Example usage with username and password:

```json
{
  "mcpServers": {
    "mcp-server-drupal": {
      "command": "__BINARY_PATH__",
      "args": ["--drupal-url", "__DRUPAL_BASE_URL__"],
      "env": {
        "DRUPAL_AUTH_USER": "<BASIC_AUTH_USERNAME>",
        "DRUPAL_AUTH_PASSWORD": "<BASIC_AUTH_PASSWORD>"
      }
    }
  }
}
```

## MCP

- All instruments are defined by the Drupal API during the initialization phase

> [!NOTE]
> The server now exposes the following
>
> - Resources (templates, reads)
> - Tools (calls)
>
> No prompts are exposed by the server for now

## Development

This project is built with [Deno](https://deno.land/).

> [!NOTE]
> Use deno version `2.0.0` or above

Install dependencies:

```bash
deno install
```

For development with auto-rebuild:

```bash
bun task dev
```

Build the server:

```bash
deno task build --output build/mcp-server-drupal
```

> [!TIP]
> To build for the specific platform use the `--target` flag and check the
> [docs](https://docs.deno.com/runtime/reference/cli/compile/#supported-targets)

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We
recommend using the
[MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is
available as a deno task:

```bash
deno task inspector --drupal-url [DRUPAL_BASE_URL]
```

## Verifying the binaries

`drupal_mcp_server` binaries are signed by [cosign](https://github.com/sigstore/cosign) using identity-based signing. You can verify your binary by downloading the `signatures.tar.gz` file from the release page, extracting the signature and running the following command:

```bash
cosign verify-blob ${YOUR_BINARY_NAME} \
--bundle signatures/${YOUR_BINARY_NAME}.bundle \
--certificate-oidc-issuer https://token.actions.githubusercontent.com \
--certificate-identity-regexp https://github.com/Omedia/mcp-server-drupal/.github/workflows/release.yml@refs/tags/v \
--certificate-github-workflow-repository Omedia/mcp-server-drupal
```