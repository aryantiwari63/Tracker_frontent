import React, { useContext } from "react";
import EventHandlerContext from "../../../../../../context/eventHAndlerContext";
import DialogBox from "../../../../../common-components/dialogBox.js";

const EnterlistProduct = ({
  setDuplicateKeyword,
  duplicateKeyword,
  campaignData,
  setNewKeyword,
  // newKeyword,
}) => {
  const { selectedItems, setSelectedItems } = useContext(EventHandlerContext);
  const [data, setData] = React.useState([]);
  const [showPopup, setShowPopup] = React.useState(false);
  const addAsins = () => {
    let insertedData = [data];
    // console.log("campaignData insertedData", insertedData);
    insertedData = insertedData?.filter((data) => data != ",");
    // console.log("campaignData asins data", data, insertedData);

    // console.log("campaignData data", data);
    // console.log("campaignData insertedData 2", insertedData);

    let duplicateData = [];
    insertedData &&
      insertedData?.length &&
      insertedData
        ?.join()
        ?.split(",")
        .map((data) => {
          if (
            campaignData &&
            campaignData?.asins &&
            campaignData?.asins?.length
          ) {
            campaignData?.asins
              ?.join()
              ?.split(",")
              ?.map((key) => {
                if (key == data) duplicateData.push(key);
              });
          }
        });

    setDuplicateKeyword(duplicateData);
    if (duplicateData && duplicateData?.length) {
      // console.log("campaignData duplicateData 1", duplicateData);
      setShowPopup(true);
    } else {
      let insertedData = [data];
      insertedData = insertedData?.filter((data) => data != ",");
      setNewKeyword(insertedData);
      // setSelectedItems([...selectedItems, data]);
      setSelectedItems([
        ...selectedItems,
        [...new Set([data]?.join()?.split(","))]?.join(",")?.toString(),
      ]);
      setData([]);
      // console.log("campaignData duplicateData 2", duplicateData);
    }
  };

  const handleDialogApply = () => {
    let insertedData = [data];

    insertedData = insertedData.join()?.split(",");
    //   ?.filter((data) => data != ",");
    // console.log("campaignData insertedData ", insertedData);

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
      // console.log(
      //   "campaignData insertedData 1 cond",
      //   duplicateKeyword,
      //   newKeywordData
      // );
      setNewKeyword(newKeywordData);

      setSelectedItems([...selectedItems, ...newKeywordData]);
    } else {
      // console.log("campaignData insertedData 2 cond", data);
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
            disabled={data.length == 0}
            onClick={addAsins}
            // onClick={() => {
            //   setSelectedItems([...selectedItems, data]);
            //   setData([]);
            // }}
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
};

export default EnterlistProduct;
