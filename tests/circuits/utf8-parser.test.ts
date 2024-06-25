import { WitnessTester } from "circomkit";
import {
  MAX_ACTUAL_OID_LENGTH,
  MAX_ACTUAL_STATE_NAME_LEN,
  MAX_INPUT_LENGTH,
  MAX_OID_OUTPUT_LENGTH,
  MAX_UTF8_OUTPUT_LENGTH,
  SAMPLE_BER,
  SAMPLE_BER_EXPECTED_0ID,
  SAMPLE_BER_EXPECTED_STRING,
  SAMPLE_DER,
  SAMPLE_X_509,
} from "../../src/constant";
import { circomkit } from "../common";

const maxLength = MAX_INPUT_LENGTH;
const maxStateNameLen = MAX_ACTUAL_STATE_NAME_LEN;
const maxOidLen = MAX_ACTUAL_OID_LENGTH;

const maxLengthOfOid = MAX_OID_OUTPUT_LENGTH;
const maxLengthOfUtf8 = MAX_UTF8_OUTPUT_LENGTH;

describe("UTF8-PARSER TEST", () => {
  let circuit: WitnessTester<
    ["in", "oid", "stateName", "actualLength", "stateNameLen", "oidLen", "lengthOfOid", "lengthOfUtf8"],
    ["out"]
  >;
  before(async () => {
    circuit = await circomkit.WitnessTester("UTF8StringProver", {
      file: "utf8-parser",
      template: "UTF8StringProver",
      params: [maxLength, maxStateNameLen, maxOidLen, maxLengthOfOid, maxLengthOfUtf8],
    });
  });
  describe("UTF8StringProver X_509", () => {
    const N = SAMPLE_X_509.length;

    const input = SAMPLE_X_509;
    const inputWithPaddingZeros = input.concat(Array(MAX_INPUT_LENGTH - input.length).fill(0));

    it("It Should take verify (2.5.4.10) => OrganizationDummy", async () => {
      const stateName = Array.from(Buffer.from("OrganizationDummy"));
      const stateWithPaddingZeros = stateName.concat(Array(maxStateNameLen - stateName.length).fill(0));

      const oid = [2, 5, 4, 10];
      const oidWithPaddingZeros = oid.concat(Array(maxOidLen - oid.length).fill(0));

      await circuit.calculateWitness({
        in: inputWithPaddingZeros,
        oid: oidWithPaddingZeros,
        stateName: stateWithPaddingZeros,
        actualLength: N,
        stateNameLen: stateName.length,
        oidLen: oid.length,
        lengthOfOid: SAMPLE_BER_EXPECTED_0ID.length,
        lengthOfUtf8: SAMPLE_BER_EXPECTED_STRING.length,
      });
    });

    it("It Should take verify (2.5.4.8) => Telagana", async () => {
      const stateName = Array.from(Buffer.from("Telagana"));
      const stateWithPaddingZeros = stateName.concat(Array(maxStateNameLen - stateName.length).fill(0));

      const oid = [2, 5, 4, 8]; // 2.5.4.8
      const oidWithPaddingZeros = oid.concat(Array(maxOidLen - oid.length).fill(0));

      await circuit.calculateWitness({
        in: inputWithPaddingZeros,
        oid: oidWithPaddingZeros,
        stateName: stateWithPaddingZeros,
        actualLength: N,
        stateNameLen: stateName.length,
        oidLen: oid.length,
        lengthOfOid: SAMPLE_BER_EXPECTED_0ID.length,
        lengthOfUtf8: SAMPLE_BER_EXPECTED_STRING.length,
      });
    });

    it("It Should take inputs (2.5.4.3) => dummywebsite.com", async () => {
      const stateName = Array.from(Buffer.from("dummywebsite.com"));
      const stateWithPaddingZeros = stateName.concat(Array(maxStateNameLen - stateName.length).fill(0));

      const oid = [2, 5, 4, 3];
      const oidWithPaddingZeros = oid.concat(Array(maxOidLen - oid.length).fill(0));

      await circuit.calculateWitness({
        in: inputWithPaddingZeros,
        oid: oidWithPaddingZeros,
        stateName: stateWithPaddingZeros,
        actualLength: N,
        stateNameLen: stateName.length,
        oidLen: oid.length,
        lengthOfOid: SAMPLE_BER_EXPECTED_0ID.length,
        lengthOfUtf8: SAMPLE_BER_EXPECTED_STRING.length,
      });
    });
    it("It Should fail at wrong utf8", async () => {
      const stateName = Array.from(Buffer.from("wrongInput"));
      const stateWithPaddingZeros = stateName.concat(Array(maxStateNameLen - stateName.length).fill(0));

      const oid = [2, 5, 4, 3];
      const oidWithPaddingZeros = oid.concat(Array(maxOidLen - oid.length).fill(0));

      await circuit.expectFail({
        in: inputWithPaddingZeros,
        oid: oidWithPaddingZeros,
        stateName: stateWithPaddingZeros,
        actualLength: N,
        stateNameLen: stateName.length,
        oidLen: oid.length,
        lengthOfOid: SAMPLE_BER_EXPECTED_0ID.length,
        lengthOfUtf8: SAMPLE_BER_EXPECTED_STRING.length,
      });
    });

    it("It Should fail at wrong oid", async () => {
      const stateName = Array.from(Buffer.from("dummywebsite.com"));
      const stateWithPaddingZeros = stateName.concat(Array(maxStateNameLen - stateName.length).fill(0));

      const oid = [2, 5, 4, 6]; // WRONG OID HERE
      const oidWithPaddingZeros = oid.concat(Array(maxOidLen - oid.length).fill(0));

      await circuit.expectFail({
        in: inputWithPaddingZeros,
        oid: oidWithPaddingZeros,
        stateName: stateWithPaddingZeros,
        actualLength: N,
        stateNameLen: stateName.length,
        oidLen: oid.length,
        lengthOfOid: SAMPLE_BER_EXPECTED_0ID.length,
        lengthOfUtf8: SAMPLE_BER_EXPECTED_STRING.length,
      });
    });
  });

  describe("UTF8StringProver DER", () => {
    let N = SAMPLE_DER.length;

    const input = SAMPLE_DER;
    const inputWithPaddingZeros = input.concat(Array(MAX_INPUT_LENGTH - input.length).fill(0));

    const stateName = Array.from(Buffer.from("Test"));
    const stateWithPaddingZeros = stateName.concat(Array(maxStateNameLen - stateName.length).fill(0));

    const oid = [2, 5, 4, 3];
    const oidWithPaddingZeros = oid.concat(Array(maxOidLen - oid.length).fill(0));

    it("It Should take verify ( 2.5.4.3 ) => test", async () => {
      await circuit.calculateWitness({
        in: inputWithPaddingZeros,
        oid: oidWithPaddingZeros,
        stateName: stateWithPaddingZeros,
        actualLength: N,
        stateNameLen: stateName.length,
        oidLen: oid.length,
        lengthOfOid: SAMPLE_BER_EXPECTED_0ID.length,
        lengthOfUtf8: SAMPLE_BER_EXPECTED_STRING.length,
      });
    });
  });

  describe("UTF8StringProver BER", () => {
    const N = SAMPLE_BER.length;
    const input = SAMPLE_BER;
    const inputWithPaddingZeros = input.concat(Array(MAX_INPUT_LENGTH - input.length).fill(0));

    const stateName = Array.from(Buffer.from("Test"));
    const stateWithPaddingZeros = stateName.concat(Array(maxStateNameLen - stateName.length).fill(0));

    const oid = [2, 5, 4, 3];
    const oidWithPaddingZeros = oid.concat(Array(maxOidLen - oid.length).fill(0));

    it("It Should take verify ( 2.5.4.3 ) => test", async () => {
      await circuit.calculateWitness({
        in: inputWithPaddingZeros,
        oid: oidWithPaddingZeros,
        stateName: stateWithPaddingZeros,
        actualLength: N,
        stateNameLen: stateName.length,
        oidLen: oid.length,
        lengthOfOid: SAMPLE_BER_EXPECTED_0ID.length,
        lengthOfUtf8: SAMPLE_BER_EXPECTED_STRING.length,
      });
    });
  });
});
