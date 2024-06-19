import { WitnessTester } from "circomkit";
import { circomkit } from "./common";
import { SAMPLE_DER } from "../src/constant";

describe("Parser", () => {
  let circuit: WitnessTester<["in"], ["out"]>;
  const N = SAMPLE_DER.length;

  console.log(N);
  before(async () => {
    circuit = await circomkit.WitnessTester(`AsnParser_${N}`, {
      file: "parser",
      template: "AsnParser",
      params: [N],
    });
  });

  it("It Should take inputs", async () => {
    const witness = await circuit.calculateWitness({ in: SAMPLE_DER });
  });
});
