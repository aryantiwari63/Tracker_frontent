import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getInstamartProductList } from "../../../../../../redux/action-creator/instamart/createCampaignAction";

const SearchProductFiled = ({ campaignData, setCampaignData }) => {
  let { instamartproductList } = useSelector(
    (state) => state?.InstamartCreateCampaignReducer
  );

  const [listData, setListData] = useState([]);
  const [initailSet, setInitailSet] = useState(true);

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
    dispatch(
      getInstamartProductList({ search: "", brand_id: campaignData.account_id })
    );
  }, []);
  React.useEffect(() => {
    setListData([...instamartproductList]);
  }, [instamartproductList]);

  const inputRef = useRef(null);
  const optionOuterRef = useRef(null);
  const [selectedData, setSelectedData] = useState([]);
  const [text, setText] = useState("");
  const handleSelect = (e) => {
    const { id } = e.target;
    let selectedItem = listData.filter((item) => item.id === id);
    if (selectedData.includes(selectedItem[0])) {
      console.error("error");
    } else {
      setSelectedData([...selectedData, ...selectedItem]);
    }
    let optionOuter = optionOuterRef.current;
    optionOuter.classList.remove("searchProduct__options--show");
    setText("");
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

  React.useEffect(() => {
    dispatch(
      getInstamartProductList({
        search: text,
        brand_id: campaignData.account_id,
      })
    );
  }, [text]);
  const [error, setError] = React.useState({
    products: "",
  });
  React.useEffect(() => {
    setError({
      ...error,
      products: "",
    });
    setCampaignData({
      ...campaignData,
      products: selectedData,
    });
  }, [selectedData]);
  React.useEffect(() => {
    if (
      campaignData &&
      campaignData?.products &&
      campaignData?.products?.length &&
      initailSet
    ) {
      setSelectedData([...campaignData.products]);
      setInitailSet(false);
    }
  }, [campaignData]);

  return (
    <>
      <>
        <div className="pb-2">
          <div className="relative w-full">
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
                  <button
                    key={i}
                    className=" searchproductfield__selectedoptions"
                  >
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
                  value={text}
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
      </>
    </>
  );
};
export default SearchProductFiled;
