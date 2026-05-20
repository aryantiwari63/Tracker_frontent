/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineDragIndicator } from "react-icons/md";
import Loader from "../Loader";
import TagMultiFilter from "./TagMultiFilter";
import { getAllTag, deleteSelectedTag } from "../../services/tag.service";
import CreateTagPopup from "./CreateTagPopup";
import TagManagerTable from "./TagManagerTable";
import { useEbuxContext } from "../../Context/EbuxProvider";
import { FILTERACTION } from "../MultiFilter/FilterConstant";


const init_tag = {
  id: 0,
  tag_name: "",
  tag_type: "Product",
  tag_color: "#c9134e",
};

export default function TagManagement() {
  // const [open, setOpen] = useState(true);

  const { tagList, setTagList } = useEbuxContext();

  const [openAddNewPopup, setOpenAddNewPopup] = useState(false);
  const [tag, setTag] = useState(init_tag);
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState({});
  const [selected, setSelected] = useState([]);

  const applySearchFilter = (sFilters, current) => {
    setSearchFilter((prevState) => {
      const newState = (current === "clear_filter") ? {} : { ...prevState, ...sFilters };
      return newState;
    });
  };
  const fetchTag = async () => {
    try {
      setLoading(true);
      const _tagList = await getAllTag();
      setTagList(_tagList);
      setLoading(false);
    } catch (error) {
      // console.error("Error fetching tags:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTag();
  }, [])
  const filterData = useMemo(() => {
      if (tagList.length > 0) {
        
        let tag = {
          key: "tag",
          label: "Tag",
          selectable: false,
          children: []
        }; 
  
        tag["children"] = tagList.map((tagItem,_k) => ({
              label: tagItem?.tag_name,
              key: `tag-${tagItem?.id}-${tagItem?.tag_name}-${_k}}`,
              data: `Tag-${tagItem?.id}-${tagItem?.tag_name}`,    
              action: FILTERACTION.APPLY,
        }))
  
          return [tag];
        }else{        
          return [];
        }
      
    }, [JSON.stringify(tagList)]);

  const filteredTagList = useMemo(() => {
    const tags = searchFilter?.tag?.map(i => i?.key);
    return tagList?.filter(i => tags?.length ? tags?.indexOf(i?.tag_name) > -1 : i);
  }, [tagList, JSON.stringify(searchFilter)]);



  return (
    <div className="w-full h-full">
      <div className="graphicalSection">
        <Loader show={loading} />
        <div className="sectionIconHead">
          <div className="flex gap-2 items-center">
            <MdOutlineDragIndicator />
            <div className="sectionIcon">
              <img
                src="/assets/images/tag.svg"
                width={14}
                height={14}
              />
            </div>
            <h4>Tag Manager</h4>
          </div>
          {/* <button
          type="button"
          onClick={() => {
            setOpen(!open);
          }}
          className={`graphIconBtn ${open ? 'arrowRotate' : ''}`}
        >
          <img src="/assets/images/toggleDown.svg" width={20} height={20} />
        </button> */}
        </div>
        <div className="px-4 py-2 w-full">
          <div className="graphHeadWrap">
            <div className="graphHeadLeft">
              <TagMultiFilter arr={filterData} hasCancel={false} applySearchFilter={applySearchFilter} />
            </div>
            <div className="graphHeadRightWrap">
              <div className="graphHeadRight">
                <div className="graphIconBtnWrap flex gap-1 items-center  ">
                  {selected.length > 0 
                  ? (
                  <button
                    type="button"
                    className="flex gap-1 items-center  text-black px-4 py-2 hover:text-red-700 "
                    onClick={async () => {
                      if (selected.length > 0) {
                        setLoading(true); await deleteSelectedTag(selected); setSelected([]); setLoading(false); fetchTag();
                      }

                    }}
                  >
                    <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.75 6H19.25" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M17.4173 6V18.8333C17.4173 19.75 16.5006 20.6667 15.584 20.6667H6.41732C5.50065 20.6667 4.58398 19.75 4.58398 18.8333V6" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7.33398 5.9987V4.16536C7.33398 3.2487 8.25065 2.33203 9.16732 2.33203H12.834C13.7507 2.33203 14.6673 3.2487 14.6673 4.16536V5.9987" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.16602 10.582V16.082" stroke="currentColor" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12.834 10.582V16.082" stroke="currentColor" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>


                  </button>)
                  :<></>
                    }
                  <button
                    type="button"
                    onClick={() => {
                      setOpenAddNewPopup(!openAddNewPopup);
                      setTag(init_tag);
                    }}
                    className="flex gap-1 items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"

                  >
                    <img
                      src="/assets/images/plus1.svg"
                      width={14}
                      height={14}
                    />
                    Add Tag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TagManagerTable tagList={filteredTagList} setTagList={setTagList} tag={tag} setTag={setTag} fetchTag={fetchTag} setLoading={setLoading} selected={selected} setSelected={setSelected} setOpenAddNewPopup={setOpenAddNewPopup} />

      </div>
      {openAddNewPopup && (
        <CreateTagPopup init_tag={init_tag} tag={tag} setTag={setTag} fetchTag={fetchTag} setOpenAddNewPopup={setOpenAddNewPopup} setLoading={setLoading} />
      )}
    </div>
  );
}
