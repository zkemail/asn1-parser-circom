import { WitnessTester } from "circomkit";
import { circomkit } from "../common";
import { ASN } from "../../src/parser";

describe("TagDecoder", () => {
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

  it("It Should check n is 8-bit number", async () => {
    await circuit.expectFail({ n: 129 });
  });

  it("It should decode SEQUENCE CONSTRUCTED correctly", async () => {
    const N = 0x30;
    const { tagClass, tagConstructed, tagNumber } = ASN.tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });

  it("It should decode OBJECT_IDENTIFIER CONSTRUCTED correctly", async () => {
    const N = 0x06;
    const { tagClass, tagConstructed, tagNumber } = ASN.tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });

  it("It should decode INTEGER correctly", async () => {
    const N = 0x02;
    const { tagClass, tagConstructed, tagNumber } = ASN.tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });

  it("It should decode BOOLEAN correctly", async () => {
    const N = 0x01;
    const { tagClass, tagConstructed, tagNumber } = ASN.tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });

  it("It should decode BIT STRING correctly", async () => {
    const N = 0x03;
    const { tagClass, tagConstructed, tagNumber } = ASN.tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });

  it("It should decode VISIBLESTRING correctly", async () => {
    const N = 0x1a;
    const { tagClass, tagConstructed, tagNumber } = ASN.tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });
});
