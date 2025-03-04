import { bold, cyan, yellow } from "@std/fmt/colors";
import { Formatter } from "./format.ts";

const HELP_MESSAGE = `
${bold("Usage:")} ${yellow("mcp-server-drupal [OPTIONS]")}

${bold("Options:")}
  ${cyan("--drupal-url")}          The URL of the Drupal site
  ${cyan("--version")}             The version of the server

${bold(yellow("Drupal Module:"))}  https://www.drupal.org/project/mcp
${bold(yellow("Docs:"))}           https://mcp-77a54f.pages.drupalcode.org
`;

const DRUPAL_URL_REQUIRED = Formatter.error(`${cyan(
  "--drupal-url"
)} is required, please provide the URL of the Drupal instance
`);

const VERSION_FRAME = (core: string, sdk: string) => `
MCP Server: ${yellow(core)}
MCP SDK:    ${yellow(sdk)}
`;

const AUTH_MESSAGES = {
  PREVENT_BOTH: Formatter.warning(
    `Both ${cyan("DRUPAL_AUTH_TOKEN")} and ${cyan(
      "DRUPAL_AUTH_USER"
    )} with ${cyan("DRUPAL_AUTH_PASSWORD")} are set. ${bold(
      yellow("Using token over user and pass.")
    )}`
  ),
  MISSING_PASSWORD: Formatter.error(
    `${cyan("DRUPAL_AUTH_PASSWORD")} is required when ${cyan(
      "DRUPAL_AUTH_USER"
    )} is set`
  ),
  MISSING_USERNAME: Formatter.error(
    `${cyan("DRUPAL_AUTH_USER")} is required when ${cyan(
      "DRUPAL_AUTH_PASS"
    )} is set`
  ),
};

export { DRUPAL_URL_REQUIRED, HELP_MESSAGE, AUTH_MESSAGES, VERSION_FRAME };
