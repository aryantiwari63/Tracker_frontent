import { useState } from "react";
import "./styles.css";
import "../../Amazon/advertise/CampaignManager/createBulkadgroup/styles.css";
import LoaderSpinner from "../../common-components/loader-spinner";
import Popup from "../../common-components/Popups/Popup";
import ActionDetail from "./actionDetail";
import Tooltip from "../advertise/CampaignManager/createBulkadgroup/Tooltip";
import { actionActivityHeaders} from "../../../utils/constants";
import moment from "moment/moment";

const ActionTable = ({
  actionData,
  loading,
  // handleTrigger,
  // accountIdObject,
  sort,
  sortData,
}) => {
  const [detailPopup, setDetailPopup] = useState(false);
  const [detailData, setDetailData] = useState({});

  const handleDetails = (data) => {
    setDetailPopup(true);
    setDetailData(data);
  };

  return (
    <>
      <div className={"action_table max-h-[500px] overflow-y-scroll rounded"}>
        <table className="w-full">
          <thead className=" table-fixed sticky top-0 z-[8] w-full">
            <tr>
              {actionActivityHeaders.map((item) => (
                <th className="max-w-[180px]" key={item.id}>
                  <div className="flex items-center justify-center px-4">
                    <div className=" ml-5 w-24">{item.title}</div>
                    {item.sort && (
                      <div className="text-[9px] leading-[0.7rem] flex flex-col cursor-pointer">
                        <p
                          className=""
                          style={{
                            color:
                              sort.key === item.value &&
                              (sort.order === 1 || sort.order === "ASC")
                                ? "black"
                                : "grey",
                          }}
                          onClick={() => sortData(item.value, "ASC")}
                        >
                          ▲
                        </p>
                        <p
                          className=""
                          style={{
                            color:
                              sort.key === item.value &&
                              (sort.order === 1 || sort.order === "DESC")
                                ? "black"
                                : "grey",
                          }}
                          onClick={() => sortData(item.value, "DESC")}
                        >
                          ▼
                        </p>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {loading === true ? (
            <td
              className="p-2"
              colSpan={10}
              rowSpan={2}
              style={{ alignItems: "center", verticalAlign: "middle" }}
            >
              <div className="loaderStyle  row sticky ">
                <LoaderSpinner />
              </div>
            </td>
          ) : (
            <tbody>
              {/* <tr> */}
              {/* {console.log(
                actionData,
                " actoin data<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
              )} */}
              {actionData?.length > 0 ? (
                actionData.map((data, key) => {
                  let createDate = moment(data?.createdat).format("YYYY-MM-DD");
                  let createTime = moment(data?.createdat).format("hh:mm A");
                  let actionOn;
                  switch (data.action_type) {
                    case "keyword":
                      actionOn = data.keywords;
                      break;
                    case "asin":
                      actionOn = data.fsn_id;
                      break;
                    case "adgroup":
                      actionOn = data.ad_group_name;
                      break;

                    case "portfolio":
                      actionOn = data.portfolio_name
                      break;
                    case "campaign":
                    case "placement":
                      actionOn = data.campaign_name;
                      break;
                  }
                  let actionStatus;
                  let color;

                  switch (data["rpa_action_results.status"]) {
                    case "false":
                      actionStatus = "Failed";
                      color = "red";
                      break;
                    case "true":
                      actionStatus = "Success";
                      color = "#4ade80";
                      break;
                    case null:
                      (actionStatus = "Pending"), (color = "#fdba74");
                      break;
                  }
                  return (
                    <tr key={key}>
                      <td>
                        <div className="">
                          <div className="flex justify-center text-sm">
                            {createDate}
                          </div>
                          <div className="flex justify-center text-gray-500 text-[12px] w-full">
                            {createTime}
                          </div>
                        </div>
                      </td>
                      <td>
                        {" "}
                        {data?.user_name ? (
                          <div className="flex justify-center">
                            {data?.user_name}
                          </div>
                        ) : (
                          <div className="flex justify-center">-</div>
                        )}
                      </td>
                      <td>
                        {" "}
                        {data?.account ? (
                          <div className="flex justify-center">
                            {data?.account}
                          </div>
                        ) : (
                          <div className="flex justify-center">-</div>
                        )}
                      </td>
                      <td>
                        {" "}
                        <div className="flex justify-center">
                          {data?.action_type}
                        </div>
                      </td>
                      <td>
                        {" "}
                        {/* {data?.campaign_name ? ( */}
                        <div className="flex justify-center ">
                          <div className="break-all text-center">
                            {actionOn}
                          </div>
                        </div>
                        {/* ) : (
                          <div className="flex justify-center items-center">
                            -
                          </div>
                        )} */}
                      </td>
                      <td className="cursor-pointer">
                        {" "}
                        {data?.action_message ? (
                          <div className="flex justify-center">
                            <div className="line-clamp-2 w-[130px] text-center">
                              {data?.action_message}
                            </div>
                            {data?.action_message?.length > 25 && (
                              <Tooltip
                                title={data?.action_message}
                                className={
                                  "!px-3 flex items-center gap-1 rounded-sm !shadow-md"
                                }
                              />
                            )}
                          </div>
                        ) : (
                          <div className="flex justify-center">-</div>
                        )}
                      </td>
                      <td>
                        <div
                          className="flex justify-center "
                          style={{
                            color: color,
                          }}
                        >
                          {actionStatus}
                        </div>
                      </td>
                      <td>
                        <div
                          className="flex justify-center "
                          onClick={() => handleDetails(data)}
                        >
                          <span className="mr-1 underline underline-offset-4 cursor-pointer">
                            Details
                          </span>
                          <span>
                            <img
                              className="w-3 inline-block align-baseline mr-1"
                              src="/assets/images/arrow-up-right.png"
                              alt="reload"
                            />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    className="p-2"
                    colSpan={10}
                    rowSpan={2}
                    style={{ alignItems: "center", verticalAlign: "middle" }}
                  >
                    <div className="loaderStyle  row sticky font-semibold">
                      No Data Found
                    </div>
                  </td>
                </tr>
              )}
              {/* </tr> */}
            </tbody>
          )}
        </table>
        {detailPopup === true && (
          <Popup
            setTempView={() => {}}
            title="Action Details"
            smallsize
            setShowPopup={setDetailPopup}
            apply_button_css={true}
            cutomButton={[
              {
                handleClick: () => {
                  setDetailPopup(false);
                },
                label: "OK",
                style: "bg-[#EF880F]",
              },
            ]}
          >
            <p>
              <ActionDetail data={detailData} />
            </p>
          </Popup>
        )}
      </div>
    </>
  );
};

export default ActionTable;
