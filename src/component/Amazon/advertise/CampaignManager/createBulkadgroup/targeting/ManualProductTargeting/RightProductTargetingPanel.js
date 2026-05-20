import React, { useContext } from "react";
import ManualProductTargetingContext from "./manualProductTargetingContext";

const RightProductTargetListPanel = () => {
  const { addedProducts, setAddedProducts } = useContext(
    ManualProductTargetingContext
  );
  // const producttable = [
  //   {
  //     id: 1,
  //     name: "amazon upi",
  //     value: "amazonupi",
  //     type: ["exact", "expanded"],
  //     suggestedbid: "₹50",
  //   },
  //   {
  //     id: 2,
  //     name: "amazon pay",
  //     value: "amazonpay",
  //     type: ["exact", "expanded"],
  //     suggestedbid: "₹50",
  //   },
  //   {
  //     id: 3,
  //     name: "amazon refer",
  //     value: "amazonrefer",
  //     type: ["exact"],
  //     suggestedbid: "₹50",
  //   },
  //   {
  //     id: 4,
  //     name: "amazon upi",
  //     value: "amazonupi",
  //     type: ["expanded"],
  //     suggestedbid: "₹50",
  //   },
  // ];
  return (
    <>
      <div className="row space-x-4 border-b pb-2 px-3 py-4 justify-between ">
        <h2>{addedProducts?.length} Added</h2>

        <button
          className="text-blue-400 hover:text-red-800 focus:outline-none"
          onClick={() => setAddedProducts([])}
        >
          Remove All
        </button>
      </div>
      <table className="w-full targetTable">
        <thead className="text-left">
          <tr className="border-b">
            <th className="font-normal">categories & products</th>
            <th className="font-normal">
              sugg.bid
              <br />
              <button className="text-blue-400">Apply all</button>
            </th>
            <th className="font-normal">Bid</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {addedProducts?.map((item, i) => {
            return (
              <tr key={i}>
                <td>
                  {item.path && <div>{item.path}</div>}
                  <div>
                    <b>Category: </b>
                    {item.categoty}
                  </div>
                  <div>Products: {item.product}</div>
                </td>
                <td>
                  <div>{item.suggbid}</div>
                  <div>{item.suggbugRange}</div>
                </td>
                <td>
                  <div className="border rounded-md w-16">
                    ₹
                    <input />
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => {
                      setAddedProducts(
                        addedProducts.filter(
                          (ele) => ele.product !== item.product
                        )
                      );
                    }}
                  >
                    X
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
export default RightProductTargetListPanel;
