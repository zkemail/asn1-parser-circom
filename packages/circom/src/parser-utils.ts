// reference := https://luca.ntop.org/Teaching/Appunti/asn1.html

export function parseOid(bytes: number[] | Uint8Array): string {
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

export function getOIDLength(bytes: Uint8Array) {
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

export function parseUTFString(data: number[] | Uint8Array): string {
  const stringArr = data.slice(2);

  const decoder = new TextDecoder("utf-8");
  return decoder.decode(new Uint8Array(stringArr));
}

export function calculateLength(ASN_ARRAY: number[]) {
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
// console.log(bytesToOID([6, 8, 42, 134, 72, 206, 61, 4, 3, 2]));
// console.log(bytesToOID(Uint8Array.from([0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x07, 0x02]))); // Outputs: 7 // 1.2.840.113549.1.7.2
// console.log(bytesToOID(Uint8Array.from([0x2a, 0x86, 0x48, 0xce, 0x3d, 0x04, 0x03, 0x02]))); // Outputs: 7 // 1.2.840.10045.4.3.2
