/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";

import { deleteSelectedTag } from "../../services/tag.service";
import LoaderSpinner from "../../../common-components/loader-spinner";
import Tag from "./tag";
import TagDetailsModal from "./tagDetailsModal";

export default function TagManagerTable({ setTag, selected, setSelected, tagList, setOpenAddNewPopup, setLoading, fetchTag }) {

  const containerRef = useRef(null);
  const loadRowSize = 10;
  const [isLazyLoading, setIsLazyLoading] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(loadRowSize);
  const visibleData = useMemo(() => tagList?.slice(0, itemsToShow), [tagList, itemsToShow]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    if (scrollHeight - scrollTop - clientHeight < loadRowSize && !isLazyLoading && itemsToShow < tagList.length) {
      setIsLazyLoading(true);
      setTimeout(() => {
        setItemsToShow((prev) => prev + loadRowSize);
        setIsLazyLoading(false);
      }, 1500);
    }
  };
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [isLazyLoading, tagList]);

  const isAllSelected = selected.length === tagList.length && tagList.length > 0;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelected([]);
    } else {
      setSelected(tagList.map(item => item.id));
    }
  };

  const handleSelectOne = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(itemId => itemId !== id));
    } else {
      setSelected([...selected, id]);
    }
  };
  const [showTagDetails,setShowTagDetails]=useState({});
  return (
    <div className="px-4 w-full">
      <div className={`tblWrap  tbl-scroll max-h-[600px] `} ref={containerRef}>
        <table className="tblOuterSticky border !border-gray-200" border="1">
          <thead className="sticky -top-1 border !border-gray-200  z-10">
            <tr className="border !border-gray-200">
              <th className=" border !border-gray-200  w-1/12">
                <input type="checkbox" className="form-checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll} />
              </th>
              <th className=" border !border-gray-200  w-2/12"><div className="px-1 py-3">Tag Name</div></th>
              <th className=" border !border-gray-200  w-2/12 min-w-2/12"><div className="px-1 py-3">Tag Details</div></th>
              <th className=" border !border-gray-200  w-1/12"><div className="px-1 py-3">Tag Type</div></th>
              <th className=" border !border-gray-200  w-3/12"><div className="px-1 py-3">Created By</div></th>
              <th className=" border !border-gray-200  w-3/12"><div className="px-1 py-3">Updated By</div></th>
            </tr>
          </thead>
          <tbody>
            {visibleData?.map((tag, index) => (
              <tr key={index} className="hover:bg-gray-200 cursor-pointer">

                <td className=" border !border-gray-200 ">
                  <input type="checkbox" className="form-checkbox"
                    checked={selected.includes(tag?.id)}
                    onChange={() => handleSelectOne(tag?.id)}
                  />
                </td>
                <td className=" border !border-gray-200 " >
                  <div className="flex items-center gap-1 group justify-between w-[1/4]">                    
                    <Tag tag_name={tag?.tag_name} tag_color={tag?.tag_color}/>
                    <div className="hidden group-hover:inline-block min-w-[45px] max-w-[45px]">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          className="flex gap-1 items-center   "
                          onClick={() => { setOpenAddNewPopup(true); setTag(tag); }}
                        >
                          <img className="cursor-pointer"
                            src="/assets/images/editCustom.svg"
                            width={22}
                            height={23}
                          />
                        </button>
                        <button
                          type="button"
                          className="flex gap-1 items-center  hover:text-red-700  "
                          onClick={async () => { setLoading(true); await deleteSelectedTag([tag?.id]); setLoading(false); fetchTag(); }}
                        >
                          <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.75 6H19.25" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M17.4173 6V18.8333C17.4173 19.75 16.5006 20.6667 15.584 20.6667H6.41732C5.50065 20.6667 4.58398 19.75 4.58398 18.8333V6" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.33398 5.9987V4.16536C7.33398 3.2487 8.25065 2.33203 9.16732 2.33203H12.834C13.7507 2.33203 14.6673 3.2487 14.6673 4.16536V5.9987" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.16602 10.582V16.082" stroke="currentColor" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12.834 10.582V16.082" stroke="currentColor" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>

                  </div>

                </td>

                <td className=" border !border-gray-200 ">{tag?.tag_details?.length?
                <div className="flex gap-2 items-center">
                  <span className="flex-1" onClick={()=>{setShowTagDetails(tag)}}>{tag?.tag_details?.[0]?.["sku_or_keyword"]}</span>
                {tag?.tag_details?.length>1?
                <span className="cursor-pointer catTxtBlue min-w-[60px] " onClick={()=>{setShowTagDetails(tag)}}>+ {tag?.tag_details?.length-1} More</span>
                :""}
                </div>
                :""
                }</td>
                <td className=" border !border-gray-200 ">{tag?.tag_type}</td>
                <td className=" border !border-gray-200 "><div className="flex flex-col"><span>{tag?.created_by}</span><span>{moment(tag?.created_at).format("DD-MM-YYYY")}</span></div></td>
                <td className=" border !border-gray-200 "><div className="flex flex-col"><span>{tag?.updated_by}</span><span>{moment(tag?.updated_at).format("DD-MM-YYYY")}</span></div></td>
              </tr>
            ))}
            {isLazyLoading && (
              <tr>
                <td
                  className="sticky z-10 bottom-0 p-2 !bg-[#FFF] !max-w-[90vw]"
                  colSpan={6}
                  rowSpan={3}
                  style={{ alignItems: "center", verticalAlign: "middle" }}
                >
                  <div className="flex !bg-[#FFF] !justify-center !text-center p-2 row sticky !shadow-none max-w-[90vw]">
                    <LoaderSpinner />
                  </div>
                </td>
              </tr>
            )}


          </tbody>
        </table>
        <TagDetailsModal tag={showTagDetails} isOpen={showTagDetails?.tag_name?true:false} onClose={()=>{setShowTagDetails({})}}/>
      </div>
    </div>

  );
}
