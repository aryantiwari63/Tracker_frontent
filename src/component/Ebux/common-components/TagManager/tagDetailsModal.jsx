import React, { useState, useRef, useEffect } from "react";
import { useMemo } from "react";
import { FILTERACTION } from "../MultiFilter/FilterConstant";
import TagMultiFilter from "./TagMultiFilter";
import { deleteSelectedTagMaping, getAllTag, getWebPidTagImageAndName } from "../../services/tag.service";
import Loader from "../Loader";
import { useEbuxContext } from "../../Context/EbuxProvider";

const TagDetailsModal = ({ isOpen,tag, onClose=()=>{} }) => {

  const [loading, setLoading] = useState(false);

  const {  setTagList } = useEbuxContext();
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
  const [data, setData] = useState([]);
    const getImageAndName=async()=>{
      const items=tag?.tag_details?.map(i=>i?.["sku_or_keyword"]);
      setData(tag?.tag_details);
      if(items?.length&&tag?.tag_type=="Product"){
        setLoading(true);
        const productData=await getWebPidTagImageAndName(items);
        setData((old)=>old?.map(i=>({...i,...(productData?.[i?.["sku_or_keyword"]]??{})})));
        setLoading(false);
      }
    }
  useEffect(()=>{
    getImageAndName();
  },[JSON.stringify(tag)])
  // const [search, setSearch] = useState("");
  const [searchFilter, setSearchFilter] = useState({});
    const [selected, setSelected] = useState([]);
  
    const applySearchFilter = (sFilters, current) => {
      setSearchFilter((prevState) => {
        const newState = (current === "clear_filter") ? {} : { ...prevState, ...sFilters };
        return newState;
      });
    };
  // const [
  //   // filterOpen, 
  //   setFilterOpen] = useState(false);

  const modalRef = useRef(null);

  // const products = [
  //   {
  //     id: 1,
  //     sku: "KS93528TUT",
  //     name: "Colgate Active Salt Toothpaste 100g",
  //     img: "https://seeklogo.com/images/C/colgate-logo-9B2723F3C3-seeklogo.com.png"
  //   },
  //   {
  //     id: 2,
  //     sku: "KS93528TUT",
  //     name: "Colgate Active Salt Toothpaste 50g",
  //     img: "https://seeklogo.com/images/C/colgate-logo-9B2723F3C3-seeklogo.com.png"
  //   },
  //   {
  //     id: 1,
  //     sku: "KS93528TUT",
  //     name: "Colgate Active Salt Toothpaste 100g",
  //     img: "https://seeklogo.com/images/C/colgate-logo-9B2723F3C3-seeklogo.com.png"
  //   },
  //   {
  //     id: 2,
  //     sku: "KS93528TUT",
  //     name: "Colgate Active Salt Toothpaste 50g",
  //     img: "https://seeklogo.com/images/C/colgate-logo-9B2723F3C3-seeklogo.com.png"
  //   },{
  //     id: 1,
  //     sku: "KS93528TUT",
  //     name: "Colgate Active Salt Toothpaste 100g",
  //     img: "https://seeklogo.com/images/C/colgate-logo-9B2723F3C3-seeklogo.com.png"
  //   },
  //   {
  //     id: 2,
  //     sku: "KS93528TUT",
  //     name: "Colgate Active Salt Toothpaste 50g",
  //     img: "https://seeklogo.com/images/C/colgate-logo-9B2723F3C3-seeklogo.com.png"
  //   },{
  //     id: 1,
  //     sku: "KS93528TUT",
  //     name: "Colgate Active Salt Toothpaste 100g",
  //     img: "https://seeklogo.com/images/C/colgate-logo-9B2723F3C3-seeklogo.com.png"
  //   },
  //   {
  //     id: 2,
  //     sku: "KS93528TUT",
  //     name: "Colgate Active Salt Toothpaste 50g",
  //     img: "https://seeklogo.com/images/C/colgate-logo-9B2723F3C3-seeklogo.com.png"
  //   }
  // ];

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  const filterData = useMemo(() => {
        if (data?.length > 0) {
          if(tag?.tag_type=="Product"){
            let sku = {
              key: "sku",
              label: "SKU",
              selectable: false,
              children: []
            }; 
      
            sku["children"] = data?.map((tagItem,_k) => ({
                  label: tagItem?.sku_or_keyword,
                  key: `sku-${tagItem?.id}-${tagItem?.sku_or_keyword}-${_k}}`,
                  data: `SKU-${tagItem?.id}-${tagItem?.sku_or_keyword}`,    
                  action: FILTERACTION.APPLY,
            }));
            let sku_name = {
              key: "sku_name",
              label: "Product Name",
              selectable: false,
              children: []
            }; 
      
            sku_name["children"] = data?.map((tagItem,_k) => (tagItem?.sku_name?{
                  label: tagItem?.sku_name,
                  key: `sku_name-${tagItem?.id}-${tagItem?.sku_name}-${_k}}`,
                  data: `Product Name-${tagItem?.id}-${tagItem?.sku_name}`,    
                  action: FILTERACTION.APPLY,
            }:null)).filter(i=>i);
    
            return [sku,sku_name];
          }else{

            let keyword = {
              key: "keyword",
              label: "Keyword",
              selectable: false,
              children: []
            }; 
      
            keyword["children"] = data?.map((tagItem,_k) => ({
                  label: tagItem?.sku_or_keyword,
                  key: `keyword-${tagItem?.id}-${tagItem?.sku_or_keyword}-${_k}}`,
                  data: `Keyword-${tagItem?.id}-${tagItem?.sku_or_keyword}`,    
                  action: FILTERACTION.APPLY,
            }));
    
            return [keyword];

          }
          
          }else{        
            return [];
          }
        
      }, [JSON.stringify(data)]);

    const filteredproducts = useMemo(() => {
      console.log({searchFilter});
      let tag_mapping_ids = [];
      if(tag?.tag_type=="Product"){
        const web_pids = searchFilter?.sku?.map(i => i?.value?parseInt(i?.value):null)?.filter(i=>i)??[];
        const sku_names = searchFilter?.sku_name?.map(i => i?.value?parseInt(i?.value):null)?.filter(i=>i)??[];
        tag_mapping_ids=[...(web_pids??[]),...(sku_names??[])];    
      }else{
        tag_mapping_ids = searchFilter?.keyword?.map(i => i?.value?parseInt(i?.value):null)?.filter(i=>i)??[];             
      }
      return data?.filter(i => tag_mapping_ids?.length ? tag_mapping_ids?.indexOf(i?.id) > -1 : i); 
      // return data;
    }, [data, JSON.stringify(searchFilter)]);

  const isAllSelected = selected.length === filteredproducts?.length && filteredproducts?.length > 0;
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelected([]);
    } else {
      setSelected(filteredproducts?.map(item => item.id));
    }
  };

  if (!isOpen||!data?.length) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-white w-[960px] shadow-lg"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b p-3 bg-gray-300">
            <h2 className="text-lg font-semibold">Tag Details  <Loader show={loading} /></h2>
          <button onClick={()=>{onClose()}} className="text-gray-500 hover:text-black">
            {/* Close Icon (X) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-1 py-1 w-full">
          <div className="flex gap-12 w-full px-3">
              <span><strong>Tag Name: </strong>{tag?.tag_name}</span>
              <span><strong>Tag Type: </strong>{tag?.tag_type}</span>
          </div>
          {/* Search & Filter */}
          <div className="flex gap-2 w-full  px-2">
            <TagMultiFilter arr={filterData} hasCancel={false} applySearchFilter={applySearchFilter} />
            {/* {filterOpen && (
              <div className="absolute top-12 left-0 bg-white border rounded-lg shadow-md w-full z-10">
                <div className="px-4 py-2 text-gray-500 text-sm">Filters</div>
                <ul>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">SKU</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Product name
                  </li>
                </ul>
              </div>
            )} */}

              <div className="flex items-center ">
            <button
              type="button"
              className="flex gap-1 px-2 py-1 items-center rounded border border-gray-300  hover:text-red-700  "
                onClick={async () => {
                                    if (selected.length > 0) {
                                      setLoading(true); await deleteSelectedTagMaping(tag?.id,selected); setData(old=>old?.filter(i=>selected?.indexOf(i?.id)==-1)); setSelected([]); setLoading(false); fetchTag();
                                    }
              
                                  }}
              // onClick={async () => { setLoading(true); await deleteSelectedTag([tag?.id]); setLoading(false); fetchTag(); }}
            >
              <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.75 6H19.25" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17.4173 6V18.8333C17.4173 19.75 16.5006 20.6667 15.584 20.6667H6.41732C5.50065 20.6667 4.58398 19.75 4.58398 18.8333V6" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.33398 5.9987V4.16536C7.33398 3.2487 8.25065 2.33203 9.16732 2.33203H12.834C13.7507 2.33203 14.6673 3.2487 14.6673 4.16536V5.9987" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.16602 10.582V16.082" stroke="currentColor" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.834 10.582V16.082" stroke="currentColor" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Delete
            </button>
            </div>
          </div>
        </div>


        

        {/* Table */}
        <div className="max-h-64 overflow-y-auto border m-2">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 z-[2]">
              <tr>
                <th className="px-3 py-2 text-left !w-[40px] !min-w-[40px] !max-w-[40px]">

                <input type="checkbox" className="form-checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll} />
                </th>
                <th className="px-3 py-2 text-left">Serial No.</th>
                <th className="px-3 py-2 text-left">{tag?.tag_type=="Product"?"SKU":"Keyword"}</th>
                {tag?.tag_type=="Product"?<th className="px-3 py-2 text-left">Product Name</th>:<></>}
                <th className="px-1 py-2 text-center !w-[80px] !min-w-[80px] !max-w-[80px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredproducts?.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`border-b hover:bg-gray-50 ${
                    selected.includes(p.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-3 py-2  !w-[40px] !min-w-[40px] !max-w-[40px]">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={() => toggleSelect(p.id)}
                    />
                  </td>
                  <td className="px-3 py-2  !w-[80px] !min-w-[80px] !max-w-[80px]">
                    <span className="ml-2">{String(idx + 1).padStart(2, "0")}.</span>
                  </td>
                  <td className="flex px-3 py-2 flex items-center  justify-between ">
                    <span className=" whitespace-normal break-all">{p?.["sku_or_keyword"]}</span>
                    {tag?.tag_type=="Product"&&p?.["pdp_image_url"]?<img src={p?.["pdp_image_url"]} alt={p?.["sku_or_keyword"]} className="w-12 h-10 p-1" />:<></>}
                  </td>
                  {tag?.tag_type=="Product"?
                  <td className="px-3 py-2">
                    <span className="truncate max-w-[200px]  whitespace-normal break-all">{p?.["sku_name"]}</span>
                  </td>
                  :<></>}
                  <td className=" !w-[80px] !min-w-[80px] !max-w-[80px]">
                    <div className="flex justify-center items-center">
                    <button
                      type="button"
                      className="flex justify-center items-center  hover:text-red-700  "
                      onClick={async () => { setLoading(true); await deleteSelectedTagMaping(tag?.id,[p?.id]); setData(old=>old?.filter(i=>[p?.id]?.indexOf(i?.id)==-1)); setLoading(false); fetchTag(); }}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <div className="flex gap-3 p-2">
            <button
              onClick={()=>{onClose()}}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagDetailsModal;
