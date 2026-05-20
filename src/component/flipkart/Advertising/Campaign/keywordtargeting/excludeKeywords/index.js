import { useRef } from "react";
const ExcludeKeywords = ({ uploadedKeywords, setUploadedKeywords }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    if (event?.target && event?.target?.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        const lines = content.split("\n");
        const extractedKeywords = lines.slice(2).map((line) => line.trim());
        setUploadedKeywords(extractedKeywords);
      };

      reader.readAsText(file);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveAll = () => {
    setUploadedKeywords([]);
  };
  const handleRemoveExcludedKey = (index) => {
    const updatedExactKeys = [...uploadedKeywords];
    updatedExactKeys.splice(index, 1);
    setUploadedKeywords(updatedExactKeys);
  };

  return (
    <>
      <div className="add-keyword-content">
        <div className="exclude-keyword-container p-4">
          {/* <div className="search-volume">
            <div className="title">Estimated Search Volume</div>
            <span>
              <img src="/assets/images/info-blue.svg" alt="" />
            </span>
            <span> : </span>
            <div className="count">0</div>
          </div> */}
          <div className="manual-keyword-match">
            <div className="keyword-match-label">
              Broad Match
              <img src="/assets/images/info-blue.svg" alt="" />
            </div>
            <div className="keyword-match-sublabel">
              {/* Enter comma separated keywords
               */}
              &nbsp;
              <div className="remove" onClick={handleRemoveAll}>
                Remove All
              </div>
            </div>
            <div className="keyword-match-textarea">
              {uploadedKeywords?.map((keywords, i) => (
                <div
                  className="flex bg-gray-200 rounded-full px-3 py-1 text-gray-600 lowercase text-sm m-1"
                  key={keywords}
                >
                  <div className="pr-3">{keywords}</div>
                  <div
                    className="cursor-pointer"
                    onClick={() => handleRemoveExcludedKey(i)}
                  >
                    X
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="upload-keyword ">
            <div
              className="product-droop cursor-pointer"
              onClick={handleIconClick}
            >
              <div className="product-droop-text ">
                <div className="product-droop-upload ">
                  <div className="upload-title flex">
                    <img src="/assets/images/upload.svg" alt="" />{" "}
                    <input
                      accept=".csv"
                      type="file"
                      className="upload"
                      name="exclude_keywordsfile"
                      id="exclude_keywordsfile"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                    <div>Upload a list of Keywords as CSV</div>
                  </div>
                  <div className="upload-subtitle ">
                    You can upload upto 198 keywords
                  </div>
                </div>
              </div>
            </div>
            <div className="product-download-template">
              <span role="presentation" className="link">
                <a
                  href="/assets/upload/keyword_targeting_exclude.csv"
                  download=""
                >
                  Download Template &nbsp;
                </a>
              </span>
              and enter keywords
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExcludeKeywords;
