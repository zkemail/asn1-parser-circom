import { WitnessTester } from "circomkit";
import { circomkit } from "./common";
import { SAMPLE_DER } from "../src/constant";
import { CircuitName, CompileCircuit } from "../src/utils";

describe("DecodeLength", () => {
  let circuit: WitnessTester<["in"], ["out"]>;

  it("Calculate Length for long form", async () => {
    const input = [0x30, 0x82, 0x04, 0x9f];
    const N = input.length;

    circuit = await CompileCircuit(CircuitName.DecodeLength, N);
    await circuit.calculateWitness({ in: input });
    await circuit.expectPass({ in: input }, { out: 1183 });
  });

  it("Calculate Length for long form for ObjectIdentifier", async () => {
    const input = [0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x07, 0x02];
    const N = input.length;

    circuit = await CompileCircuit(CircuitName.DecodeLength, N);
    await circuit.expectPass({ in: input }, { out: 9 });
  });

  it("Calculate Length for long form for UTCString", async () => {
    const input = [0x17, 0x0d, 0x32, 0x34, 0x30, 0x36, 0x31, 0x38, 0x31, 0x34, 0x34, 0x39, 0x35, 0x35, 0x5a];
    const N = input.length;

    circuit = await CompileCircuit(CircuitName.DecodeLength, N);
    await circuit.expectPass({ in: input }, { out: 13 });
  });
});

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
    await circuit.calculateWitness({ in: SAMPLE_DER });
  });
});
