import * as snarkjs from "snarkjs";
import { CircuitInput, SAMPLE_INPUT, vkey_path, wasm_path, zkey_path } from "./constant";

export class Proof {
  async generate(input: CircuitInput) {
    try {
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasm_path, zkey_path);
      return { proof, publicSignals };
    } catch (error) {
      console.error("Error generating proof:", error);
      throw error;
    }
  }

  async verify(proof: snarkjs.Groth16Proof, publicSignals: snarkjs.PublicSignals) {
    try {
      const res = await snarkjs.groth16.verify(vkey_path, publicSignals, proof);
      return res;
    } catch (error) {
      console.error("Error verifying proof:", error);
      throw error;
    }
  }
}

// async function main() {
//   const s = new Proof();
//   try {
//     const { proof, publicSignals } = await s.generate(SAMPLE_INPUT);
//     const result = await s.verify(proof, publicSignals);
//     console.log("Verification result:", result);
//   } catch (error) {
//     console.error("Error in proof generation or verification:", error);
//   }
// }

// main().then(() => {
//   process.exit(0);
// });
