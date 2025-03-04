import { parseArgs } from "@std/cli";
import {
  DRUPAL_URL_REQUIRED,
  HELP_MESSAGE,
  VERSION_FRAME,
} from "./templates.ts";

const flags = parseArgs(Deno.args, {
  boolean: ["help", "version"],
  string: ["drupal-url", "build-sdk-version", "build-app-version"],
  default: {
    ["build-sdk-version"]: "dev",
    ["build-app-version"]: "dev",
  },
});

function setup() {
  if (flags.help) {
    console.info(HELP_MESSAGE);
    Deno.exit(0);
  }

  if (flags.version) {
    console.log(
      VERSION_FRAME(flags["build-app-version"]!, flags["build-sdk-version"]!)
    );
    Deno.exit(0);
  }

  if (!flags["drupal-url"]) {
    console.error(DRUPAL_URL_REQUIRED);
    Deno.exit(1);
  }

  Deno.addSignalListener("SIGINT", () => {
    Deno.exit(0);
  });
}

export { flags, setup };
