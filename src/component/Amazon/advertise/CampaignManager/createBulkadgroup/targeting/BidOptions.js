import React, { useState } from "react";
import "./styles.css";
import { AiOutlineExclamation } from "react-icons/ai";
import { RiAlertFill } from "react-icons/ri";
import Tooltip from "../Tooltip";

const BidOptions = () => {
  const [selectedOption, setSelectedOption] = useState("defaultBid");
  const [defaultBid, setDefaultBid] = useState("");
  const [targetingGroups, setTargetingGroups] = useState([
    { name: "Close match", active: true },
    { name: "Loose match", active: true },
    { name: "Substitute match", active: true },
    { name: "Complements", active: true },
  ]);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleDefaultBidChange = (e) => {
    setDefaultBid(e.target.value);
  };

  const handleTargetingGroupToggle = (index) => {
    const updatedGroups = [...targetingGroups];
    updatedGroups[index].active = !updatedGroups[index].active;
    // console.log(updatedGroups, "updatedGroups");
    setTargetingGroups(updatedGroups);
  };
  // const [showTooltip, setShowTooltip] = useState(false);
  // const [showHelp, setShowHelp] = useState(false);

  // const toggleTooltip = () => {
  //   setShowTooltip(!showTooltip);
  // };

  return (
    <div className=" py-4 px-2 bg-white percentageBox">
      <div className="">
        <label>
          <input
            type="radio"
            value="defaultBid"
            checked={selectedOption === "defaultBid"}
            onChange={handleOptionChange}
          />
          Set Default Bid
          <Tooltip />
        </label>
        <div className=" bidoption__stepper p-2 percentageBox">
          {selectedOption === "defaultBid" && (
            <div className="border rounded-md px-1 col_2">
              ₹
              <input
                type="number"
                value={defaultBid}
                onChange={handleDefaultBidChange}
                // placeholder="₹"
                className="border-none px-1  outline-none py-1 "
              />
            </div>
          )}
        </div>
      </div>
      <div className=" ">
        <div className="row">
          <label>
            <input
              type="radio"
              value="targetingGroups"
              checked={selectedOption === "targetingGroups"}
              onChange={handleOptionChange}
            />
            Set Bid by Targeting Groups
            <Tooltip />
          </label>
        </div>
        {selectedOption === "targetingGroups" && (
          <div className=" bidoption__stepper pt-5 pl-2 ">
            <div className="">
              <table className="w-full text-left targetTable pt-10">
                <thead>
                  <tr className="text-left text-xs py-4">
                    <td>TARGETING GROUPS</td>
                    <td>SUGGESTED BID</td>
                    <td>BID</td>
                  </tr>
                </thead>
                <tbody>
                  {targetingGroups.map((group, index) => (
                    <>
                      <tr className="py-1">
                        <td className="bg-white">
                          <label className="switch">
                            <input
                              type="checkbox"
                              // value={day}
                              onClick={() => {
                                handleTargetingGroupToggle(index);
                              }}
                              checked={group.active}
                            />
                            <span className="slider round"></span>
                          </label>

                          {group.name}
                        </td>
                        <td>-</td>
                        <td className="">
                          <div className=" percentageBox  ">
                            <div className="border">
                              ₹
                              <input
                                type="number"
                                disabled={!group.active}
                                className={[
                                  "border-none py-2 outline-none",
                                  group.active && "opacity-100",
                                ].join(" ")}
                              />
                            </div>
                          </div>

                          <br />
                          <div className="row py-2 text-red-400 hidden">
                            <AiOutlineExclamation />
                            <label className="text-red-400 pt-0">
                              please provide a bid
                            </label>
                          </div>
                          <div className="text-xs text-blue-400 hidden">
                            Quick Fix
                          </div>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {targetingGroups.some((item) => item.active === false) && (
          <div className="row text-red-400">
            <RiAlertFill className=" " />
            <label className="pl-1">
              Consider lowering your bid instead of turning off the targeting
              group
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default BidOptions;
