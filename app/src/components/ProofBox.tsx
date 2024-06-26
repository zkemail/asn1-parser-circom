import { Buffer } from "buffer";
import { useState } from "react";
import { MAX_ACTUAL_OID_LENGTH, MAX_ACTUAL_STATE_NAME_LEN, MAX_INPUT_LENGTH } from "../asn/constant";
import { OIDInfo } from "../asn/oid";
import { CircuitInput } from "../utils/constant";
import { Utf8CircuitProver } from "../utils/proof";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface OidItemProps {
  oid: string;
  info: OIDInfo;
  inputBytes: number[];
  expectedLength: number[];
}

enum Status {
  proofGenerated = "Proof Generated",
  proofVerified = "Proof Verified",
  proofNotVerified = "Proof Not Verified",
}

export default function OidItem({ oid, info, inputBytes, expectedLength }: OidItemProps) {
  const [utf8, setUtf8] = useState("");
  const [proof, setProof] = useState("");
  const [status, setStatus] = useState<Status | null>(null);
  const [publicSig, setPublicSig] = useState("");

  const handleProof = async () => {
    try {
      const acutalLength = inputBytes.length;
      const inputWithPaddingZeros = inputBytes.concat(Array(MAX_INPUT_LENGTH - inputBytes.length).fill(0));

      const oidArray = oid.split(".").map((e) => parseInt(e));
      const oidWithPaddingZeros = oidArray.concat(Array(MAX_ACTUAL_OID_LENGTH - oidArray.length).fill(0));

      const ALL_OIDS_LENGTH = expectedLength[0];
      const ALL_UTF8_LENGTH = expectedLength[1];

      console.log(ALL_OIDS_LENGTH, ALL_UTF8_LENGTH);
      const utf8Param = Array.from(Buffer.from(utf8));
      const stateWithPaddingZeros = utf8Param.concat(Array(MAX_ACTUAL_STATE_NAME_LEN - utf8Param.length).fill(0));

      const inputs: CircuitInput = {
        actualLength: acutalLength,
        in: inputWithPaddingZeros,
        oid: oidWithPaddingZeros,
        stateName: stateWithPaddingZeros,
        lengthOfOid: ALL_OIDS_LENGTH,
        lengthOfUtf8: ALL_UTF8_LENGTH,
        oidLen: oidArray.length,
        stateNameLen: utf8Param.length,
      };
      const { proof, publicSignals } = await Utf8CircuitProver.generate(inputs);
      console.log(proof, publicSignals);
      setProof(JSON.stringify(proof, null, 2));
      setPublicSig(JSON.stringify(publicSignals));
      setStatus(Status.proofGenerated);
      toast.info("Proof generated successfully", { position: "top-right", autoClose: 3000 });
    } catch (error) {
      setProof("");
      setStatus(Status.proofNotVerified);
      console.error("Error generating proof:", error);
      toast.error("Error generating proof", { position: "top-right", autoClose: 3000 });
    }
  };

  const handleVerifyProof = async () => {
    try {
      const isVerified = await Utf8CircuitProver.verify(JSON.parse(proof), JSON.parse(publicSig));
      setStatus(isVerified ? Status.proofVerified : Status.proofNotVerified);
      if (isVerified) {
        toast.success("Proof verified successfully", { position: "top-right", autoClose: 3000 });
      } else {
        toast.error("Proof verification failed", { position: "top-right", autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error verifying proof:", error);
      toast.error("Error verifying proof", { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <ToastContainer />
      <div className="flex items-center justify-between">
        <h3 className="text-gray-900 text-sm font-medium truncate">{oid}</h3>
        <span
          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
            status === Status.proofVerified
              ? "text-green-800 bg-green-100"
              : status === Status.proofNotVerified
              ? "text-red-800 bg-red-100"
              : "text-yellow-800 bg-yellow-100"
          }`}
        >
          {status || "Not Verified"}
        </span>
      </div>
      <span className="inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
        {info.c}
      </span>
      <p className="text-gray-500 text-sm">{info.d}</p>
      <input
        type="text"
        value={utf8}
        onChange={(e) => {
          setUtf8(e.target.value);
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Enter value"
      />
      <button
        className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleProof}
      >
        Generate Proof
      </button>

      {status && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md h-64 overflow-hidden">
          <h4 className="text-lg font-semibold text-black mb-2">Proof Section</h4>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Status:{" "}
            <span
              className={`
              ${
                status === Status.proofVerified
                  ? "text-green-600"
                  : status === Status.proofNotVerified
                  ? "text-red-600"
                  : "text-blue-600"
              }
            `}
            >
              {status}
            </span>
          </p>
          <div className="h-32 overflow-y-auto">
            <pre className="bg-gray-100 text-black p-2 rounded-md text-xs">
              <code>{proof}</code>
            </pre>
          </div>
          <button
            className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleVerifyProof}
          >
            Verify Proof
          </button>
        </div>
      )}
    </div>
  );
}
