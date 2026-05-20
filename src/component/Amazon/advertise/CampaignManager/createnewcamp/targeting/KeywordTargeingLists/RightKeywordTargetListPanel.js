import React from "react";
import Tooltip from "../../Tooltip";

const RightKeywordTargetListPanel = ({
  addedProducts,
  setAddedProducts,
  setCampaignData,
  campaignData,
  setDuplicateKeyword,
  duplicateKeyword,

  setNewKeyword,
  newKeyword,
  setExistingNegativeKeyword,
}) => {
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      keywords: addedProducts,
    });

    setTimeout(() => {
      setDuplicateKeyword([]);
      setNewKeyword([]);
      setExistingNegativeKeyword([]);
    }, 3000);
  }, [addedProducts]);
  const handleBID = (data, keyword, match) => {
    let tempData = campaignData?.keywords;
    let result = tempData?.map(function (item) {
      var o = Object.assign({}, item);
      if (item.keyword == keyword && item.match == match) {
        o.bid = data;
      }
      return o;
    });

    setCampaignData({
      ...campaignData,
      keywords: result,
    });
  };

  return (
    <>
      <div className="row space-x-4  pb-2 px-3 py-4 justify-between ">
        <div className="">
          <h2>{addedProducts.length} added</h2>
        </div>

        <button
          className="text-blue-400  focus:outline-none"
          onClick={() => setAddedProducts([])}
        >
          Remove All
        </button>
      </div>
      <table className="w-full targetTable ">
        <thead className="border">
          <tr className="">
            <th className=" text-left font-normal ">
              Keyword
              <br />
              IS|IR
              <Tooltip />
            </th>
            <th className="text-left font-normal">
              Match type
              <Tooltip />
            </th>
            {/* <th className="text-left font-normal">Sugg bid<Tooltip/>
                    <br/>Apply all</th> */}
            <th className="text-left font-normal">
              Bid
              <Tooltip />
            </th>
          </tr>
        </thead>
        <tbody className="">
          {addedProducts?.map((item, i) => {
            return (
              <tr className="border-b " key={i}>
                <td
                  className={
                    duplicateKeyword &&
                    duplicateKeyword?.length &&
                    duplicateKeyword.find(
                      (data) =>
                        data.keyword === item.keyword &&
                        data.match === item.match
                    )
                      ? "duplicateKeyword"
                      : newKeyword &&
                        newKeyword?.length &&
                        newKeyword.find(
                          (data) =>
                            data.keyword === item.keyword &&
                            data.match === item.match
                        )
                      ? "newKeyword"
                      : ""
                  }
                >
                  {item.keyword}
                </td>
                <td>{item.match}</td>
                {/* <td>{item.suggestedbid[item.matchtype]}</td> */}
                <td className="py-2 ">
                  <input
                    className="border rounded w-14"
                    type="number"
                    value={
                      campaignData?.keywords?.filter(
                        (data) =>
                          data.keyword == item?.keyword &&
                          data.match == item?.match
                      )[0]?.bid
                        ? campaignData?.keywords?.filter(
                            (data) =>
                              data.keyword == item?.keyword &&
                              data.match == item?.match
                          )[0]?.bid
                        : item?.bid
                    }
                    onChange={(e) =>
                      handleBID(e.target.value, item?.keyword, item?.match)
                    }
                  />
                </td>
                <td>
                  <button
                    type="button"
                    value={item.match}
                    onClick={() => {
                      setAddedProducts(
                        addedProducts.filter((ele) => {
                          if (
                            ele.match === item.match &&
                            ele.keyword === item.keyword
                          ) {
                            return false;
                          } else {
                            return true;
                          }
                        })
                      );
                    }}
                    // ele.matchtype !== item.matchtype && ele.value !== item.value
                  >
                    x
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
export default RightKeywordTargetListPanel;
