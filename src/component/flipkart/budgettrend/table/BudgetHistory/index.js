import React, { useState, useEffect } from "react";
import SelectDropDrown from "../../../../common-components/SelectDropDown";
import _ from "lodash";
import { _GET, _POST } from "../../../../../services/axios.method";
import {
  GET_ACCOUNTS,
  USER_LIST,
  BUDGET_PACER_HISTORY,
} from "../../../../../utils/constants";
import DatePicker from "../../../../DatePicker";
import { defaultDateRange, convertDate, saveLocalStorageAccounts, getLocalStorageAccounts } from "../../../../../utils/helpers";
import HistoryTable from "./HistoryTable";
import { useDispatch } from "react-redux";
import { getWallletBalance } from "../../../../../redux/action-creator/sideBarAction";
const BudgetHistory = () => {
  // holds the username
  const [username, setUsername] = useState([]);
  const [brandOptionData, setBrandOptionData] = useState([]);
  const [selectedAccountVal, setSelectedAccountVal] = useState([]);
  const [userData, setUserData] = useState([]);
  const dateFilters = defaultDateRange();
  const [dateRange, setDateRange] = React.useState([
    {
      startDate: new Date(dateFilters["startDate"]),
      endDate: new Date(dateFilters["endDate"]),
      key: dateFilters["key"],
    },
  ]); //For LOCAL STORAGE

  const [calState, setCalState] = React.useState({
    showCalender: false,
    fullCalender: false,
    dateApplied: false,
  });

  const [historyData, setHistoryData] = useState([]);


  const dispatch = useDispatch()
  const accountNames = async () => {
    try {
      const result = await _GET(GET_ACCOUNTS);
      const data = result.data.data.result;
      const accounts = data.map((item) => ({
        value: item._id.account,
        brand_id: item._id.platform_id,
      }));
      const brandOptionDatas = accounts.map((item) => ({
        label: item.value,
        value: item.value,
      }));
      let filterAccounts = _.cloneDeep(brandOptionDatas);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(filterAccounts)) {
          let selectedAccounts = brandOptionDatas.filter(ele => savedAccounts.includes(ele.value))
          if (_.size(_.compact(selectedAccounts))) {
            filterAccounts = selectedAccounts;
          } else {
            saveLocalStorageAccounts(_.map(brandOptionDatas, 'value'));
          }
      } else {
        saveLocalStorageAccounts(_.map(brandOptionDatas, 'value'));
      }
      setBrandOptionData(brandOptionDatas);
      setSelectedAccountVal(filterAccounts.map((item) => item.value));
    } catch (error) {
      console.error(error);
    }
  };

  const userNames = async () => {
    try {
      const result = await _GET(USER_LIST);
      const userData = result?.data?.data?.result.map((item) => ({
        label: `${item?.first_name} ${item?.last_name}`,
        value: item?.id,
      }));

      setUserData(userData);
      setUsername(userData.map((item) => item.value));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    accountNames();
    userNames();
  }, []);

  const onChangeDate = (item) => {
    defaultDateRange(item.selection);
    setDateRange([item.selection]);
    if (!calState.fullCalender) {
      setCalState({
        ...calState,
        showCalender: false,
        dateApplied: true,
      });
    }
  };

  React.useEffect(() => {
    // if (selectedAccountVal.length > 0)
    dispatch(getWallletBalance(selectedAccountVal));
  }, [selectedAccountVal]);

  const applyDate = () => {
    setCalState({
      showCalender: false,
      fullCalender: false,
      dateApplied: true,
    });
    onChangeDate({ selection: dateRange[0] });
  };

  const getHistory = async () => {
    try {
      const data = {
        brand: selectedAccountVal,
        start_date: convertDate(dateRange[0]?.startDate),
        end_date: convertDate(dateRange[0]?.endDate),
        media_type: "Flipkart",
        user_id: username,
      };

      const result = await _POST(BUDGET_PACER_HISTORY, data);
      setHistoryData(result?.data?.data?.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getHistory();
  }, [dateRange, username, selectedAccountVal]);
  return (
    <>
      <div className="flipkart__card pb-3  w-full ">
        <div className="flex mb-4 ">
          <div className="flipkart__calander mt-4 w-[250px] outline-[#0081F7]">
            <DatePicker
              onChangeDate={onChangeDate}
              applyDate={applyDate}
              // cancelDate={cancelDate}
              // dashboard={dashboard}
              state={dateRange}
              setState={setDateRange}
              calState={calState}
              setCalState={setCalState}
              //   positionLeft="calRight"
              position="right"
              className="border"
              platform={"flipkart"}
            />
          </div>

          <div className="h-8  w-60 mt-4">
            {" "}
            {userData.length > 0 && (
              <>
                {" "}
                <SelectDropDrown
                  FilterHeading="User name"
                  selectAllDefault={true}
                  setDefault={username}
                  // options={["MP", "SM"]}
                  setSelectedVal={setUsername}
                  selectedVal={username}
                  options={userData}
                  platform
                />
            
              </>
            )}
          </div>

          <div className="h-8  w-60 ml-3 mt-4">
            {" "}
            {brandOptionData.length > 0 && (
              <SelectDropDrown
                FilterHeading="Select Brand"
                selectAllDefault={true}
                setDefault={selectedAccountVal}
                setSelectedVal={setSelectedAccountVal}
                selectedVal={selectedAccountVal}
                options={brandOptionData}
                platform
              />
            )}
          </div>
        </div>

        <HistoryTable historyData={historyData} />
      </div>
    </>
  );
};

export default BudgetHistory;
