export * as Cert from "./cert";
export * from "./constant";
export * as AsnParser from "./parser";
export * as ParserUtils from "./parser-utils";
export * from "./tag";
export * from "./utils";

import { Circomkit } from "circomkit";

export const circomkit = new Circomkit({
  verbose: false,
  protocol: "groth16",
});
