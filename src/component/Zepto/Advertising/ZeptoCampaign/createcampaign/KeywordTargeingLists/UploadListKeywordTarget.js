import React from "react";
import { HiDownload, HiUpload } from "react-icons/hi";

const UploadListKeywordTarget = () => {
 
  const handleDownload = () => {
  
    const csvData = "csv"; 
    const blob = new Blob([csvData], { type: "text/csv" });

   
    const url = window.URL.createObjectURL(blob);

   
    const a = document.createElement("a");
    a.href = url;
    a.download = "template.csv"; 
    a.click();


    window.URL.revokeObjectURL(url);
  };
  

  return (
    <>
      <div className="p-4 h-96">
        <h2 className="text-xs">
          Use the template to make sure your information uploads accurately.
        </h2>
        <div className="row">
          <div className="pt-3">
            <button
              className="rounded-lg bg-gray-200 border row items-center px-2"
              onClick={handleDownload}
            >
              <HiDownload className="" />
              Download the CSV template
            </button>
          </div>
          <div className="row pt-4 justify-center">
            <div className="rounded-lg custom-dotted-border text-center bg-gray-50 text-sm p-16">
              <HiUpload className="mx-auto text-gray-500" />
              <p className="text-center text-sm">
                Drag and drop files here or click to upload.
              </p>
              <p className="text-sm">or click to select from computer</p>
              <p className="text-sm">Accepted formats: CSV, TSV, XLSX</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadListKeywordTarget;
