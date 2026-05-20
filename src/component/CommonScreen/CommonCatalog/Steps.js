import React from "react";
import SecondStep from "./SecondStep";

const Steps = ({
  step,
  amazonTemplate,
  npdFileName,
  setNpdFileName,
  amazonFileName,
  setAmazonFileName,
  activeBody,
  setActiveBody,
  freezeChanges,
  selectedOption,
}) => {
  // console.log("amazonTemplate>>>>>>>>>>>>>>", amazonTemplate);
  return (
    <div
      className={`rounded-md p-[1rem]  mb-[${step === 0 ? "4rem" : "1rem"}]`}
    >
      {/* {step === 1 && ( */}
      <SecondStep
        step={step}
        setActiveBody={setActiveBody}
        freezeChanges={freezeChanges}
        npdFileName={npdFileName}
        setNpdFileName={setNpdFileName}
        amazonFileName={amazonFileName}
        setAmazonFileName={setAmazonFileName}
        selectedOption={selectedOption}
        amazonTemplate={amazonTemplate}
        activeBody={activeBody}
      />
      {/* )} */}
      {/* {step === 2 && (
        <>
          <div>
            <p className="text-[16px]">
              <b>
                <i className="fa fa-exclamation-triangle text-[red]"></i>
                &nbsp;&nbsp;Alert
              </b>
            </p>
            <p className="text-[#A4A4A4]">
              Attention! We couldn't find sufficient Primary identifiers to
              establish a solid match.
            </p>
          </div>

          <div className="flex">
            <div
              className="file-uploader flex place-content-between "
              style={{ width: "35%" }}
            >
              <p>Upload New NPD File</p>
              <i
                className="fa fa-info-circle self-center"
                aria-hidden="true"
              ></i>
            </div>
            <input
              type="file"
              single
              className="input-upload"
              accept="text/csv"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                }
              }}
            />
          </div>
        </>
      )} */}
    </div>
  );
};

export default Steps;
