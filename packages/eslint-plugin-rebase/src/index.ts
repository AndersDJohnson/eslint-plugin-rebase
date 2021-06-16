export * from "./plugin";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      ESLINT_REBASE_REBASING?: boolean;
    }
  }
}
