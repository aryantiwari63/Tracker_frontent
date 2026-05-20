import React from "react";
import NewStepCaption from "./NewStepCaption";
import Btn from "./button/Btn";
import Button from "../../../../common-components/button/Button";
import ImageRightPanel from "./campaignthreesteps/ImageRightPanel";
import ImageLeftPanel from "./campaignthreesteps/ImageLeftPanel";
import CollectionRightPanel from "./campaignthreesteps/CollectionRightPanel";
import CollectionLeftPanel from "./campaignthreesteps/CollectionLeftPanel";

const StepthreeSpotlight = ({
  active,
  setActive,
  setCampaignData,
  campaignData,
  // handleChange,
}) => {
  const [selectedData, setSelectedData] = React.useState([]);
  const [error, setError] = React.useState({
    collection: "",
    asset: "",
  });
  React.useEffect(() => {
    if (campaignData?.collection?.length > 0) {
      setError({
        ...error,
        collection: "",
      });
    }
  }, [campaignData?.collection]);

  const [selectedImage, setSelectedImage] = React.useState(null);
  const [selectedImageData, setSelectedImageData] = React.useState(null);
  const [uploadedImage, setUploadedImage] = React.useState(null);

  const handleImageUpload = (image, url) => {
    setSelectedImage(URL.createObjectURL(image));
    setSelectedImageData(url);
  };
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      asset: selectedImageData,
    });
  }, [selectedImageData]);
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      assetImage: selectedImage,
    });
  }, [selectedImage]);
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      collection: selectedData,
    });
  }, [selectedData]);
  const [initialSet, setInitialSet] = React.useState(true);
  const [initialImageDataSet, setInitialImageDataSet] = React.useState(true);
  const [initialImageSet, setInitialImageSet] = React.useState(true);
  React.useEffect(() => {
    if (
      campaignData &&
      campaignData?.collection &&
      campaignData?.collection?.length &&
      initialSet
    ) {
      setTimeout(() => {
        setSelectedData(campaignData?.collection);
      }, [1000]);
      setInitialSet(false);
    }
    if (
      campaignData &&
      campaignData?.asset &&
      campaignData?.asset?.length &&
      initialImageDataSet
    ) {
      setTimeout(() => {
        setSelectedImageData(campaignData?.asset);
      }, [1000]);
      setInitialImageDataSet(false);
    }
    if (
      campaignData &&
      campaignData?.assetImage &&
      campaignData?.assetImage?.length &&
      initialImageSet
    ) {
      setTimeout(() => {
        setSelectedImage(campaignData?.assetImage);
        setUploadedImage(campaignData?.assetImage);
      }, [1000]);
      setInitialImageSet(false);
    }
  }, [campaignData]);

  return (
    <>
      {active === 3 ? (
        <>
          <NewStepCaption
            caption="Select campaign products"
            subcaption={
              selectedData && selectedData?.length
                ? ""
                : "Choose your campaign products using filters, search, or bulk upload"
            }
          />

          <div className="flex" style={{ height: "600px" }}>
            <div className="w-1/2 pr-2 h-full">
              <ImageLeftPanel
                onImageUpload={handleImageUpload}
                setSelectedImage={setSelectedImage}
                setSelectedImageData={setSelectedImageData}
                setUploadedImage={setUploadedImage}
                uploadedImage={uploadedImage}
              />
            </div>
            <div className="w-1/2 pl-2 h-full">
              <ImageRightPanel selectedImage={selectedImage} />
            </div>
          </div>
          <div className="flex" style={{ height: "600px" }}>
            <div className="w-1/2 pr-2 h-full">
              <CollectionLeftPanel
                selectedData={selectedData}
                setSelectedData={setSelectedData}
              />
            </div>
            <div className="w-1/2 pl-2 h-full">
              <CollectionRightPanel selectedData={selectedData} />
            </div>
          </div>
          <div className="row pt-4 border-t justify-end">
            {error.asset && <p className="errorText">{error.asset}</p>}
            {error.collection && (
              <p className="errorText">{error.collection}</p>
            )}
            <div className="col_1 text-end">
              <Button
                title="Done"
                platform={"blinkit"}
                blinkit
                type="button"
                click={() => {
                  if (!campaignData?.asset || campaignData?.asset == "") {
                    setError({
                      ...error,
                      asset: "Select at least one image.",
                    });
                  } else if (
                    !campaignData?.collection ||
                    campaignData?.collection?.length == 0
                  ) {
                    setError({
                      ...error,
                      collection: "At least 1 collection should be selected.",
                    });
                  } else {
                    setCampaignData({
                      ...campaignData,
                      active: [],
                      activeSmartCpm: [],
                    });
                    setActive(active + 1);
                  }
                }}
              />
            </div>
            <div className="col-auto text-end px-2">
              {active > 3 && (
                <Btn
                  title="Edit"
                  onClick={() => {
                    setActive(3);
                  }}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="row pt-2 px-1">
            <div className="col">
              <p className="text-[11px] text-gray-600 font-semibold">
                Campaign collection
              </p>

              <div className="row">
                {campaignData?.collection?.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className=" searchproductfield__selectedoptions"
                    >
                      {item?.name}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="text-end ">
              <Btn
                title="Edit"
                onClick={() => {
                  setActive(3);
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default StepthreeSpotlight;
