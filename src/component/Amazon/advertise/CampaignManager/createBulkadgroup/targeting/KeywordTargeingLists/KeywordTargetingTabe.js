import React, { useContext } from "react";
import Tooltip from "../../Tooltip";
import ManualProductTargetingContext from "../ManualProductTargeting/manualProductTargetingContext";

const KeywordTargetingTable = ({ checkedItems }) => {
  const { addedProducts, setAddedProducts } = useContext(
    ManualProductTargetingContext
  );
  // const [addAllClicked, setAddAllClicked] = useState(false);
  let matchtypeOptions = ["broad", "phrase", "exact"];
  const producttable = [
    {
      id: 1,
      name: "amazon upi",
      value: "amazonupi",
      matchtype: ["broad", "exact", "phrase"],
      suggestedbid: { broad: "₹50", exact: "₹60", phrase: "₹70" },
    },
    {
      id: 2,
      name: "amazon pay",
      value: "amazonpay",
      matchtype: ["broad", "exact", "pharse"],
      suggestedbid: { broad: "₹50", exact: "₹60", phrase: "₹70" },
    },
    {
      id: 3,
      name: "amazon refer",
      value: "amazonrefer",
      matchtype: ["broad", "exact", "pharse"],
      suggestedbid: { broad: "₹50", exact: "₹60", phrase: "₹70" },
    },
    {
      id: 4,
      name: "amazon up",
      value: "amazonup",
      matchtype: ["broad", "exact"],
      suggestedbid: { broad: "₹50", exact: "₹60", phrase: "₹70" },
    },
    {
      id: 5,
      name: "amazon phone",
      value: "amazonphone",
      matchtype: ["broad", "exact"],
      suggestedbid: { broad: "₹50", exact: "₹60", phrase: "₹70" },
    },
    {
      id: 6,
      name: "amazon referin",
      value: "amazonreferin",
      matchtype: ["broad", "exact"],
      suggestedbid: { broad: "₹50", exact: "₹60" },
    },
    {
      id: 7,
      name: "amazon upis",
      value: "amazonupis",
      matchtype: ["broad", "exact"],
      suggestedbid: { broad: "₹50", exact: "₹60" },
    },
    {
      id: 8,
      name: "amazonpayments",
      value: "amazonpayments",
      matchtype: ["exact"],
      suggestedbid: { exact: "₹60" },
    },
    {
      id: 9,
      name: "amazonpaytm",
      value: "amazonpaytm",
      matchtype: ["broad"],
      suggestedbid: { broad: "₹50" },
    },
    {
      id: 10,
      name: "amazonphone",
      value: "amazonphone",
      matchtype: ["pharse"],
      suggestedbid: { phrase: "₹70" },
    },
  ];
  const addProducts = (item, matchtype) => {
    setAddedProducts([
      ...addedProducts,
      {
        ...item,
        matchtype: matchtype,
      },
    ]);
  };

  return (
    <>
      <table className="w-full targetTable ">
        <thead className=" bg-gray-100 sticky top-0">
          <tr className="text-sm ">
            <th className="font-normal text-left px-2">
              {producttable?.length}
              Keyword
              <br />
              IS|IR
              <Tooltip />
            </th>
            <th className="font-normal text-left">
              Match type
              <Tooltip />
            </th>
            <th className="font-normal text-left">
              Sugg bid
              <Tooltip />
            </th>
            <th className="text-left">
              <button className="text-blue-400 ">Add All</button>
            </th>
          </tr>
        </thead>

        <tbody className="">
          {producttable?.map((item, i) => {
            return (
              <tr className="border-b " key={i}>
                <td className="pl-2">
                  {item.name}
                  {item?.is && <div>IS: {item?.is}</div>}
                  {item?.ir && <div>IR: {item?.ir}</div>}
                </td>

                <td>
                  {matchtypeOptions?.map((matchitem) => {
                    return checkedItems[matchitem] && <div>{matchitem}</div>;
                  })}
                </td>
                <td>
                  {item.suggestedbid.broad && checkedItems.broad && (
                    <div>{item.suggestedbid.broad}</div>
                  )}
                  {item.suggestedbid.phrase && checkedItems.phrase && (
                    <div>{item.suggestedbid.phrase}</div>
                  )}
                  {item.suggestedbid.exact && checkedItems.exact && (
                    <div>{item.suggestedbid.exact}</div>
                  )}
                </td>
                <td>
                  {checkedItems.broad && (
                    <div>
                      <button
                        className="text-blue-400"
                        onClick={() => {
                          addProducts(item, "broad");
                        }}
                        disabled={addedProducts.some(
                          (ele) =>
                            ele.value === item.value &&
                            ele.matchtype === "broad"
                        )}
                      >
                        {addedProducts.some(
                          (ele) =>
                            ele.value === item.value &&
                            ele.matchtype === "broad"
                        )
                          ? "Added"
                          : "Add"}
                      </button>
                    </div>
                  )}
                  {checkedItems.phrase && (
                    <div>
                      <button
                        className="text-blue-400"
                        onClick={() => {
                          addProducts(item, "phrase");
                        }}
                        disabled={addedProducts.some(
                          (ele) =>
                            ele.value === item.value &&
                            ele.matchtype === "phrase"
                        )}
                      >
                        {addedProducts.some(
                          (ele) =>
                            ele.value === item.value &&
                            ele.matchtype === "phrase"
                        )
                          ? "Added"
                          : "Add"}
                      </button>
                    </div>
                  )}
                  {checkedItems.exact && (
                    <div>
                      <button
                        className="text-blue-400"
                        onClick={() => {
                          addProducts(item, "exact");
                        }}
                        disabled={addedProducts.some(
                          (ele) =>
                            ele.value === item.value &&
                            ele.matchtype === "exact"
                        )}
                      >
                        {addedProducts.some(
                          (ele) =>
                            ele.value === item.value &&
                            ele.matchtype === "exact"
                        )
                          ? "Added"
                          : "Add"}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default KeywordTargetingTable;
