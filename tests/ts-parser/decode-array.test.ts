import assert from "assert";
import { arrayToBigNumber, bigNumberToArray, generateRandomArray } from "../../src/array_to_bigInt";

describe("arrayToBigNumber", () => {
  const testCases: bigint[][] = [
    [1n, 2n, 840n, 113549n, 1n, 7n, 2n],
    generateRandomArray(10),
    generateRandomArray(100),
    generateRandomArray(1000),
    generateRandomArray(10000),
  ];

  it("It Should generate and decode array to bigInt", async () => {
    testCases.forEach((originalArray, index) => {
      const bigNum = arrayToBigNumber(originalArray);
      const recoveredArray = bigNumberToArray(bigNum, originalArray.length);
      assert(originalArray.every((value, i) => value === recoveredArray[i]));
    });
  });
});
