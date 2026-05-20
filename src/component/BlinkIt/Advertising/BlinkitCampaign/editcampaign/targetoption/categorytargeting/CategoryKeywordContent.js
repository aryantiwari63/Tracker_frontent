import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlinkitCategoryList } from "../../../../../../../redux/action-creator/blinkit/createCampaignAction";

const CategoryKeywordContent = ({
  setCampaignData,
  campaignData,
  inputError,
  setInputError,
}) => {
  const dispatch = useDispatch();
  const [initialFetch, setInitialFetch] = React.useState(true);

  React.useEffect(() => {
    if (campaignData?.products?.length) {
      dispatch(getBlinkitCategoryList({ brand: campaignData?.products }));
    }
  }, [campaignData?.products]);
  const { categoryList } = useSelector(
    (state) => state?.BlinkitCreateCampaignReducer
  );

  const [showCategoryList, setShowCategoryList] = React.useState([]);
  React.useEffect(() => {
    if (categoryList && categoryList?.length) {
      if (
        campaignData &&
        campaignData?.categoryData &&
        campaignData?.categoryData?.length
      ) {
        setSelectedCheckBox([...campaignData.categoryData]);
        setShowCategoryList([...categoryList, ...campaignData.categoryData]);
      } else {
        setShowCategoryList([...categoryList]);
      }
    }
    // eslint-disable-next-line no-console
    // console.log("campaignData updatedIds 6", categoryList);
  }, [categoryList]);
  const [selectedCheckBox, setSelectedCheckBox] = React.useState([]);
  // const [inputError, setInputError] = React.useState([]);
  const handleCheckBox = (check, data) => {
    let updatedIds;
    if (check) {
      updatedIds = [...selectedCheckBox, data];
      // eslint-disable-next-line no-console
      // console.log(
      //   "campaignData updatedIds",
      //   updatedIds,
      //   selectedCheckBox,
      //   data
      // );
      if (campaignData?.categoryData && campaignData?.categoryData?.length) {
        let campaignIds = new Set(
          campaignData?.categoryData?.map((obj) => obj.id)
        );
        let newAddedKeyword = updatedIds.filter(
          (obj) => !campaignIds.has(obj.id)
        );
        // eslint-disable-next-line no-console
        // console.log(
        //   "campaignData updatedIds 2",
        //   campaignData.categoryData,
        //   newAddedKeyword
        // );

        setSelectedCheckBox([...campaignData.categoryData, ...newAddedKeyword]);
      } else {
        // eslint-disable-next-line no-console
        // console.log("campaignData updatedIds 3", updatedIds);
        setSelectedCheckBox(updatedIds);
      }
    } else {
      updatedIds = campaignData?.categoryData.filter(
        (item) => item.id !== data.id
      );
      // eslint-disable-next-line no-console
      // console.log("campaignData updatedIds 4", updatedIds);
      setSelectedCheckBox(updatedIds);
    }
  };
  React.useEffect(() => {
    // console.log("campaignData data123 inputError", inputError);
  }, [inputError]);
  const handleCPM = (data, id, min, max) => {
    // console.log(
    //   "campaignData data123",
    //   data,
    //   id,
    //   min,
    //   max,
    //   Number(data),
    //   Number(min),
    //   Number(max),
    //   Number(data) < Number(min),
    //   Number(data) > Number(max),
    //   Number(data) < Number(min) || Number(data) > Number(max)
    // );
    if (Number(data) < Number(min) || Number(data) > Number(max)) {
      setInputError([...inputError, id]);
    } else {
      let updatedIds = inputError.filter((item) => item !== id);
      // console.log("campaignData updatedIds 12", updatedIds);

      setInputError(updatedIds);

      let tempData = campaignData?.categoryData;
      let result = tempData?.map(function (item) {
        var o = Object.assign({}, item);
        if (item.id == id) {
          o.cpm = data;
        }
        return o;
      });

      setCampaignData({
        ...campaignData,
        categoryData: result,
      });
    }
  };
  React.useEffect(() => {
    // console.log("campaignData check", selectedCheckBox);
    // eslint-disable-next-line no-console
    // console.log("campaignData updatedIds 5", selectedCheckBox);
    setCampaignData({
      ...campaignData,
      categoryData: selectedCheckBox,
    });
  }, [selectedCheckBox]);
  React.useEffect(() => {
    if (initialFetch) {
      if (
        campaignData &&
        campaignData?.categoryData &&
        campaignData?.categoryData?.length &&
        initialFetch
      ) {
        setTimeout(function () {
          setSelectedCheckBox([...campaignData.categoryData]);
          setShowCategoryList([
            ...showCategoryList,
            ...campaignData.categoryData,
          ]);
        }, 2000);
      }
      setTimeout(function () {
        setInitialFetch(false);
      }, 1000);
    }
  }, [campaignData]);

  React.useEffect(() => {
    setInputError([]);
  }, [campaignData?.titleOption]);
  return (
    <>
      <table className="w-full">
        <thead className="h-[30px] bg-gray-200 text-center text-gray-400 pl-4">
          <tr className="">
            <th> </th>
            <th>Category Listing Page</th>
            <th>CPM Bid</th>
            <th>No. of page vistis</th>
          </tr>
        </thead>
        <tbody className="targetKeyword__table bg-green-100">
          {showCategoryList && showCategoryList.length
            ? showCategoryList.map((data) => {
                return (
                  <>
                    <tr className="text-center border-b h-[50px]">
                      <td className="w-5">
                        <input
                          type="checkbox"
                          checked={selectedCheckBox
                            .map((id) => id.id)
                            .includes(data.id)}
                          onChange={(e) =>
                            handleCheckBox(e.target.checked, data)
                          }
                        />
                      </td>
                      <td className="font-semibold">{data.keyword}</td>
                      <td>
                        <input
                          type="number"
                          placeholder="Enter CPM Bid Value"
                          className="text-[10px] px-2 rounded py-1 outline-none"
                          min={Number(data?.min_suggested_bid)}
                          max={Number(data?.max_suggested_bid)}
                          // value={campaignData?.categoryData?.[i]?.cpm}
                          value={
                            campaignData?.categoryData?.filter(
                              (items) => items.id == data?.id
                            )[0]?.cpm
                              ? campaignData?.categoryData?.filter(
                                  (items) => items.id == data?.id
                                )[0]?.cpm
                              : ""
                          }
                          disabled={
                            !selectedCheckBox
                              .map((id) => id.id)
                              .includes(data.id)
                          }
                          onChange={(e) =>
                            handleCPM(
                              e.target.value,
                              data?.id,
                              data?.min_suggested_bid,
                              data?.max_suggested_bid
                            )
                          }
                        />
                        {inputError.includes(data?.id) && (
                          <p className="errorText">{` please enter value between ${data?.min_suggested_bid} and ${data?.max_suggested_bid}`}</p>
                        )}
                      </td>
                      <td>{data.no_of_page_visit}</td>
                    </tr>
                  </>
                );
              })
            : null}
        </tbody>
      </table>
    </>
  );
};
export default CategoryKeywordContent;
