import React, { useEffect, useState } from "react";
import AmazonCampignSection from "./AmazonCampignSection";
import { AMAZON_ACCOUNTS } from "../../../../utils/amazonConstants";
// import AmazonCampaignManagerHeader from "./AmazonCampaignManagerHeader";
import {  _GET } from "../../../../services/axios.method";
import { useDispatch } from "react-redux";
import ActionType from "../../../../redux/types";
import { getLocalStorageAccounts, saveLocalStorageAccounts } from "../../../../utils/helpers";
import _ from "lodash";

const AmazonCamapignManager = () => {
  const dispatch = useDispatch();
  const [account, setAccount] = useState([]);

  const [selectedAccount, setSelectedAccount] = useState("");
  useEffect(() => {
    getAccounts();
  }, []);
  const getAccounts = async () => {
    const responseAccount = await _GET(AMAZON_ACCOUNTS);
    if (responseAccount?.data?.data) {
      let accountsFilter = _.cloneDeep(responseAccount?.data?.data);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
         let firstAccount = savedAccounts[0];
         let filterAccount = responseAccount?.data?.data.find(acc => acc.label === firstAccount);
         if (filterAccount) {
            accountsFilter = [filterAccount]
            saveLocalStorageAccounts([accountsFilter[0]?.label])
         } else {
           saveLocalStorageAccounts([accountsFilter[0]?.label])
         }
      } else {
        saveLocalStorageAccounts([accountsFilter[0]?.label])
      }
      setSelectedAccount(accountsFilter[0].value);
      setAccount(responseAccount.data.data);
    }
  };

  useEffect(() => {
    dispatch({
      type: ActionType.AMAZONPROFILE,
      payload: selectedAccount,
    });
    localStorage.setItem("amazon_profile", selectedAccount);
  }, [selectedAccount]);
  return (
    <>
      <div>
        {/* <AmazonCampaignManagerHeader/> */}
        <div className="py-2 ">
          <AmazonCampignSection
            platform={"ams"}
            account={account}
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
          />
        </div>
      </div>
    </>
  );
};
export default AmazonCamapignManager;
