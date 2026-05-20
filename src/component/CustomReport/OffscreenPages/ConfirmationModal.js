import React, { useEffect } from "react";

function ConfirmationModal({ message, onConfirm, onCancel, color }) {
  useEffect(() => {
    stylingComponent();
  }, []);

  const stylingComponent = (from) => {
    const element = document.getElementById("scheduler-offscreen");
    if (element) {
      element.style.zIndex = from ? "10" : "5";
    }
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div className="relative bg-white rounded-md max-w-md mx-auto p-6">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={() => {
              stylingComponent("onCancel");
              onCancel(false);
            }}
            className={`px-7 py-2 bg-[#FFFFFF] text-[#000000] rounded-md border font-medium text-[14px] mr-2`}
          >
            No
          </button>
          <button
            onClick={() => {
              onConfirm();
            }}
            className={`px-7 py-2 text-[#ffffff] rounded-md border font-medium text-[14px]`}
            style={{
              background: color,
            }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
export default ConfirmationModal;
