export function parseCertificate(input: string) {
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

export function convertUintArray(str: string): Uint8Array {
  // TODO : convert given string into Uint8Array
  return new Uint8Array([]);
}
