# MCP Server for Drupal

![image](https://github.com/user-attachments/assets/3fc18e9b-acd6-4490-8f43-504d812354dc)

This is a typescript based companion [Model Context Protocol(MCP)](https://modelcontextprotocol.io/introduction) server for the [Drupal MCP module](https://www.drupal.org/project/mcp) that works with the `STDIO` transport. In order to use `SSE` transport this server is not required.

> [!IMPORTANT]
> 📖 Detailed docs are avilable at [drupalmcp.io](https://drupalmcp.io/en)

## Installation

The STDIO Binary is available through multiple distribution channels to accommodate various environments:

- [Docker container](https://github.com/Omedia/mcp-server-drupal/pkgs/container/mcp-server-drupal)
- [Compiled binary](https://github.com/Omedia/mcp-server-drupal/releases)
- [JSR package](https://jsr.io/@omedia/mcp-server-drupal)

Here is a quick example of how to use the server with `docker`:

```json
{
  "mcpServers": {
    "mcp-server-drupal": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "ghcr.io/omedia/mcp-server-drupal",
        "--drupal-url=__DRUPAL_BASE_URL_"
      ],
      "env": {}
    }
  }
}
```

📖 For more details check the [Installation](http://drupalmcp.io/en/mcp-server/stdio-transport/#installation) section in the docs

## Authentication

The server supports both authentication via environment variables. You can use either a auth token or a basic auth with username and password combination . The following environment variables are supported:

- `DRUPAL_AUTH_TOKEN`: The authentication token.
- `DRUPAL_AUTH_USER`: The username for authentication.
- `DRUPAL_AUTH_PASSWORD`: The password for authentication.

> [!NOTE]
> Make sure to turn the authentication on the Drupal MCP module settings page.

> [!NOTE]
> If both `DRUPAL_AUTH_TOKEN` and `DRUPAL_AUTH_USER`/`DRUPAL_AUTH_PASSWORD` are set, the token will be used over the username and password.

📖 Check the [Authentication](http://drupalmcp.io/en/mcp-server/stdio-transport/#authentication) section in the docs for more details

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

## Verifying the binaries and images

`drupal_mcp_server` binaries and container images are signed by [cosign](https://github.com/sigstore/cosign) using identity-based signing.

You can verify your binary by downloading the `signatures.tar.gz` file from the release page, extracting the signature and running the following command:

```bash
cosign verify-blob ${YOUR_BINARY_NAME} \
--bundle signatures/${YOUR_BINARY_NAME}.bundle \
--certificate-oidc-issuer https://token.actions.githubusercontent.com \
--certificate-identity-regexp https://github.com/Omedia/mcp-server-drupal/.github/workflows/release.yml@refs/tags/v \
--certificate-github-workflow-repository Omedia/mcp-server-drupal
```

On the container side you can verify the image by running the following command:

```bash
cosign verify ghcr.io/omedia/mcp-server-drupal:latest \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  --certificate-identity-regexp "https://github.com/Omedia/mcp-server-drupal/.github/workflows/release.yml@refs/tags/v"
```
