import { Buffer } from "buffer";
import { ChangeEvent, useState } from "react";
import { OPTIONS } from "../utils/constant";
import { DER_SAMPLE_CONTENT, SAMPLE_BER_CONTENT, SAMPLE_X_509_CONTENT } from "../utils/samples";

interface InputBoxProps {
  certificateContent: string;
  onCertificateContentChange: (content: string, type: string) => void;
  onGenerateProof: () => void;
}

export default function InputBox({ certificateContent, onCertificateContentChange, onGenerateProof }: InputBoxProps) {
  const [certificateType, setCertificateType] = useState("DER");
  const [isSampleCheck, setIsSampleCheck] = useState(false);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]!;

    const arrayBuffer = Buffer.from(await file.arrayBuffer());
    const pdfContent = arrayBuffer.toString("utf8");

    const contentsRegex = /\/Contents\s*<([0-9A-Fa-f]+)>/;
    const match = contentsRegex.exec(pdfContent);

    if (!match) {
      console.error("No match found");
      return;
    }
    const hexEContnent = match[1];
    const signature = Buffer.from(hexEContnent, "hex").toString("base64");

    onCertificateContentChange(signature, "base64");
  };

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    onCertificateContentChange(content, "textarea");
  };

  const fetchCertificateContent = (type: string) => {
    switch (type) {
      case "DER":
        onCertificateContentChange(DER_SAMPLE_CONTENT, "DER");
        break;
      case "BER":
        onCertificateContentChange(SAMPLE_BER_CONTENT, "BER");
        break;
      case "X.509":
        onCertificateContentChange(SAMPLE_X_509_CONTENT, "X.509");
        break;
      default:
        break;
    }
  };

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const type = event.target.value;
    setCertificateType(type);
    fetchCertificateContent(type);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsSampleCheck(event.target.checked);
    if (event.target.checked) {
      fetchCertificateContent(certificateType);
    } else {
      onCertificateContentChange("", "");
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">ZK ASN.1 Parser</h1>
        <div className="flex flex-col items-center p-6 rounded shadow-md">
          <input
            type="file"
            accept="application/pdf"
            className={`mb-4 p-2 border rounded w-96 h-12 ${isSampleCheck ? "opacity-50 cursor-not-allowed" : ""}`}
            onChange={handleFileUpload}
            disabled={isSampleCheck}
          />

          <div className="mb-4 w-full">
            <label className="flex items-center mb-2">
              <input type="checkbox" checked={isSampleCheck} onChange={handleCheckboxChange} className="mr-2" />
              <span>Use sample certificate</span>
            </label>
            {isSampleCheck && (
              <>
                {OPTIONS.map((option) => (
                  <div className="flex items-center mb-2" key={option}>
                    <input
                      type="radio"
                      id={option}
                      name="certificateType"
                      value={option}
                      checked={certificateType === option}
                      onChange={handleRadioChange}
                      className="mr-2"
                    />
                    <label htmlFor={option}>{option}</label>
                  </div>
                ))}
              </>
            )}
          </div>

          <textarea
            className="w-full p-4 border rounded mb-4 h-96"
            placeholder="Paste certificate file here"
            value={certificateContent}
            onChange={handleTextareaChange}
          ></textarea>

          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={onGenerateProof}>
            Check Parameters to Generate Proof
          </button>
        </div>

        <div className="flex items-center bg-gradient-to-r rounded-lg shadow-lg px-6 py-4 mb-8">
          <p className="text-white font-medium mr-4 flex items-center">
            Project is supported by &nbsp;
            <a
              href="https://github.com/zkemail"
              className="block text-center underline transition duration-300 hover:text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              ZkEmail
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
