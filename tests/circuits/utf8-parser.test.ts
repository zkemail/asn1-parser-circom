import fs from "fs";
import { WitnessTester } from "circomkit";
import {
  MAX_ACTUAL_OID_LENGTH,
  MAX_ACTUAL_STATE_NAME_LEN,
  MAX_BIT_STRING_LENGTH,
  MAX_INPUT_LENGTH,
  MAX_OCTET_STRING_LENGTH,
  MAX_OID_OUTPUT_LENGTH,
  MAX_UTC_TIME_LENGTH,
  MAX_UTF8_OUTPUT_LENGTH,
  SAMPLE_BER,
  SAMPLE_BER_EXPECTED_0ID,
  SAMPLE_BER_EXPECTED_STRING,
  SAMPLE_BER_EXPECTED_UTC,
  SAMPLE_DER,
  SAMPLE_X509_EXPECTED_STRING,
  SAMPLE_X509_EXPECTED_UTC,
  SAMPLE_X_509,
  SAMPLE_X_509_EXPECTED_OID,
} from "../../src/constant";
import { circomkit } from "../common";

const maxLength = MAX_INPUT_LENGTH;
const maxStateNameLen = MAX_ACTUAL_STATE_NAME_LEN;
const maxOidLen = MAX_ACTUAL_OID_LENGTH;
const maxUTCLen = MAX_UTC_TIME_LENGTH;

const maxLengthOfOid = MAX_OID_OUTPUT_LENGTH;
const maxLengthOfUtf8 = MAX_UTF8_OUTPUT_LENGTH;

const maxLengthOfOctet = MAX_OCTET_STRING_LENGTH;
const maxLengthofBit = MAX_BIT_STRING_LENGTH;

describe("UTF8-PARSER TEST", () => {
  let circuit: WitnessTester<
    [
      "in",
      "oid",
      "stateName",
      "actualLength",
      "stateNameLen",
      "oidLen",
      "lengthOfOid",
      "lengthOfUtf8",
      "lengthOfUtc",
      "lengthOfOctet",
      "lengthOfBit"
    ],
    ["out"]
  >;
  before(async () => {
    const params = [
      maxLength,
      maxStateNameLen,
      maxOidLen,
      maxLengthOfOid,
      maxLengthOfUtf8,
      maxUTCLen,
      maxLengthOfOctet,
      maxLengthofBit,
    ];

    circuit = await circomkit.WitnessTester("UTF8StringProver", {
      file: "utf8-parser",
      template: "UTF8StringProver",
      params: params,
    });
    console.log("#params", params);
    console.log("#contraints", await circuit.getConstraintCount());
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

      const wt = await circuit.calculateWitness({
        in: inputWithPaddingZeros,
        oid: oidWithPaddingZeros,
        stateName: stateWithPaddingZeros,
        actualLength: N,
        stateNameLen: stateName.length,
        oidLen: oid.length,
        lengthOfOid: SAMPLE_X_509_EXPECTED_OID.length,
        lengthOfUtf8: SAMPLE_X509_EXPECTED_STRING.length,
        lengthOfUtc: SAMPLE_X509_EXPECTED_UTC.length,
        lengthOfBit: 2,
        lengthOfOctet: 7,
      });
      console.log(wt);
    });

    it("It Should take verify (2.5.4.8) => Telagana", async () => {
      const stateName = Array.from(Buffer.from("Telagana"));
      const stateWithPaddingZeros = stateName.concat(Array(maxStateNameLen - stateName.length).fill(0));

      const oid = [2, 5, 4, 8]; // 2.5.4.8
      const oidWithPaddingZeros = oid.concat(Array(maxOidLen - oid.length).fill(0));
      const s = {
        in: inputWithPaddingZeros,
        oid: oidWithPaddingZeros,
        stateName: stateWithPaddingZeros,
        actualLength: N,
        stateNameLen: stateName.length,
        oidLen: oid.length,
        lengthOfOid: SAMPLE_X_509_EXPECTED_OID.length,
        lengthOfUtf8: SAMPLE_X509_EXPECTED_STRING.length,
        lengthOfUtc: SAMPLE_X509_EXPECTED_UTC.length,
        lengthOfBit: 2,
        lengthOfOctet: 7,
      };
      fs.writeFileSync("test.json", JSON.stringify(s));
      await circuit.expectPass(s);
    });

    it("It Should take inputs (2.5.4.3) => dummywebsite.com", async () => {
      const stateName = Array.from(Buffer.from("dummywebsite.com"));
      const stateWithPaddingZeros = stateName.concat(Array(maxStateNameLen - stateName.length).fill(0));

      const oid = [2, 5, 4, 3];
      const oidWithPaddingZeros = oid.concat(Array(maxOidLen - oid.length).fill(0));

      await circuit.expectPass({
        in: inputWithPaddingZeros,
        oid: oidWithPaddingZeros,
        stateName: stateWithPaddingZeros,
        actualLength: N,
        stateNameLen: stateName.length,
        oidLen: oid.length,
        lengthOfOid: SAMPLE_X_509_EXPECTED_OID.length,
        lengthOfUtf8: SAMPLE_X509_EXPECTED_STRING.length,
        lengthOfUtc: SAMPLE_X509_EXPECTED_UTC.length,
        lengthOfBit: 2,
        lengthOfOctet: 7,
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
        lengthOfOid: SAMPLE_X_509_EXPECTED_OID.length,
        lengthOfUtf8: SAMPLE_X509_EXPECTED_STRING.length,
        lengthOfUtc: SAMPLE_X509_EXPECTED_UTC.length,
        lengthOfBit: 2,
        lengthOfOctet: 7,
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
        lengthOfOid: SAMPLE_X_509_EXPECTED_OID.length,
        lengthOfUtf8: SAMPLE_X509_EXPECTED_STRING.length,
        lengthOfUtc: SAMPLE_X509_EXPECTED_UTC.length,
        lengthOfBit: 2,
        lengthOfOctet: 7,
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
      await circuit.expectPass({
        in: inputWithPaddingZeros,
        oid: oidWithPaddingZeros,
        stateName: stateWithPaddingZeros,
        actualLength: N,
        stateNameLen: stateName.length,
        oidLen: oid.length,
        lengthOfOid: SAMPLE_BER_EXPECTED_0ID.length,
        lengthOfUtf8: SAMPLE_BER_EXPECTED_STRING.length,
        lengthOfUtc: SAMPLE_BER_EXPECTED_UTC.length,
        lengthOfBit: 3,
        lengthOfOctet: 8,
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
      await circuit.expectPass({
        in: inputWithPaddingZeros,
        oid: oidWithPaddingZeros,
        stateName: stateWithPaddingZeros,
        actualLength: N,
        stateNameLen: stateName.length,
        oidLen: oid.length,
        lengthOfOid: SAMPLE_BER_EXPECTED_0ID.length,
        lengthOfUtf8: SAMPLE_BER_EXPECTED_STRING.length,
        lengthOfUtc: SAMPLE_BER_EXPECTED_UTC.length,
        lengthOfBit: 3,
        lengthOfOctet: 18,
      });
    });
  });
});
