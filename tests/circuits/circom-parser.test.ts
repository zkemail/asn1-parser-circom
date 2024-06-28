import { WitnessTester } from "circomkit";
import {
  MAX_INPUT_LENGTH,
  MAX_OID_OUTPUT_LENGTH,
  MAX_UTF8_OUTPUT_LENGTH,
  SAMPLE_BER,
  SAMPLE_BER_EXPECTED_0ID,
  SAMPLE_BER_EXPECTED_STRING,
  SAMPLE_DER,
  SAMPLE_DER_EXPECTED_OID,
  SAMPLE_DER_EXPECTED_STRING,
  SAMPLE_X509_EXPECTED_STRING,
  SAMPLE_X_509,
  SAMPLE_X_509_EXPECTED_OID,
} from "../../src/constant";
import { CircuitName, CompileCircuit } from "../../src/utils";
import { circomkit } from "../common";
import { ASN } from "../../src/parser";

describe("DecodeLength", () => {
  let circuit: WitnessTester<["in"], ["out"]>;

  it("Calculate Length for long form", async () => {
    const input = [0x30, 0x82, 0x04, 0x9f];
    const N = input.length;

    circuit = await CompileCircuit(CircuitName.DecodeLength, [N]);
    await circuit.calculateWitness({ in: input });
    await circuit.expectPass({ in: input }, { out: 1183 });
  });

  it("Calculate Length for long form for ObjectIdentifier", async () => {
    const input = [0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x07, 0x02];
    const N = input.length;

    circuit = await CompileCircuit(CircuitName.DecodeLength, [N]);
    await circuit.expectPass({ in: input }, { out: 9 });
  });

  it("Calculate Length for long form for UTCString", async () => {
    const input = [0x17, 0x0d, 0x32, 0x34, 0x30, 0x36, 0x31, 0x38, 0x31, 0x34, 0x34, 0x39, 0x35, 0x35, 0x5a];
    const N = input.length;

    circuit = await CompileCircuit(CircuitName.DecodeLength, [N]);
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

describe("ObjectIdentifierLength", () => {
  let circuit: WitnessTester<["in"], ["out"]>;

  it("It Should take calculate length oid (1.2.840.113549.1.9.15)", async () => {
    let input = [0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x09, 0x0f];
    let N = input.length;
    circuit = await CompileCircuit(CircuitName.ObjectIdentifierLength, [N]);
    await circuit.calculateWitness({ in: input });
    await circuit.expectPass({ in: input }, { out: 7 });
  });

  it("It Should take calculate length oid (2.5.29.14)", async () => {
    let input = [0x55, 0x1d, 0x0e];
    let N = input.length;
    circuit = await CompileCircuit(CircuitName.ObjectIdentifierLength, [N]);
    await circuit.calculateWitness({ in: input });
    await circuit.expectPass({ in: input }, { out: 4 });
  });

  it("It Should take calculate length oid (2.16.840.1.101.3.4.2.1) ", async () => {
    let input = [0x60, 0x86, 0x48, 0x01, 0x65, 0x03, 0x04, 0x01, 0x02];
    let N = input.length;
    circuit = await CompileCircuit(CircuitName.ObjectIdentifierLength, [N]);
    await circuit.calculateWitness({ in: input });
    await circuit.expectPass({ in: input }, { out: 9 });
  });
});

describe("ObjectIdentifierParser", () => {
  let circuit: WitnessTester<["in"], ["out"]>;

  it("It Should take decode oid (1.2.840.113549.1.9.15)", async () => {
    let input = [0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x09, 0x0f];
    let N = input.length;
    let M = ASN.getOIDLength(Uint8Array.from(input));

    circuit = await CompileCircuit(CircuitName.ObjectIdentifierParser, [N, M]);
    await circuit.expectPass({ in: input }, { out: [1, 2, 840, 113549, 1, 9, 15] });
  });

  it("It Should take decode oid (1.2.840.113549.1.7.2)", async () => {
    let input = [0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x07, 0x02];
    let N = input.length;
    let M = ASN.getOIDLength(Uint8Array.from(input));

    circuit = await CompileCircuit(CircuitName.ObjectIdentifierParser, [N, M]);
    await circuit.expectPass({ in: input }, { out: [1, 2, 840, 113549, 1, 7, 2] });
  });

  it("It Should take decode oid (1.2.840.10045.4.3.2)", async () => {
    let input = [0x2a, 0x86, 0x48, 0xce, 0x3d, 0x04, 0x03, 0x02];
    let N = input.length;
    let M = ASN.getOIDLength(Uint8Array.from(input));

    circuit = await CompileCircuit(CircuitName.ObjectIdentifierParser, [N, M]);
    await circuit.expectPass({ in: input }, { out: [1, 2, 840, 10045, 4, 3, 2] });
  });

  it("It Should take decode oid (2.16.840.1.101.3.4.1.42)", async () => {
    let input = [0x60, 0x86, 0x48, 0x01, 0x65, 0x03, 0x04, 0x01, 0x2a];
    let N = input.length;
    let M = ASN.getOIDLength(Uint8Array.from(input));

    circuit = await CompileCircuit(CircuitName.ObjectIdentifierParser, [N, M]);
    await circuit.expectPass({ in: input }, { out: [2, 16, 840, 1, 101, 3, 4, 1, 42] });
  });
  it("It Should take decode oid (2.5.4.3)", async () => {
    let input = [0x55, 0x04, 0x03];
    let N = input.length;
    let M = ASN.getOIDLength(Uint8Array.from(input));

    circuit = await CompileCircuit(CircuitName.ObjectIdentifierParser, [N, M]);
    await circuit.expectPass({ in: input }, { out: [2, 5, 4, 3] });
  });
});

describe("Circom Parser", () => {
  it("It Should take calculate length of der oids & string array", async () => {
    const N = SAMPLE_DER.length;
    let circuit = await CompileCircuit(CircuitName.AsnLength, [N]);

    await circuit.calculateWitness({ in: SAMPLE_DER });
    await circuit.expectPass(
      { in: SAMPLE_DER },
      { out: [SAMPLE_DER_EXPECTED_OID.length, SAMPLE_DER_EXPECTED_STRING.length] }
    );
  });

  it("It Should take calculate length of ber oids & string array", async () => {
    const N = SAMPLE_BER.length;
    let circuit = await CompileCircuit(CircuitName.AsnLength, [N]);

    await circuit.calculateWitness({ in: SAMPLE_BER });
    await circuit.expectPass(
      { in: SAMPLE_BER },
      { out: [SAMPLE_BER_EXPECTED_0ID.length, SAMPLE_BER_EXPECTED_STRING.length] }
    );
  });

  it("It Should take calculate length of X_509 oids & string array", async () => {
    const N = SAMPLE_X_509.length;
    let circuit = await CompileCircuit(CircuitName.AsnLength, [N]);

    await circuit.calculateWitness({ in: SAMPLE_X_509 });
    await circuit.expectPass(
      { in: SAMPLE_X_509 },
      { out: [SAMPLE_X_509_EXPECTED_OID.length, SAMPLE_X509_EXPECTED_STRING.length] }
    );
  });
});

describe("Circom Parser Range Circuit", () => {
  let circuit: WitnessTester<["in", "actualLength", "actualLengthOfOid", "actualLengthOfString"], ["out"]>;
  const N = MAX_INPUT_LENGTH;
  const lengthOfOID = 44;
  const lengthOfString = 4;

  const input = SAMPLE_DER;
  const inputWithPaddingZero = input.concat(Array(N - input.length).fill(0));

  before(async () => {
    circuit = await circomkit.WitnessTester(
      `AsnStartAndEndIndex_${N}_${MAX_OID_OUTPUT_LENGTH}_${MAX_UTF8_OUTPUT_LENGTH}`,
      {
        file: "parser",
        template: "AsnStartAndEndIndex",
        params: [N, MAX_OID_OUTPUT_LENGTH, MAX_UTF8_OUTPUT_LENGTH],
      }
    );
  });
  it("It Should take input", async () => {
    await circuit.calculateWitness({
      in: inputWithPaddingZero,
      actualLength: SAMPLE_DER.length,
      actualLengthOfOid: lengthOfOID,
      actualLengthOfString: lengthOfString,
    });
  });
});

describe("Circom Parser Range Circuit", () => {
  let circuit: WitnessTester<["in", "actualLength", "actualLengthOfOid", "actualLengthOfString"], ["out"]>;
  const N = MAX_INPUT_LENGTH;
  const lengthOfOID = SAMPLE_BER_EXPECTED_0ID.length;
  const lengthOfString = SAMPLE_BER_EXPECTED_STRING.length;

  const input = SAMPLE_BER;
  const inputWithPaddingZero = input.concat(Array(N - input.length).fill(0));

  before(async () => {
    circuit = await circomkit.WitnessTester(
      `AsnStartAndEndIndex_${N}_${MAX_OID_OUTPUT_LENGTH}_${MAX_UTF8_OUTPUT_LENGTH}`,
      {
        file: "parser",
        template: "AsnStartAndEndIndex",
        params: [N, MAX_OID_OUTPUT_LENGTH, MAX_UTF8_OUTPUT_LENGTH],
      }
    );
  });
  it("It Should take input", async () => {
    await circuit.calculateWitness({
      in: inputWithPaddingZero,
      actualLength: SAMPLE_BER.length,
      actualLengthOfOid: lengthOfOID,
      actualLengthOfString: lengthOfString,
    });
  });
});
