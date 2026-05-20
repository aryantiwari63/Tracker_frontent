import React, { useRef, useState } from "react";

const NegativeKeywordTargeting = ({ setCampaignData, campaignData }) => {
  const [selectedData, setSelectedData] = useState([]);
  const [initailSet, setInitailSet] = useState(true);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const handleDeleteItem = (e) => {
    const { id } = e.target;
    setSelectedData((prev) => {
      return prev.filter((item) => item.id !== id);
    });
  };
  const handleAddKeyword = (e) => {
    const { value } = e.target;
    setValue(value);
    if (e.key === "Enter") {
      setSelectedData([...selectedData, { name: value, id: value }]);
      setValue("");
    }
  };
  React.useEffect(() => {
    if (selectedData) {
      setCampaignData({
        ...campaignData,
        NegativeKeyword: selectedData,
      });
    }
  }, [selectedData]);
  React.useEffect(() => {
    if (
      campaignData &&
      campaignData?.NegativeKeyword &&
      campaignData?.NegativeKeyword?.length &&
      initailSet
    ) {
      setSelectedData([...campaignData.NegativeKeyword]);
      setInitailSet(false);
    }
  }, [campaignData]);
  return (
    <>
      <div className=" negativekeywordtargerting">
        <div className="row bg-gray-100 text-xs font-semibold px-3 py-3 text-gray-400">
          Negative Keyword Targeting (optional)
        </div>
        <div className="row text-xs  px-3 pt-3 text-gray-300">
          Your ads will not appear on these searchs. Please enter the negative
          keywords below
        </div>
        <div className="row px-2 py-2 border outline-none rounded text-xs">
          {selectedData?.map((item, i) => {
            return (
              <button
                key={i}
                className="border-black rounded-xl ml-2 border px-2 py-1 mt-1"
              >
                {item.name}
                <button
                  className="px-1"
                  id={item.id}
                  onClick={handleDeleteItem}
                >
                  x
                </button>
              </button>
            );
          })}
          <input
            className="outline-none pl-2 w-full "
            type="text"
            ref={inputRef}
            placeholder={
              selectedData.length === 0 && "Type a keyword and press enter"
            }
            value={value}
            id={value.trim}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleAddKeyword}
            disabled={
              campaignData &&
              campaignData?.keywords &&
              campaignData?.keywords?.length &&
              campaignData?.keywords
                .map((data) => data?.smartcpm)
                .filter((e) => e !== undefined).length == 0
            }
            // onBlur={handleAddKeyword}
          />
        </div>
      </div>
    </>
  );
};

export default NegativeKeywordTargeting;
