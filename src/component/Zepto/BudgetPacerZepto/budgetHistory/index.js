import React, { useState, useEffect } from "react";
import _ from 'lodash';
import { GET_ZEPTO_ACCOUNTS } from "../../../../utils/constants";
import BudgetPacerHistory from "../../../common-components/BudgetPacer/budgetPacerHistory";
import { _GET, _POST } from "../../../../services/axios.method";
import SelectDropDrown from "../../../common-components/SelectDropDown";
import { defaultDateRange, convertDate, getLocalStorageAccounts, saveLocalStorageAccounts } from "../../../../utils/helpers";
import DatePicker from "../../../DatePicker";
import { BUDGET_PACER_HISTORY, USER_LIST } from "../../../../utils/constants";

const BudgetHistoryZepto = () => {
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

  const accountNames = async () => {
    try {
      // setLoading(true);

      const result = await _GET(GET_ZEPTO_ACCOUNTS);
      const data = result.data.data;
      const accounts = data.map((item) => ({
        label: item.account_name,
        value: item.id,
        account_id: item.account_name,
        platform_id: item.id,
      }));

      // setLoading(false);
      const brandOptionDatas = accounts.map((item) => ({
        label: item.label,
        value: item.label,
      }));
      let filterAccounts = _.cloneDeep(brandOptionDatas);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
        let selectedAccounts = savedAccounts.map(value =>
          brandOptionDatas.find(account => account.value === value)
        ).filter(Boolean);
          if (_.size(_.compact(selectedAccounts))) {
            filterAccounts = selectedAccounts;
          } else {
            saveLocalStorageAccounts(_.map(brandOptionDatas, 'value'));
          }
      } else {
        saveLocalStorageAccounts(_.map(brandOptionDatas, 'value'));
      }
      setBrandOptionData(brandOptionDatas);
      setSelectedAccountVal(_.map(filterAccounts, 'value'));
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

  const getHistory = async () => {
    try {
      const data = {
        brand: selectedAccountVal,
        start_date: convertDate(dateRange[0]?.startDate),
        end_date: convertDate(dateRange[0]?.endDate),
        media_type: "Zepto",
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

  const applyDate = () => {
    setCalState({
      showCalender: false,
      fullCalender: false,
      dateApplied: true,
    });
    onChangeDate({ selection: dateRange[0] });
  };

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

  return (
    <>
      <div className="flipkart__card pb-3  w-full ">
        <div className="flex mt-4 mb-8">
          <div className="flipkart__calander ml-1 w-[250px]">
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
              platform={'zepto'}
              className="border"
            />
          </div>

          <div className="h-8  w-60 ml-3">
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
                  platform={"zepto"}
                />
              </>
            )}
          </div>

          <div className="h-8  w-60 ml-5">
            {" "}
            {brandOptionData.length > 0 && (
              <SelectDropDrown
                FilterHeading="Select Brand"
                selectAllDefault={true}
                setDefault={selectedAccountVal}
                setSelectedVal={setSelectedAccountVal}
                selectedVal={selectedAccountVal}
                options={brandOptionData}
                platform={"zepto"}
              />
            )}
          </div>
        </div>

        <BudgetPacerHistory historyData={historyData} mediaType="Zepto" />
      </div>
    </>
  );
};

export default BudgetHistoryZepto;
