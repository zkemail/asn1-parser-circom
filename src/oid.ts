// reference := https://luca.ntop.org/Teaching/Appunti/asn1.html

export function bytesToOID(bytes: Uint8Array) {
  let s = "";
  const ansArray = [];
  let n = 0;
  const len = bytes.length;

  for (let i = 0; i < len; ++i) {
    let v = bytes[i];
    n = n << 7;
    n = n | (v & 0x7f);

    const mst = v & 0x80;
    if (!mst) {
      if (s === "") {
        let first = Math.floor(n / 40);
        let second = n % 40;
        s = first + "." + second;
        ansArray.push(first, second);
      } else {
        s += "." + n;
        ansArray.push(n);
      }
      n = 0;
    }
  }
  // console.log(ansArray.toString());
  return s;
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

// console.log(bytesToOID(Uint8Array.from([0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x09, 0x0f]))); // Outputs: 3
// console.log(bytesToOID(Uint8Array.from([0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x07, 0x02]))); // Outputs: 7 // 1.2.840.113549.1.7.2
// console.log(bytesToOID(Uint8Array.from([0x2a, 0x86, 0x48, 0xce, 0x3d, 0x04, 0x03, 0x02]))); // Outputs: 7 // 1.2.840.10045.4.3.2
