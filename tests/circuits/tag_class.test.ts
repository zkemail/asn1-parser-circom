import { circomkit } from "../common";

describe("TagClass", async () => {
  it("should satisfy BooleanConstraint", async () => {
    const circuit = await circomkit.WitnessTester("TagClass", {
      file: "tag_class",
      template: "BooleanConstraint",
    });
    await circuit.expectConstraintCount(0);
    const witness = await circuit.calculateWitness({ in: 0x01 });
    await circuit.expectConstraintPass(witness);
  });

  it("should satisfy IntegerConstraint", async () => {
    const circuit = await circomkit.WitnessTester("TagClass", {
      file: "tag_class",
      template: "IntegerConstraint",
    });
    await circuit.expectPass({ in: 0x02 });
  });

  it("should satisfy OctectStringConstraint", async () => {
    const circuit = await circomkit.WitnessTester("TagClass", {
      file: "tag_class",
      template: "OctectStringConstraint",
    });
    await circuit.expectPass({ in: 0x04 });
  });

  it("should satisfy ObjectIdentifierConstraint", async () => {
    const circuit = await circomkit.WitnessTester("TagClass", {
      file: "tag_class",
      template: "ObjectIdentiferConstraint",
    });
    await circuit.expectPass({ in: 0x06 });
  });

  it("should satisfy SequenceConstraint", async () => {
    const circuit = await circomkit.WitnessTester("TagClass", {
      file: "tag_class",
      template: "SequenceConstraint",
    });
    await circuit.expectPass({ in: 0x30 });
  });

  it("should satisfy UTCTimeConstraint", async () => {
    const circuit = await circomkit.WitnessTester("TagClass", {
      file: "tag_class",
      template: "UTCTimeConstraint",
    });
    await circuit.expectPass({ in: 0x17 });
  });

  it("should satisfy UTF8StringConstraint", async () => {
    const circuit = await circomkit.WitnessTester("TagClass", {
      file: "tag_class",
      template: "UTF8StringConstraint",
    });
    await circuit.expectPass({ in: 0x0c });
  });

  it("should satisfy BITStringConstraint", async () => {
    const circuit = await circomkit.WitnessTester("TagClass", {
      file: "tag_class",
      template: "BITStringConstraint",
    });
    await circuit.expectPass({ in: 0x03 });
  });
});
