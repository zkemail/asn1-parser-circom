import { useState } from "react";
import "./App.css";
import { Certificate } from "./asn/cert";
import { ALL_OIDS } from "./asn/oid";
import { ASN } from "./asn/parser";
import InputBox from "./components/InputBox";
import OidItem from "./components/ProofBox";
import { SPECIFIC_OIDS } from "./utils/constant";

interface OIDInfo {
  d: string;
  c: string;
}

function App() {
  const [certificateContent, setCertificateContent] = useState<string>("");
  const [showInputBox, setShowInputBox] = useState<boolean>(true);
  const [oidsInfo, setOidsInfo] = useState<{ [key: string]: OIDInfo }>({});
  const [inputBytes, setInputBytes] = useState<number[]>([]);

  const [expectedLengths, setExpectedLength] = useState<number[]>([0, 0]);

  const handleCertificateContentChange = (content: string) => {
    setCertificateContent(content);
  };

  const handleGenerateProof = () => {
    setShowInputBox(false);
    const INPUT_BYTES = Certificate.decode(certificateContent);
    setInputBytes(Array.from(INPUT_BYTES));
    const parsed = ASN.decode(ASN.parse(Array.from(INPUT_BYTES)));
    const Oids = parsed.OID;
    const OidSet = new Set(Oids);
    const OIDsInfo: { [key: string]: OIDInfo } = {};
    OidSet.forEach((e: string) => {
      if (ALL_OIDS[e] && SPECIFIC_OIDS.includes(e)) {
        OIDsInfo[e] = ALL_OIDS[e];
      }
    });

    setExpectedLength([Oids.length, parsed.UTF8Array.length]);
    setOidsInfo(OIDsInfo);
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
            Zk Prove over ObjectIndentifer:String
          </h1>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(oidsInfo).map(([oid, info]) => (
                <div key={oid} className="bg-white rounded-lg shadow-md border border-gray-300 flex flex-col">
                  <OidItem oid={oid} info={info} inputBytes={inputBytes} expectedLength={expectedLengths} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
