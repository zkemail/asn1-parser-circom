import { ChangeEvent, useState } from "react";
import { OPTIONS } from "../utils/constant";

interface InputBoxProps {
  certificateContent: string;
  onCertificateContentChange: (content: string, type: string) => void;
  onGenerateProof: () => void;
}

export default function InputBox({ certificateContent, onCertificateContentChange, onGenerateProof }: InputBoxProps) {
  const [certificateType, setCertificateType] = useState("DER");
  const [isSampleCheck, setIsSampleCheck] = useState(false);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result as string;
        onCertificateContentChange(content, "file");
      };
      reader.readAsText(file);
    }
  };

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    onCertificateContentChange(content, "textarea");
  };

  const fetchCertificateContent = (type: string) => {
    const fileUrl = {
      DER: "https://raw.githubusercontent.com/lapo-luchini/asn1js/trunk/examples/sig-p256-der.p7m",
      BER: "https://raw.githubusercontent.com/lapo-luchini/asn1js/trunk/examples/sig-p256-ber.p7m",
      "X.509":
        "https://gist.githubusercontent.com/0xVikasRushi/9ca33093d2715926cc31accb2e74d04c/raw/897a36b9c1aa2fa52047c153821e6ff945f8799f/X.509.txt",
    }[type];

    fetch(`${fileUrl}`)
      .then((response) => response.text())
      .then((text) => {
        onCertificateContentChange(text, type);
      })
      .catch((error) => console.error("Error fetching text file:", error));
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
      onCertificateContentChange("", ""); // Clear content in parent component
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">ASN.1 Parser</h1>
      <div className="flex flex-col items-center p-6 rounded shadow-md">
        <input
          type="file"
          accept="application/pdf"
          className="mb-4 p-2 border rounded w-96 h-12"
          onChange={handleFileUpload}
        />
        <textarea
          className="w-full p-4 border rounded mb-4 h-96"
          placeholder="Paste certificate file here"
          value={certificateContent}
          onChange={handleTextareaChange}
        ></textarea>
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
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={onGenerateProof}>
          Check Parameters to Generate Proof
        </button>
      </div>
    </div>
  );
}
