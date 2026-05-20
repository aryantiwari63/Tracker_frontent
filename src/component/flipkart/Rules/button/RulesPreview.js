import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { _POST } from "../../../../services/axios.method";
import { GET_RULES_PREVIEW, UPDATE_RULES_PREVIEW, PERMISSIONS } from "../../../../utils/constants";
import "./style.css";
import { campaignHeaders, adgroupHeaders, keywordHeaders, fsnHeaders } from "../../../../utils/rulesConstants"
import LoaderSpinner from "../../../common-components/loader-spinner";
import Popup from "../../../common-components/Popups/Popup";
import {
    setToastMessageHandler,
  } from "../../../../redux/action-creator/commonAction";

const RulesPreview = ({ ruleId, accountsData, setShowPopup, showPopup, getRulesApi }) => {
    const dispatch = useDispatch();
    const [resultData, setresultData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [headers, setHeaders] = useState([]);
    const [selected, setSelected] = useState([]);
    const [disable, setDisable] = useState(true);
    const userPermissions = useSelector(
        (state) => state?.permissionsReducer || []
      );
    const hasPermission = _.find(userPermissions, {
        permission_name: PERMISSIONS.CREATE_RULE,
        platform: 'flipkart',
      });    
    const rpaData = async () => {
        try {
            setLoading(true);
            const result = await _POST(`${GET_RULES_PREVIEW}`, {
                ruleData: ruleId,
            });
            setLoading(false);
            setresultData(result.data.data.result);
            if (!ruleId.selected) {
                const ids = result.data.data.result.map((item) => item.id)
                setSelected([...ids])
            }
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
     if(ruleId.selected) {
        if(JSON.stringify(ruleId.selected) != JSON.stringify(selected)) setDisable(false)
        else {
            setDisable(true)
        }
     }
     else {
        if(selected?.length != resultData?.length) setDisable(false)
        else {
            setDisable(true)
        }
     }
    }, [selected])

    useEffect(() => {
        if (ruleId.selected) {
            setSelected([...ruleId.selected])
        }

        if (ruleId.entity == 'Campaign') {
            setHeaders(campaignHeaders);
        }
        if (ruleId.entity == 'AdGroup') {
            setHeaders(adgroupHeaders);
        }
        if (ruleId.entity == 'Keyword') {
            setHeaders(keywordHeaders);
        }

        if (ruleId.entity == 'FSN') {
            setHeaders(fsnHeaders);
        }

        rpaData();
    }, []);

    const handleCheckboxChange = (checked, id) => {
        if (checked) {
            setSelected((selected) => [...selected, id]);
        } else {
            setSelected((selected) =>
                selected.filter((item) => item != id)
            );
        }
    };

    const handleUpdate = async() => {
        try {
           await _POST(`${UPDATE_RULES_PREVIEW}`, {
                id: ruleId.id,
                selected: selected
            });
            dispatch(
                setToastMessageHandler(`Rule ${ruleId.rule_name} updated successfully!`, true)
              );
           await getRulesApi();
        }
        catch(error) {
            console.error(error)
        }
    }

    const handleAllCheckBox = (e) => {
        // checked state of the checkbox
        const isChecked = e.target.checked;
        // if the checkbox is selected, add the data to the previous selectedData array
        if (isChecked) {
            let ids = resultData?.map(function (obj) {
                return obj.id;
            });
            setSelected(ids)
        } else {
            setSelected([])
        }
    };
    function getCustomButton() {
        const customButton = [
            {
                handleClick: () => setShowPopup(!showPopup),
                label: "Cancel",
                style: "bg-white text-black border",
            },
        ]
        if (hasPermission) {
            customButton.push({
                handleClick: () => handleUpdate(),
                label: "Save Changes",
                style: `${disable ? " text-white font-semibold py-2 px-4  opacity-50 cursor-not-allowed" : "text-white"} border rounded bg-blue-500`,
                disabled: disable 
            });
        } 
        return customButton;   
    }
    return (

        <Popup
            title={`Preview of ${ruleId.rule_name} rule Changes - ${ruleId?.action
                .split(/(?=[A-Z])/)
                .map(
                    (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1)
                )
                .join(" ")}`}
            setShowPopup={setShowPopup}
            apply_button_css={true}
            applyAction={() => handleUpdate()}
            cutomButton={getCustomButton()}
        > <><div style={{ maxHeight: 'inherit' }} className="relative overflow-x-auto shadow-md sm:rounded-lg overflow-scroll">
            <div><table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="p-[1.1rem]" style={{ minWidth: '40px' }}>
                            <div className="flex items-center">
                                <input checked={resultData?.length == selected?.length && resultData?.length > 0} onChange={(e) => { handleAllCheckBox(e) }} id="checkbox-all" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" disabled={!hasPermission} />
                                <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                            </div>
                        </th>
                        {headers && headers.map((item, index) => (
                            <th key={index} scope="col" style={{
                                position: 'sticky',
                                top: '0px', left: '0'
                            }} className="pl-4 pr-6 py-3">
                                {item.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                {loading ? (
                    <tbody>
                        <tr>
                            <td colSpan="4">
                                <LoaderSpinner />
                            </td>
                        </tr>
                    </tbody>
                ) : (
                    <tbody>{
                        resultData && resultData?.length > 0 ? 
                         resultData.map((item, index) => (<tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="w-4 p-4">
                                <div className="flex items-center">
                                    <input onChange={(e) => { handleCheckboxChange(e.target.checked, item.id) }} checked={selected?.includes(item?.id)} id="checkbox-table-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" disabled={!hasPermission} />
                                    <label htmlFor="checkbox-table-1" className="sr-only">checkbox</label>
                                </div>
                            </td>


                            {headers && headers.map((item1, index1) => {
                                if (item1.value == 'platform_id') {
                                    return (
                                        <td key={index1} className="px-6 py-4 text-left">
                                            {accountsData.find(x => x.platform_id ?  x.platform_id === item.platform_id : x.value == item.profile_id).label}
                                        </td>
                                    )
                                }
                                if (item1.value == 'platform') {
                                    return (
                                        <td key={index1} className="px-6 py-4 text-left">
                                            {item.platform ? item.platform : "Amazon"}
                                        </td>
                                    )
                                }
                                else {
                                    return (<td key={index1}  style={{
                                        position: index1 == '0' ? 'sticky' : '',
                                        top: '0px', left: '0', minWidth: "200px"
                                    }} scope="row" className=" px-6 py-4 font-medium text-gray-900 dark:text-white text-left">
                                        {item[item1.value]}
                                    </td>)
                                }
                            })}

                        </tr>)) : (
                <tr>
                  <td
                    className="p-2"
                    colSpan={10}
                    rowSpan={2}
                    style={{ alignItems: "center", verticalAlign: "middle" }}
                  >
                    <div className="loaderStyle  row sticky font-semibold">
                      {`No ${ruleId.entity} Found`}
                    </div>
                  </td>
                </tr>
              )} 
                    </tbody>)}
            </table>

            </div>
        </div>
            </>
        </Popup>
    );
};

export default RulesPreview;
