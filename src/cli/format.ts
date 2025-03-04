import { bold, green, red, yellow } from "@std/fmt/colors";

const Formatter = {
  error(err: unknown) {
    return `\n${bold(red("ERROR:"))} ${err}`;
  },
  info(msg: string) {
    return `\n${bold(green("INFO:"))} ${msg}`;
  },
  warning: (msg: string) => `\n${bold(yellow("WARNING:"))} ${msg}`,
};

export { Formatter };
