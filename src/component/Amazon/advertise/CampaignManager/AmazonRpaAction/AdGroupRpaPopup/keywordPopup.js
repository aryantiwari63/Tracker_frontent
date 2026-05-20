import { useState } from "react";
import { RPA_ACTION_EDIT } from "../../../../../../utils/constants";
import { Chips } from "primereact/chips";
import { _POST } from "../../../../../../services/axios.method";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../../../redux/action-creator/commonAction";
import { useSelector, useDispatch } from "react-redux";
import DialogBox from "../../../../../common-components/dialogBox.js";
import ActionType from "../../../../../../redux/types";
import Popup from "../../../../../common-components/Popups/Popup";

export const KeywordPopup = ({ setOpenState }) => {
  const [budget, setBudget] = useState();
  const [value, setValue] = useState([]);
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  const [showDialog, setShowDialog] = useState(false);
  const [exact, setExact] = useState(false);
  const [broad, setBroad] = useState(false);
  const [phrase, setPhrase] = useState(false);
  let { amazonProfile } = useSelector((state) => state?.AmazonProfileReducer);
  const ACTION_TYPE = "adgroup";
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState(false);
  let accountName = localStorage.getItem("savedAccounts");
  let currency = localStorage.getItem("currency")
  let val = JSON.parse(accountName);
  // eslint-disable-next-line no-unused-vars
  const [date, setDate] = useState("none");

  const handleBudgetChange = (inputValue) => {
    // Use a regular expression to keep only numeric characters and decimals
    const numericValue = inputValue.replace(/[^0-9.]/g, "");

    // Update the budget state with the filtered numeric value
    setBudget(numericValue);
  };

  const handleAction = async (data) => {
    try {
      setLoading(true);

      const res = await _POST(RPA_ACTION_EDIT, data);
      setLoading(false);
      setOpenState(false);
      if (res?.status === 200) {
        dispatch(setToastMessageHandler("Action performed successfully", true));
      } else {
        dispatch(setToastMessageHandler("Failed to perform action", false));
      }
      dispatch({
        type: ActionType.CHECKBOX,
        payload: [],
      });
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleApplyButton = () => {
    const data = selectedCheckBox?.adgroup?.flatMap((data) => {
      return value.flatMap((keyword) => {
        let matchTypes = [];
        if (exact && broad && phrase) {
          matchTypes = ["EXACT", "BROAD", "PHRASE"];
        } else if (exact && broad) {
          matchTypes = ["EXACT", "BROAD"];
        } else if (exact && phrase) {
          matchTypes = ["EXACT", "PHRASE"];
        } else if (broad && phrase) {
          matchTypes = ["BROAD", "PHRASE"];
        } else if (exact) {
          matchTypes = ["EXACT"];
        } else if (broad) {
          matchTypes = ["BROAD"];
        } else if (phrase) {
          matchTypes = ["PHRASE"];
        }
        return matchTypes.map((matchType) => {
          //   const numericBudget = parseFloat(budgetWithoutCurrency);
          let actionMessage = `Set Keyword ${keyword} with Match Type`;
          if (exact) {
            console.error(exact);
          }
          return {
            campaign_id: [data?.campaign_id],
            ad_group_id: data?.ad_group_id,
            campaign_name: [data.campaign_name],
            ad_group_name: data.ad_group_name,
            state: data.ad_status || "enable",
            action_type: ACTION_TYPE,
            // state: "enable",
            match_type: matchType,
            set_value :  parseFloat(budget),
            // bid: parseFloat(budget),
            keywords: keyword,
            account_id: amazonProfile,
            action: "add_keyword",
            account: val[0],
            // set_value:numericBudget,
            action_message: `${actionMessage} ${matchType} with bid of ${currency}${budget}`,
            media_type: "Amazon",
            profile_id: amazonProfile,
            segment: data?.campaign_type,
          };
        });
      });
    });

    handleAction(data);
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
  };

  const handleDialogApply = () => {
    setShowDialog(false);
    handleApplyButton();
  };
  // useEffect(() => {
  //   document.addEventListener("click", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);

  // useEffect(() => {}, [onEditButtonClick]);
  return (
    <>
      <Popup
        title="Edits: Keyword"
        popup_id_container="rpa-container"
        popup_content="rpa_content"
        setShowPopup={setOpenState}
        platform="amazon"
        setTempView={() => {}}
        // applyAction={handleApplyButton}
        applyAction={() => {
          if (value.length < 1 || !(exact || phrase || broad) || budget == "") {
            setErrorMessage(true);
            setShowDialog(false);
            return;
          }
          setShowDialog(true);
          // setOpenState(false);
        }}
      >
        <div className="w-full p-4">
          <div className=" flex">
            <div className="">
              <div className="flex items-center mr-4 mb-2">
                <label
                  htmlFor="inline-radio"
                  className=" text-sm font-medium text-black"
                >
                  Add Keyword
                </label>
              </div>
              <div
                //  className="items-center"
                style={{
                  overflowY: "auto",
                  maxWidth: "250px",
                  minWidth: "250px",
                  minHeight: "20px",
                  maxHeight: "50px",
                }}
              >
                <Chips
                  value={value}
                  onChange={(e) => {
                    setValue(e.value);
                  }}
                  separator=","
                />
              </div>
            </div>
            <div className="w-[40px]">
              <label className="">Bid </label>

              <div className=" mt-2 flex items-center">
                <input
                  className="w-[110px] h-12 rounded px-1 border text-sm  border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
                  type="text"
                  placeholder="Enter Amount"
                  value={budget}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                ></input>
              </div>
            </div>

            <div className="ml-20">
              <div className="mr-2">
                <label key="exact">
                  <label className="pr-2">Exact</label>
                </label>
              </div>
              <div className="mt-2">
                <input
                  type="checkbox"
                  name="exact"
                  onChange={() => setExact(!exact)}
                />
              </div>
            </div>

            <div className="mr-2">
              <div>
                <label key="broad">
                  <label className="pr-2">Broad</label>
                </label>
                <div className="mt-2">
                  <input
                    type="checkbox"
                    name="broad"
                    onChange={() => setBroad(!broad)}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="mr-2">
                <div>
                  <label key="phrase">
                    <label className="pr-2">Phrase</label>
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    type="checkbox"
                    name="phrase"
                    onChange={() => setPhrase(!phrase)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="pb-1"></div> <div className="flex"></div>
          {/* </div> */}
          {errorMessage == true && (
            <p className="text-red-500 text-[14px] mt-2">
              *Please select all field.
            </p>
          )}
        </div>
        <hr className="mt-6" />
      </Popup>
      {showDialog && (
        <DialogBox
          buttonName="Accept"
          title="Confirmation"
          onAccept={handleDialogApply}
          onCancel={handleDialogCancel}
          platform={"blinkit"}
        >
          Are you sure you want to add keyword?
        </DialogBox>
      )}
    </>
  );
};
