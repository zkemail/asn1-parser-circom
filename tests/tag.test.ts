import { WitnessTester } from "circomkit";
import { circomkit } from "./common";
import { tagDecoder } from "../src/tag";

describe("Tag Decoder Tests", () => {
  let circuit: WitnessTester<["n"], ["tagClass", "tagConstructed", "tagNumber"]>;

  before(async () => {
    circuit = await circomkit.WitnessTester("tagDecoder", {
      file: "tag",
      template: "TagDecoder",
    });
  });

  it("It should have correct number of constraints", async () => {
    await circuit.expectConstraintCount(0);
  });

  it("It Should check n is non zero", async () => {
    await circuit.expectFail({ n: 0x00 });
  });

  it("It should decode SEQUENCE CONSTRUCTED correctly", async () => {
    const N = 0x30;
    const { tagClass, tagConstructed, tagNumber } = tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });

  it("It should decode OBJECT_IDENTIFIER CONSTRUCTED correctly", async () => {
    const N = 0x06;
    const { tagClass, tagConstructed, tagNumber } = tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });

  it("It should decode INTEGER correctly", async () => {
    const N = 0x02;
    const { tagClass, tagConstructed, tagNumber } = tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });

  it("It should decode BOOLEAN correctly", async () => {
    const N = 0x01;
    const { tagClass, tagConstructed, tagNumber } = tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });

  it("It should decode BIT STRING correctly", async () => {
    const N = 0x03;
    const { tagClass, tagConstructed, tagNumber } = tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });

  it("It should decode CONTEXT-SPECIFIC CONSTRUCTED correctly", async () => {
    const N = 0xa3;
    const { tagClass, tagConstructed, tagNumber } = tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });
});
