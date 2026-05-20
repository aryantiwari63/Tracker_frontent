import React from "react";
import OptionsHeader from "../OptionsHeader/OptionsHeader";

const TableSubHeader = ({
  onChangeDate,
  applyDate,
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
  setBrandOptions
}) => {

  return (
    <>
      <OptionsHeader
        onChangeDate={onChangeDate}
        applyDate={applyDate}
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
        platform={"ams"}
        setBrandOptions={setBrandOptions}
      
      />
    </>
  );
};

export default TableSubHeader;
