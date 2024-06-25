import path from "path";
import Input from "../assets/sample-der-inputs.json";
import Vkey from "../assets/groth16_vkey.json";

export const wasm_path = path.join(process.cwd(), "src/assets/utf8prover.wasm");
export const zkey_path = path.join(process.cwd(), "src/assets/utf8prover.zkey");
export const vkey_path = Vkey;

export const SAMPLE_INPUT = Input;
export type CircuitInput = {
  in: number[];
  oid: number[];
  stateName: number[];
  actualLength: number;
  stateNameLen: number;
  oidLen: number;
  lengthOfOid: number;
  lengthOfUtf8: number;
};
