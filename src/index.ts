import fs from "fs";
import { parseCertificate } from "./cert-utils";

async function main() {
  const der = fs.readFileSync("./samples/der.pem");
  console.log(parseCertificate(der.toString()));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
