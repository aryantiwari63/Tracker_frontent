import React from "react";
import DatePicker from "../../../DatePicker";
import { addDays } from "date-fns";
import { convertDate, defaultDateRange } from "../../../../utils/helpers";

const OptionHeaders = ({ start_date, end_date }) => {
  const dateFilters = defaultDateRange();
  const [dateRange, setDateRange] = React.useState([
    {
      startDate: addDays(new Date(), -7),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [tempDate, setTempDate] = React.useState([
    {
      startDate: new Date(dateFilters["startDate"]),
      endDate: new Date(dateFilters["endDate"]),
      key: dateFilters["key"],
    },
  ]);

  const [calState, setCalState] = React.useState({
    showCalender: false,
    fullCalender: false,
    dateApplied: false,
  });

  const onChangeDate = (item) => {
    let dateRangePrev = dateRange[0];
    setTempDate([{ ...dateRangePrev, ...item.selection }]);

    if (!calState.fullCalender) {
      setDateRange([item.selection]);
      setCalState({
        ...calState,
        showCalender: false,
        dateApplied: true,
      });
      // setCallApi(true);
    }
  };

  const applyDate = () => {
    let appdaterange = tempDate[0];
    setDateRange([{ ...appdaterange }]);
    // onChangeDate({ selection: dateRange[0] });
    start_date(convertDate(dateRange[0]?.startDate));
    end_date(convertDate(dateRange[0]?.endDate));
    setCalState({
      showCalender: false,
      fullCalender: false,
      dateApplied: true,
    });
  };
  const cancelDate = () => {
    let dateRangePrev = dateRange[0];
    
    setTempDate([{ ...dateRangePrev}]);
    //setTempDate([dateRange[0]]);
  };

  // useEffect(() => {
  //   start_date(convertDate(dateRange[0]?.startDate));
  //   end_date(convertDate(dateRange[0]?.endDate));
  // }, [dateRange]);

  return (
    <>
      <div className="row p-6 relative">
        <div className="">
          {/* <label for="">
            <input type="text" className="px-4 py-2 "></input>
          </label> */}
          <DatePicker
            positionLeft="calLeft"
            onChangeDate={onChangeDate}
            state={tempDate}
            dashboard="report"
            applyDate={applyDate}
            cancelDate={cancelDate}
            setState={(data) => setDateRange(data)}
            calState={calState}
            setCalState={(data) => setCalState(data)}
            position="left"
            // top
            disableFutureDates={true}
            className="border"
          />
        </div>
      </div>
    </>
  );
};

export default OptionHeaders;
