import React from "react";
import OptionsHeader from "../OptionsHeader/OptionsHeader";

const TableSubHeader = ({
  onChangeDate,
  applyDate,
  cancelDate,
  dashboard,
  state,
  setState,
  calState,
  setCalState,
  setSelectedAccountVal,
  selectedAccountVal,
  setSelectedPlatformVal,
  selectedPlatformVal,
  setSelectedTypeVal,
  selectedTypeVal,
  applybtn,
  typeBrand,
  setBrandOptions,
  platform=""
}) => {
  // const [dateRange, setDateRange] = React.useState([
  //   {
  //     startDate: addDays(new Date(), -30),
  //     endDate: new Date(),
  //     key: "selection",
  //   },
  // ]);
  // const [calState, setCalState] = React.useState({
  //   showCalender: false,
  //   fullCalender: false,
  //   dateApplied: false,
  // });

  // function onChangeDate(item) {
  //   setDateRange([item.selection]);
  //   if (!calState.fullCalender) {
  //     setCalState({
  //       ...calState,
  //       showCalender: false,
  //       dateApplied: true,
  //     });
  //   }
  // }
  // console.log("selectedAccountVal", selectedAccountVal);

  return (
    <>
    
      <OptionsHeader
        onChangeDate={onChangeDate}
        applyDate={applyDate}
        cancelDate={cancelDate}
        dashboard={dashboard}
        dateRange={state}
        setDateRange={setState}
        calState={calState}
        setCalState={setCalState}
        setSelectedAccountVal={setSelectedAccountVal}
        selectedAccountVal={selectedAccountVal}
        setSelectedPlatformVal={setSelectedPlatformVal}
        selectedPlatformVal={selectedPlatformVal}
        setSelectedTypeVal={setSelectedTypeVal}
        selectedTypeVal={selectedTypeVal}
        applybtn={applybtn}
        typeBrand={typeBrand}
        setBrandOptions={setBrandOptions}
        platform={platform}
      />
    </>
  );
};

export default TableSubHeader;
