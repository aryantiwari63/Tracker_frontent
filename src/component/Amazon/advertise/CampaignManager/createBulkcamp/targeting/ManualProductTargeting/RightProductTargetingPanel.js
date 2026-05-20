import React, { useContext } from "react";
import ManualProductTargetingContext from "./manualProductTargetingContext";

const RightProductTargetListPanel = () => {
  const { addedProducts, setAddedProducts } = useContext(
    ManualProductTargetingContext
  );
  let currency = localStorage.getItem("currency");
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
                    {currency}
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
