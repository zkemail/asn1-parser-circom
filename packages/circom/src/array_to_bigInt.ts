// Function to convert array of 64-bit numbers to BigNumber
export function arrayToBigNumber(arr: bigint[]): bigint {
  return arr.reduce((bigNum, value, index) => {
    return bigNum + (value << BigInt(64 * index));
  }, BigInt(0));
}

// Function to convert BigNumber back to array of 64-bit numbers
export function bigNumberToArray(
  bigNum: bigint,
  arrayLength: number
): bigint[] {
  const mask = (1n << 64n) - 1n;
  const result: bigint[] = [];
  for (let i = 0; i < arrayLength; i++) {
    result.push((bigNum >> BigInt(64 * i)) & mask);
  }
  return result;
}

// Function to generate random 64-bit number
export function randomUint64(): bigint {
  return (
    BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) * BigInt(2) +
    BigInt(Math.floor(Math.random() * 2))
  );
}

// Function to generate random array of 64-bit numbers
export function generateRandomArray(length: number): bigint[] {
  return Array.from({ length }, () => randomUint64());
}
