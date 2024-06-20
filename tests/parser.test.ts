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

describe("UTF8StringParser", () => {
  let circuit: WitnessTester<["in"], ["out"]>;
  const input = [0x0c, 0x09, 0x48, 0x79, 0x64, 0x65, 0x72, 0x61, 0x62, 0x61, 0x64]; // hyderabad
  const N = input.length;

  before(async () => {
    circuit = await circomkit.WitnessTester(`UTF8StringParser_${N}`, {
      file: "parser",
      template: "UTF8StringParser",
      params: [N],
    });
  });

  it("It Should take parse UTF8String", async () => {
    const expectedOutput = Array.from(Buffer.from("Hyderabad"));
    await circuit.calculateWitness({ in: input });
    await circuit.expectPass({ in: input }, { out: expectedOutput });
  });

  it("It Should take parser UTF8String", async () => {
    const input = [
      0x0c, 0x11, 0x4f, 0x72, 0x67, 0x61, 0x6e, 0x69, 0x7a, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x44, 0x75, 0x6d, 0x6d, 0x79,
    ];
    const expectedOutput = Array.from(Buffer.from("OrganizationDummy"));

    const N = input.length;
    circuit = await circomkit.WitnessTester(`UTF8StringParser_${N}`, {
      file: "parser",
      template: "UTF8StringParser",
      params: [N],
    });
    await circuit.expectPass({ in: input }, { out: expectedOutput });
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
