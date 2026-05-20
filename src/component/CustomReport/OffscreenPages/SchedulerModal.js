import React, { useState, useRef, useEffect } from "react";
import WhenPermitted from "../../common-components/WhenPermitted";
import { PERMISSIONS } from "../../../utils/constants";

function SchedulerModal({
  content,
  setScheduled,
  schedulerPosition,
  color,
  setEmailList,
  setConfirmation,
  permissionPlatform
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState(
    content["reportSchedulers.emails"] || []
  );
  const [error, setError] = useState("");

  const modalRef = useRef(null);

  useEffect(() => {
    const calculateModalPosition = () => {
      if (!modalRef.current) return;
      const modalHeight = modalRef.current.clientHeight;
      const modalWidth = modalRef.current.clientWidth;
      const buttonTop = schedulerPosition.top;
      const buttonLeft = schedulerPosition.left;
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const spaceBelowButton = windowHeight - buttonTop;
      const spaceRight = windowWidth - (buttonLeft + modalWidth);
      if (spaceBelowButton < modalHeight) {
        const modalTop = Math.max(buttonTop - modalHeight, 0);
        modalRef.current.style.top = `${modalTop}px`;
      }
      if (spaceRight < modalWidth) {
        // console.log(spaceRight, "etstststss>>>>>>>>>>", modalWidth);
        const modalLeft = Math.min(
          buttonLeft - spaceRight,
          windowWidth - modalWidth + spaceRight
        );
        modalRef.current.style.left = `${modalLeft}px`;
      }
    };

    calculateModalPosition();
    window.addEventListener("resize", calculateModalPosition);
    return () => {
      window.removeEventListener("resize", calculateModalPosition);
    };
  }, [schedulerPosition]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddEmail = () => {
    if (!isValidEmail(emailInput)) {
      setError("Invalid email format");
      return;
    }

    if (emails.includes(emailInput)) {
      setError("Email already exists in the list");
      return;
    }

    setEmails([...emails, emailInput]);
    setEmailInput("");
    setError("");
  };

  const isValidEmail = (email) => {
    // Basic email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };
  const handlevalueChange = (e) => {
    const value = e.target.value.replace(/\s+/g, "");
    setEmailInput(value);
  };

  return (
    <div
      className="fixed inset-0 z-10 overflow-y-auto"
      id="scheduler-offscreen"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div
          ref={modalRef}
          className="relative bg-white rounded-md max-w-sm mx-auto overflow-hidden"
          style={{
            position: "absolute",
            ...schedulerPosition,
            width: 250,
            maxWidth: 250,
          }}
        >
          <div className="pt-3">
            <div className="relative mb-4 px-4 ">
              <input
                type="text"
                value={searchTerm}
                placeholder="Search People"
                onChange={handleSearchChange}
                className="pl-8 pr-4 py-2 rounded border w-full bg-[#F5F5F5]"
              />
              <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-[#999999]">
                <i className="fas fa-search text-[#999999] "></i>
              </span>
            </div>
            <div className="mb-4 px-4 ">
              <div
                className={`flex items-center ${error === "" ? "mb-2" : ""}`}
                style={{ width: "100%" }}
              >
             <WhenPermitted platform={permissionPlatform} permission={PERMISSIONS.CUSTOM_REPORT_ACTION}> 
                <input
                  type="text"
                  placeholder="Enter email"
                  value={emailInput}
                  // onChange={(e) => setEmailInput(e.target.value)}
                  onChange={handlevalueChange}
                  className="px-4 py-2 rounded border flex-grow"
                  style={{ width: "100%" }}
                />
                {/* { && ( */}
                <button
                  onClick={handleAddEmail}
                  className=" hover:bg-[#F2F2F2] ml-2 text-white font-bold py-2 px-4 rounded"
                  style={{
                    background: color,
                    cursor:
                      emailInput.trim() === "" || !isValidEmail(emailInput)
                        ? "not-allowed"
                        : "pointer",
                  }}
                  disabled={
                    emailInput.trim() === "" || !isValidEmail(emailInput)
                  }
                >
                  <i className="fas fa-plus"></i>
                </button>
                {/* )} */}
              </WhenPermitted>
              </div>
              {error && (
                <p className="text-red-500 text-[12px] rounded p-1 mb-2 ">
                  {error}
                </p>
              )}
              <div className="h-40 max-h-48 max-w-[100%] overflow-y-auto mt-4">
                {emails
                  .filter((email) =>
                    email.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((email, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <div
                        className="flex-grow pr-4 py-1 text-[12px] text-ellipsis overflow-hidden max-w-[90%]"
                        title={email}
                      >
                        {email}
                      </div>
                     <WhenPermitted platform={permissionPlatform} permission={PERMISSIONS.CUSTOM_REPORT_ACTION}> 
                      <button
                        onClick={() => handleRemoveEmail(email)}
                        className="text-black text-[12px] ml-2 hover:text-red-500" // Added hover effect
                      >
                        <img
                          className="w-3 h-3 rounded-full "
                          src={"/assets/images/crossiconblackcustom.svg"}
                          alt="cross"
                        />
                      </button>
                    </WhenPermitted>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="border-t p-2 flex justify-end bg-[#F2F2F2]">
            <button
              onClick={() => {
                if (emails.length === content["reportSchedulers.emails"].length)
                  setScheduled();
                else {
                  setConfirmation({ type: "emails" });
                }
              }}
              className={`px-7 py-2 bg-[#E3E3E3] text-[#000000] rounded-md border font-medium text-[14px] mr-2`}
            >
              Cancel
            </button>
           <WhenPermitted platform={permissionPlatform} permission={PERMISSIONS.CUSTOM_REPORT_ACTION}> 
            <button
              onClick={() => setEmailList(emails)}
              className={`px-7 py-2 text-[#ffffff] rounded-md border font-medium text-[14px]`}
              style={{
                background: color,
                // cursor:
                //   emails.length === content["reportSchedulers.emails"].length
                //     ? "not-allowed"
                //     : "pointer",
              }}
              // disabled={
              //   emails.length === content["reportSchedulers.emails"].length
              // }
            >
              Apply
            </button>
            </WhenPermitted>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchedulerModal;
