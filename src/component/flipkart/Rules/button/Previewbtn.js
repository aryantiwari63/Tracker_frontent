import React, { useRef, useState } from "react";
import _ from "lodash";
import { FaChevronDown } from "react-icons/fa";
import Popup from "../../../common-components/Popups/Popup";
import PreviewData from "./PreviewData";
import KeywordPopup from "../../../common-components/Popups/keywordPopup";
import { RULES, RULES_STATUS, RULES_EMAIL, PERMISSIONS } from "../../../../utils/constants";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../redux/action-creator/commonAction";
import { _PATCH } from "../../../../services/axios.method";
import { useCloseWhenClickOutside } from "../../../common-components/useCloseWhenClickOutside";
import { useDispatch, useSelector } from "react-redux";
import ActionType from "../../../../redux/types";
import "./style.css";
import WhenPermitted from "../../../common-components/WhenPermitted";

const PreviewBtn = ({ rowData }) => {
  const [open, setOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showOpenModal, setOpenModal] = useState(false);
  const { ruleData } = useSelector((state) => state?.RuleReducer);
  const [emails, setEmails] = useState(rowData.emails ? rowData.emails : []);
  const [validEmail, setValidEmail] = useState([]);
  const userPermissions = useSelector(
    (state) => state.permissionsReducer || []
  );
  const dispatch = useDispatch();
  const hasPermission = _.find(userPermissions, {
    permission_name: PERMISSIONS.CREATE_RULE,
    platform: 'flipkart',
  });

  const deleteRule = async () => {
    try {
      setLoading(true);
      const response = await _PATCH(`${RULES}/${rowData.id}`);
      setLoading(false);
      const updatedRules = ruleData.filter((rule) => rule.id !== rowData.id);
      dispatch({
        type: ActionType.RULE,
        payload: updatedRules,
      });

      if (response?.status === 200) {
        dispatch(setToastMessageHandler(response?.data?.status?.message, true));
      } else {
        dispatch(setToastMessageHandler("Failed to delete rule", false));
      }
    } catch (error) {
      console.error(error);
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const updateEmails = async() => {
    try{
      let email =  emails.filter(function (el) {
        return el != null || el != "" ||  el != undefined;
      });
      let emailChecker = validEmail.every(v => v === true || v === undefined || v === "" );
      if(email.length > 0 && emailChecker) {
        setLoading(true);
        let data = {emails}
        
        const response = await _PATCH(`${RULES_EMAIL}/${rowData.id}`, data);
        setLoading(false);
        if (response?.status === 200) {
          dispatch(setToastMessageHandler("Rule emails updated", true));
        } else {
          dispatch(setToastMessageHandler("Failed to update rule status", false));
        }
        setShowPopup(false)
      } 
    }
    catch(e){
      console.error(e)
    }
  }

  const ruleStatusApi = async (status) => {
    try {
      let data;
      if (status == "disable") {
        data = { rule_status: false };
      } else {
        data = { rule_status: true };
      }

      setLoading(true);
      const response = await _PATCH(`${RULES_STATUS}/${rowData.id}`, data);
      setLoading(false);
      if (response?.status === 200) {
        dispatch(setToastMessageHandler("Rule status updated", true));
      } else {
        dispatch(setToastMessageHandler("Failed to update rule status", false));
      }
      dispatch({
        type: ActionType.RECALLGETRULESAPI,
        payload: true,
      });
    } catch (error) {
      console.error(error);
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const dropdownRef = useRef(null);
  useCloseWhenClickOutside(open, setOpen, dropdownRef);
  return (
    <>
      <div className="row justify-center">
        <div className="flex w-24 gap-1">
          <button
            className="preview__btn w-14 hover:bg-[#0081f7cc]"
            onClick={() => setShowPopup(!showPopup)}
          >
            <div className="row flex-col items-center">
              <div className=" w-4 col_4 ">
                <img src="/assets/images/eye-solid.svg" alt="" />
                {/* <BsEyeFill/> */}
              </div>
              <div className="">Preview</div>
            </div>
          </button>
          <WhenPermitted platform="flipkart" permission={PERMISSIONS.CREATE_RULE}>
          <button className="preview__delbtn hover:text-white hover:bg-[#0081f7cc]" onClick={() => setOpen(!open)}>
            {/* <img src="\assets\images\arrow-down.svg" alt="" /> */}
            <FaChevronDown className="h-3" />
          </button>
          </WhenPermitted>
        </div>
        <div className="relative" ref={dropdownRef}>
          {open && (
            <ul className="deleteoptn rounded ">
              <li
                className="cursor-pointer text-blue-500 hover:bg-gray-100 "
                // onClick={() => {
                //   setOpen(!showOpenModal);
                // }}
              >
                <button
                  className="pl-4 text-base "
                  onClick={() => {
                    setOpenModal(!showOpenModal);
                    // deleteRule();
                  }}
                >
                  Delete
                </button>
                {showOpenModal && (
                  <KeywordPopup
                    subTitle={"Are you sure you want to delete this rule?"}
                    setShowPopup={setOpenModal}
                    apply={() => {
                      deleteRule();
                      setOpenModal(false);
                    }}
                  />
                )}
              </li>
              {rowData?.is_active === true ? (
                <li className="cursor-pointer text-blue-500  hover:bg-gray-100 ">
                  <button
                    className="pl-4  text-base"
                    onClick={() => {
                      ruleStatusApi("disable");
                      setOpen(false);
                    }}
                  >
                    Disable Rule
                  </button>
                </li>
              ) : (
                <li className="cursor-pointer text-blue-500  hover:bg-gray-100">
                  <button
                    className="pl-4  text-base"
                    onClick={() => {
                      ruleStatusApi("enable");
                      setOpen(false);
                    }}
                  >
                    Enable Rule
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
        {showPopup && (
          <Popup
            title="Preview of rule results"
            smallsize
            setShowPopup={setShowPopup}
            apply_button_css={true}
            cutomButton={hasPermission && [
              {
                handleClick: () => updateEmails(),
                label: "Save Changes",
                style: "",
              },
            ]}
          >
            <p>
              <PreviewData rowData={rowData} emails={emails} setEmails={setEmails} validEmail={validEmail} setValidEmail={setValidEmail}  hasPermission={hasPermission}/>
            </p>
          </Popup>
        )}
      </div>
    </>
  );
};

export default PreviewBtn;
