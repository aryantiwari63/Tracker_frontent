import React from "react";
import CustomReportTable from "../../common-components/CustomReportTable";
// import { customreportheader } from "../../../utils/constants";
// import { useSelector } from "react-redux";
// import { LIMIT } from "../../../../utils/constants";

const ReportList = ({
  showHeader,
  setCheckedHeader,
  dataLIMIT,
  setDataLIMIT,
  reportData,
  platform,
}) => {
  // const [offset, setOffset] = React.useState(0);
  // const [page, setPage] = React.useState(1);
  // const [totalData, setTotalData] = React.useState();
  // console.log("showHEadeeeeer>>>>>>>", showHeader);
  // const [dataLIMIT, setDataLIMIT] = React.useState(0);
  // const { generatedreportlist } = useSelector((state) => state.Customreport);
  // const [campaignData, setCampaignData] = React.useState([]);
  // React.useEffect(() => {
  //   setCampaignData([...generatedreportlist]);
  // }, [generatedreportlist]);

  const [sortBy, setSortBy] = React.useState({
    key: "created_on",
    order: -1,
  });
  let seenValues = new Set();
  let filteredData = showHeader.filter((item) => {
    if (seenValues.has(item.value)) {
      return false;
    } else {
      seenValues.add(item.value);
      return true;
    }
  });
  // const [loading, setLoading] = React.useState(false);

  const sortData = (item, order) => {
    // setCampaignData([]);
    setSortBy({
      key: item,
      order: order,
    });
    // setPage(1);
    // setOffset(0);
    // setDataLIMIT(0);
    setCheckedHeader([]);
  };
  // const paginate = (direction) => {
  //   if (direction == "prev") {
  //     setPage(page - 1);
  //     setOffset(offset - LIMIT);
  //   } else {
  //     setPage(page + 1);
  //     setOffset(offset + LIMIT);
  //   }
  // };
  // const selectAlls = (checked) => {
  //   if (productListtoShow && productListtoShow.length > 0) {
  //     if (checked) {
  //       setSelectedProduct([...productListtoShow]);
  //     } else {
  //       setSelectedProduct([]);
  //     }
  //   }
  // };
  // React.useEffect(() => {
  //   if (campaignData.FSNs) {
  //     setSelectedProduct(
  //       productListtoShow.filter((item) => item.FSNs == campaignData.FSNs)
  //     );
  //   }
  // }, []);
  return (
    <>
      <div className="">
        <div className="px-3 bg-white">
          <CustomReportTable
            headers={filteredData}
            bodyContent={reportData}
            sortData={sortData}
            source={"campaign"}
            setDataLIMIT={setDataLIMIT}
            dataLIMIT={dataLIMIT}
            sortBy={sortBy}
            platform={platform}
            // paginate={paginate}
            // totalData={totalData}
            // page={page}
            // offset={offset}
          />
        </div>
      </div>
    </>
  );
};

export default ReportList;
