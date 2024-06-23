import assert from "assert";
import {
  SAMPLE_BER,
  SAMPLE_BER_EXPECTED_0ID,
  SAMPLE_DER,
  SAMPLE_DER_EXPECTED_OID,
  SAMPLE_X_509,
  SAMPLE_X_509_EXPECTED_OID,
} from "../src/constant";
import { Parser, parserASN } from "../src/parser";

describe("Typescript Asn.1 Parser", () => {
  const ASN_DER = parserASN(Parser(SAMPLE_DER));
  const ASN_BER = parserASN(Parser(SAMPLE_BER));
  const ASN_X509 = parserASN(Parser(SAMPLE_X_509));

  it("It Should calculate DER Object Identifier ", () => {
    const ASN_DER_OID = ASN_DER.OID;
    assert.equal(ASN_DER_OID.length, SAMPLE_DER_EXPECTED_OID.length);
    for (let i = 0; i < SAMPLE_DER_EXPECTED_OID.length; i++) {
      assert.equal(ASN_DER_OID[i], SAMPLE_DER_EXPECTED_OID[i]);
    }
  });

  it("It Should calculate BER Object Identifier", () => {
    const ASN_BER_OID = ASN_BER.OID;
    assert.equal(ASN_BER_OID.length, SAMPLE_BER_EXPECTED_0ID.length);
    for (let i = 0; i < SAMPLE_BER_EXPECTED_0ID.length; i++) {
      assert.equal(ASN_BER_OID[i], SAMPLE_BER_EXPECTED_0ID[i]);
    }
  });

  it("It Should calculate X.509 Object Identifier", () => {
    const ASN_X509_OID = ASN_X509.OID;
    assert.equal(ASN_X509_OID.length, SAMPLE_X_509_EXPECTED_OID.length);
    for (let i = 0; i < SAMPLE_BER_EXPECTED_0ID.length; i++) {
      assert.equal(ASN_X509_OID[i], SAMPLE_X_509_EXPECTED_OID[i]);
    }
  });
});
