import React, { useEffect } from "react";
import DatePicker from "../../../DatePicker";
import { addDays } from "date-fns";
import { convertDate } from "../../../../utils/helpers";

const OptionHeaders = ({ start_date, end_date }) => {

  const [dateRange, setDateRange] = React.useState([
    {
      startDate: addDays(new Date(), -7),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [calState, setCalState] = React.useState({
    showCalender: false,
    fullCalender: false,
    dateApplied: false,
  });

  const onChangeDate = (item) => {
    setDateRange([item.selection]);
    if (!calState.fullCalender) {
      setCalState({
        ...calState,
        showCalender: false,
        dateApplied: true,
      });
      // setCallApi(true);
    }
  };
  const applyDate = () => {
    onChangeDate({ selection: dateRange[0] });
    setCalState({
      showCalender: false,
      fullCalender: false,
      dateApplied: true,
    });
  };

  useEffect(() => {
    start_date(convertDate(dateRange[0]?.startDate));
    end_date(convertDate(dateRange[0]?.endDate));
  }, [dateRange]);

  return (
    <>
      <div className="row p-6 relative">
        <div className="">
          {/* <label for="">
            <input type="text" className="px-4 py-2 "></input>
          </label> */}
          <DatePicker
            onChangeDate={onChangeDate}
            state={dateRange}
            setState={setDateRange}
            calState={calState}
            setCalState={setCalState}
            position={"left"}
            top
            applyDate={applyDate}
            disableFutureDates={true}
            className="border"
          />
        </div>
      </div>
    </>
  );
};

export default OptionHeaders;
