import { WitnessTester } from "circomkit";
import { SAMPLE_X_509 } from "../../src/constant";
import { circomkit } from "../common";

describe("UTF8StringProver", () => {
  let circuit: WitnessTester<["in", "stateName"]>;
  let N = SAMPLE_X_509.length;
  const stateName = Array.from(Buffer.from("Telagana"));
  before(async () => {
    circuit = await circomkit.WitnessTester("UTF8StringProver", {
      file: "utf8-parser",
      template: "UTF8StringProver",
      params: [N, stateName.length, 43, 15],
    });
  });

  it("It Should take inputs UTF8StringProver", async () => {
    await circuit.calculateWitness({ in: SAMPLE_X_509, stateName: stateName });
  });
});
