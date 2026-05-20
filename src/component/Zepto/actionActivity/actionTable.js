import { useState } from "react";
import "./styles.css";
import LoaderSpinner from "../../common-components/loader-spinner";
import Popup from "../../common-components/Popups/Popup";
import ActionDetail from "./actionDetail";
import Tooltip from "../../Amazon/advertise/CampaignManager/createBulkadgroup/Tooltip";
import moment from "moment";
import { actionActivityHeaders } from "../../../utils/constants";

const ActionTable = ({
  actionData,
  loading,
  // handleTrigger,
  sort,
  sortData
  // accountIdObject,
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
          <thead className=" table-fixed sticky top-0 z-10 w-full">
          <tr>
             {
              actionActivityHeaders.map((item)=>
              (
                <th className="max-w-[180px]" key={item.id}>
                  <div className="flex items-center justify-center px-4">
                  <div className=" ml-5 w-24">{item.title}</div>
                  {
                    item.sort && (
                      <div className="text-[9px] leading-[0.7rem] flex flex-col cursor-pointer">
                          <p className=""
                           style={{
                            color:
                              sort.key === item.value &&
                              (sort.order === 1 ||
                                sort.order === "ASC")
                                ? "black"
                                : "grey",
                          }} 
                          onClick={()=> sortData(item.value,"ASC")}>▲</p>      
                          <p className=""
                          style={{
                            color:
                              sort.key === item.value &&
                              (sort.order === 1 ||
                                sort.order === "DESC")
                                ? "black"
                                : "grey",
                          }}
                          onClick={()=> sortData(item.value,"DESC")}>▼</p>
                      </div>
                    )
                  }
                  </div>
                </th>
              )
              )
             }
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
                actionData.map((data, index) => {
                  let createDate = moment(data?.createdat).format('YYYY-MM-DD');
                  let createTime = moment(data?.createdat).format('hh:mm A');
                   let actionOn;
                   switch (data.action_type) {
                     case "keyword":
                       actionOn = data.keywords;
                       break;
                     
                     case "category":
                       actionOn = data.category_name;
                       break;
                     case "campaign":
                       actionOn = data.campaign_name;
                       break
                     case "product":
                       actionOn = data.products;
                       break;
                   }

                  return (
                    <tr key={index}>
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
                          <div className="flex justify-center ">
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
                        <div className="flex justify-center items-center">
                          <div className="break-all text-center">
                            {actionOn}
                          </div>
                        </div>
                        {/* )} */}
                      </td>
                      <td>
                        {" "}
                        {data?.action_message ? (
                          <div className="flex text-center justify-center">
                            <div className="line-clamp-2 w-[110px]">
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
                        {/* {data?.status === "True" ? ( */}
                        <div className="flex justify-center items-center gap-3">
                          {data?.status == "true" || data?.status == "True" ? (
                            <span className="mr-2 text-green-400">Success</span>
                          ) : data?.status == "false" ||
                            data?.status == "False" ? (
                            <span className="mr-2 text-red-500">Failed</span>
                          ) : (
                            <span className="mr-2 text-orange-300">
                              Pending
                            </span>
                          )}

                          {/* <span
                            className=" border rounded py-1 px-2"
                            onClick={() => {
                              handleTrigger(data.action_id);
                            }}
                          >
                            <img
                              className="w-3 inline-block align-baseline cursor-pointer"
                              src="/assets/images/reload.png"
                              alt="reload"
                            />
                          </span> */}
                        </div>
                        {/* ) : (
                          <div className="flex justify-center items-center gap-3">
                            <span className="mr-2 text-red-500">Failed</span>
                            <span
                              className=" border rounded py-1 px-2"
                              onClick={() => {
                                handleTrigger(data.action_id);
                              }}
                            >
                              <img
                                className="w-3 inline-block align-baseline cursor-pointer"
                                src="/assets/images/reload.png"
                                alt="reload"
                              />
                            </span>
                          </div>
                        )}{" "} */}
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
            title="Action Details"
            smallsize
            setShowPopup={setDetailPopup}
            apply_button_css={true}
            platform="zepto"
            cutomButton={[
              {
                handleClick: () => {
                  setDetailPopup(false);
                },
                label: "OK",
                style: "bg-[#3C006B]",
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
