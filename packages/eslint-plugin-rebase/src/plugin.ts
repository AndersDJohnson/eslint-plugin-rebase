import { processor } from "./processor";

const processors = {
  ".js": processor,
  ".jsx": processor,
  ".ts": processor,
  ".tsx": processor,
};

const plugin = {
  processors,
};

export default plugin;
