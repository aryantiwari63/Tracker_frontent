import React, { useEffect, useState } from "react";
import Popup from "../../common-components/Popups/Popup";
import { useDispatch } from "react-redux";
import {
    setLoading,
    setToastMessageHandler,
} from "../../../redux/action-creator/commonAction";
import { MultiSelect } from "react-multi-select-component";
import { AMAZON_ACCOUNTS, AMAZON_BUYBOX_ACCOUNTS } from "../../../utils/amazonConstants";
import { _GET, _POST } from "../../../services/axios.method";
import { AMAZON_BUYBOX } from "../../../utils/constants";

const BuyBoxPopup = ({ setOpenState }) => {
    const [accountsData, setAccountsData] = useState([]);
    const [accountRuleError, setAccountRuleError] = useState(false);
    const [platformId, setPlatformId] = useState([]);
    const dispatch = useDispatch();

    const accountNames = async () => {
        try {
            setLoading(true);
            const responseAccount = await _GET(AMAZON_ACCOUNTS);
            const buyBoxSelectedAccounts = await _GET(AMAZON_BUYBOX_ACCOUNTS);
            const buyBoxPlatformId = buyBoxSelectedAccounts.data.data.platform_id;
            const data = responseAccount.data.data;
            const accounts = data.map((item) => ({
                label: item.label,
                value: item.value,
            }));
            if (buyBoxPlatformId && buyBoxPlatformId.length > 0) {
                const selectedAccounts = accounts.filter(account =>
                    buyBoxPlatformId.includes(account.value)
                );
                setPlatformId(selectedAccounts);
            }
            setLoading(false);
            setAccountsData(accounts);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        accountNames();
    }, []);

    const handleSelectedAccounts = (selected) => {
        setAccountRuleError(false);
        setPlatformId(selected);
    };

    const handleBuyBox = () => {
        try {
            if (platformId.length < 1) {
                setAccountRuleError(true);
                setOpenState(true);
                return;
                // eslint-disable-next-line no-dupe-else-if
            } else {
                let accounts = [];
                platformId.map((item) => {
                    accounts.push(item.value);
                });

                let data = {
                    platformId: accounts,
                    media_type: "amazon",
                };

                createRuleAPI(data);
                // setShowDialog(true);
                setOpenState(false);
                dispatch(
                    setToastMessageHandler(`Buy Box action performed successfully!`, true)
                );
            }
        } catch (error) {
            console.error(error);
        }
    };
    const createRuleAPI = async (data) => {
        try {
            setLoading(true);
            await _POST(AMAZON_BUYBOX, data);

            setLoading(false);

        } catch (error) {
            console.error(error);
        }
    };


    const accountOptions =
        accountsData && accountsData.length > 0
            ? accountsData.map((item) => ({
                label: item.label,
                value: item.value,
            }))
            : [];

    return (
        <div>
            <Popup
                title="Create Buy Box"
                setShowPopup={setOpenState}
                platform="ams"
                applyAction={() => handleBuyBox()}
                smallsize={true}
            >
                <div className="pl-4 pr-3 h-[10em]">
                    <div className="flex">
                        <img src="/assets/images/red-info.svg" alt="" />
                        <div className="text-red-700 pl-1">
                            All ASINs of P1 seller will be paused when they are out of stock in the selected accounts</div>
                    </div>
                    <div className=" flex mt-2">
                        <div className=" text-[13px] w-1/2">
                            <label className="pl-1" htmlFor="">
                                Select Accounts
                            </label>
                            <label className="text-red-500">*</label>
                            {/* <br /> */}

                            <MultiSelect
                                options={accountOptions}
                                value={platformId}
                                onChange={handleSelectedAccounts}
                                labelledBy="Select Account"
                                ClearSelectedIcon={null}
                                disableSearch={true}
                                className="z-10"
                            />
                            {accountRuleError == true && (
                                <p className="text-red-500 text-[11px]">
                                    Account is a required field
                                </p>
                            )}
                        </div>
                    </div>
                    
                </div>
            </Popup>
        </div>
    )
};

export default BuyBoxPopup;