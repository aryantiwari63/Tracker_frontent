import { useEffect } from "react";
const SearchTermPopup = ({
  selectedAdGroup,
  setSearchTermTypeData,
  searchTermTypeData,
  campaignTermTypeData,
}) => {
  useEffect(() => {
    // console.log(
    //   "weferfr1234",
    //   searchTermTypeData,
    //   campaignTermTypeData,
    //   selectedAdGroup
    // );
  }, [selectedAdGroup, searchTermTypeData, campaignTermTypeData]);
  const handleTypeChange = (e) => {
    setSearchTermTypeData(e);
  };

  return (
    <>
      <div className="px-4">
        <h4>Negative Keyword Match Type</h4>
        <div className="py-1 pb-3">
          <select
            name="Type"
            id="Type"
            className="w-full py-2 text-gray-600 outline-none px-2 border-2 rounded text-sm"
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option selected disabled>
              Select
            </option>
            <option value="exact">EXACT</option>
            {/* <option value="broad">BROAD</option> */}
          </select>
        </div>
      </div>
    </>
  );
};

export default SearchTermPopup;
