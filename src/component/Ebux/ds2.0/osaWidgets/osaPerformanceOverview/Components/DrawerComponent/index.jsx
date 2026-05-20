import React, { useState } from 'react'
import { IoIosClose } from "react-icons/io";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import DailyPerformance from './DailyPerformance';
import DrillDown from './DrillDown';
import CompetitionAnalysis from './CompetitionAnalysis';
import { useEbuxContext } from '../../../../../Context/EbuxProvider';
import { MdOutlineCategory } from 'react-icons/md';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


function DrawerComponent({ drawerInfo, onClose }) {

    const { kpi } = useEbuxContext();
    const [value, setValue] = React.useState(0);
    const [selectedRows, setSelectedRows] = useState({ selectedDates: [], selectedPlatform: [], selectedLocation: [], selectedProduct: [], selectedKeyword: [] });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleRemove1 = (type, value) => {
        console.log("check21", value)
        switch (type) {
            case "selectedDates":
                setSelectedRows((prev) => ({ ...prev, selectedDates: prev?.selectedDates?.filter(item => item.date !== (value?.date)) }))
                break;
            case "selectedPlatform":
                setSelectedRows((prev) => ({ ...prev, selectedPlatform: prev?.selectedPlatform?.filter(item => (item?.platform ?? item.name) !== (value?.platform || value?.name)) }))
                break;
            case "selectedLocation":
                setSelectedRows((prev) => ({ ...prev, selectedLocation: prev?.selectedLocation?.filter(item => (item?.location ?? item.name) !== (value?.location || value?.name)) }))
                break;
            case "selectedProduct":
                setSelectedRows((prev) => ({ ...prev, selectedProduct: prev?.selectedProduct?.filter(item => ((item?.product + item?.skuId) ?? item.name) !== ((value?.product + value?.skuId) ?? value.name)) }))
                break;
            case "selectedKeyword":
                setSelectedRows((prev) => ({ ...prev, selectedKeyword: prev?.selectedKeyword?.filter(item => (item?.keyword ?? item.name) !== (value?.keyword ?? value.name)) }))
                break;
            default:
                break;
        }
    };
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // console.log("selected details over here", { selectedDates, selectedLocation, selectedPlatform, selectedProduct });
    return (
        <>
            <div className="performanceDrawerBox">
                <div className="performanceDrawerHead shrink-0">
                    <button type="button" className="closeButton" onClick={onClose}>
                        <img src="/assets/images/drawerClose.svg" />
                    </button>
                    <h6 className="capitalize">{drawerInfo?.title}</h6>

                    {drawerInfo?.data?.value?<div className="flex items-center gap-2 bg-blue-50 py-1 px-3 rounded-md border border-blue-300">
                        <span className="text-xl">
                            {(drawerInfo?.data?.icon) ?
                                (drawerInfo?.data?.icon=="mother_pack" ? (<MdOutlineCategory className="w-6 h-6" alt={drawerInfo?.data?.value ?? ""} />):
                                (<img src={`/assets/images/${drawerInfo?.data?.icon}.svg`} alt={drawerInfo?.data?.value ?? ""} className="w-6 h-6" />))
                                : <></>
                            }</span>
                        <h3 className="font-bold">{drawerInfo?.data?.value}</h3>
                    </div>:""}
                </div>
                <div className="performanceDrawerContent flex flex-col flex-1 overflow-hidden">
                    <div className="bg-white px-3 py-2 bg-white rounded-2 flex gap-2 items-center">
                        <h6>Comprehensive Breakdown ({["selectedDates", "selectedPlatform", "selectedLocation", ...(["SOS", "OR"]?.indexOf(kpi) == -1 ? ["selectedProduct"] : [])].reduce((init, selected) => { return init + (selectedRows?.[selected]?.length ?? 0) }, 0)}) :</h6>
                        <div className="flex overflow-x-auto items-center gap-2 text-xs whitespace-nowrap">
                            {
                                Object.keys(selectedRows)?.map((selected) => (
                                    <>
                                        {selectedRows?.[selected]?.length > 0 && (
                                            <>
                                                {selectedRows?.[selected]?.length > 0 && (
                                                    <span className="font-semibold text-gray-500">
                                                        {(selected == "selectedDates") ?
                                                            "Dates"
                                                            :
                                                            (selected == "selectedPlatform") ?
                                                                "Platforms"
                                                                :
                                                                (selected == "selectedLocation") ?
                                                                    "Locations"
                                                                    :
                                                                    (selected == "selectedProduct") ?
                                                                        "Products"
                                                                        :
                                                                        (selected == "selectedKeyword") ?
                                                                        "Keywords"
                                                                        :
                                                                        ""}
                                                        ({selectedRows?.[selected]?.length}):</span>
                                                )}
                                                {selectedRows?.[selected]?.map((el, i) =>
                                                    el ?
                                                        (
                                                            <span
                                                                key={`${selected}-${i}`}
                                                                className="bg-[#E6F7FF] border border-[#91D5FF] px-2 py-1 rounded-full flex items-center"
                                                            >
                                                                {(selected == "selectedDates") ?
                                                                    formatDate(el?.date)
                                                                    :
                                                                    (selected == "selectedPlatform") ?
                                                                        <>{(el.platform || el.name)}</>
                                                                        :
                                                                        (selected == "selectedLocation") ?
                                                                            (el?.location || el?.name)
                                                                            :
                                                                            (selected == "selectedProduct") ?
                                                                                ((el?.product ?? el?.name) + "-" + el?.skuId)
                                                                                :
                                                                        (selected == "selectedKeyword") ?
                                                                            (el?.keyword || el?.name)
                                                                            : ""}
                                                                <IoIosClose
                                                                    size={16}
                                                                    className="cursor-pointer ml-1"
                                                                    onClick={() => handleRemove1(selected, el)}
                                                                />
                                                            </span>)
                                                        : null
                                                )}
                                            </>
                                        )}
                                    </>
                                ))
                            }

                        </div>
                    </div>
                    <div className="bg-white px-3 py-3 mt-2 rounded-md">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="drawer tabs"
                            textColor="primary"
                            indicatorColor="primary"
                        >
                            <Tab
                                label={
                                    <div className="flex items-center gap-1 text-md">
                                        Daily Performance
                                        <span
                                            className={`ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full 
                                            ${value === 0 ? "bg-[#E6F7FF]" : "bg-[#F0F0F0]"}`}
                                        >
                                            {["selectedDates"].reduce((init, selected) => { return init + (selectedRows?.[selected]?.length ?? 0) }, 0)}
                                        </span>
                                    </div>
                                }
                                {...a11yProps(0)}
                                sx={{ fontSize: "1rem", textTransform: "none", }}
                            />

                            {/* Tab 1 */}
                            <Tab
                                label={
                                    <div className="flex items-center gap-1 text-md">
                                        Drill Down
                                        <span
                                            className={`ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full 
                                             ${value === 1 ? "bg-[#E6F7FF]" : "bg-[#F0F0F0]"}`}
                                        >
                                            {["selectedPlatform", "selectedLocation", ...(["SOS", "OR"]?.indexOf(kpi)> -1 ? ["selectedKeyword"] : ["selectedProduct"])].reduce((init, selected) => { return init + (selectedRows?.[selected]?.length ?? 0) }, 0)}
                                        </span>
                                    </div>
                                }
                                {...a11yProps(1)}
                                sx={{ fontSize: "1rem", textTransform: "none" }}
                            />

                            {/* Tab 2 */}
                            <Tab
                                label={
                                    <div className="flex items-center gap-1 text-md">
                                        Competition Analysis
                                        <span
                                            className={`ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full 
                                           ${value === 2 ? "bg-[#E6F7FF]" : "bg-[#F0F0F0]"}`}
                                        >
                                            {[""].reduce((init, selected) => { return init + (selectedRows?.[selected]?.length ?? 0) }, 0)}
                                        </span>
                                    </div>
                                }
                                {...a11yProps(2)}
                                sx={{ fontSize: "1rem", textTransform: "none" }}
                            />
                        </Tabs>

                    </div>
                    <div className="flex-1 overflow-y-auto mt-2">
                    {value == 0 && <DailyPerformance data={drawerInfo?.data ?? {}} setSelectedRows={setSelectedRows} selectedRows={selectedRows}  />}
                    {value == 1 && <DrillDown data={drawerInfo?.data ?? {}} setSelectedRows={setSelectedRows} selectedRows={selectedRows} />}
                    {value == 2 && <CompetitionAnalysis data={drawerInfo?.data ?? {}} selectedRows={selectedRows}/>}
                </div>
                </div>
            </div >
        </>
    )
}

export default DrawerComponent