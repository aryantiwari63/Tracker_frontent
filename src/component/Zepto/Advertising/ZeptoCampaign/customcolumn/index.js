import React,{useState} from "react";
import CustomColOptionAms from "../../../../common-components/customdropdowntable/CustomColOptionAms";

const CustomColumn =()=>{
    const [showHeader, setShowHeader] = useState([
        // ...campaignSearchHeaders,
    ]);
    const [showFilter, setShowFilter] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [ShowTab, setShowTab] = useState("campaign");
    const applyFilter = React.useCallback(() => {
        setShowHeader(
          showHeader.map((checkbox) =>
            checkbox.checked === true
              ? { ...checkbox, showCol: true }
              : { ...checkbox, showCol: false }
          )
        );
        setShowFilter(false);
      }, [showHeader]);
      const cancelFilter = () => {
        setShowHeader([...showHeader]);
        setShowFilter(false);
      };
    return(
        <>
        <CustomColOptionAms 
        title="Customize column"
        setShowHeader={setShowHeader}
        showHeader={showHeader}
        applyFilter={applyFilter}
        cancelFilter={cancelFilter}
        setShowFilter={setShowFilter}
        showFilter={showFilter}
        platform={"blinkIt"}
        activeTab={ShowTab}
        />
        </>
    )
}

export default CustomColumn