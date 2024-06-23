import { SAMPLE_DER } from "./constant";
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
    if (firstByte === 0x30 || firstByte === 0xa0) {
      const isLongForm = (secondByte & 0x80) !== 0;
      if (isLongForm) {
        const offset = calculateOffSet(secondByte);
        const endIndex = i + offset + 2;
        ASN_ARRAY.push(data.slice(i, endIndex));
        i = endIndex;
      } else {
        ASN_ARRAY.push(data.slice(i, i + 2));
        i += 2;
      }
    } else if (firstByte == 0x31) {
      ASN_ARRAY.push(data.slice(i, i + 2));
      i += 2;
    } else {
      const startIndex = i;
      const endIndex = startIndex + secondByte + 2;
      ASN_ARRAY.push(data.slice(i, endIndex));
      i = endIndex;
    }
  }
  return ASN_ARRAY;
}

const sorted = Parser(SAMPLE_DER);

sorted.forEach((e) => {
  if (e[0] === 0x06) {
    console.log(parseOid(e));
  }

  if (e[0] == 0x0c) {
    console.log(parseUTFString(e));
  }
  if (e[0] == 0x04) {
    console.log(parseUTFString(e));
  }
});
