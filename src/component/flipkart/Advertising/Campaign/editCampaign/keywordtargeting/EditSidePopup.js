import React from "react";

const EditSidePopup = ({
  title,
  setShowPopup,
  children,
  subTitle,
  footerless,
  setBroadKeys,
  setExactKeys,
  setUploadedKeywords,
}) => {
  return (
    <>
      <div className="popup popup--rightSide">
        <div className="popup__container popup__container--rightSide">
          <div
            className={[
              "popup__heading popup__heading--rightside",
              subTitle && "popup__heading--subTitle",
            ].join(" ")}
          >
            {/* {  <button className="popup__close" onClick={()=>setShowPopup(false)} >x</button>} */}
            <div className="row justify-between items-center">
              <div>
                <h4 className="font-bold text-lg capitalize ">{title}</h4>
                {subTitle && <h4 className="">{subTitle}</h4>}
              </div>
              <div>
                <button
                  className="w-6 h-6"
                  onClick={() => {
                    setShowPopup(false);
                    setBroadKeys([]);
                    setExactKeys([]);
                    setUploadedKeywords([]);
                  }}
                >
                  <img src="/assets/images/cross-icon.svg" alt="x" />
                </button>
              </div>
            </div>
          </div>
          <div className="popup__content popup__content--rightside">
            {children}
          </div>
          {footerless ? null : (
            <div className="popup__footer pt-2">
              <div className="text-right">
                <button
                  className="popup__button bg-slate-100 text-gray-400  text-sm"
                  onClick={() => {
                    setShowPopup(false);
                  }}
                >
                  cancel
                </button>
                <button className="popup__button">apply</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditSidePopup;
