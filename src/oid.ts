// reference := https://luca.ntop.org/Teaching/Appunti/asn1.html

function bytesToOID(bytes: Uint8Array) {
  let s = "";
  const ansArray = [];
  let n = 0;
  const len = bytes.length;

  for (let i = 0; i < len; ++i) {
    let v = bytes[i];
    n = (n << 7) | (v & 0x7f);
    if (!(v & 0x80)) {
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
  return s;
}

function getOIDLength(bytes: Uint8Array) {
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
