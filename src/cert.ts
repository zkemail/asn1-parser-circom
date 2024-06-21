import fs from "fs";

export class Certificate {
  static parseCertificate(input: string) {
    const Base64CertRegex =
      /-----BEGIN [^-]+-----([A-Za-z0-9+/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+/=\s]+)====|^([A-Za-z0-9+/=\s]+)$/;
    const matches = input.match(Base64CertRegex);
    if (!matches) {
      return null;
    }
    const [_, encoded1, encoded2, encoded3] = matches;
    const encoded = encoded1 || encoded2 || encoded3;
    return encoded.trim();
  }

  static base64ToBinary(base64: string) {
    let binaryString = atob(base64);
    let binaryArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      binaryArray[i] = binaryString.charCodeAt(i);
    }
    return binaryArray;
  }

  // returns base64 encoded values
  static decode(input: string): Uint8Array {
    return this.base64ToBinary(this.parseCertificate(input)!);
  }
}

export function readAndParseDer(): Uint8Array {
  try {
    const der = fs.readFileSync("./samples/der/sig-p256-der.txt", "utf-8");
    return Certificate.decode(der);
  } catch (error) {
    throw new Error("Failed in parsing Certificate");
  }
}
