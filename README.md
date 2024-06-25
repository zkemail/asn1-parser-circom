# ASN.1 Circom Parser

A generic ASN.1 DER/BER parser implemented in Circom for use in zero-knowledge proofs.
This circuits can extract and verify key information from ASN.1 encoded data structures, enabling on-chain verification of certificates, signatures, and other ASN.1 encoded documents.

> Note: This project is a work in progress and not yet recommended for production use

## Project Milestone

1. **Phase-1** ASN.1 Parser
   - Extract certificate information from a given PDF.
   - Circom Circuit which take DER structure as input and extracting all information such as (e.g., issuer, subject, validity period, public key, signature algorithm, signature).
2. **Phase-2** ZK Proof to verify data
   - Develop a circuit to prove specific aspects of the extracted data.
   - Whether document is signed with issuer name or not?

## **Phase-1** ASN.1 Parser

### Things to Extract from PDF Certificate

Some of ASN.1 DER types.

1. Integers
2. UTF8String
3. Date and Time
4. Object Identifier which used to recognize algorithm
   - OIDs starting with that prefix, like [1.2.840.113549.1.1.11](http://oid-info.com/get/1.2.840.113549.1.1.11), which identifies sha256WithRSAEncryption
   - [1.3.6.1.4.1.11129](http://oid-info.com/get/1.3.6.1.4.1.11129) identifies Google
   - [2.5.4.6](http://oid-info.com/get/2.5.4.6) means countryName
   - [2.5.4.10](http://oid-info.com/get/2.5.4.10) means “organizationName
5. Signature

For Testing, I took two pdf i.e

1. blank pdf
2. blank pdf with digital signature (done with the help docuSign)

Using online tools like [ASN.1 JavaScript decoder](https://lapo.it/asn1js/), I checked the information contained in them. Since blank.pdf doesn't have a digital signature, it doesn't contain any information to decode.

However, by checking the DocuSigned PDF and exporting the `.cer` certificate in the `PKCS#7/CMS DER` format, I found these information
check these link it will show the all information [asn1 link](https://lapo.it/asn1js/#MIIFwzCCBKugAwIBAgIQJobcP0b0cfqDrWZJYF_LbTANBgkqhkiG9w0BAQsFADCBtzELMAkGA1UEBhMCVVMxFjAUBgNVBAoTDUVudHJ1c3QsIEluYy4xKDAmBgNVBAsTH1NlZSB3d3cuZW50cnVzdC5uZXQvbGVnYWwtdGVybXMxOTA3BgNVBAsTMChjKSAyMDE1IEVudHJ1c3QsIEluYy4gLSBmb3IgYXV0aG9yaXplZCB1c2Ugb25seTErMCkGA1UEAxMiRW50cnVzdCBDbGFzcyAzIENsaWVudCBDQSAtIFNIQTI1NjAeFw0yMzEwMjYxNzE2MzZaFw0yNTEwMjYxNzE2MzRaMIG6MQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEXMBUGA1UEChMORG9jdVNpZ24sIEluYy4xHTAbBgNVBAsTFFRlY2huaWNhbCBPcGVyYXRpb25zMRcwFQYDVQQDEw5Eb2N1U2lnbiwgSW5jLjEtMCsGCSqGSIb3DQEJARYeZW50ZXJwcmlzZXN1cHBvcnRAZG9jdXNpZ24uY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAowpIXhmV0SDi9ZnQL97zqL70RNhT3NAN1dcOQ4C0msQoayUpET4fjXVmiK2EDy3PzXSvx86FEpus_z-_fZ0C-ZsLNx_ETwJolGvLFGbG10k92EAG9ARToBDhJhkGIXuWU-jzTUrEQjJz4AdRgujWbiDNHqJXkBbkv6PY5w8lOlRh8khoCtys-TsiKxmAeC4ipgflOUK8TDxqgbAvtwt5j_JLQfCc_wxABas1hYR6_rg1q8_iukKHcRcvp1FMFFWtNZ8w6k3wLPwoCYZ1JSRdaHIbjNdmslrSlRZ_SpifGSl0HQGdS6_OHtuP0mT3Oyl5pNTJcRIU0xcaBasVLr4RLQIDAQABo4IBxDCCAcAwDAYDVR0TAQH_BAIwADAdBgNVHQ4EFgQUBC3YVHzRCu4skFnR09xJ-Qm8G7UwHwYDVR0jBBgwFoAUBp9vTqIpTg8Mrhe_tphG7624O3IwZwYIKwYBBQUHAQEEWzBZMCMGCCsGAQUFBzABhhdodHRwOi8vb2NzcC5lbnRydXN0Lm5ldDAyBggrBgEFBQcwAoYmaHR0cDovL2FpYS5lbnRydXN0Lm5ldC9jbGFzczMtMjA0OC5jZXIwNwYDVR0fBDAwLjAsoCqgKIYmaHR0cDovL2NybC5lbnRydXN0Lm5ldC9jbGFzczMtc2hhMi5jcmwwDgYDVR0PAQH_BAQDAgbAMCAGA1UdJQQZMBcGCWCGSAGG-msoCwYKKwYBBAGCNwoDDDBDBgoqhkiG9y8BAQkBBDUwMwIBAYYuaHR0cDovL3RpbWVzdGFtcC5lbnRydXN0Lm5ldC9UU1MvUkZDMzE2MXNoYTJUUzATBgoqhkiG9y8BAQkCBAUwAwIBATBCBgNVHSAEOzA5MDcGCmCGSAGG-mwKAQYwKTAnBggrBgEFBQcCARYbaHR0cHM6Ly93d3cuZW50cnVzdC5uZXQvcnBhMA0GCSqGSIb3DQEBCwUAA4IBAQBUzroho_W0sJhpReZrGKnhi61MNFOBaPqxI_FtqHNnP0afbPs7X_XVcOYExQUh0VbrghqXx_K-7ptw-6CnzIwEHZY8HKOOyH_EHRRUKb1IpEQMuWbAjB4j2ZNgwb6BNHHptDESMOOPBERLUiqxpNRTf_mvzj6xkByLfQnvTv492xu18r-rKAxY_aNM_2lQZ09caWjec64rBEUCjfr4h2o7oolOEhQAW7SHCydLVJMjHm1sst8wyv2G7KQFneI4k8XlXvnWm7uIUmLaDbtCCN538yhZT07znGHyCuvCk9DygMAI5HfJ4Uo9h8NqLTUyGJiF7NzyXW2Wddr6sZpjie5-)

Here are some important information we can extract:

- Issuer Name (blank in DocuSigned)
- Country Information
- Locality Information
- Signature Algorithm
- Signature

Since the DocuSign document provides only basic information, we can build a generic DER or BER parser that takes data from a `.cer` file and outputs all important information.

To create a new certificate signing request (CSR) using OpenSSL and generate a `.cer` file:

```json
$ openssl req -new -key private.key -out new.cer
```

So, I have created a new Certificate Signing Request (CSR) using OpenSSL and generate a `.cer` file, you need to provide various pieces of information. This information is then stored in the DER structure of the `.cer` file. The details include:

- Country Name
- State or Province Name
- Locality Name
- Organisation Name
- Organisation al Unit Name
- Common Name
- Email Address
- Date

**We can later extract this information in Circom circuits.**

![asn-decode-online](https://hackmd.io/_uploads/H1TIBe_8R.png)

---

## Algorithm for ASN.1 Parser

1. **Step - 1 :** converting base64/Hex string as input and returns the decoded binary data as  **`Uint8Array`**
2. **Step - 2 :** Extracting Information from `Uint8Array`

# Step-1

- Since most `DER` and `BER` structures are encoded in base64 format, we need a base64 decoder which takes a base64 encoded string as input and gives `arrayOfBytes`.
- Most digital certificates are encoded with base64, and some also use hex encoding:
  - PKCS#7/CMS attached signature (DER) - BASE64 Encoded
  - PKCS#7/CMS attached BER - BASE64 Encoded
  - PKCS#8 RSA key - Base64 Encoded
- Check whether it matches the valid regex `/^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/` for base64.
- Here is a lookup table for the base64 standard mentioned in [RFC3548](https://datatracker.ietf.org/doc/html/rfc3548).

![base64](https://hackmd.io/_uploads/H1pVaL2BC.png)

- If we have encoded hex as “0x76696b6173”, it can be parsed into `[ 118, 105, 107, 97, 115 ]`. When we look up these values in the ASCII table, they give decoded character values.
- By using this approach, for a given hex encoded string, we can get the ASCII equivalent.
- for a given base64 encoded string we can get ASCII equivalent using following circuits
  - base64 Decoder Algorithm → [base64-utils.js](https://gist.github.com/0xVikasRushi/9b29b379f6fb411ab95d6e7b6daa5f0b)
  - zkemail base64 decoder
    - [base64.circom](https://github.com/zkemail/zk-email-verify/blob/main/packages/circuits/lib/base64.circom)
    - [base64.test.ts](https://github.com/zkemail/zk-email-verify/blob/main/packages/circuits/tests/base64.test.ts)
  - [RFC6025](https://datatracker.ietf.org/doc/html/rfc6025)

### Flow of Base64 and Hex Decoding

- Take any generic certificate which contains encoded data in `DER` and `BER` structures:
  1. Parse Information into Bytes:
  2. `decodeText(entire_ber_or_der_certificate)`
  3. Parse content in `.pem` file:
  4. `-----BEGIN PKCS7------{encoded_info}------END PKCS7------`
  5. Check whether `encoded_info` is hex or base64.
  6. If the encoding string is “hex”:
     1. Function: `Hex.decode(hexString)` → `arrayOfBytes`
  7. If the entire cert is encoded in base64:
     1. Function: `Base64Decoder(base64string)` → `arrayOfBytes`

# Step-2

## **2.(a) - ASN.1 Type-Length-Value (TLV) Encoding**:

```jsx
+----------+----------+----------+--
| Type (T) | Length (L) | Value (V) |
+----------+----------+----------+--
```

ASN.1 encoding follows the Type-Length-Value (TLV) format, where:

1. **Type (T)**: The tag that identifies the data type.
2. **Length (L)**: The length of the value field, encoded in a compact form.
3. **Value (V)**: The actual data value, encoded according to the specific data type and encoding rules.

Every value, an octet is an eight- bit unsigned integer. Bit 8 of the octet is the most significant and bit 1 is the least significant.

### Type - ASN1Tag

Every ASN1 Tag is octet. ASN1 Tag Representation

```mathematica
| 7 6 | 5 | 4 3 2 1 0 |
|-----|---|-----------|
| Class | C | Number |

- Bits 7-6 (Class): Represent the tag class.
- Bit 5 (C): Indicates if the tag is constructed.
- Bits 4-0 (Number): Represent the tag number.
```

## **2.(b)** ASN.1 Tag Classes and Numbers

Here is a list of all universal class types which includes all these types.

| Tag Class | Tag Number | Tag Name          |
| --------- | ---------- | ----------------- |
| Universal | 0x00       | EOC               |
| Universal | 0x01       | BOOLEAN           |
| Universal | 0x02       | INTEGER           |
| Universal | 0x03       | BIT_STRING        |
| Universal | 0x04       | OCTET_STRING      |
| Universal | 0x05       | NULL              |
| Universal | 0x06       | OBJECT_IDENTIFIER |
| Universal | 0x07       | ObjectDescriptor  |
| Universal | 0x08       | EXTERNAL          |
| Universal | 0x09       | REAL              |
| Universal | 0x0A       | ENUMERATED        |
| Universal | 0x0B       | EMBEDDED_PDV      |
| Universal | 0x0C       | UTF8String        |
| Universal | 0x0D       | RELATIVE_OID      |
| Universal | 0x10       | SEQUENCE          |
| Universal | 0x11       | SET               |
| Universal | 0x12       | NumericString     |
| Universal | 0x13       | PrintableString   |
| Universal | 0x14       | TeletexString     |
| Universal | 0x15       | VideotexString    |
| Universal | 0x16       | IA5String         |
| Universal | 0x17       | UTCTime           |
| Universal | 0x18       | GeneralizedTime   |
| Universal | 0x19       | GraphicString     |
| Universal | 0x1A       | VisibleString     |
| Universal | 0x1B       | GeneralString     |
| Universal | 0x1C       | UniversalString   |
| Universal | 0x1E       | BMPString         |

Since we want to extract ASN1Tag from bytesArray:

- Generally, since it follows T-L-V, the tag will be the first byte of the ASN structure.
- We need to determine other things from class, form, and number.

![                              ASNTag Representation](https://hackmd.io/_uploads/rJG-CL2rA.png)

                              ASNTag Representation

### Example of ASN.1 Calculating Tag Values

```jsx
// given buff to find ASN1 Tag values
const buff = 42;

// 7th and 8th bit
const tagClass = buff >> 6;
// tagClass is 00 -> universal

// 0x20 => 00100000  we will get the 6th bit
const tagConstructed = (buff & 0x20) == 0;

// 0x1f => 0011111. we will get 0-4th bits of buffer
const tagNumber = buf & 0x1f;
```

## **2.\(c\)** ASN.1 Length Decoding Algorithm

1. **Read the Length Byte**:
   1. The second byte in ASN.1 indicates the length.
2. **Check the Most Significant Bit (MSB)**:
   - If the MSB is 0, the byte represents the length directly (short form).
   - If the MSB is 1, the byte indicates the number of subsequent bytes that encode the length (long form).
3. **Short Form Encoding**:
   - If the MSB is 0, return the value of the byte as the length.
4. **Long Form Encoding**:
   - If the MSB is 1, mask out the MSB to get the number of subsequent bytes.
   - Read the subsequent bytes and combine them to get the length.

```jsx
// Given buff to find ASN1 Tag values
const buff = 0x82;

// Check whether most significant bit is set to zero
// If it's set to 1 then it's encoded in long bytes format
const mst = buff & 0x80;

if (mst === 0) {
  // Short form encoding
  return buff;
} else {
  // Long bytes encoding
  let numBytes = buff & 0x7f; // Get 7 bits of octet 0x7F => 01111111

  let length = 0;
  for (let i = 2; i < numBytes; i++) {
    // Read the next byte and combine to form the length
    length = (length << 8) | nextByte(); // nextByte index from starting bytes
    // Assume nextByte() returns the next byte in the sequence
  }

  return length;
}
```

## **2.(d)** ASN.1 Example

Extraction of TLV (Type Length, Values)

```jsx
const simpleASN1 = [30 ,82 ,2A ,74, ....more];
```

**1. Decoding the Type**

- The first byte `0x30` represents the Tag value.
- The Tag value `0x30` corresponds to the SEQUENCE type in the universal class. This is a constructed type, meaning it can contain nested TLV triplets.

1. **Decode the Length**
   - The second byte `0x82` has the most significant bit set to 1, indicating a long-form length encoding.
   - The remaining 7 bits `0x02` indicate that the Length value is encoded in the next `2 bytes`.
2. **Decode the Value**
   - The next 2 bytes are `0x2A, 0x74`, which represent the Length value 10,868 (0x2A74 in hexadecimal) when combined.

- Since SEQUENCE indicates how many values it consists of in this constructed type, we can iterate through the next bytes, starting to check the type and extract values from it.

Let's analyze how to parse the next few bytes of the ASN.1 structure following the same approach:

1. Get the first byte and find the tag type.
2. Get the length of the bytes.
3. Get the values.

```jsx
[30,82,2A,74,  06 ,09 ,2A, 86, 48, 86, F7, 0D, 01, 07, 02, ...asn2];
|-parent asn-||-----------child asn1---------------------|--child2-|
```

From the previous example, we know that there are two ASN.1 structures in the stream. We can move the offset by +4 and get ASN.1 and calculate TLV values for it:

```jsx
const asn1 = [06 ,09 ,2A, 86, 48, 86, F7, 0D, 01, 07, 02]
```

- **Determine the Type (T)**:
  - The first byte `06` represents the Type (T) or the tag value.
  - This byte value `0x06` corresponds to the OBJECT_IDENTIFIER data type in the universal class.
- **Determine the Length (L)**:
  - The second byte `09` represents the Length (L) of the Value field.
  - Since the most significant bit (0x80) is not set, this is a short-form length encoding.
  - The value `0x09` (decimal 9) indicates that the length of the Value field is 9 bytes.
- **Determine the Value (V)**:

  - The remaining 9 bytes `2A 86 48 86 F7 0D 01 07 02` represent the Value (V) field for the OBJECT_IDENTIFIER data type.
  - OBJECT_IDENTIFIER values are encoded using a specific set of rules:
    - The value is represented as a sequence of variable-length numbers.
    - The first two numbers are encoded in the first byte, and subsequent numbers are encoded in subsequent bytes.
    - Each number is encoded in base 128, with the most significant bit indicating whether more bytes follow for that number.
  - Decoding the Value `2A 86 48 86 F7 0D 01 07 02`:

    ```jsx
    // reference := https://luca.ntop.org/Teaching/Appunti/asn1.html

    function bytesToOID(bytes) {
      let s = ""; // Initialize an empty string to store the OID
      let n = 0; // Initialize a variable to accumulate the current number
      const len = bytes.length; // Length of the input bytes array

      for (let i = 0; i < len; ++i) {
        let v = bytes[i]; // Current byte value
        n = (n << 7) | (v & 0x7f); // Append the lower 7 bits to n

        if (!(v & 0x80)) {
          // If highest bit is not set
          if (s === "") {
            // If s is empty, it's the first two numbers
            let first = Math.floor(n / 40); // Calculate the first number
            let second = n % 40; // Calculate the second number
            s = first + "." + second; // Add the first two numbers to s
          } else {
            s += "." + n; // Add the accumulated number to s
          }
          n = 0; // Reset n for the next number
        }
      }

      return s;
    }

    let bytes = [0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x07, 0x02];
    console.log(bytesToOID(bytes)); // Output: 1.2.840.113549.1.7.2

    let bytes2 = [0x2a, 0x86, 0x48, 0xce, 0x3d, 0x04, 0x03, 0x02];
    console.log(bytesToOID(bytes2)); // Output: 1.2.840.10045.4.3.2

    console.log(bytesToOID([0x55, 0x1d, 0x0e])); // Output: 2.5.29
    ```

## **2.(e)** Integrating ASN.1 Parsing in Circuits

To handle ASN.1 data types in circuits, i can think of two approaches:

1. **Individual Circuits for Specific Data Types**: Write individual circuits for extracting specific data types.
2. **Extract Important Data Types**: extracting important data types in circuits. We need to explore ways to return these values efficiently in Circom in a single circuit.
   - Important ASN.1 Data Types to Extract
     - OBJECT_IDENTIFIER
       - versions
       - encryption algorithm used
     - OCTET_STRING
       - signature values
       - content
     - UTCTime
     - UTF8String
       - issuer, country, states
     - BIT_STRING
       - subjectPublicKey

## **2.(f)** ASN.1 Complete Parsing Algorithm

Here's the TypeScript implementation of the ASN.1 parsing algorithm in `./src/parser.ts`:

```ts
function parse(data: number[]) {
  let ASN_ARRAY = [];
  let i = 0;
  while (i < data.length - 1) {
    const ASN_TAG = data[i];
    const ASN_LENGTH = data[i + 1];
    if (
      ASN_TAG === ASN1_TAGS.SEQUENCE ||
      ASN_TAG === ASN1_TAGS.SET ||
      ASN_TAG == ASN1_TAGS.CONTEXT_SPECIFIC_0 ||
      ASN_TAG == ASN1_TAGS.CONTEXT_SPECIFIC_1 ||
      ASN_TAG == ASN1_TAGS.CONTEXT_SPECIFIC_3 ||
      ASN_TAG == ASN1_TAGS.CONTEXT_SPECIFIC_4
    ) {
      const isLongForm = (ASN_LENGTH & 0x80) === 0 ? false : true;
      if (isLongForm) {
        const offset = this.calculateOffSet(ASN_LENGTH);
        const endIndex = i + offset + 2;
        ASN_ARRAY.push(data.slice(i, endIndex));
        i = endIndex;
      } else {
        ASN_ARRAY.push(data.slice(i, i + 2));
        i += 2;
      }
    } else if (ASN_TAG == ASN1_TAGS.OCTET_STRING) {
      const isLongForm = (ASN_LENGTH & 0x80) === 0 ? false : true;
      let length = 0;
      if (isLongForm) {
        let numBytes = ASN_LENGTH & 0x7f;
        let temp = numBytes;
        let currentIndex = i + 2;
        while (numBytes > 0) {
          length = (length << 8) | data[currentIndex];
          numBytes--;
          ++currentIndex;
        }
        const startIndex = i;
        const endIndex = startIndex + length + temp + 2;
        ASN_ARRAY.push(data.slice(i, endIndex));
        i = endIndex;
      } else {
        const startIndex = i;
        const endIndex = startIndex + ASN_LENGTH + 2;
        ASN_ARRAY.push(data.slice(i, endIndex));
        i = endIndex;
      }
    } else {
      const startIndex = i;
      const endIndex = startIndex + ASN_LENGTH + 2;
      ASN_ARRAY.push(data.slice(i, endIndex));
      i = endIndex;
    }
  }
  return ASN_ARRAY;
}
```

### Example Parsing for X.509 certificate:

```typescript
const input = [
  0x30, 0x82, 0x04, 0x9f, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x07, 0x02, 0xa0, 0x82, 0x04, 0x90,
  0x30, 0x82, 0x04, 0x8c, 0x02, 0x01, 0x01,
  // ... (more bytes would follow in a complete certificate)
];
```

Now, let's walk through how the parsing algorithm would process the first 5 elements of this input:

1. `30 82 04 9F`

   - Tag: `30` (SEQUENCE)
   - Length: `82 04 9F` (long form, 1183 bytes)
   - Algorithm:
     - Recognizes `30` as SEQUENCE
     - Identifies long form length (0x82)
     - Calculates total length (0x049F = 1183)
     - Pushes `[30, 82, 04, 9F]` to ASN_ARRAY
   - Index moves to: 4

2. `06 09 2A 86 48 86 F7 0D 01 07 02`

   - Tag: `06` (OBJECT IDENTIFIER)
   - Length: `09` (9 bytes)
   - Value: `2A 86 48 86 F7 0D 01 07 02`
   - Algorithm:
     - Identifies `06` as OBJECT IDENTIFIER
     - Reads length `09`
     - Pushes entire line `[06, 09, 2A, 86, 48, 86, F7, 0D, 01, 07, 02]` to ASN_ARRAY
   - Index moves to: 15

3. `A0 82 04 90`

   - Tag: `A0` (CONTEXT SPECIFIC)
   - Length: `82 04 90` (long form, 1168 bytes)
   - Algorithm:
     - Recognizes `A0` as CONTEXT SPECIFIC
     - Identifies long form length (0x82)
     - Calculates total length (0x0490 = 1168)
     - Pushes `[A0, 82, 04, 90]` to ASN_ARRAY
   - Index moves to: 19

4. `30 82 04 8C`

   - Tag: `30` (SEQUENCE)
   - Length: `82 04 8C` (long form, 1164 bytes)
   - Algorithm:
     - Recognizes `30` as SEQUENCE
     - Identifies long form length (0x82)
     - Calculates total length (0x048C = 1164)
     - Pushes `[30, 82, 04, 8C]` to ASN_ARRAY
   - Index moves to: 23

5. `02 01 01`
   - Tag: `02` (INTEGER)
   - Length: `01` (1 byte)
   - Value: `01`
   - Algorithm:
     - Identifies `02` as INTEGER
     - Reads length `01`
     - Pushes entire line `[02, 01, 01]` to ASN_ARRAY
   - Index moves to: 26

### Resulting ASN_ARRAY

After processing these 5 elements, the ASN_ARRAY would look like this:

```javascript
[
  [30, 82, 04, 9F],
  [06, 09, 2A, 86, 48, 86, F7, 0D, 01, 07, 02],
  [A0, 82, 04, 90],
  [30, 82, 04, 8C],
  [02, 01, 01]
]
```

we can look at first bytes of each array and determine its tag class and decode according to get value.

### Reference

- Understanding PDF Parsing
  https://letsencrypt.org/docs/a-warm-welcome-to-asn1-and-der/#:~:text=The Encoding-,ASN.,to express a given structure.
- https://datatracker.ietf.org/doc/html/rfc5280#page-96
- https://lapo.it/asn1js/
