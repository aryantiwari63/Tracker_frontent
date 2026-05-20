import { useRef } from "react";

const EditKeywordsRightBlock = ({
  broadKeys,
  removeAllBroadKeys,
  handleRemoveBroadKey,
  handleRemoveExactKey,
  exactKeys,
  removeAllExactKeys,
  setBroadKeys,
  setExactKeys,
}) => {
  const fileInputRefCSV = useRef(null);
  const handleFileUploadCSV = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split("\n");
      const data = lines.slice(2).map((line) => line.trim());
      // setUploadedKeywords(extractedKeywords);
      // console.log("extractedKeywordsextractedKeywords", data);
      let broadKeys = [];
      let exactKeys = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i] != "") {
          if (data[i].split(",")[0]) {
            broadKeys.push(data[i].split(",")[0]);
            setBroadKeys(broadKeys);
          }
          if (data[i].split(",")[1]) {
            exactKeys.push(data[i].split(",")[1]);
            setExactKeys(exactKeys);
          }
        }
      }
    };

    reader.readAsText(file);
  };

  const handleIconClickCSV = () => {
    fileInputRefCSV.current.click();
  };
  return (
    <>
      <div className="keyword-right">
        <div className="row">
          <div className="keyword__wrap-keysugg align-middle">
            <div className="callout-imgKey mr-2">
              <img src="/assets/images/info-orange.svg" alt="" />
            </div>
            <p className="callout__keysugg">
              Use spell suggestions for improved ads serving.
            </p>
          </div>
        </div>
        <div className="">
          <div className="">
            <div className="keyword-match-label row">
              Broad Match
              <img src="/assets/images/info-blue.svg" alt="" />
            </div>
            <div>
              <div className="keyword-match-sublabel">
                {/* Enter comma separated keywords */}
                &nbsp;
                <div className="remove" onClick={removeAllBroadKeys}>
                  Remove All
                </div>
              </div>
            </div>

            <div className="">
              <div className="keyword-match-textarea">
                {broadKeys?.map((broadKey, i) => (
                  <div
                    className="flex bg-gray-200 rounded-full px-3 py-1 text-gray-600 lowercase text-sm m-1"
                    key={broadKey}
                  >
                    <div className="pr-3">{broadKey}</div>
                    <div
                      className="cursor-pointer"
                      onClick={() => handleRemoveBroadKey(i)}
                    >
                      X
                    </div>
                  </div>
                ))}
              </div>
              <div className="">
                <div className="keyword-match-label row mt-1">
                  Exact Match
                  <div className="">
                    {" "}
                    <img src="/assets/images/info-blue.svg" alt="" />
                  </div>
                </div>
              </div>
              <div>
                <div className="keyword-match-sublabel">
                  &nbsp;
                  <div className="remove" onClick={removeAllExactKeys}>
                    Remove All
                  </div>
                </div>
              </div>
              <div className="keyword-match-textarea">
                <div className="bootstrap-tagsinput">
                  {exactKeys?.map((exactKey, i) => (
                    <div
                      className="flex bg-gray-200 rounded-full px-3 py-1 text-gray-600 lowercase text-sm m-1"
                      key={exactKey}
                    >
                      <div className="pr-3">{exactKey}</div>
                      <div
                        className="cursor-pointer"
                        onClick={() => handleRemoveExactKey(i)}
                      >
                        X
                      </div>
                    </div>
                  ))}
                </div>
                {/* <input
                  className="taginput"
                  type="text"
                  name="keywords_exact"
                  id="keywords_exact"
                  value=""
                /> */}
              </div>
              <div className="upload-keyword">
                <div
                  className="product-droop cursor-pointer"
                  onClick={handleIconClickCSV}
                >
                  <div className="product-droop-text ">
                    <div className="product-droop-upload ">
                      <div className="upload-title flex">
                        <img src="/assets/images/upload.svg" alt="" />
                        <div className="text-sm">
                          Upload a list of Keywords as CSV
                        </div>

                        <input
                          accept=".csv"
                          type="file"
                          className="upload"
                          name="keywordsfile"
                          id="keywordsfile"
                          ref={fileInputRefCSV}
                          onChange={handleFileUploadCSV}
                          style={{ display: "none" }}
                        />
                      </div>
                      <div className="upload-subtitle ">
                        You can upload upto 198 keywords
                      </div>
                    </div>
                  </div>
                </div>
                <div className="product-download-template">
                  <span role="presentation" className="link">
                    <a href="/assets/upload/keyword_targeting.csv" download="">
                      Download Template &nbsp;
                    </a>
                  </span>
                  and enter keywords
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditKeywordsRightBlock;
