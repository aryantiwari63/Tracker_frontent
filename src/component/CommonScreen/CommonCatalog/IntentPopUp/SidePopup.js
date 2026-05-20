import React from "react";

const SidePopup = ({ children, footerless, close }) => {
  return (
    <>
      <div className="sidepopup sidepopup--rightSide">
        <div className="sidepopup__container sidepopup__container--rightSide">
          <div
            className={[
              "sidepopup__heading sidepopup__heading--rightside",
            ].join(" ")}
          >
            <div className="row justify-between items-center">
              {/* <div>
                <h4 className="font-bold text-lg capitalize ">{title}</h4>
              </div> */}
              <div>
                <button
                  className="border px-2 py-1"
                  // className="w-6 h-6"
                  onClick={() => {
                    close();
                  }}
                >
                  <div className="flex">
                    <img
                      src="/assets/images/slidearrow.svg"
                      alt=""
                      style={{ width: 14 }}
                    />
                    <label className="px-1 text-sm">Hide Assistant</label>
                  </div>
                </button>
              </div>
              {/* <div>
                <button
                  className="px-3 py-2 rounded bg-[#1890FF] text-white text-sm"
                  // onClick={() => {
                  //   close();
                  // }}
                >
                  Save
                </button>
              </div> */}
            </div>
          </div>
          <div className="sidepopup__content sidepopup__content--rightside">
            {children}
          </div>
          {footerless ? null : (
            <div className="popup__footer pt-2">
              <div className="text-right">
                <button
                  className="sidepopup__button bg-slate-100 text-gray-400  text-sm"
                  onClick={() => {
                    // setShowPopup(false);
                  }}
                >
                  cancel
                </button>
                <button className="sidepopup__button">apply</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SidePopup;
