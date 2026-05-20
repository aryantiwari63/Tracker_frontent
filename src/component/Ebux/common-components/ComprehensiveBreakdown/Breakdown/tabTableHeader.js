
const TabTableHeader=({ tabPosition,selectedTabKey,selectedTableRows, setSelectedTableRows,setCombinedState,openMultipleInDrawer,handleColumnClick })=>{


    
    const clearAll = (column) => {
        setSelectedTableRows((prevFilters) => {
            const updatedFilters = {
                ...prevFilters,
                [column]: [],
            };

            setCombinedState((prevFilters) => ({
                ...prevFilters,
                _selectedTableRows: {
                    ...prevFilters?._selectedTableRows,
                    ...updatedFilters
                }
            }));

            return updatedFilters;
        });
    }

    const removeItem = (column, item) => {
        setSelectedTableRows((prevFilters) => {
            const updatedFilters = {
                ...prevFilters,
                [column]: prevFilters?.[column]?.filter((rowIndex) => rowIndex?.value !== item?.value)
            };


            setCombinedState((prevFilters) => ({
                ...prevFilters,
                _selectedTableRows: {
                    ...prevFilters?._selectedTableRows,
                    ...updatedFilters
                }
            }));

            return updatedFilters;
        });
    }



    return (
        <div className="tblHeadCatWrap">
                <div className="tblHeadCatBoxWrap">

                    <div className="tblHeadCatBox">
                        {tabPosition&&tabPosition?.map((tab, i) => (
                            <div className='tblHeadCatBoxCol' key={i}>
                                <h4 className={selectedTabKey == tab?.value?.toLowerCase() ? `catTxtBlue` : `catTxtBlack `} //cursor-pointer
                                    onClick={() => {
                                        if (selectedTabKey != tab?.value?.toLowerCase()) {
                                            handleColumnClick(tab?.value?.toLowerCase());
                                        }
                                    }} key={i}>{(selectedTableRows?.[tab?.value?.toLowerCase()] ?? []).length} Selected {tab?.value}:</h4>

                                {(selectedTableRows?.[tab?.value?.toLowerCase()] ?? []).length > 0 ? (
                                    <div className="tblHeadCatTagWrap" key={`${i}-TagWrap`}>
                                        {selectedTableRows?.[tab?.value?.toLowerCase()]?.length > 1 &&
                                            <button type="button" className="clearClose" onClick={() => clearAll(tab?.value?.toLowerCase())}>Clear all {tab?.value}</button>
                                        }


                                        {selectedTableRows?.[tab?.value?.toLowerCase()]?.map((item, i) => (
                                            <div className="tblHeadCatTag" key={i}>
                                                {item?.lable} <img className="cursor-pointer mr-[5px]" src="/assets/images/crossIcon.svg" width={14} height={14} onClick={() => removeItem(tab?.value?.toLowerCase(), item)} />
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        ))}

                    </div>

                </div>
                {selectedTabKey!="banner"?
                <div className="tblHeadCatBoxIcon">
                    <button type="button" onClick={() => openMultipleInDrawer(selectedTabKey)}><img src="/assets/images/graphIcon.svg" width={18} height={18} /></button>
                </div>
                :<></>}
            </div>
    );
}
export default TabTableHeader;