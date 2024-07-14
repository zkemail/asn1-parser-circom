import { ASN1_TAGS } from "./constant";
// reference := https://luca.ntop.org/Teaching/Appunti/asn1.html

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
      } else if (ASN_TAG == 0x24) {
        ASN_ARRAY.push(data.slice(i, i + 2));
        i += 2;
      } else if (ASN_TAG == ASN1_TAGS.OCTET_STRING) {
        const isEmbedded = data[i + 2]; // third byte is embedded

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
          if (isEmbedded === ASN1_TAGS.BIG_STRING || isEmbedded === ASN1_TAGS.OCTET_STRING) {
            const endIndex = i + 2;
            ASN_ARRAY.push(data.slice(i, endIndex));
            i = endIndex;
          } else {
            const startIndex = i;
            const endIndex = startIndex + ASN_LENGTH + 2;
            ASN_ARRAY.push(data.slice(i, endIndex));
            i = endIndex;
          }
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
    const utcArray: string[] = [];
    const octetArray: string[] = [];
    const bitArray: string[] = [];
    asn1.forEach((e) => {
      if (e[0] === ASN1_TAGS.OBJECT_IDENTIFIER) {
        oidArray.push(this.parseOid(e));
      }
      if (e[0] == 0x0c) {
        utf8Array.push(this.parseUTFString(e));
      }
      if (e[0] == ASN1_TAGS.UTC_TIME) {
        utcArray.push(this.parseUTCString(e));
      }
      if (e[0] == ASN1_TAGS.BIG_STRING) {
        bitArray.push(e.toString());
      }
      if (e[0] == ASN1_TAGS.OCTET_STRING) {
        octetArray.push(e.toString());
      }
    });
    return { OID: oidArray, UTF8Array: utf8Array, UTCString: utcArray, BitArray: bitArray, OctetArray: octetArray };
  }

  static parseUTCString(bytes: number[] | Uint8Array): string {
    if (bytes.length < 15) {
      throw new Error("Invalid byte length for UTC time");
    }

    const timeBytes = bytes.slice(2);
    const timeString = String.fromCharCode(...timeBytes);

    const year = parseInt(timeString.slice(0, 2));
    const month = parseInt(timeString.slice(2, 4)) - 1;
    const day = parseInt(timeString.slice(4, 6));
    const hour = parseInt(timeString.slice(6, 8));
    const minute = parseInt(timeString.slice(8, 10));
    const second = parseInt(timeString.slice(10, 12));

    const fullYear = year >= 50 ? 1900 + year : 2000 + year;
    const date = new Date(Date.UTC(fullYear, month, day, hour, minute, second));
    return date.toUTCString();
  }

  static stringToDate(dateString: string): Date {
    const [datePart, timePart] = dateString.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);

    return new Date(year, month - 1, day, hour, minute, second);
  }

  static getOIDLength(bytes: Uint8Array) {
    let count = 0;
    let isFirst = true;

    for (let i = 0; i < bytes.length; ++i) {
      if (!(bytes[i] & 0x80)) {
        if (isFirst) {
          count += 2;
          isFirst = false;
        } else {
          count++;
        }
      }
    }

    return count;
  }

  static parseOid(bytes: number[] | Uint8Array): string {
    const ansArray: number[] = [];
    let n = 0;

    // Start from index 2 to skip the tag (0x06) and length bytes
    for (let i = 2; i < bytes.length; ++i) {
      let v = bytes[i];
      n = n << 7;
      n = n | (v & 0x7f);

      if ((v & 0x80) === 0) {
        if (ansArray.length === 0) {
          let first = Math.floor(n / 40);
          let second = n % 40;
          ansArray.push(first, second);
        } else {
          ansArray.push(n);
        }
        n = 0;
      }
    }

    return ansArray.join(".");
  }

  static parseUTFString(ASN_ARRAY: number[] | Uint8Array): string {
    const stringArr = ASN_ARRAY.slice(2);
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(new Uint8Array(stringArr));
  }
  static calculateLength(ASN_ARRAY: number[]) {
    const buff = ASN_ARRAY[1];
    const mst = buff & 0x80;
    let length = 0;
    if (mst === 0) {
      return buff;
    } else {
      let numBytes = buff & 0x7f;
      let currentIndex = 2;
      while (numBytes > 0) {
        length = (length << 8) | ASN_ARRAY[currentIndex];
        numBytes--;
        ++currentIndex;
      }
    }
    return length;
  }
  static tagDecoder(n: number) {
    return { tagClass: n >> 6, tagConstructed: (n & 0x20) == 0 ? 1 : 0, tagNumber: n & 0x1f };
  }
}
