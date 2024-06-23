import { SAMPLE_BER, SAMPLE_BER_EXPECTED_0ID } from "./constant";
import { parseOid, parseUTFString } from "./parser-utils";

function calculateOffSet(buff: number) {
  const mst = buff & 0x80;
  if (mst === 0) {
    return buff;
  } else {
    return buff & 0x7f;
  }
}

function Parser(data: number[]) {
  let ASN_ARRAY = [];
  let i = 0;
  while (i < data.length - 1) {
    const firstByte = data[i];
    const secondByte = data[i + 1];
    if (
      firstByte === 0x30 ||
      firstByte === 0xa0 ||
      firstByte == 0x31 ||
      firstByte == 0xa3 ||
      firstByte == 0xa1 ||
      firstByte == 0xa4
    ) {
      const isLongForm = (secondByte & 0x80) === 0 ? false : true;
      if (isLongForm) {
        const offset = calculateOffSet(secondByte);
        const endIndex = i + offset + 2;
        ASN_ARRAY.push(data.slice(i, endIndex));
        i = endIndex;
      } else {
        ASN_ARRAY.push(data.slice(i, i + 2));
        i += 2;
      }
      // octet string
    } else if (firstByte == 0x04) {
      const isLongForm = (secondByte & 0x80) === 0 ? false : true;
      let length = 0;
      if (isLongForm) {
        let numBytes = secondByte & 0x7f;
        let temp = numBytes;
        let currentIndex = i + 2;
        while (numBytes > 0) {
          length = (length << 8) | data[currentIndex];
          numBytes--;
          ++currentIndex;
        }
        const startIndex = i;
        const endIndex = startIndex + length + 2 + temp;
        ASN_ARRAY.push(data.slice(i, endIndex));
        i = endIndex;
      } else {
        const startIndex = i;
        const endIndex = startIndex + secondByte + 2;
        ASN_ARRAY.push(data.slice(i, endIndex));
        i = endIndex;
      }
    } else {
      const startIndex = i;
      const endIndex = startIndex + secondByte + 2;
      ASN_ARRAY.push(data.slice(i, endIndex));
      i = endIndex;
    }
  }
  return ASN_ARRAY;
}

const sorted = Parser(SAMPLE_BER);

const oidArray: string[] = [];
sorted.forEach((e) => {
  if (e[0] === 0x06) {
    oidArray.push(parseOid(e));
  }
  if (e[0] == 0x0c) {
    console.log(parseUTFString(e));
  }
  if (e[0] == 0x04) {
    // TODO OCTECT PARSING
    console.log(parseUTFString(e));
  }
});
console.log(oidArray.length);
console.log(oidArray.length == SAMPLE_BER_EXPECTED_0ID.length);
