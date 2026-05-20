import React, { useContext } from "react";
import EventBulkHandlerContext from "../../../../../../context/eventBulkHandlerContext";
// import { AiOutlineExclamation } from "react-icons/ai";
import DialogBox from "../../../../../common-components/dialogBox.js";

const EnterlistProduct = ({
  setDuplicateKeyword,
  duplicateKeyword,
  campaignData,
  setNewKeyword,
  // newKeyword,
  formIndex,
}) => {
  const { selectedItems, setSelectedItems } = useContext(
    EventBulkHandlerContext
  );
  const [data, setData] = React.useState([]);
  const [showPopup, setShowPopup] = React.useState(false);

  // React.useEffect(()=>{console.log("campaignData",data)},[data])
  const addAsins = () => {
    let insertedData = [data];
    // console.log("campaignData insertedData", insertedData);
    // insertedData = insertedData?.filter((data) => data != ",");
    insertedData = insertedData.join()?.split(",");

    // console.log("campaignData data", data);
    // console.log("campaignData insertedData 2", insertedData);

    let duplicateData = [];
    insertedData &&
      insertedData?.length &&
      insertedData.map((data) => {
        if (
          campaignData &&
          campaignData[formIndex] &&
          campaignData[formIndex]?.asins &&
          campaignData[formIndex]?.asins?.length
        ) {
          campaignData[formIndex]?.asins
            ?.join()
            ?.split(",")
            ?.map((key) => {
              if (key == data) duplicateData.push(key);
            });
        }
      });

    setDuplicateKeyword(duplicateData);
    if (duplicateData && duplicateData?.length) {
      setShowPopup(true);
    } else {
      let insertedData = [data];
      insertedData = insertedData?.filter((data) => data != ",");
      setNewKeyword(insertedData);
      // // eslint-disable-next-line no-console
      // console.log(
      //   "campaignData debug",
      //   [...new Set([data]?.join()?.split(","))]?.join(",")?.toString()
      // );
      setSelectedItems([
        ...selectedItems,
        [...new Set([data]?.join()?.split(","))]?.join(",")?.toString(),
      ]);
      setData([]);
    }
  };
  const handleDialogApply = () => {
    let insertedData = [data];

    // insertedData = insertedData?.filter((data) => data != ",");
    insertedData = insertedData?.join()?.split(",");
    // console.log("campaignData insertedData func", insertedData);

    if (duplicateKeyword && duplicateKeyword?.length) {
      let removedIndex = [];
      for (let i = 0; i < insertedData.length; i++) {
        let key = insertedData[i];
        for (let j = 0; j < duplicateKeyword.length; j++) {
          if (key === duplicateKeyword[j]) {
            removedIndex.push(i);
          }
        }
      }
      let newKeywordData = insertedData.filter(
        (data, index) => !removedIndex.includes(index)
      );
      // console.log("campaignData newKeywordData func", newKeywordData);
      setNewKeyword(newKeywordData);

      setSelectedItems([...selectedItems, ...newKeywordData]);
    } else {
      setSelectedItems([...selectedItems, data]);
    }
    setData([]);
    setShowPopup(false);
  };

  return (
    <>
      <div className="row outline-none pt-4  px-5 ">
        <textarea
          rows="5"
          placeholder="Enter ASINs separated by commas."
          className="px-4 py-3 w-full  outline-none border"
          value={data}
          onChange={(e) => setData(e.target.value)}
        ></textarea>
      </div>
      <div className="row justify-between pr-4 py-2">
        {showPopup && (
          <DialogBox
            title="Confirmation"
            buttonName="Okay"
            // cancelbuttonName="No"
            onAccept={handleDialogApply}
            // onCancel={handleDialogCancel}
          >
            {duplicateKeyword && duplicateKeyword?.length
              ? `${duplicateKeyword
                  .map((data) => data)
                  ?.join(",")} has already been added to the list on the right.`
              : "Add Asins"}
          </DialogBox>
        )}
        <div className=" row px-4">
          {/* <AiOutlineExclamation className="text-red-400" />
          <label className="text-red-400">products weren't added.</label> */}
          <button
            className="rounded-lg bg-gray-300 px-3 "
            // onClick={(e) => {
            //   setSelectedItems([...selectedItems, data]);
            //   setData([]);
            // }}
            disabled={data.length == 0}
            onClick={addAsins}
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
};

export default EnterlistProduct;
