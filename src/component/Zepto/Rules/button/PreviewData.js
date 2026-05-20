/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from "react";
import "./style.css";
import { GET_ACCOUNTS } from "../../../../utils/constants";
import { _GET } from "../../../../services/axios.method";
import _ from "lodash";

const PreviewData = ({
  rowData,
  emails,
  setEmails,
  validEmail,
  setValidEmail,
  hasPermission,
}) => {
  let currency = localStorage.getItem("currency");
  const [platform, setPlatform] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [timeData, setTimeData] = useState([]);

  let timeArray = [];

  const accountNames = async () => {
    try {
      // /  setLoading(true);
      const result = await _GET(GET_ACCOUNTS);
      const data = result.data.data.result;
      const accounts = data.map((item) => ({
        // label: item._id.account,
        value: item._id.account,
        // account_id: item._id.account_id,
        platform_id: item._id.platform_id,
      }));

      const values = rowData?.platform_id.map((platformId) => {
        const account = accounts.find(
          (account) => account.platform_id === platformId
        );
        return account?.value;
      });
      setPlatform(values);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    accountNames();
  }, []);
  // console.log(rowData, "<< row Data");
  let masterArray = [];

  useEffect(() => {
    const capitalizeCondition = (condition) => {
      return condition
        .replace(/_/g, " ")
        .toLowerCase()
        .split(" ")
        .map((word) => (word.length === 3 ? word.toUpperCase() : word))
        .join(" ");
    };

    const mapConditionToWords = (x) => {
      switch (x.conditionType) {
        case "greater_than":
          return "exceeds";
        case "smaller_than":
          return "subceeds";
        case "range":
          return "is in between";
        case "is_not_in_range":
          return "isn't between";
        default:
          return null;
      }
    };

    const mapConditionValues = (x) => {
      if (
        x?.conditionType === "range" ||
        x?.conditionType === "is_not_in_range"
      ) {
        return `${x?.less}-${x?.greater} `;
      } else if (x?.conditionType === "smaller_than") {
        return `${x.less} `;
      } else {
        return `${x?.greater}`;
      }
    };

    const mapCustomSchedule = (customSchedule, targetArray) => {
      if (!customSchedule) {
        targetArray.push("every two hours");
      } else {
        if (customSchedule.custom_type === "Weekly") {
          customSchedule.schedule_time.map((x, index) => {
            targetArray.push(`every ${x.custom_day} at`);
            addTimeDetails(targetArray, x);

            if (index === customSchedule.schedule_time.length - 2) {
              targetArray.push("and");
            }
            if (index > 0 && index < customSchedule.schedule_time.length - 1) {
              targetArray.push(",");
            }
          });
        } else {
          customSchedule.schedule_time.map((x, index) => {
            targetArray.push(`on ${x.custom_date}`);
            addTimeDetails(targetArray, x);

            if (index === customSchedule.schedule_time.length - 2) {
              targetArray.push("and");
            }
            if (index > 0 && index < customSchedule.schedule_time.length - 1) {
              targetArray.push(",");
            }
          });
        }
      }
    };

    const addTimeDetails = (targetArray, schedule) => {
      for (let i = 1; i <= 4; i++) {
        const startTime = schedule[`start_time${i}`];
        if (startTime !== "00:00") {
          targetArray.push(`${String(startTime).padStart(2, "0")}:00`);
        }
      }
    };
    const formatActionString = (actionString, targetArray) => {
      targetArray.push(
        actionString
          .split(/(?=[A-Z])/)
          .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
          .join(" ")
      );
    };

    const addItemsToMasterArray = (items, prefix, suffix, separator = ",") => {
      if (items?.length > 0) {
        masterArray.push(prefix);
        items?.forEach((item, index) => {
          masterArray.push(item);
          if (index === items?.length - 2) {
            masterArray.push("and");
          } else if (index < items?.length - 1) {
            masterArray.push(separator);
          }
        });
        masterArray.push(suffix);
      }
    };

    if (rowData?.rule_conditions?.length > 0) {
      rowData?.rule_conditions?.map((rule) => {
        masterArray.push("When");

        masterArray.push("For ");

        addItemsToMasterArray(rowData?.campaign_type, "", "", ",");

        masterArray.push(`${rowData?.entity.toLowerCase()}s : when`);
        rule?.map((x, index) => {
          masterArray.push(capitalizeCondition(x?.conditionCategory));

          if (index > 0 && index < rule?.length - 1) {
            masterArray.push(",");
          }
          if (index === rule.length - 2) {
            masterArray.push("and");
          }
        });

        // rowData?.platform.map((x, index) => {
        //   {
        //     if (index === 0) {
        //       masterArray.push("on");
        //     }

        //     x === "MP"
        //       ? masterArray.push("marketplace")
        //       : x === "SM"
        //       ? masterArray.push("supermart")
        //       : x;

        //     if (index === rowData?.platform.length - 2) {
        //       masterArray.push("and");
        //     }
        //   }
        // });
        {
          rowData?.tags?.length > 0 &&
            rowData.tags?.map((x, index) => {
              if (index === 0) {
                masterArray.push("tagged as");
              }
              masterArray.push(x.label);
              if (index === rowData.tags.length - 2) {
                masterArray.push("and");
              }
            });
        }
        rule?.map((x, index) => {
          const conditionWord = mapConditionToWords(x);
          const conditionValue = mapConditionValues(x);

          conditionWord && masterArray.push(conditionWord);
          conditionValue && masterArray.push(conditionValue);

          if (index === rule.length - 2) {
            masterArray.push("and");
          }
        });
        if (rule.length > 1) {
          masterArray.push("respectively");
        }
        masterArray.push(", automatically");
        const actionString = rowData?.action;
        formatActionString(actionString, masterArray);
        // Add budget details if conditions are met
        if (rowData?.budget_amount !== 0 || rowData?.budget_percent !== 0) {
          rowData?.budget_amount !== 0 &&
            masterArray.push(`by ${currency} ${rowData?.budget_amount}.`);
          rowData?.budget_percent !== 0 &&
            masterArray.push(`${rowData?.budget_percent}%.`);
        } else if (rowData?.action !== "SendNotificationOnly") {
          masterArray.push(`the ${rowData?.entity.toLowerCase()}s.`);
        }
      });
      timeArray.push("This rule undergoes validation");
      const customScheduleDetails = rowData?.custom_schedule;
      mapCustomSchedule(customScheduleDetails, timeArray);
      masterArray.push(".");
      timeArray.push("Time range considered for these");
      // console.log(rowData?.campaign_type, "<<<<<<<< console");
      // addItemsToMasterArray(rowData?.campaign_type, "", "", ",");

      timeArray.push(`${rowData?.entity.toLowerCase()}s`);

      timeArray.push("is since");
      if (rowData?.time_range === "Maximum") {
        timeArray.push("lifetime");
      } else {
        timeArray.push(`last ${rowData?.time_range} days`);
      }
      timeArray.push(`of the ${rowData?.entity.toLowerCase()}s.`);
    } else {
      if (rowData?.rule_conditions !== null) {
        rowData?.rule_conditions?.map((rule) => {
          masterArray.push("When");
          rule?.map((x, index) => {
            masterArray.push(capitalizeCondition(x?.conditionCategory));

            if (index > 0 && index < rule?.length - 1) {
              masterArray.push(",");
            }
            if (index === rule.length - 2) {
              masterArray.push("and");
            }
          });
          // platform.map((x, index) => {
          //   if (index === 0) {
          //     masterArray.push("For");
          //   }

          //   if (index > 0 && index < platform?.length - 1) {
          //     masterArray.push(",");
          //   }
          //   masterArray.push(x);
          //   if (index === platform.length - 2) {
          //     masterArray.push("and");
          //   }
          // });

          addItemsToMasterArray(rowData?.campaign_type, "", "", ",");

          masterArray.push(`${rowData?.entity.toLowerCase()}s`);

          // rowData?.platform.map((x, index) => {
          //   {
          //     if (index === 0) {
          //       masterArray.push("on");
          //     }

          //     x === "MP"
          //       ? masterArray.push("marketplace")
          //       : x === "SM"
          //       ? masterArray.push("supermart")
          //       : x;

          //     if (index === rowData?.platform.length - 2) {
          //       masterArray.push("and");
          //     }
          //   }
          // });
          {
            rowData?.tags?.length > 0 &&
              rowData.tags?.map((x, index) => {
                if (index === 0) {
                  masterArray.push("tagged as");
                }
                masterArray.push(x.label);
                if (index === rowData.tags.length - 2) {
                  masterArray.push("and");
                }
              });
          }
          masterArray.push(", automatically");
          const actionString = rowData?.action;
          formatActionString(actionString, masterArray);
          // Add budget details if conditions are met
          if (rowData?.budget_amount !== 0 || rowData?.budget_percent !== 0) {
            rowData?.budget_amount !== 0 &&
              masterArray.push(`by ${currency} ${rowData?.budget_amount}`);
            rowData?.budget_percent !== 0 &&
              masterArray.push(`${rowData?.budget_percent}%`);
          } else if (rowData?.action !== "SendNotificationOnly") {
            masterArray.push(`the ${rowData?.entity.toLowerCase()}s.`);
          }
          masterArray.push(".");
          masterArray.push("This rule underegoes validation");
          const customScheduleDetails = rowData?.custom_schedule;
          mapCustomSchedule(customScheduleDetails, masterArray);
          masterArray.push(".");
          masterArray.push("Time range considered for these");
          addItemsToMasterArray(rowData?.campaign_type, "", "", ",");

          masterArray.push(`${rowData?.entity.toLowerCase()}s`);

          masterArray.push("is since");
          if (rowData?.time_range === "Maximum") {
            masterArray.push("lifetime");
          } else {
            masterArray.push(`last ${rowData?.time_range} days`);
          }
          masterArray.push(`of the ${rowData?.entity.toLowerCase()}s.`);
        });
      } else {
        masterArray.push("for ");

        addItemsToMasterArray(rowData?.campaign_type, "", "", ",");

        masterArray.push(`${rowData?.entity.toLowerCase()}s`);

        // rowData?.platform.map((x, index) => {
        //   {
        //     if (index === 0) {
        //       masterArray.push("on");
        //     }

        //     x === "MP"
        //       ? masterArray.push("marketplace")
        //       : x === "SM"
        //       ? masterArray.push("supermart")
        //       : x;

        //     if (index === rowData?.platform?.length - 2) {
        //       masterArray.push("and");
        //     }
        //   }
        // });
        {
          rowData?.tags?.length > 0 &&
            rowData.tags?.map((x, index) => {
              if (index === 0) {
                masterArray.push("tagged as");
              }
              masterArray.push(x.label);
              if (index === rowData.tags.length - 2) {
                masterArray.push("and");
              }
            });
        }
        masterArray.push(", automatically");
        const actionString = rowData?.action;
        formatActionString(actionString, masterArray);
        // Add budget details if conditions are met
        if (rowData?.budget_amount !== 0 || rowData?.budget_percent !== 0) {
          rowData?.budget_amount !== 0 &&
            masterArray.push(`by ${currency} ${rowData?.budget_amount}`);
          rowData?.budget_percent !== 0 &&
            masterArray.push(`${rowData?.budget_percent}%`);
        } else if (rowData?.action !== "SendNotificationOnly") {
          masterArray.push(`the ${rowData?.entity.toLowerCase()}s.`);
        }
        masterArray.push(".");
        masterArray.push("This rule underegoes validation");
        const customScheduleDetails = rowData?.custom_schedule;
        mapCustomSchedule(customScheduleDetails, masterArray);
        masterArray.push(".");
        masterArray.push("Time range considered for these");
        addItemsToMasterArray(rowData?.campaign_type, "", "", ",");

        masterArray.push(`${rowData?.entity.toLowerCase()}s`);

        masterArray.push("is since");
        if (rowData?.time_range === "Maximum") {
          masterArray.push("lifetime");
        } else {
          masterArray.push(`last ${rowData?.time_range} days`);
        }
        masterArray.push(`of the ${rowData?.entity.toLowerCase()}s.`);
      }
    }

    let joinedData = masterArray.join(" ").split("When");

    setPreviewData(joinedData);
    setTimeData(timeArray);
    // console.log(masterArray, "<< master array", previewData, "Preview data");
  }, [platform]);

  const handleEmailChange = (e, c) => {
    let newEmailArray = emails;
    newEmailArray[c] = e.target.value;
    setEmails([...newEmailArray]);
  };

  const validateEmail = (e, index) => {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(e.target.value) || e.target.value == "") {
      let newValid = validEmail;
      validEmail[index] = true;
      setValidEmail([...newValid]);
    } else {
      let newValid = validEmail;
      validEmail[index] = false;
      setValidEmail([...newValid]);
    }
  };

  return (
    <>
      <div className="modal-body ams_modal ">
        <div className="preview-data-body-wrap ">
          <div
            className="flex preview-condition-box"
            style={{ flexWrap: "wrap" }}
          >
            {" "}
            {previewData?.map((x, index) => (
              <p className="mr-1  mb-1" key={index}>
                {rowData?.rule_conditions !== null ? (
                  index !== 0 && <p>{x}</p>
                ) : (
                  <p>When {x}</p>
                )}
              </p>
            ))}
            {timeData &&
              timeData?.map((x) => (
                <p className="mr-1  " key="">
                  {x}
                </p>
              ))}
          </div>
          <ul className="preview-rule mt-4 ">
            <li className="">
              <b>Rule Name : </b>
              <span>{rowData?.rule_name}</span>
            </li>
            <li>
              <b>Status : </b>
              <span>{rowData?.is_active ? "Enabled" : "Disabled"}</span>
            </li>
            {/* <li>
              <b>Platform: </b>
              {rowData.platform === "MP" ? (
                <span>Marketplace</span>
              ) : (
                <span>Flipkart</span>
              )}
            </li> */}
            <li>
              <b>Campaign Type : </b>
              <span>{rowData?.campaign_type.toString()}</span>
            </li>
            <li>
              <b>Apply To : </b>
              <span>{rowData?.entity}</span>
            </li>
            {/* <li>
              <b>Apply Rule on : </b>
              <span></span>
            </li> */}
            <li>
              <b>Action : </b>
              <span>
                {rowData?.action
                  .split(/(?=[A-Z])/)
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
            </li>
            {/* {rowData?.emails !== null && (
                <><b>Increase budget percent by : </b><>{rowData?.emails.map((item, index) => (    <input
                key={index}
                  value={item}/>
                ))}
                </></>
                
              
            )} */}
            {rowData?.time_range !== null && (
              <li>
                <b>Time range : </b>
                <span>
                  {rowData?.time_range == "Maximum"
                    ? rowData?.time_range
                    : rowData?.time_range + " days"}
                </span>
              </li>
            )}

            <li>
              <b>Schedule : </b>
              <span>{rowData?.schedule}</span>
            </li>

            {rowData?.budget_amount !== null && (
              <li>
                <b>Increase budget amount by : </b>
                <span>
                  {currency}
                  {rowData?.budget_amount}
                </span>
              </li>
            )}

            {rowData?.budget_percent !== null && (
              <li>
                <b>Increase budget percent by : </b>
                <span>{rowData?.budget_percent} %</span>
              </li>
            )}
            {rowData?.tags.length !== 0 && (
              <div className="flex">
                {" "}
                <li>
                  <b>Tags : </b>
               
                {rowData?.tags.map((item, index) => (
                  <span key={item.value}>
                     <span>{item.label}</span>
                    {index > 0 && ", "}
                   
                  </span>
                ))}
                 </li>
              </div>
            )}
          </ul>

          <div className="">
            <h4>Emails</h4>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[...new Array(hasPermission ? 5 : _.size(emails))].map((i, index) => {
                return (
                  <div key={index}>
                    <input
                      onBlur={(e) => validateEmail(e, index)}
                      onChange={(e) => handleEmailChange(e, index)}
                      value={emails[index]}
                      type="email"
                      id="email"
                      className="mt-1 col-span-3  h-[36px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="john.doe@company.com"
                      required
                      disabled={!hasPermission}
                    />
                    {validEmail[index] == false && (
                      <p className="text-red-500 text-[11px]">
                        Please enter a valid email address
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {rowData?.schedule == "Custom" && (
            <table className="rules-table table-container mb-4">
              <thead className="">
                <tr className="text-left">
                  {rowData?.custom_schedule?.custom_type === "Datewise" ? (
                    <th className="">Date</th>
                  ) : (
                    <th className="">Day</th>
                  )}
                  <th>Timing 1</th>
                  <th>Timing 2</th>
                  <th>Timing 3</th>
                  <th>Timing 4</th>
                </tr>
              </thead>
              <tbody>
                {rowData.custom_schedule.schedule_time.map((item, index) => (
                  <tr className="custom_time" key={index}>
                    {rowData?.custom_schedule?.custom_type === "Datewise" ? (
                      <td className="">{item.custom_date}</td>
                    ) : (
                      <td className="">{item.custom_day}</td>
                    )}
                        {item.start_time1 !== "00:00" ? (
                      <td>{String(item.start_time1).padStart(2, "0")}:00</td>
                    ) : (
                      <td>--</td>
                    )}{" "}
                    {item.start_time2 !== "00:00" ? (
                      <td>{String(item.start_time2).padStart(2, "0")}:00</td>
                    ) : (
                      <td>--</td>
                    )}
                    {item.start_time3 !== "00:00" ? (
                      <td>{String(item.start_time3).padStart(2, "0")}:00</td>
                    ) : (
                      <td>--</td>
                    )}{" "}
                    {item.start_time4 !== "00:00" ? (
                      <td>{String(item.start_time4).padStart(2, "0")}:00</td>
                    ) : (
                      <td>--</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {rowData?.rule_conditions?.length > 0 &&
            rowData.rule_conditions[0].length > 0 &&
            rowData.rule_conditions.map((conditionGroup, groupIndex) => (
              <div className="preview-condition-box" key={groupIndex}>
                <h4>Condition {groupIndex + 1}</h4>
                <ul className="preview-rule">
                  <li>
                    <b>Action & Condition :</b>
                    <span>
                      {conditionGroup?.map((condition, conditionIndex) => (
                        <React.Fragment key={conditionIndex}>
                          {conditionIndex > 0 && <br />}
                          {conditionIndex > 0 && <span>AND</span>}
                          (if {condition.conditionCategory} is{" "}
                          {condition.conditionType === "greater_than"
                            ? "Greater than"
                            : condition.conditionType === "smaller_than"
                            ? "Smaller than"
                            : condition.conditionType === "range" ||
                              condition.conditionType === "is_not_in_range"
                            ? "Between"
                            : null}{" "}
                          {condition?.conditionType === "range" ||
                          condition?.conditionType === "is_not_in_range"
                            ? `${condition?.less}-${condition?.greater}`
                            : condition?.conditionType === "smaller_than"
                            ? `${condition?.less}`
                            : condition?.greater}
                          )
                        </React.Fragment>
                      ))}
                    </span>
                  </li>
                </ul>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default PreviewData;
