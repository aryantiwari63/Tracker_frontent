import React, { useEffect,  useState } from "react";
// import { FILTERACTION } from "../MultiFilter/FilterConstant";
// import { useEbuxContext } from "../../Context/EbuxProvider";
import MultiFilter from "../MultiFilter/MultiFilter";

const TagMultiFilter = ({
  arr = [],
  // additionalFilter = [],
  defaultValue = false,
  savedSearch = {},
  handleSaveFilters = false,
  applySearchFilter = false,
  platform = "ams",
  hasCancel= true, 
}) => {

    // const {
    //   filters, kpi,activeClientProject } = useEbuxContext();

    // const {tagList} = useEbuxContext();
    const [filterData, setFilterData] = useState([]);
 


  useEffect(() => {
    // if (tagList.length > 0) {
      
    //   let tag = {
    //     key: "tag",
    //     label: "Tag",
    //     selectable: false,
    //     children: []
    //   }; 

    //   tag["children"] = tagList.map((tagItem,_k) => ({
    //         label: tagItem?.tag_name,
    //         key: `tag-${tagItem?.id}-${tagItem?.tag_name}-${_k}}`,
    //         data: `Tag-${tagItem?.id}-${tagItem?.tag_name}`,    
    //         action: FILTERACTION.APPLY,
    //   }))

    //     const finalFilterData = [ ...arr, tag]
        
    //     setFilterData(finalFilterData);
    //   }else{        
    //     setFilterData([...arr]);
    //   }
    setFilterData([...arr])
  }, [JSON.stringify(arr)]);




  return (
    <MultiFilter hasCancel={hasCancel} filterData={filterData} applySearchFilter={applySearchFilter} handleSaveFilters={handleSaveFilters} savedSearch={savedSearch} defaultValue={defaultValue} platform={platform} />
  );
};

export default TagMultiFilter;
