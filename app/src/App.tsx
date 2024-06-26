import { ChangeEvent, useState } from "react";
import "./App.css";
import { SAMPLE_BER } from "asn1-parser-circom/src";
const options = ["DER", "BER", "X.509"];

function App() {
  const [certificateContent, setCertificateContent] = useState("");
  const [certificateType, setCertificateType] = useState("DER");
  const [isSampleCheck, setIsSampleCheck] = useState(false);
  console.log(SAMPLE_BER);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setCertificateContent(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCertificateContent(event.target.value);
  };

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCertificateType(event.target.value);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsSampleCheck(event.target.checked);
    if (!event.target.checked) {
      setCertificateContent("");
      setCertificateType("DER");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">ASN.1 Parser</h1>
      <div className="flex flex-col items-center  p-6 rounded shadow-md">
        <input type="file" accept="application/pdf" className="mb-4 p-2 border rounded" onChange={handleFileUpload} />
        <textarea
          className="w-full p-4 border rounded mb-4"
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
              {options.map((option) => (
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
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Check Parameters to Generate Proof
        </button>
      </div>
    </div>
  );
}

export default App;
