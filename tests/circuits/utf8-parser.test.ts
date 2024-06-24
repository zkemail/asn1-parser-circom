import { WitnessTester } from "circomkit";
import { SAMPLE_X509_EXPECTED_STRING, SAMPLE_X_509, SAMPLE_X_509_EXPECTED_OID } from "../../src/constant";
import { circomkit } from "../common";

describe("UTF8StringProver", () => {
  let circuit: WitnessTester<["in", "stateName", "oid"], ["out"]>;
  let N = SAMPLE_X_509.length;
  const stateName = Array.from(Buffer.from("Telagana"));
  const oid = [2, 5, 4, 8];

  before(async () => {
    circuit = await circomkit.WitnessTester("UTF8StringProver", {
      file: "utf8-parser",
      template: "UTF8StringProver",
      params: [N, stateName.length, oid.length, SAMPLE_X_509_EXPECTED_OID.length, SAMPLE_X509_EXPECTED_STRING.length],
    });
  });

  it("It Should take inputs UTF8StringProver", async () => {
    const witness = await circuit.calculateWitness({
      in: SAMPLE_X_509,
      stateName: stateName,
      oid: oid,
    });
    // const ak = await circuit.readWitnessSignals(witness, ["out"]);
    // console.log(ak);
  });
});