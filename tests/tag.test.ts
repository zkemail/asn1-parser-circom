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

  it("should have correct number of constraints", async () => {
    await circuit.expectConstraintCount(0);
  });

  it("should classify SEQUENCE CONSTRUCTED correctly", async () => {
    const N = 0x30;
    const { tagClass, tagConstructed, tagNumber } = tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });

  it("should classify OBJECT IDENTIFIER CONSTRUCTED correctly", async () => {
    const N = 0x06;
    const { tagClass, tagConstructed, tagNumber } = tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });

  it("should classify INTEGER correctly", async () => {
    const N = 0x02;
    const { tagClass, tagConstructed, tagNumber } = tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });

  it("should classify BOOLEAN correctly", async () => {
    const N = 0x01;
    const { tagClass, tagConstructed, tagNumber } = tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });

  it("should classify BIT STRING correctly", async () => {
    const N = 0x03;
    const { tagClass, tagConstructed, tagNumber } = tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });

  it("should classify CONTEXT-SPECIFIC CONSTRUCTED correctly", async () => {
    const N = 0xa3;
    const { tagClass, tagConstructed, tagNumber } = tagDecoder(N);
    await circuit.expectPass({ n: N }, { tagClass, tagConstructed, tagNumber });
  });
});
