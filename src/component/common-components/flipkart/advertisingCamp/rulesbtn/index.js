import React, { useState } from "react";
import CreateRulePopup from "../../../../flipkart/Rules/CreateRulePopup";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
const RuleBtn = () => {
  const [showPopup, setShowPopup] = useState(false);
  const history = useHistory();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="campaign__rulesbtn  ">
        <button
          className=" campaign__rulebutton"
          onClick={() => setOpen(!open)}
        >
          Rules
        </button>
        {open && (
          <div className="campaign__rulebtn-dropdown">
            <div>
              <button
                className="campaign__rulebtn-dropdownlist"
                onClick={() => setShowPopup(!showPopup)}
              >
                Create Rule
              </button>
              {showPopup && <CreateRulePopup setOpenState={setShowPopup} />}

              <button
                className="campaign__rulebtn-dropdownlist"
                onClick={() => history.push("/flipkart/rules")}
              >
                Manage Rule
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RuleBtn;
