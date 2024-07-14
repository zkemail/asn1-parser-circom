import * as snarkjs from "snarkjs";
const wasm_path = "build/utf8prover_js/utf8prover.wasm";
const zkey_path = "build/utf8prover_0001.zkey";
const vkey_path = "build/verification_key.json";
export class Utf8CircuitProver {
  static async generate(input: any) {
    try {
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasm_path, zkey_path);
      return { proof, publicSignals };
    } catch (error) {
      console.error("Error generating proof:", error);
      throw error;
    }
  }

  static async verify(proof: snarkjs.Groth16Proof, publicSignals: snarkjs.PublicSignals) {
    try {
      const res = await snarkjs.groth16.verify(vkey_path, publicSignals, proof);
      return res;
    } catch (error) {
      console.error("Error verifying proof:", error);
      throw error;
    }
  }
}
