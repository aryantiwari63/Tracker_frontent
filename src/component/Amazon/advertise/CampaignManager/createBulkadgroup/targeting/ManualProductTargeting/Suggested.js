import React, { useContext, useState } from "react";
import Tooltip from "../../Tooltip";
import { BsChevronBarDown } from "react-icons/bs";
import ManualProductTargetingContext from "./manualProductTargetingContext";

const Suggested = () => {
  const { addedProducts, setAddedProducts } = useContext(
    ManualProductTargetingContext
  );
  const [bids, setBids] = useState("Suggested bid");
  // const [showsortDropdown, setShowSortDropdown] = useState(false);
  const [showBidsDropdown, setShowBidsDropdown] = useState(false);
  const [bidInput] = useState("");

  const bidsOptions = [
    {
      label: "Suggested bid",
      value: "suggestedbid",
    },
    {
      label: "Custom bid",
      value: "custombid",
    },
    {
      label: "Default bid",
      value: "defaultbid",
    },
  ];

  const categoryData = [
    {
      path: "/Gift Cards/Gift Cards",
      categoty: "Gift Cards",
      product: "731-1,218",
      suggbid: "1.30",
      suggbugRange: "1.30 - 4.95",
    },
    {
      path: "/Gift Cards/Gift Cards",
      categoty: "Gift Cards",
      product: "731-1,219",
      suggbid: "1.30",
      suggbugRange: "1.30 - 4.95",
    },
    {
      path: "/Gift Cards/Gift Cards",
      categoty: "Gift Cards",
      product: "731-1,217",
      suggbid: "1.30",
      suggbugRange: "1.30 - 4.95",
    },
  ];
  const addProducts = (item) => {
    setAddedProducts([...addedProducts, item]);
  };

  return (
    <>
      <div>
        <div className="row p-3 border-b ">
          <label className="font-semibold pr-2">
            Bid
            <Tooltip />
          </label>
          <div className="">
            <div>
              <div className="rounded-3xl bg-gray-200 text-sm  px-2 py-1 relative">
                <div
                  className="row justify-between items-center"
                  onClick={() => setShowBidsDropdown(!showBidsDropdown)}
                >
                  <div>{bids}</div>
                  <BsChevronBarDown />
                </div>
                {showBidsDropdown && (
                  <div className="absolute  w-full bg-white max-h-72 overflow-y-auto py-4 border z-10">
                    <div>
                      {bidsOptions?.map((item, i) => {
                        return (
                          item.label
                            .toLowerCase()
                            .startsWith(bidInput.toLowerCase()) && (
                            <div
                              key={i}
                              className={[
                                "portfolio__options",
                                bids === item.label &&
                                  "portfolio__options--active",
                              ].join(" ")}
                              onClick={() => {
                                setBids(item.label);
                                setShowBidsDropdown(false);
                              }}
                            >
                              <div className="text-sm">{item.label}</div>
                            </div>
                          )
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <table className="w-full px-2 targetTable">
          <thead className="border-b text-left px-2">
            <tr className=" bg-gray-200 px-3">
              <th className="col_6 font-normal pl-2">
                {categoryData?.length} suggestion
              </th>
              <th className="font-normal">
                Sugg.bid
                <Tooltip />
              </th>
              <th className="text-blue-400 ">Add all</th>
            </tr>
          </thead>
          <tbody className="">
            {categoryData?.map((item, i) => {
              return (
                <tr className="border-b p-4" key={i}>
                  <td className="">
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
                    <div className="row">
                      <div>
                        <button
                          type="button"
                          className="text-blue-300"
                          onClick={() => {
                            addProducts(item);
                          }}
                          disabled={addedProducts.some(
                            (ele) => ele.product === item.product
                          )}
                        >
                          {addedProducts.some(
                            (ele) => ele.product === item.product
                          )
                            ? "Added"
                            : "Add"}
                        </button>
                      </div>
                      <div className="text-blue-300 px-2">|</div>
                      <div>
                        <button type="button" className="text-blue-300">
                          Refine
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Suggested;
