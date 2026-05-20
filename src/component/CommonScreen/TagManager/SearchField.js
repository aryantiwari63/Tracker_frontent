/* eslint-disable no-console */
/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import TagManagerContext from "../../../context/tagManagerContext";
import { _GET, _PATCH } from "../../../services/axios.method";
import { Headerbtn } from "../../common-components/headerButton/headerButton";
import DialogBox from "../../common-components/dialogBox.js";
import { DELETE_BULK_TAGS, GET_ALL_USERS, PERMISSIONS } from "../../../utils/constants.js";
import WhenPermitted from "../../common-components/WhenPermitted.js";
import { setToastMessageHandler } from "../../../redux/action-creator/commonAction.js";
import Toast from "../../common-components/toast";
import FilterDrawer from "./FilterDrawer.js";
import { defaultDateRange } from "../../../utils/helpers.js";
import { providedFilters, quickFilters } from "./utils.js";
import DatePickerModal from "../../CustomReport/OffscreenPages/DatePickerModal.js";
import { format } from "date-fns";

export default function SearchField({ setShowPopup, showPopup, blinkitAccounts, flipkartAccounts,
    amazonAccounts, zeptoAccounts, instamartAccounts
}) {
    const dateFilters = defaultDateRange();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
    const [platformFilters, setPlatformFilters] = useState(providedFilters);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(dateFilters["startDate"]),
        endDate: new Date(dateFilters["endDate"]),
        key: dateFilters["key"],
    });
    const { allTagsData, selectedCheckboxes, setIsCreatedOrUpdated, setSelectedCheckBoxes, setSearchTagName, searchTagName, filters, dispatch, setDeletedData, deletedData } = useContext(TagManagerContext);
    const _dispatch = useDispatch();
    const totalElements = Object.values(filters?.quickFilters).reduce(
        (total, array) => total + array.length,
        0
    );

    const handleDelete = async () => {
        const result = await _PATCH(DELETE_BULK_TAGS, deletedData);
        setIsCreatedOrUpdated(true);
        if (result?.status === 200) {
            _dispatch(setToastMessageHandler(result?.data?.status?.message, true));
            setTimeout(() => {
                setSelectedCheckBoxes([]);
                setDeletedData([]);
                setShowDeletePopup(false);
            }, 1000);
        } else {
            _dispatch(setToastMessageHandler(result?.data?.error?.message, false));
        }
    }

    const handleDeleteClose = () => {
        setShowDeletePopup(false);
    }

    function handleSearch(e) {
        setSearchTagName(e.target.value);
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await _GET(GET_ALL_USERS);
                const users = response.data.data.result.map((user, index) => ({
                    id: index,
                    parentTitle: 'Created_by',
                    parentKey: 'created_by',
                    title: `${user?.first_name} ${user?.last_name}`,
                    value: user.email

                }))
                setPlatformFilters((prevArray) =>
                    prevArray.map((item) =>
                        item.id === 2
                            ? {
                                ...item,
                                includedFilter: users,
                                searchedValue: users
                            }
                            : item
                    )
                );
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        })();

    }, []);

    const applyDate = (fromFilter) => {
        let data = fromFilter;
        data["ranges"] = {
            startDate: format(dateRange.startDate, "yyyy-MM-dd"),
            endDate: format(dateRange.endDate, "yyyy-MM-dd"),
        };
        dispatch({ type: "QUICK_FILTERS_DATE", value: data });
        setDateRange({
            startDate: new Date(dateFilters["startDate"]),
            endDate: new Date(dateFilters["endDate"]),
            key: dateFilters["key"],
        });
    };

    useEffect(() => {
        let accounts = [];
        if (Array.isArray(amazonAccounts)) {
            const amazonBrands = amazonAccounts.map(ele => ele.value);
            accounts.push(...amazonBrands)
        }
        if (Array.isArray(flipkartAccounts)) {
            const flipkartBrands = flipkartAccounts.map(ele => ele.value);
            accounts.push(...flipkartBrands)
        }
        if (Array.isArray(zeptoAccounts)) {
            const zeptoBrands = zeptoAccounts.map(ele => ele.value);
            accounts.push(...zeptoBrands)
        }
        if (Array.isArray(instamartAccounts)) {
            const instamartBrands = instamartAccounts.map(ele => ele.value);
            accounts.push(...instamartBrands)
        }
        accounts = [...new Set(accounts)];
        console.log('accounts', accounts);
        const filterOptions = accounts.map((ele, index) => ({
            id: index + 1, parentTitle: 'Accounts', parentKey: 'accounts', title: ele, value: ele
        }));
        setPlatformFilters((prevArray) =>
            prevArray.map((item) =>
                item.id === 4
                    ? {
                        ...item,
                        includedFilter: filterOptions,
                        searchedValue: filterOptions,
                    }
                    : item  
            )
        );

    }, [amazonAccounts, flipkartAccounts, zeptoAccounts, instamartAccounts])

    return (
        <>
            <Toast />
            <section className="flex flex-nowrap border bg-white mt-2 mb-10 py-2 justify-between">
                <div className="flex gap-1 items-center pl-4">
                    {!selectedCheckboxes.length ? (
                        <>
                            <WhenPermitted platform="dashboard" permission={PERMISSIONS.CREATE_EDIT_TAG}>
                            <Headerbtn
                                imgsrc="/assets/images/plus1.svg"
                                title="Create Tag"
                                onClick={() => {
                                    setShowPopup(!showPopup);
                                }}
                                btnStyle={{ width: '139px', marginTop: 0, paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
                                active={true}
                            />
                            </WhenPermitted>
                            <div className="w-[20rem]">
                                <div className="relative form-group show-right-border">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fa fa-search text-gray-400"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="input-search pl-10"
                                        placeholder="Search Tag"
                                        style={{ paddingLeft: '2.5rem', height: '37px', borderRadius:'5px' }}
                                        onChange={handleSearch}
                                        value={searchTagName}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>{selectedCheckboxes.length} Tag Selected:</div>
                           <WhenPermitted>
                            <Headerbtn
                                btnStyle={{ marginTop: 0, padding: '0.5rem', paddingRight: '1rem'}}
                                title="Delete"
                                onClick={() => {
                                    setShowDeletePopup(true);
                                }}
                            />
                            </WhenPermitted>
                        </>
                    )}
                </div>
                <div className="flex gap-4 mr-3">
                    <div className="py-2">Total number of tags: <span className="font-bold">{allTagsData.length}</span></div>
                    <div className="flex relative">
                        <img
                            className="w-6 inline-block align-baseline mr-1 cursor-pointer"
                            src="/assets/images/filterscustom.svg"
                            alt="filter"
                            onClick={() => setOpenFilterDrawer(true)}
                        />
                        {totalElements > 0 && (
                            <span
                                className={`absolute top-0 right-0 block h-4 w-4 text-xs rounded-full bg-[#0081F7] text-white flex items-center justify-center`}
                            >
                                {totalElements}
                            </span>
                        )}
                    </div>
                </div>
            </section>
            {
                showDeletePopup && <DialogBox
                    title="Confirmation"
                    buttonName="OK"
                    onAccept={handleDelete}
                    onCancel={handleDeleteClose}
                >
                    <i className="fal fa-times-circle text-red-500 text-lg mr-2"></i>
                    <span className="text-base">
                        Are you sure you want to delete the selected {selectedCheckboxes.length === 1 ? 'tag' : 'tags'} ({selectedCheckboxes.length})?
                    </span>

                </DialogBox>
            }
            {openFilterDrawer && (
                <FilterDrawer
                    setFilterDrawer={() => setOpenFilterDrawer(false)}
                    platformFilters={platformFilters}
                    setPlatformFilters={setPlatformFilters}
                    filters={filters["quickFilters"]}
                    calendar={filters['calendar']}
                    setQuickFilter={(value) => {
                        dispatch({ type: "QUICK_FILTERS", value })
                    }}
                    color="#0081F7"
                    platform="dashboard"
                    searchFieldRequired={false}
                />
            )}
            {filters?.calendar?.showCalendar && (
                <DatePickerModal
                    setQuickFilter={(value) =>
                        dispatch({ type: "QUICK_FILTERS", value })
                    }
                    calendar={filters["calendar"]}
                    dateRange={dateRange}
                    setDateRange={(item) => setDateRange(item?.selection)}
                    color='#0081F7'
                    onCancel={() =>
                        setDateRange({
                            startDate: new Date(dateFilters["startDate"]),
                            endDate: new Date(dateFilters["endDate"]),
                            key: dateFilters["key"],
                        })
                    }
                    applyDate={applyDate}
                />
            )}
        </>
    )
}