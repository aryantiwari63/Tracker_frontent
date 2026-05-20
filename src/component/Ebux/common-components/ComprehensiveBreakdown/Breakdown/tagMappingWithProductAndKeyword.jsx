import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useEbuxContext } from '../../../Context/EbuxProvider';
import { createPortal } from 'react-dom';
import Tag from '../../TagManager/tag';
import { getAllTag, saveTagMapWithSkuOrKeywords } from '../../../services/tag.service';
import CreateTagPopup from '../../TagManager/CreateTagPopup';

const Tooltip = ({ infoTooltip, onClose, selectedTabName, selectedTabRows = [], activeTags = [] }) => {
    const { setTagList } = useEbuxContext();
    const refOne = useRef(null);
    const { rect, position } = infoTooltip;
    const data = activeTags?.length ? activeTags : infoTooltip.data;

    const [openAddNewPopup, setOpenAddNewPopup] = useState(false);
    const init_tag = {
        id: 0,
        tag_name: "",
        tag_type: selectedTabName === "Keyword" ? "Keyword" : "Product",
        tag_color: "#c9134e",
    };
    const [tag, setTag] = useState(init_tag);
    const [, setLoading] = useState(false);

    const fetchTag = async () => {
        const _tagList = await getAllTag();
        setTagList(_tagList);

        if (tag?.tag_name) {
            const foundTag = _tagList.find(t => t.tag_name === tag.tag_name && t.tag_type === tag.tag_type);
            if (foundTag?.id) {
                setSelectedTags(prev => prev.includes(foundTag.id) ? prev : [...prev, foundTag.id]);
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openAddNewPopup) return;
            if (refOne.current && !refOne.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose, openAddNewPopup]);

    if (!rect) return null;

    // Calculate tooltip position
    const gap = 8;
    let style = {};
    //   let arrowStyle = {};
    let arrowClasses = "";

    switch (position) {
        case "top":
            style = {
                top: rect.top - gap,
                left: rect.left + rect.width / 2,
                transform: "translate(-50%, -100%)",
            };
            arrowClasses =
                "absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-300";
            break;

        case "bottom":
            style = {
                top: rect.bottom + gap,
                left: rect.left + rect.width / 2,
                transform: "translate(-15%, 0)",
            };
            arrowClasses =
                "absolute top-[-8px] left-[10%] -translate-x-[10%] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-gray-300";
            break;

        case "left":
            style = {
                top: rect.top + rect.height / 2,
                left: rect.left - gap,
                transform: "translate(-100%, -50%)",
            };
            arrowClasses =
                "absolute top-1/2 right-[-8px] -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-gray-300";
            break;

        case "right":
        default:
            style = {
                top: rect.top + rect.height / 2,
                left: rect.right + gap,
                transform: "translate(0, -50%)",
            };
            arrowClasses =
                "absolute top-1/2 left-[-8px] -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-300";
            break;
    }

    const [selectedTags, setSelectedTags] = useState([])
    const handleOnChange = (tag_id) => {
        if (tag_id) {
            setSelectedTags(prev => (prev?.indexOf(tag_id) > -1 ? prev.filter(i => i != tag_id) : [...prev, tag_id]));
        }
    }
    const [query, setQuery] = useState("");

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const tags = useMemo(() => {
        const searchText = query?.trim()?.toLowerCase();
        if (searchText && searchText?.length) {
            return data?.filter(i => i.tag_name?.toLowerCase().includes(searchText));
        }
        return data || [];
    }, [query, JSON.stringify(data)]);

    const [error, setError] = useState(null);
    useEffect(() => {
        if (!selectedTabRows?.length) {
            setError(`No ${selectedTabName} selected!`);
        } else if (!selectedTags?.length) {
            setError("No Tag selected!");
        } else {
            setError(null);
        }

    }, [selectedTags])

    const [processing, setProcessing] = useState(false);
    const mapTag = async () => {
        if (!error && selectedTabRows?.length && selectedTags?.length) {
            setProcessing(true);
            // console.log(JSON.stringify(selectedTags)+"\n<---tag----map----"+selectedTabName+"---->\n"+JSON.stringify(selectedTabRows))
            await saveTagMapWithSkuOrKeywords(selectedTags, selectedTabRows);
            const _tagList = await getAllTag();
            setTagList(_tagList);
            setSelectedTags([]);
            onClose();
            setProcessing(false);
        }
    }
    return createPortal(
        <>
            <div
                ref={refOne}
                className="fixed bg-white border rounded-lg shadow-lg px-2 py-0 z-[99999]"
                style={style}
            >
                <div className={arrowClasses}></div>
                <div className="flex items-center border border-gray-300 rounded-md px-2 py-2 my-2 bg-white shadow-sm w-full max-w-sm">
                    {/* Search Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                        />
                    </svg>

                    {/* Input */}
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder="Search Tag"
                        className="flex-1 ml-2 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                    />

                    {/* Clear Button */}
                    {/* {query && (
        <button onClick={clearSearch} className="ml-2 text-gray-400 hover:text-gray-600">
          ✕
        </button>
      )} */}
                </div>
                <ul className="max-w-xs max-h-[200px] overflow-y-auto p-1">
                    {tags.map((tag, i) => (
                        <li key={i} className="flex items-center gap-2 max-w-xs p-1">
                            <input
                                type="checkbox"
                                checked={selectedTags?.indexOf(tag?.id) > -1}
                                onChange={() => handleOnChange(tag?.id)}
                            />
                            <Tag tag_name={tag?.tag_name} tag_color={tag?.tag_color} />
                        </li>
                    ))}
                </ul>
                <div
                    className="flex-1 text-[#0082F7] cursor-pointer  px-0 py-1 border-t border-gray-200"
                    onClick={() => {
                        setTag(init_tag);
                        setOpenAddNewPopup(true);
                    }}
                >
                    Create New Tag
                </div>
                <div className="flex gap-1 px-0 py-1  items-center">
                    <div className="flex-1 text-red-500">
                        {error}
                        {processing ? "Processing..." : ""}
                    </div>
                    <div className="flex justify-end gap-2 ">
                        <button onClick={() => onClose()} className="px-3 py-1 text-[14px] border rounded hover:bg-gray-100">
                            Cancel
                        </button>
                        <button
                            disabled={error || processing}
                            className={`px-3 py-1 text-[14px] rounded  ${error || processing ? "bg-gray-200 text-black hover:bg-gray-100 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"}`}

                            onClick={() => { mapTag(); }}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
            {openAddNewPopup && (
                <div className="relative z-[999999]">
                    <CreateTagPopup
                        init_tag={init_tag}
                        tag={tag}
                        setTag={setTag}
                        fetchTag={fetchTag}
                        setOpenAddNewPopup={setOpenAddNewPopup}
                        setLoading={setLoading}
                        restrictTagType={selectedTabName === "Keyword" ? "Keyword" : "Product"}
                    />
                </div>
            )}
        </>,
        document.body
    );
};
function TagMappingWithProductAndKeyword({ selectedTabName, selectedTabKey, selectedTableRows }) {
    const { kpi, tagList } = useEbuxContext();

    const [infoTooltip, setInfoTooltip] = useState({});

    const toggleTooltip = (event, option, position = "top") => {
        const rect = event.currentTarget.getBoundingClientRect();
        setInfoTooltip({ data: option, rect, position });
    };
    const showTag = (["SOS", "OR"].indexOf(kpi) > -1 && selectedTabName == "Keyword" || ["OSA", "CS", "PRO", "RR"].indexOf(kpi) > -1 && selectedTabName == "SKU") ? true : false;

    const [isShowTag, setIsShowTag] = useState(showTag)

    useEffect(() => {
        const _isShowTag = (["SOS", "OR"].indexOf(kpi) > -1 && selectedTabName == "Keyword" || ["OSA", "CS", "PRO", "RR"].indexOf(kpi) > -1 && selectedTabName == "SKU") ? true : false;
        setIsShowTag(_isShowTag);
    }, [kpi, selectedTabName])

    const tags = tagList?.filter((tagItem) => tagItem?.tag_type == (["SOS", "OR"].indexOf(kpi) > -1 && selectedTabName == "Keyword" ? "Keyword" : "Product"));
    if (!selectedTableRows?.[selectedTabKey]?.length) return null;
    if (!isShowTag) {
        return (<></>)
    }
    return (
        <div className='flex gap-1 px-1 pt-1 items-center'>
            <span className='items-center'>Number of Selected {["SOS", "OR"].indexOf(kpi) > -1 && selectedTabName == "Keyword" ? "Keywords" : "Products"}: <strong>{selectedTableRows?.[selectedTabKey]?.length > 0 && selectedTableRows?.[selectedTabKey]?.length < 10 ? "0" : null}{selectedTableRows?.[selectedTabKey]?.length}</strong></span>

            <div>
                <button
                    type="button"
                    className="flex gap-1 items-center rounded-lg bg-white border border-gray-200 py-1 px-2 min-w-[80px]"
                    onClick={(e) => toggleTooltip(e, tags, "bottom")}
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_8688_81034)">
                            <path d="M6.99935 1.16797H1.16602V7.0013L6.58518 12.4205C7.13352 12.9688 8.03185 12.9688 8.58018 12.4205L12.4185 8.58214C12.9668 8.0338 12.9668 7.13547 12.4185 6.58714L6.99935 1.16797Z" stroke="black" strokeOpacity="0.85" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4.08398 4.08203H4.08982" stroke="black" strokeOpacity="0.85" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_8688_81034">
                                <rect width="14" height="14" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    Tag
                </button>
            </div>
            {/* Tooltip */}
            {infoTooltip?.data ? (
                <Tooltip
                    selectedTabRows={selectedTableRows?.[selectedTabKey]?.map(i => i?.lable ?? i?.value) ?? []}
                    selectedTabName={selectedTabName}
                    infoTooltip={infoTooltip}
                    activeTags={tags}
                    onClose={() => setInfoTooltip({})}
                />
            ) : <></>}
        </div>
    )
}

export default TagMappingWithProductAndKeyword;