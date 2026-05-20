import React, { useState, useCallback, useEffect } from "react";
import "./HelpdeskIcon.css";
import { RxCross2 } from "react-icons/rx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDropzone } from "react-dropzone";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import html2canvas from 'html2canvas';
// import ReCAPTCHA from 'react-google-recaptcha';
import { useSelector } from "react-redux";
// import _ from "lodash";
import { capitalizeFirstLetter } from "../../utils/helpers";
import { FaBox } from "react-icons/fa";
import {
  faFile,
  faFilePdf,
  faFileWord,
  faFileImage,
} from "@fortawesome/free-solid-svg-icons";
import { MultiSelect } from "react-multi-select-component";
// import { USER_DETAILS } from "../../utils/constants";
// import { _GET } from "../../services/axios.method";

// const client_id = localStorage.getItem('client_id')

const HelpdeskForm = ({
  platform,
  toggle,
  handleApi,
  setPreview,
  screenshot,
  setScreenshot,
}) => {
  const [files, setFiles] = useState([]);
  const [selectedPlatform,setSelectedPlatform] = useState([])
  const [userDetail, setUserDetail] = useState({});
  const [formData, setFormData] = useState({
    name: userDetail.userName,
    email: userDetail.email,
    subject: "",
    description: ""
  });
  const [errors, setErrors] = useState({});
  const [errorMessage,setErrorMessage] = useState("")
  const [fileError, setFileError] = useState(null); // Error for exceeding file limit
  // const [recaptchaToken, setRecaptchaToken] = useState(null); // reCAPTCHA token state
  const user_info = useSelector((state) => state?.AuthReducer);
  // const sortedPlatforms = _.sortBy(user_info?.platforms, "platform_id");
  // const platformValues = _.map(sortedPlatforms, "platform_value");
  const data = JSON.parse(user_info?.platforms);
  let savedPlatform;
  //console.log('platformValuesplatformValues',data?.platform)
  if(data?.platform){
    savedPlatform = data?.platform;
  }else{
    savedPlatform =["Flipkart","Amazon","Blinkit","Zepto","Instamart"]
  }

  const platformOption = savedPlatform?.map((item)=>{
    return {label: capitalizeFirstLetter(item),value: item}
  })

  // Single loader object to manage multiple loaders
  const [loader, setLoader] = useState({
    screenshotLoading: false,
    submitLoading: false,
  });

  // const colorMap = {
  //   amazon: "#FF9900s",
  //   blinkit: "#11B07A",
  //   flipkart: "#0081f7",
  //   zepto: "#BD39EC",
  //   instamart: "#851853",
  // };

  // const colorMapField = {
  //   amazon: "rmsc--ams",
  //   blinkit: "rmsc--blinkit",
  //   flipkart: "",
  //   zepto: "rmsc--zepto",
  //   instamart: "rmsc--insta",
  // };

  // const bgMap = {
  //   amazon: "rgba(255, 153, 0, 0.06)",
  //   blinkit: "rgba(17, 176, 122, 0.06)",
  //   flipkart: "rgba(0, 129, 247, 0.06)",
  //   zepto: "rgba(60, 0, 107, 0.06)",
  //   instamart: "rgba(207, 38, 128, 0.06)",
  // };

  // const bgCss = bgMap[platform] || bgMap['flipkart'];
  const colorCss = 'rgb(30, 31, 32, 1)';
  // const borderCss = platform ? `${platform}Ring` : "flipkartRing";

  const onDrop = useCallback(
    (acceptedFiles) => {
      const MAX_FILE_SIZE_MB = 5;
      const MAX_TOTAL_FILES = 5;

  
      // Check if any accepted file exceeds the size limit
      const hasLargeFile = acceptedFiles.some((file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
  
      if (hasLargeFile) {
        setFileError("File size must be less than 5 MB.");
      } else if (files.length + acceptedFiles.length > MAX_TOTAL_FILES) {
        setFileError("You can upload a maximum of 5 files.");
      } else {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
        setFileError(null); // Clear error if within limits
      }
    },
    [files]
  );

  useEffect(()=>{
    if(platform === 'dashboard'){
      setSelectedPlatform(platformOption)
    }else{
      setSelectedPlatform([{label: capitalizeFirstLetter(platform),value: platform}])
    }
  },[platform])

  const removeFile = (fileName,file) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.name !== fileName || f !== file));
    setFileError(null); // Clear error if any file is removed
  };

  const customValueRenderer = (selected) => {
    let selectedLabels = [];
    if (selected.length) {
      if(selected.length === platformOption.length){
        return "All platform"
      }
        selected.map(({ label }) => selectedLabels.push(label));
      }
      return selectedLabels.join(",");
  };

  const handleSelectedPlatforms = (selected)=>{
    setSelectedPlatform(selected)
    setErrors({...errors,platform: false})
    setErrorMessage(null)
  }

  const userDetailsApi = async () => {
    try {
      let userName=localStorage.getItem('name')
      let email=localStorage.getItem('email')
      const result = {
        email,
        userName
    }
      setUserDetail(result);
      setFormData({...formData,name: result?.userName,email: result?.email})
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    localStorage.getItem('client_id') && userDetailsApi();
  }, []);

  const captureScreenshot = async () => {
    try {
      // Select the helpdesk form element
      const helpdeskForm = document.querySelector(".helpdesk-form");

      // Hide the helpdesk form element
      if (helpdeskForm) {
        helpdeskForm.style.visibility = "hidden";
      }

      // Capture the screen using getDisplayMedia()
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
      });

      const video = document.createElement("video");
      video.srcObject = screenStream;
      video.onloadedmetadata = () => {
        video.play();

        // Add a delay to wait for the popup to disappear
        setTimeout(() => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");

          // Draw the video frame on the canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convert the canvas to an image (base64 format)
          const imgData = canvas.toDataURL("image/jpeg");

          // Set the image data in the state
          setScreenshot(imgData);

          // Stop the screen stream after capturing the screenshot
          screenStream.getTracks().forEach((track) => track.stop());

          // Restore the helpdesk form's visibility
          if (helpdeskForm) {
            helpdeskForm.style.visibility = "visible";
          }
        }, 450); // Wait 450ms second before taking the screenshot
      };
    } catch (err) {
      console.error("Error capturing the screen:", err);

      // Ensure the helpdesk form is made visible in case of errors
      const helpdeskForm = document.querySelector(".helpdesk-form");
      if (helpdeskForm) {
        helpdeskForm.style.visibility = "visible";
      }
    }
  };

  const removeScreenshot = (e) => {
    e.stopPropagation(); // Stop the event from propagating
    setScreenshot(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    // maxSize: 5242880, // 5 MB max size
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
    setErrorMessage(null)
  };

  const validateFields = () => {
    const newErrors = {};
    let message;
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|mil|co|info|io|me|biz|us|in|uk|ca|au)$/i;// Regex for basic email validation
  
    Object.keys(formData).forEach((key) => {
      if (!formData[key]?.trim() && key !== 'platform' && key !== 'subject') {
        // Exclude platform from empty check
        newErrors[key] = true;
        message = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`; // Create an error message
      } else if (key === 'email' && !emailRegex.test(formData[key].trim())) {
        // Validate email format
        newErrors[key] = true;
        message = 'Email is not valid.'; // Set error message for invalid email
      }  
    });
    if(selectedPlatform.length < 1 && userDetail.email){
      newErrors.platform = true
      message = "Platform is required."
    }
    
    setErrors(newErrors);
    setErrorMessage(message); // Set the error messages
  
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      setLoader((prev) => ({ ...prev, submitLoading: true }));
      await handleApi({ ...formData, files, selectedPlatform, screenshot,platformOption }); // Include platform
      setLoader((prev) => ({ ...prev, submitLoading: false }));
    } else {
      document.querySelector(".input-error")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const RenderFileList = ({ files}) => {
    const [fileUrls, setFileUrls] = useState([]);
  
    useEffect(() => {
      // Generate blob URLs for each file when component mounts
      const urls = files.map(file => {
        return {
          name: file.name,
          url: URL.createObjectURL(file),
        };
      });
      setFileUrls(urls);
  
      // Cleanup blob URLs when component unmounts
      return () => {
        urls.forEach(file => URL.revokeObjectURL(file.url));
      };
    }, [files]);
  
    return (
      <ul className="mt-2">
        {/* Conditionally show the number of attachments */}
        {files?.length > 0 && (
          <div className="mb-2 text-gray-700 font-semibold">
            {files.length} Attachment{files.length > 1 ? "s" : ""}
          </div>
        )}
  
        {files?.map((file, index) => {
          // Get the file extension to determine the file type
          const fileExtension = file.name.split(".").pop().toLowerCase();
  
          // Function to select icon based on file type
          const getFileIcon = (extension) => {
            switch (extension) {
              case "pdf":
                return faFilePdf;
              case "doc":
              case "docx":
                return faFileWord;
              case "jpg":
              case "jpeg":
              case "png":
              case "gif":
                return faFileImage;
              default:
                return faFile; // Default file icon for other types
            }
          };
  
          // Find the generated Blob URL for the current file
          const fileUrl = fileUrls.find(f => f.name === file.name)?.url;
  
          return (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-50 p-2 mb-2 border border-gray-300 rounded-sm shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Left side: File icon, name with ellipsis */}
              <div className="flex items-center space-x-2 flex-grow">
                <FontAwesomeIcon
                  icon={getFileIcon(fileExtension)}
                  className="text-gray-600"
                  size="lg"
                />
  
                {/* Wrap file name with <a> tag to preview the file */}
                <a
                  href={fileUrl} // Use the stored file Blob URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 font-medium truncate"
                  title={file.name}
                  style={{ maxWidth: "150px" }} // Limit file name width
                >
                  {file.name}
                </a>
              </div>
  
              {/* Right side: Remove button */}
              <button
                onClick={() => removeFile(file.name,file)} 
                className="text-gray-500 hover:text-red-500 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      <div
        className="h-40 rounded-t-lg px-5 py-7 flex justify-between"
        style={{ backgroundColor: colorCss,opacity: '92%' }}
      >
        <div className="w-4/5 text-xl text-white font-semibold">
          Welcome to E-Genie Support
        </div>
        <RxCross2
          className="cursor-pointer"
          size={20}
          color="#FFFFFF"
          onClick={toggle}
        />
      </div>
      <div className="px-5 h-10">
        <div
          className="px-3 pt-3 h-[320px] border -translate-y-16 rounded-md bg-white overflow-y-auto scrollbar-hide"
          style={{ borderWidth: "1px" }}
        >
          <h1 className="mb-3 text-base font-semibold">Contact Us</h1>

          {["name", "email", "subject", "description"].map((field) => (
                <div key={field}>
                  <label
                    className="block font-semibold text-base mb-2"
                    htmlFor={field}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {field !== "subject" && <span className="text-red-500">*</span>}
                  </label>
                  {field === "description" ? (
                    <textarea
                      name={field}
                      id={field}
                      className={`w-full p-2 border ${
                        errors[field] ? "border-red-500 input-error" : ''
                      } border-gray-300 rounded-sm mb-2`}
                      placeholder={`Enter a ${field}`}
                      rows="4"
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      id={field}
                      className={`w-full p-1 border ${
                        errors[field] ? "border-red-500 input-error" : ''
                      } border-gray-300 rounded-sm mb-2`}
                      placeholder={`Enter your ${field}`}
                      onChange={handleChange}
                      value={formData[field] || ""} // Pre-fill value from formData or empty
                      disabled={
                        (field === "email" || field === "name") &&
                        localStorage.getItem('client_id')
                          ? true
                          : false
                      } // Disable if the field exists in formData
                    />
                  )}

                  {/* Conditionally render platform right after the email field */}
                  {field === "email" && localStorage.getItem('client_id') && (
                    <div key="platform">
                      <label
                        className="block font-semibold text-base mb-2"
                        htmlFor="platform"
                      >
                        Platform
                        {<span className="text-red-500">*</span>}
                      </label>
                      
                      <MultiSelect
                          className={`z-30 mb-2 customBoxHelpdesk rmsc--tagManager`}
                          options={platformOption}
                          value={selectedPlatform}
                          onChange={handleSelectedPlatforms}
                          labelledBy="Select Platform"
                          valueRenderer={customValueRenderer}
                          ClearSelectedIcon={null}
                          disableSearch={true}
                          platform={platform}
                        />
                      {/* <select
                        name="platform"
                        id="platform"
                        className={`w-full border ${
                          errors["platform"] ? "border-red-500 input-error" : borderCss
                        } border-gray-300 rounded-sm mb-2 align-middle`}
                        style={{
                          height: "32px",
                          padding: "0 3px",
                          lineHeight: "1.5",
                          background: "#fff",
                        }}
                        value={formData["platform"] || "dashboard"} // Bind the formData value
                        onChange={handleChange}
                      >
                        <option value="All">All platform</option>
                        {platformValues.map((platformValue) => (
                          <option key={platformValue} value={platformValue}>
                            {capitalizeFirstLetter(platformValue)}
                          </option>
                        ))}
                      </select> */}
                    </div>
                  )}
                </div>
              ))}


          {screenshot ? (
            <div
              className="screenshot-preview relative mb-3 cursor-pointer"
              onClick={() => setPreview(true)}
            >
              {/* Darkened screenshot with reduced brightness */}
              <img
                src={screenshot}
                className="rounded-sm"
                alt="Screenshot"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  filter: "brightness(50%)",
                }}
              />

              {/* Cross Icon to remove screenshot */}
              <RxCross2
                className="absolute top-2 right-2 z-20 cursor-pointer"
                size={24}
                color="white"
                onClick={(e) => removeScreenshot(e)}
              />

              {/* "Click to Preview" text in the center */}
              <div className="absolute inset-0 flex justify-center items-center text-white text-sm z-10 font-semibold">
                Click to Preview
              </div>
            </div>
          ) : (
            <button className="btn-screenshot mb-3" onClick={captureScreenshot}>
              {loader.screenshotLoading ? (
                "Capturing..."
              ) : (
                <>
                  <img
                    src="/assets/images/ScreenShot-Image.svg"
                    alt=""
                    className="mr-2"
                  />{" "}
                  Take Screenshot
                </>
              )}
            </button>
          )}

          <div
            {...getRootProps()}
            className={`flex flex-col hover:cursor-pointer items-center justify-center w-full h-28 p-6 border-2 border-dotted`}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
          >
            <input {...getInputProps()} />
            <div className="mb-2">
              <FaBox />
            </div>
            <p className="text-gray-600">Select or drag files.</p>
            <p className="text-sm text-gray-400 text-center">
              You can upload maximum of 5 MB
            </p>
          </div>

          {fileError && (
            <div className="text-red-500 text-sm mt-2">{fileError}</div>
          )}
          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
          )}

          <RenderFileList files={files} />

          <button
            className={`w-full mb-3 text-white py-2`}
            onClick={handleSubmit}
            style={{
              backgroundColor: colorCss,
              filter: loader.submitLoading
                ? "brightness(0.8)"
                : "brightness(1)", // Adjust brightness when loading
              cursor: loader.submitLoading ? "not-allowed" : "pointer", // Change cursor when disabled
            }}
            disabled={loader.submitLoading}
          >
            {loader.submitLoading ? "Please wait..." : "Send"}
          </button>
        </div>
      </div>
    </>
  );
};

export default HelpdeskForm;