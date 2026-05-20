import React, { useState, useRef, useEffect } from "react";
import "./HelpdeskIcon.css";
import HelpdeskForm from "./HelpdeskForm";
import { HELP_DESK_SUPPORT } from "../../utils/constants";
import { _POST } from "../../services/axios.method";
import { useDispatch } from "react-redux";
import { setToastMessageHandler } from "../../redux/action-creator/commonAction";
import Toast from "../common-components/toast";
// import Popup from '../common-components/Popups/Popup';
// import { RxCross2 } from 'react-icons/rx';
import Popup from "../common-components/Popups/Popup";

const Helpdesk = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const platform = localStorage
    .getItem("platform_type")
    ?.replace(/"/g, "")
    ?.substring(1);
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const helpdeskContainerRef = useRef(null);

  // Helper function to toggle the form's visibility
  const toggleForm = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  useEffect(() => {
    setScreenshot(null);
  }, [isOpen]);

  const handleSupportApi = async (formDetails) => {
    const { name, email, subject, description, files, screenshot, selectedPlatform,platformOption } = formDetails;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("platform", platformOption.length == selectedPlatform.length ? "All" :  selectedPlatform.map((item) => item.label));

    if (files && files?.length > 0) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    if (screenshot) {
      const byteString = atob(screenshot?.split(",")[1]);
      const mimeString = screenshot?.split(",")[0].split(":")[1].split(";")[0];
      const arrayBuffer = new Uint8Array(byteString.length);

      for (let i = 0; i < byteString.length; i++) {
        arrayBuffer[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([arrayBuffer], { type: mimeString });

      formData.append("screenshot", blob, "screenshot.png");
    }

    try {
      const response = await _POST(HELP_DESK_SUPPORT, formData);
      if (response?.data?.status.code === 200) {
        dispatch(
          setToastMessageHandler(`${response?.data?.status?.message}`, true)
        );
        setIsOpen(false);
      } else {
        dispatch(
          setToastMessageHandler(`${response?.data?.status?.message}`, false)
        );
      }
    } catch (error) {
      dispatch(setToastMessageHandler(`Something went wrong`, false));
    }
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     // Check if click is outside both the form and helpdesk icon container
  //     if (
  //       formRef.current &&
  //       !formRef.current.contains(event.target) &&
  //       helpdeskContainerRef.current &&
  //       !helpdeskContainerRef.current.contains(event.target)
  //     ) {
  //       setIsOpen(false);
  //     }
  //   };

  //   // Add event listener for clicks outside
  //   document.addEventListener('mousedown', handleClickOutside);

  //   // Cleanup the event listener
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  return (
    <>
      <Toast />
      <button
        className="helpdesk-container"
        ref={helpdeskContainerRef}
        onClick={toggleForm}
      >
        <i className="fa fa-question-circle mr-2"></i>
        <span className="help-text">Help</span>
      </button>
      <div className="helpdesk-wrapper">
        {/* Helpdesk Icon */}

        {/* Helpdesk Form */}
        {isOpen && (
          <div
            className={`helpdesk-form ${
              isOpen ? "enter-active" : "exit-active"
            }`}
            ref={formRef}
            onClick={(e) => e.stopPropagation()} // Prevent click inside the form from closing it
          >
            <HelpdeskForm
              platform={platform ? platform : null}
              toggle={toggleForm}
              handleApi={handleSupportApi}
              screenshot={screenshot}
              setScreenshot={setScreenshot}
              setPreview={setPreview}
            />
          </div>
        )}
      </div>
      {preview && (
        <div>
          <Popup
            setTempView={() => {}}
            title="Preview"
            footerless={true}
            setShowPopup={setPreview}
            className="z-50"
          >
            <div className="p-2">
              <img
                src={screenshot}
                alt="Full Screenshot"
                className="max-w-full max-h-full rounded-md"
              />
            </div>
          </Popup>
        </div>
      )}
    </>
  );
};

export default Helpdesk;