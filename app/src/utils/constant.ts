import Input from "../assets/sample-der-inputs.json";
import Vkey from "../assets/groth16_vkey.json";

// ? need to change once repo is open source

export const wasm_path =
  "https://raw.githubusercontent.com/zkemail/asn1-parser-circom/main/app/src/assets/utf8prover.wasm";
export const zkey_path =
  "https://raw.githubusercontent.com/zkemail/asn1-parser-circom/main/app/src/assets/utf8prover.zkey";
export const vkey_path = Vkey;

export const OPTIONS = ["DER", "BER", "X.509"];

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
  lengthOfUtc: number;
  lengthOfBit: number;
  lengthOfOctet: number;
};

export const SPECIFIC_OIDS = ["2.5.4.6", "2.5.4.8", "2.5.4.7", "2.5.4.10", "2.5.4.11", "2.5.4.3"];
