import React, { useRef, useState } from "react";
import { _POST } from "../../../../../../services/axios.method";
import { useDispatch } from "react-redux";
import { setToastMessageHandler } from "../../../../../../redux/action-creator/commonAction";
import LoaderSpinnerBlinkit from "../../../../../common-components/loader-spinner-blinkit";

const ImageLeftPanel = ({
  onImageUpload,
  setSelectedImage,
  setSelectedImageData,
  setUploadedImage,
  uploadedImage,
}) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Clear the file input
    }
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const { width, height } = img;
        if (file.size > 180 * 1024) {
          setError("File size exceeds 180kB.");
        } else if (width !== 208 || height !== 520) {
          setError("Image dimensions must be 208px width by 520px height.");
        } else if ((width - 160) / 2 < 0 || (height - 372) / 2 < 0) {
          setError(
            "Image content must be centered within 160px width by 372px height."
          );
        } else {
          setError("");
          uploadImage(file); // Call the function to upload the image
        }
      };
    }
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      setLoading(true);

      const response = await _POST("/blinkit/uploadcretiveimage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle success response
      if (response.data.status.code == 200) {
        setUploadedImage(URL.createObjectURL(file));
        onImageUpload(file, response.data?.data);
        dispatch(setToastMessageHandler("Image uploaded successFully", true));
        setLoading(false);
      } else {
        dispatch(setToastMessageHandler("Failed to upload image", false));
        setLoading(false);
      }
    } catch (error) {
      // Handle error response
      console.error("Image upload failed:", error);
      setError("Image upload failed. Please try again.");
      dispatch(setToastMessageHandler("Failed to upload image", false));
      resetInput();
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setError("");
    resetInput();
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Clear the file input
      setSelectedImage(null);
      setSelectedImageData(null);
    }
  };

  const handleDivClick = () => {
    if (!uploadedImage && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageUpload({ target: { files } });
    }
  };

  return (
    <div className="leftpanel_container">
      <div className="blinkit_leftpanel_stepthree">
        <div className="blinkit_leftpanel__selected-title">
          <div>
            <b>Ad creative</b>
            <div>Upload the ad creative you want to display in the ad</div>
          </div>
        </div>
        <div className="flex pt-4">
          <div className="mr-2 flex-[1] mb-4 space-y-2 mr-6">
            <div
              className={`image-upload-container w-full mx-4 my-2 p-4 border-2 border-dashed border-green-500 text-center ${
                uploadedImage ? "bg-white" : ""
              }`}
              onClick={handleDivClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{ cursor: uploadedImage ? "default" : "pointer" }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              {uploadedImage ? (
                <>
                  <i
                    className="far fa-file-contract"
                    style={{ fontSize: "2rem" }} // Increased icon size
                  ></i>
                  <div
                    className="text-red-500 mt-2 cursor-pointer"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </div>
                </>
              ) : (
                <>
                  {!loading ? (
                    <>
                      <div className="icon-container flex justify-center items-center h-20">
                        <div className="icon-circle rounded-full border-2 border-dashed border-green-500 p-4">
                          <span className="text-green-500 text-2xl">+</span>
                        </div>
                      </div>
                      <div className="text-gray-500 mt-4">
                        Drop your files here
                      </div>
                      <div className="text-gray-500 mt-4">
                        Browse Files from your computer
                      </div>
                    </>
                  ) : (
                    <div className="icon-container flex justify-center items-center h-20">
                      <LoaderSpinnerBlinkit />
                    </div>
                  )}
                </>
              )}
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        </div>
        <div className="flex-col">
          <div>Creative guidelines</div>
          <ul className="list-disc list-inside pl-4 mt-2 text-gray-600">
            <li>
              Creative dimensions should be{" "}
              <span className="font-bold">208px width X 520px height</span> &
              maximum file size should be{" "}
              <span className="font-bold">180kB</span>
            </li>
            <li>
              To avoid any cropping, please ensure that the creative content is
              centered within 160px width x 372px height
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImageLeftPanel;
