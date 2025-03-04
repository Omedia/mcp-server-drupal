import { AUTH_MESSAGES } from "../cli/templates.ts";

const AUTH_ENV_VARS = {
  token: Deno.env.get("DRUPAL_AUTH_TOKEN"),
  user: Deno.env.get("DRUPAL_AUTH_USER"),
  pass: Deno.env.get("DRUPAL_AUTH_PASSWORD"),
};

function validate(): void {
  if (AUTH_ENV_VARS.token && (AUTH_ENV_VARS.user || AUTH_ENV_VARS.pass)) {
    console.error(AUTH_MESSAGES.PREVENT_BOTH);
  }

  if (AUTH_ENV_VARS.user && !AUTH_ENV_VARS.pass) {
    console.error(AUTH_MESSAGES.MISSING_PASSWORD);
    Deno.exit(1);
  }

  if (AUTH_ENV_VARS.pass && !AUTH_ENV_VARS.user) {
    console.error(AUTH_MESSAGES.MISSING_USERNAME);
    Deno.exit(1);
  }
}

function header(): string {
  const prefix = "Basic ";

  if (AUTH_ENV_VARS.token) return prefix + btoa(AUTH_ENV_VARS.token);

  return prefix + btoa(`${AUTH_ENV_VARS.user}:${AUTH_ENV_VARS.pass}`);
}

function isEnabled(): boolean {
  return !!(AUTH_ENV_VARS.token || (AUTH_ENV_VARS.user && AUTH_ENV_VARS.pass));
}

const Auth = {
  validate,
  header,
  isEnabled,
};

export { Auth };
