import React from "react";

const ImageRightPanel = ({ selectedImage }) => {
  return (
    <div className="blinkit_rightpanel__selected-box flex flex-col px-4 pb-4">
      <div className="blinkit_rightpanel__selected-title h-[60px]">
        <div>
          <b>Ad preview</b>
          <div>Ensure that the creative falls within the safe area</div>
        </div>
      </div>
      <div
        className="blinkit_rightpanel__productlist-card flex flex-col flex-1 pb0"
        id="selected-product-show"
      >
        <div className="flex justify-center items-center h-full relative">
          {selectedImage ? (
            <div
              className="relative"
              style={{ width: "228px", height: "540px" }} // Increased dimensions for padding
            >
              {/* Blurred background div */}
              <div
                className="absolute inset-0 bg-gray-300"
                style={{
                  width: "100%",
                  height: "100%",
                  zIndex: 10,
                  filter: "blur(10px)",
                }}
              >
                {/* Placeholder to create space around the image */}
              </div>

              {/* Container for the image */}
              <div
                className="absolute flex justify-center items-center"
                style={{
                  top: "10px", // Padding from top
                  bottom: "10px", // Padding from bottom
                  left: "10px", // Padding from left
                  right: "10px", // Padding from right
                  zIndex: 20,
                }}
              >
                <img
                  src={selectedImage}
                  alt="Uploaded"
                  className="object-cover"
                  style={{
                    width: "208px",
                    height: "520px",
                    borderRadius: "8px", // Optional: add rounded corners
                  }}
                />
              </div>
            </div>
          ) : (
            <div>No image selected</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageRightPanel;
