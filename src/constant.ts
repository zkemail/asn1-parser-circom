import { readAndParseDer } from "./cert";

export const MAX_INPUT_LENGTH = 20000;
export const MAX_OID_OUTPUT_LENGTH = 45;
export const MAX_UTF8_OUTPUT_LENGTH = 35;
export const MAX_UTC_TIME_LENGTH = 10;
export const MAX_BIT_STRING_LENGTH = 80;
export const MAX_OCTET_STRING_LENGTH = 80;

export const MAX_ACTUAL_STATE_NAME_LEN = 30;
export const MAX_ACTUAL_OID_LENGTH = 30;

export const ASN1_TAGS = {
  SEQUENCE: 0x30,
  SET: 0x31,
  CONTEXT_SPECIFIC_0: 0xa0,
  CONTEXT_SPECIFIC_1: 0xa1,
  CONTEXT_SPECIFIC_3: 0xa3,
  CONTEXT_SPECIFIC_4: 0xa4,
  OCTET_STRING: 0x04,
  OBJECT_IDENTIFIER: 0x06,
  UTC_TIME: 0x17,
  BIG_STRING: 0x03,
};

export const MAX_STATE_NAME_LEN = 30;
export const MAX_OID_LENGTH = 30;

export const SAMPLE_X_509: number[] = Array.from(readAndParseDer("X.509.txt"));
export const SAMPLE_DER: number[] = Array.from(readAndParseDer("sig-p256-der.txt"));
export const SAMPLE_BER: number[] = Array.from(readAndParseDer("sig-p256-ber.txt"));

// ? EACH LINE IS ASN.1 SINGLE IN OUTPUT FOR X_509
// 30 82 04 9F
// 06 09 2A 86 48 86 F7 0D 01 07 02
// A0 82 04 90
// 30 82 04 8C
// 02 01 01
// 31 0D
// 30 0B
// 06 09 60 86 48 01 65 03 04 02 01
// 30 3F
// 06 09 2A 86 48 86 F7 0D 01 07 01
// A0 32 04 30 74 68 69 73 20 69 73 20 64 61 74 61 20 66  72 6F 6D 20 64 61 74 61 2E 74 78 74 20 66 69 6C 65 20 63 72 65 61 74 65 64 20 62 79 20 76 69 6B  61 73
// A0 82 02 4D
// 30 82 02 49
// 30 82 01 EF
// A0 03
// 02 01 02
// 02 14 3A 00 AC 98 A0 3D BF 46 B6 72 7D E9 65 75 E8 94 0C 51 AC BA
// 30 0A
// 06 08 2A 86 48  CE 3D 04 03 02
// 30 7A
// 31 0B
// 30 09
// 06 03 55 04 06
// 13 02 49 4E
// 31 11
// 30 0F
// 06 03 55 04 08
// 0C 08 54 65 6C 61 67 61 6E 61
// 31 12
// 30 10
// 06 03 55 04 07
// 0c 09 48 79 64 65 72 61 62 61 64

export const SAMPLE_X_509_EXPECTED_OID = [
  "1.2.840.113549.1.7.2",
  "2.16.840.1.101.3.4.2.1",
  "1.2.840.113549.1.7.1",
  "1.2.840.10045.4.3.2",
  "2.5.4.6",
  "2.5.4.8",
  "2.5.4.7",
  "2.5.4.10",
  "2.5.4.11",
  "2.5.4.3",
  "2.5.4.6",
  "2.5.4.8",
  "2.5.4.7",
  "2.5.4.10",
  "2.5.4.11",
  "2.5.4.3",
  "1.2.840.10045.2.1",
  "1.2.840.10045.3.1.7",
  "2.5.29.14",
  "2.5.29.35",
  "2.5.29.19",
  "1.2.840.10045.4.3.2",
  "2.5.4.6",
  "2.5.4.8",
  "2.5.4.7",
  "2.5.4.10",
  "2.5.4.11",
  "2.5.4.3",
  "2.16.840.1.101.3.4.2.1",
  "1.2.840.113549.1.9.3",
  "1.2.840.113549.1.7.1",
  "1.2.840.113549.1.9.5",
  "1.2.840.113549.1.9.4",
  "1.2.840.113549.1.9.15",
  "2.16.840.1.101.3.4.1.42",
  "2.16.840.1.101.3.4.1.22",
  "2.16.840.1.101.3.4.1.2",
  "1.2.840.113549.3.7",
  "1.2.840.113549.3.2",
  "1.2.840.113549.3.2",
  "1.3.14.3.2.7",
  "1.2.840.113549.3.2",
  "1.2.840.10045.4.3.2",
];

export const SAMPLE_DER_EXPECTED_OID = [
  "1.2.840.113549.1.7.2",
  "2.16.840.1.101.3.4.2.1",
  "1.2.840.113549.1.7.1",
  "1.2.840.10045.4.3.2",
  "2.5.4.3",
  "2.5.4.3",
  "1.2.840.10045.2.1",
  "1.2.840.10045.3.1.7",
  "2.5.29.15",
  "2.5.29.14",
  "2.5.29.35",
  "1.2.840.10045.4.3.2",
  "2.5.4.3",
  "2.16.840.1.101.3.4.2.1",
  "1.2.840.113549.1.9.3",
  "1.2.840.113549.1.7.1",
  "1.2.840.113549.1.9.5",
  "1.2.840.113549.1.9.52",
  "2.16.840.1.101.3.4.2.1",
  "1.2.840.10045.4.3.2",
  "1.2.840.113549.1.9.4",
  "1.2.840.113549.1.9.16.2.47",
  "2.5.4.3",
  "1.2.840.10045.4.3.2",
];

export const SAMPLE_BER_EXPECTED_0ID = [
  "1.2.840.113549.1.7.2",
  "2.16.840.1.101.3.4.2.1",
  "1.2.840.113549.1.7.1",
  "1.2.840.10045.4.3.2",
  "2.5.4.3",
  "2.5.4.3",
  "1.2.840.10045.2.1",
  "1.2.840.10045.3.1.7",
  "2.5.29.15",
  "2.5.29.14",
  "2.5.29.35",
  "1.2.840.10045.4.3.2",
  "2.5.4.3",
  "2.16.840.1.101.3.4.2.1",
  "1.2.840.113549.1.9.3",
  "1.2.840.113549.1.7.1",
  "1.2.840.113549.1.9.5",
  "1.2.840.113549.1.9.52",
  "2.16.840.1.101.3.4.2.1",
  "1.2.840.10045.4.3.2",
  "1.2.840.113549.1.9.4",
  "1.2.840.113549.1.9.16.2.47",
  "2.5.4.3",
  "1.2.840.10045.4.3.2",
];

export const SAMPLE_X509_EXPECTED_STRING = [
  "Telagana",
  "Hyderabad",
  "OrganizationDummy",
  "Unit",
  "dummywebsite.com",
  "Telagana",
  "Hyderabad",
  "OrganizationDummy",
  "Unit",
  "dummywebsite.com",
  "Telagana",
  "Hyderabad",
  "OrganizationDummy",
  "Unit",
  "dummywebsite.com",
];
export const SAMPLE_BER_EXPECTED_STRING = ["Test", "Test", "Test", "Test"];
export const SAMPLE_DER_EXPECTED_STRING = ["Test", "Test", "Test", "Test"];

export const SAMPLE_DER_EXPECTED_UTC = ["2020-09-02 13:25:26", "2030-09-02 13:25:26", "2018-07-16 14:56:35"];
export const SAMPLE_BER_EXPECTED_UTC = ["2018-07-16 15:17:00", "2019-07-16 15:17:00", "2018-07-16 15:17:01"];
export const SAMPLE_X509_EXPECTED_UTC = ["2024-06-18 14:40:26", "2025-06-18 14:40:26", "2024-06-18 14:49:55"];
