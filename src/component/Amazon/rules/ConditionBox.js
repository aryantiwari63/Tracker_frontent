import React, { useEffect, useState } from "react";
import Popup from "../../common-components/Popups/Popup";
// import AdForm from "../../common-components/ad-form/AdForm";
// import { Field, Formik } from "formik";
import { Keywords, adGroupAction, campaignAction } from "./data/actionData";
import Conditions from "./Conditions";
import ConditionBoxAddBtn from "./button/ConditionBoxAddBtn";

const ConditionBox = ({ setOpenState }) => {
  const [rule, setRule] = useState("");
  const [actionData, setActionData] = useState([
    {
      label: "",
      value: "",
    },
  ]);
  useEffect(() => {
    switch (rule) {
      case "Campaign":
        setActionData(campaignAction);
        break;
      case "AdGroup":
        setActionData(adGroupAction);
        break;
      case "Keyword":
        setActionData(Keywords);
        break;
      case "FSN":
        setActionData();
        break;
      default:
        break;
    }
    setRule();
  }, [rule]);
  return (
    <>
      <Popup title="Condition Box" setShowPopup={setOpenState} smallsize>
        <div className="col_12 pt-2 pl-4 pr-3">
          <div className=" ">
            <label htmlFor="">Campaign Type</label>
          </div>
          <select
            name="campaign_type"
            id="campaign_type"
            className="form-control px-10"
          >
            <option value="PLA">PLA</option>
            <option value="PCA">PCA</option>
            <option value="PCA,PLA">PLA+PCA</option>
          </select>
        </div>
        <div className="col_12 pt-2 pl-4 pr-3">
          <label htmlFor=""> Select Entity</label>
          <select
            name="apply_rule_to"
            id="apply_rule_to"
            className="form-control pr-3"
            onChange={(e) => {
              setRule(e.target.value);
            }}
          >
            <option selected disabled value="">
              Select one
            </option>
            <option value="Campaign">Campaign</option>
            <option value="AdGroup">Ad Group</option>
            <option value="Keyword">Keyword</option>
            <option value="FSN">FSN</option>
          </select>
        </div>
        <div className="col_12 pt-2 pl-4 pr-3">
          <div className=" ">
            <label htmlFor="">Apply Rule to</label>
          </div>
          <select
            name="campaign_type"
            id="campaign_type"
            className="form-control px-10"
          >
            <option value="PLA">PLA</option>
            <option value="PCA">PCA</option>
            <option value="PCA,PLA">PLA+PCA</option>
          </select>
        </div>

        <div className="col_12 pt-2 pl-4 pr-3">
          <div className=" pt-2 pl-3 ">
            <label htmlFor="">Action </label>
          </div>

          <select
            name="rule_action"
            id="rule_action"
            className="form-control px-10"
          >
            {actionData.map((v) => {
              return (
                <>
                  <option value={v.value}>{v.label}</option>
                </>
              );
            })}
          </select>
        </div>
        <div className="col_12">
          <div className="row pt-2 pl-3">
            <label htmlFor="" className="createrulepopup-forms">
              Conditions
            </label>
            <div className="pt-1 pl-2">
              <img src="/assets/images/info.svg" alt="" />
            </div>
          </div>
          <Conditions />
          <div className="row pl-1.5">
            <ConditionBoxAddBtn />
          </div>
        </div>
      </Popup>
    </>
  );
};
export default ConditionBox;
