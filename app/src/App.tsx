import "./App.css";
import { Certificate } from "./asn/cert";
import { ALL_OIDS } from "./asn/oid";
import { ASN } from "./asn/parser";
import InputBox from "./components/InputBox";
import { useState } from "react";
import { SPECIFIC_OIDS } from "./utils/constant";

interface OIDInfo {
  d: string;
  c: string;
}

function App() {
  const [certificateContent, setCertificateContent] = useState<string>("");
  const [contentType, setContentType] = useState<string>("");
  const [showInputBox, setShowInputBox] = useState<boolean>(true);
  const [oidsInfo, setOidsInfo] = useState<{ [key: string]: OIDInfo }>({});
  const [selectedOid, setSelectedOid] = useState<string | null>(null);
  const [oidValues, setOidValues] = useState<{ [key: string]: string }>({});

  const handleCertificateContentChange = (content: string, type: string) => {
    setCertificateContent(content);
    setContentType(type);
  };

  console.log(contentType, selectedOid);
  const handleGenerateProof = () => {
    setShowInputBox(false);
    const INPUT_BYTES = Certificate.decode(certificateContent);
    const Oids = ASN.decode(ASN.parse(Array.from(INPUT_BYTES))).OID;
    const OidSet = new Set(Oids);
    const OIDsInfo: { [key: string]: OIDInfo } = {};

    OidSet.forEach((e: string) => {
      if (ALL_OIDS[e] && SPECIFIC_OIDS.includes(e)) {
        OIDsInfo[e] = ALL_OIDS[e];
      }
    });

    setOidsInfo(OIDsInfo);
  };

  const handleInputChange = (oid: string, value: string) => {
    setOidValues((prev) => ({ ...prev, [oid]: value }));
  };

  return (
    <div>
      {showInputBox && (
        <InputBox
          certificateContent={certificateContent}
          onCertificateContentChange={handleCertificateContentChange}
          onGenerateProof={handleGenerateProof}
        />
      )}
      {!showInputBox && (
        <div className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-200 rounded-md">
          <h1 className="text-center text-2xl font-bold text-gray-800 my-8 font-mono tracking-wide border-b-4 border-indigo-500 pb-4 max-w-3xl mx-auto">
            Prove over ObjectIndentifer:String
          </h1>
          <div className="max-w-7xl mx-auto">
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(oidsInfo).map(([oid, info]) => (
                <li key={oid} className="col-span-1 bg-white rounded-lg shadow-md border border-gray-300">
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-gray-900 text-sm font-medium truncate">{oid}</h3>
                      <span className="inline-block px-2 py-1 text-red-800 text-xs font-medium bg-red-100 rounded-full">
                        Not Verified
                      </span>
                    </div>
                    <span className="inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                      {info.c}
                    </span>
                    <p className="text-gray-500 text-sm">{info.d}</p>
                    <input
                      type="text"
                      value={oidValues[oid] || ""}
                      onChange={(e) => handleInputChange(oid, e.target.value)}
                      onFocus={() => setSelectedOid(oid)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter value"
                    />
                    <button
                      className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => {}}
                    >
                      Generate Proof
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
