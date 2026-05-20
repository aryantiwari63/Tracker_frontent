/* eslint-disable */
import React from "react";
import { useHistory } from "react-router-dom";
import { APPLICATION_ROUTES } from "../../../../../utils/constants";

const Header = ({ setValue, value }) => {
  const history = useHistory();

  const handleChange = (val) => {
    setValue(val);
  };
  const options = [];
  for (let i = 1; i <= 10; i++) options.push(i);
  return (
    <header className=" py-4 px-6 flex justify-between items-center border-b-2">
      <div className="flex items-center">
        <button
          className="text-black text-xl pr-4"
          onClick={() => history.push(APPLICATION_ROUTES.AMAZONADVERTISE)}
        >
          X
        </button>
        <h1 className="text-black text-xl font-semibold ">New Campaign</h1>
      </div>

      <div className="flex gap-4 items-center">
        <h3 className="text-black text-xl font-semibold ">
          Select number of AdGroups X
        </h3>

        <div>
          <select
            value={value}
            className="campaignselect "
            onChange={(e) => handleChange(e.target.value)}
            disabled={value != "1"}
          >
            {/* <option selected disabled>
              Select
            </option> */}

            {options.map((option) => (
              <option key={option} value={option}>
                {option}x
              </option>
            ))}
          </select>
        </div>
        <div className="space-x-4">
          <button
            className="text-blue-400 hover:underline"
            onClick={() => history.push(APPLICATION_ROUTES.AMAZONADVERTISE)}
          >
            Go Back to Campaigns
          </button>

          {/* <button className="bg-gray-400 text-white px-4 py-2 rounded-2xl">
						Save as Draft
					</button>

					<button className="bg-orange-400 text-white px-4 py-2 rounded-2xl">
						Launch Campaign
					</button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
