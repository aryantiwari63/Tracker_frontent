import React from "react";
import Papa from "papaparse";
import { useDispatch, useSelector } from "react-redux";
import { getProductsByCsv } from "../../../../../../redux/action-creator/campaignAction";
import { useRef } from "react";
const EditRightPanel = ({
  selectedProduct,
  setSelectedProduct,
  setValues,
  values,
  campaignData,
  setError,
  error,
}) => {
  // let currency = localStorage.getItem("currency");
  const delProduct = (v) => {
    setSelectedProduct(
      selectedProduct.filter((item) => item.productid !== v.productid)
    );
  };
  const fileInputRef = useRef(null);
  const uploadFile = () => {
    fileInputRef.current.click();
  };
  const dispatch = useDispatch();
  const changeHandler = (event) => {
    if (!campaignData?.category) {
      setError({
        ...error,
        category: "Please select a category",
      });
    } else {
      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const valuesArray = [];
          results.data.map((d) => {
            valuesArray.push(Object.values(d));
          });
          setValues(valuesArray);
        },
      });
    }
  };
  const productsData = useSelector(
    (state) => state.CampaignReducer?.productsByCsv?.product
  );
  const wrongFsns = useSelector(
    (state) => state.CampaignReducer?.productsByCsv?.wrongFsns
  );
  React.useEffect(() => {
    // console.log("valuesvalues", values.flat().slice(1));
    if (values.length > 0 && campaignData?.category) {
      dispatch(
        getProductsByCsv(
          campaignData.category,
          values.flat().slice(1),
          campaignData.brand,
          campaignData.platform
        )
      );
    }
  }, [values]);
  React.useEffect(() => {
    if (productsData && productsData.length > 0) {
      if (selectedProduct && selectedProduct.length > 0) {
        setSelectedProduct([...selectedProduct, productsData]);
      } else {
        setSelectedProduct([...productsData]);
      }
      // console.log("selectedProductselectedProduct", productsData);
      // console.log("selectedProductselectedProduct 12", selectedProduct);
    }
  }, [productsData]);
  const [invalidFsnsError, setInvalidFsnsError] = React.useState("");
  React.useEffect(() => {
    if (wrongFsns && wrongFsns.length > 0) {
      setInvalidFsnsError(`${wrongFsns.length} fsns failed`);
    }
  }, [wrongFsns]);
  React.useEffect(() => {
    setTimeout(() => {
      setInvalidFsnsError("");
    }, 3000);
  }, [invalidFsnsError]);
  return (
    <>
      {wrongFsns && wrongFsns.length > 0 && invalidFsnsError.length > 0 ? (
        <p className="errorText">{invalidFsnsError}</p>
      ) : null}

      <div
        className="rightpanel__product-drop pt-2 cursor-pointer"
        onClick={uploadFile}
      >
        <input
          ref={fileInputRef}
          accept=".csv"
          type="file"
          name="FSNs"
          id="FileFSNs"
          className="upload w-0 h-0 opacity-0 overflow-hidden block"
          onChange={changeHandler}
        />
        <div className="product-droop-text">
          <div className="product-droop-upload">
            <div className="rightpanel__upload-title">
              <button>
                <img
                  src="/assets/images/upload.svg"
                  alt=""
                  className="w-4 text-xs pr-1 cursor-pointer"
                />
              </button>

              <div>Upload Products CSV</div>
            </div>
            <div className="rightpanel__upload-subtitle">
              You can upload a maximum of 2000 FSNs
            </div>
          </div>
        </div>
      </div>
      <div className="rightpanel__download-template row">
        <span
          role="presentation"
          className="rightpanel__link pr-1 cursor-pointer"
        >
          <a
            // href="https://www.ebuxautomation.com/AMSDashboard/upload/sample/campaignSample.csv"
            href="/assets/upload/campaignSample.csv"
            download=""
          >
            Download Template
          </a>
        </span>
        <div className="">and enter FSNs for your products</div>
      </div>
      <div className="rightpanel__selected-box">
        <div className="rightpanel__selected-title">
          <div className="countselected">
            Selected Products ({selectedProduct.length})
          </div>
          <div className="file-download"></div>
        </div>
        <div className="rightpanel__productlist-box">
          <div
            className="rightpanel__productlist-card"
            id="selected-product-show"
          >
            {selectedProduct.map((v) => {
              return (
                <>
                  <div className=" pb-1.5">
                    <div className="listcard row">
                      <div className="col overflow-hidden">
                        <div className="row overflow-hidden">
                          <div className="listproduct__image ">
                            {/* <img
                              src={
                                v?.image_url != "#"
                                  ? v?.image_url
                                  : "https://ebuxautomation.com/AMSDashboard/upload/avatar/product-img.jpg"
                              }
                              alt=""
                            /> */}
                            {/* <img
                              src={"/assets/images/product-img.jpg"}
                              alt=""
                            /> */}
                            <img
                              src={
                                v.image != ""
                                  ? `${v.image}`
                                  : "/assets/images/product-img.jpg"
                              }
                              alt=""
                            />
                          </div>
                          <div className="listcard__product pl-2">
                            <div className="listcard__producttitle">
                              {v.title}
                            </div>
                            <div className="listcard__productinfo">
                              {v.productid}
                            </div>

                            {v.minlistingprice || v.maxlistingprice ? (
                              <div className="listcard__productamt">
                                {`${
                                  v.listingcurrency == "INR"
                                    ? "₹"
                                    : v.listingcurrency
                                }${v.minlistingprice}-${
                                  v.listingcurrency == "INR"
                                    ? "₹"
                                    : v.listingcurrency
                                }${v.maxlistingprice}`}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div>
                        <button onClick={() => delProduct(v)}>x</button>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>

        <div></div>
      </div>
    </>
  );
};

export default EditRightPanel;
