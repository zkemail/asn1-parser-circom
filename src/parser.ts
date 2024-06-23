import { ASN1_TAGS, SAMPLE_X_509 } from "./constant";
import { parseOid, parseUTFString } from "./parser-utils";

export class ASN {
  /**
   * Calculates the offset for long-form length encoding
   * @param byte - The byte to calculate the offset from
   * @returns The calculated offset
   */
  static calculateOffSet(buff: number) {
    return buff & 0x7f;
  }

  static parse(data: number[]) {
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

  static decode(asn1: number[][]) {
    const oidArray: string[] = [];
    const utf8Array: string[] = [];
    asn1.forEach((e) => {
      if (e[0] === 0x06) {
        oidArray.push(parseOid(e));
      }
      if (e[0] == 0x0c) {
        utf8Array.push(parseUTFString(e));
      }
      // if (e[0] == 0x04) {
      //   // TODO OCTECT PARSING
      //   console.log(parseUTFString(e));
      // }
    });
    return { OID: oidArray, UTF8Array: utf8Array };
  }
}
