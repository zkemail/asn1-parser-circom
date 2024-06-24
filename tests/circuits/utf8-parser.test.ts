import { WitnessTester } from "circomkit";
import {
  SAMPLE_BER,
  SAMPLE_BER_EXPECTED_STRING,
  SAMPLE_DER,
  SAMPLE_DER_EXPECTED_OID,
  SAMPLE_DER_EXPECTED_STRING,
  SAMPLE_X509_EXPECTED_STRING,
  SAMPLE_X_509,
  SAMPLE_X_509_EXPECTED_OID,
} from "../../src/constant";
import { circomkit } from "../common";

describe("UTF8StringProver X_509", () => {
  let circuit: WitnessTester<["in", "stateName", "oid"], ["out"]>;
  let N = SAMPLE_X_509.length;

  it("It Should take verify (2.5.4.10) => OrganizationDummy", async () => {
    const stateName = Array.from(Buffer.from("OrganizationDummy"));
    const oid = [2, 5, 4, 10];
    circuit = await circomkit.WitnessTester("UTF8StringProver", {
      file: "utf8-parser",
      template: "UTF8StringProver",
      params: [N, stateName.length, oid.length, SAMPLE_X_509_EXPECTED_OID.length, SAMPLE_X509_EXPECTED_STRING.length],
    });
    await circuit.calculateWitness({
      in: SAMPLE_X_509,
      stateName: stateName,
      oid: oid,
    });
  });

  it("It Should take verify (2.5.4.8) => Telagana", async () => {
    const stateName = Array.from(Buffer.from("Telagana"));
    const oid = [2, 5, 4, 8]; // 2.5.4.8

    circuit = await circomkit.WitnessTester("UTF8StringProver", {
      file: "utf8-parser",
      template: "UTF8StringProver",
      params: [N, stateName.length, oid.length, SAMPLE_X_509_EXPECTED_OID.length, SAMPLE_X509_EXPECTED_STRING.length],
    });

    await circuit.calculateWitness({
      in: SAMPLE_X_509,
      stateName: stateName,
      oid: oid,
    });
  });

  it("It Should take inputs (2.5.4.3) => dummywebsite.com", async () => {
    const stateName = Array.from(Buffer.from("dummywebsite.com"));
    const oid = [2, 5, 4, 3];

    circuit = await circomkit.WitnessTester("UTF8StringProver", {
      file: "utf8-parser",
      template: "UTF8StringProver",
      params: [N, stateName.length, oid.length, SAMPLE_X_509_EXPECTED_OID.length, SAMPLE_X509_EXPECTED_STRING.length],
    });

    await circuit.calculateWitness({
      in: SAMPLE_X_509,
      stateName: stateName,
      oid: oid,
    });
  });

  it("It Should fail at wrong utf8", async () => {
    const stateName = Array.from(Buffer.from("wrongInput"));
    const oid = [2, 5, 4, 3]; //

    circuit = await circomkit.WitnessTester("UTF8StringProver", {
      file: "utf8-parser",
      template: "UTF8StringProver",
      params: [N, stateName.length, oid.length, SAMPLE_X_509_EXPECTED_OID.length, SAMPLE_X509_EXPECTED_STRING.length],
    });

    await circuit.expectFail({
      in: SAMPLE_X_509,
      stateName: stateName,
      oid: oid,
    });
  });

  it("It Should fail at wrong oid", async () => {
    const stateName = Array.from(Buffer.from("dummywebsite.com"));
    const oid = [2, 5, 4, 6]; // WRONG OID HERE

    circuit = await circomkit.WitnessTester("UTF8StringProver", {
      file: "utf8-parser",
      template: "UTF8StringProver",
      params: [N, stateName.length, oid.length, SAMPLE_X_509_EXPECTED_OID.length, SAMPLE_X509_EXPECTED_STRING.length],
    });

    await circuit.expectFail({
      in: SAMPLE_X_509,
      stateName: stateName,
      oid: oid,
    });
  });
});

describe("UTF8StringProver DER", () => {
  let circuit: WitnessTester<["in", "stateName", "oid"], ["out"]>;
  let N = SAMPLE_DER.length;

  it("It Should take verify ( 2.5.4.3 ) => test", async () => {
    const stateName = Array.from(Buffer.from("Test"));
    const oid = [2, 5, 4, 3];
    circuit = await circomkit.WitnessTester("UTF8StringProver", {
      file: "utf8-parser",
      template: "UTF8StringProver",
      params: [N, stateName.length, oid.length, SAMPLE_DER_EXPECTED_OID.length, SAMPLE_DER_EXPECTED_STRING.length],
    });

    await circuit.calculateWitness({
      in: SAMPLE_DER,
      stateName: stateName,
      oid: oid,
    });
  });
});

describe("UTF8StringProver BER", () => {
  let circuit: WitnessTester<["in", "stateName", "oid"], ["out"]>;
  let N = SAMPLE_BER.length;

  it("It Should take verify ( 2.5.4.3 ) => test", async () => {
    const stateName = Array.from(Buffer.from("Test"));
    const oid = [2, 5, 4, 3];
    circuit = await circomkit.WitnessTester("UTF8StringProver", {
      file: "utf8-parser",
      template: "UTF8StringProver",
      params: [N, stateName.length, oid.length, SAMPLE_DER_EXPECTED_OID.length, SAMPLE_BER_EXPECTED_STRING.length],
    });

    await circuit.calculateWitness({
      in: SAMPLE_BER,
      stateName: stateName,
      oid: oid,
    });
  });
});
