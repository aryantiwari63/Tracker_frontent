import React, { useRef, useState } from "react";
import Button from "../../../../../common-components/button/Button";
import Btn from "../button/Btn";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getProductList } from "../../../../../../redux/action-creator/blinkit/createCampaignAction";

const SearchProductFiled = ({
  active,
  setActive,
  setCampaignData,
  campaignData,
}) => {
  let { productList } = useSelector(
    (state) => state?.BlinkitCreateCampaignReducer
  );

  const [listData, setListData] = useState([]);
  // const [listData, setListData] = useState([
  //   {
  //     name: "426661 Tata Tea Premium Tea-1.5kg",
  //     id: "426661 Tata Tea Premium Tea-1.5kg",
  //   },
  //   {
  //     name: "44096 Tata Sampurn Popular Poha-500g",
  //     id: "44096 Tata Sampurn Popular Poha-500g",
  //   },
  //   {
  //     name: "480044 Tata Sampurn",
  //     id: "480044 Tata Sampurn ",
  //   },
  // ]);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getProductList({ search: "" }));
  }, []);
  React.useEffect(() => {
    setListData([...productList]);
  }, [productList]);

  const inputRef = useRef(null);
  const optionOuterRef = useRef(null);
  const [selectedData, setSelectedData] = useState([]);
  const [text, setText] = useState("");
  const handleSelect = (e) => {
    const { id } = e.target;
    let selectedItem = listData.filter((item) => item.id === id);
    if (selectedData.includes(selectedItem[0])) {
      console.error("none")
    } else {
      setSelectedData([...selectedData, ...selectedItem]);
    }
    let optionOuter = optionOuterRef.current;
    optionOuter.classList.remove("searchProduct__options--show");
  };
  const handleDeleteItem = (e) => {
    const { id } = e.target;
    setSelectedData((prev) => {
      return prev.filter((item) => item.id !== id);
    });
  };
  const handleClearAllItems = () => {
    setSelectedData([]);
  };
  // React.useEffect(() => {
  //   setCampaignData({
  //     ...campaignData,
  //     products: selectedData,
  //   });
  // }, [selectedData]);
  React.useEffect(() => {
    dispatch(getProductList({ search: text }));
  }, [text]);
  const [error, setError] = React.useState({
    products: "",
  });
  React.useEffect(() => {
    setError({
      ...error,
      products: "",
    });
  }, [selectedData]);

  return (
    <>
      {active === 2 ? (
        <>
          <div className="pb-2">
            <div className="relative w-full">
              {error.products && <p className="errorText">{error.products}</p>}
              <div
                className="row searchfieldblinkit"
                onClick={() => {
                  inputRef.current.focus();
                  let optionOuter = optionOuterRef.current;
                  optionOuter.classList.add("searchProduct__options--show");
                }}
              >
                {selectedData?.map((item, i) => {
                  return (
                    <button key={i} className=" searchproductfield__selectedoptions">
                      {item.name}
                      <button
                        className="px-1"
                        id={item.id}
                        onClick={handleDeleteItem}
                      >
                        X
                      </button>
                    </button>
                  );
                })}
                <div className="col">
                  <input
                    type="text"
                    ref={inputRef}
                    placeholder={
                      selectedData.length === 0 &&
                      "Search for products,or enter a list of PIDs separated by commas"
                    }
                    className=" searchproductfield__search"
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
              </div>
              <div
                className="searchProduct__options absolute top-full left-0 w-full border"
                ref={optionOuterRef}
              >
                <div className=" searchproductfield__options overflow-y-scroll">
                  {listData?.map((item, i) => {
                    return (
                      <div key={i}>
                        <div
                          id={item.id}
                          onClick={handleSelect}
                          className="searchproductfield__list"
                        >
                          {item.id} - {item.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {selectedData.length ? (
                <div className="searchProduct__clearall">
                  <button
                    className="text-xs px-2 py-1 text-left"
                    onClick={handleClearAllItems}
                  >
                    Clear All
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="row tooltipblinkit">
              Tip: Please ensure all the products are relevent to the targeting
              you choose in the following steps.
            </div>
          </div>
          <div className="row pt-4 border-t">
            <div className="col_6">
              <Button
                title="Done"
                blinkit
                type="button"
                // disable={selectedData.length == 0}
                click={() => {
                  if (!selectedData?.length) {
                    setError({
                      ...error,
                      products:
                        "At least 1 product should be selected to promote.",
                    });
                  } else {
                    setActive(active + 1);
                    setCampaignData({
                      campaign_type: campaignData.campaign_type,
                      product_booster: campaignData.product_booster,
                      products: selectedData,
                    });
                  }
                }}
              />
            </div>
            <div className="col text-end px-2">
              {active > 2 && (
                <Btn
                  title="Edit"
                  onClick={() => {
                    setActive(2);
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
                Campaign Products
              </p>
              <div className="row">
                {selectedData?.map((item, i) => {
                  return (
                    <div key={i} className=" searchproductfield__selectedoptions">
                      {item.name}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="text-end ">
              <Btn
                title="Edit"
                onClick={() => {
                  setActive(2);
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default SearchProductFiled;
