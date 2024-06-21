import { WitnessTester } from "circomkit";
import { circomkit } from "../tests/common";

export enum CircuitName {
  AsnParser,
  DecodeLength,
  ObjectIdentifierParser,
  ObjectIdentifierLength,
}

export const CompileCircuit = async (
  circuitName: CircuitName,
  paramsNumber: number[]
): Promise<WitnessTester<["in"], ["out"]>> => {
  try {
    let circuit: WitnessTester<["in"], ["out"]>;
    switch (circuitName) {
      case CircuitName.AsnParser:
        if (paramsNumber == null) {
          throw new Error("Param Number is not defined");
        }
        circuit = await circomkit.WitnessTester(`AsnParser_${paramsNumber}`, {
          file: "parser",
          template: "AsnParser",
          params: [...paramsNumber],
        });
        break;

      case CircuitName.DecodeLength:
        circuit = await circomkit.WitnessTester("DecodeLength", {
          file: "parser",
          template: "DecodeLength",
          params: [...paramsNumber],
        });
        break;

      case CircuitName.ObjectIdentifierLength:
        circuit = await circomkit.WitnessTester(`ObjectIdentifierLength_${paramsNumber}`, {
          file: "parser",
          template: "ObjectIdentifierLength",
          params: [...paramsNumber],
        });
        break;

      case CircuitName.ObjectIdentifierParser:
        circuit = await circomkit.WitnessTester(`ObjectIdentifierParser_${paramsNumber[0]}_${paramsNumber[1]}`, {
          file: "parser",
          template: "ObjectIdentifierParser",
          params: [...paramsNumber],
        });
        break;
      default:
        throw new Error("Unknown Circuit");
    }

    return circuit;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};
