import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useEbuxContext } from "../../../Context/EbuxProvider";
import Tag from "../../TagManager/tag";
import { copyToClipboard } from "../../../../../utils/helpers";
import { IoMdCopy } from "react-icons/io";
import { deleteSelectedTagMaping } from "../../../services/tag.service";

const Tooltip = ({ infoTooltip, onClose }) => {
    const refOne = useRef(null);
    const { rect, data, position } = infoTooltip;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (refOne.current && !refOne.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!data?.length || !rect) return null;

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
                "absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white";
            break;

        case "bottom":
            style = {
                top: rect.bottom + gap,
                left: rect.left + rect.width / 2,
                transform: "translate(-50%, 0)",
            };
            arrowClasses =
                "absolute top-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white";
            break;

        case "left":
            style = {
                top: rect.top + rect.height / 2,
                left: rect.left - gap,
                transform: "translate(-100%, -50%)",
            };
            arrowClasses =
                "absolute top-1/2 right-[-8px] -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white";
            break;

        case "right":
        default:
            style = {
                top: rect.top + rect.height / 2,
                left: rect.right + gap,
                transform: "translate(0, -50%)",
            };
            arrowClasses =
                "absolute top-1/2 left-[-8px] -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white";
            break;
    }
    return createPortal(
        <div
            ref={refOne}
            className="fixed bg-white border rounded-lg shadow-lg p-3 z-[99999]"
            style={style}
        >
            <div className={arrowClasses}></div>
            <div className={`grid ${data.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-2 max-w-xs`}>
                {data.map((tag, i) => (
                    <Tag
                        key={i}
                        tag_name={tag?.tag_name}
                        tag_color={tag?.tag_color}
                        onRemove={tag.onRemove}
                        type={tag.type}
                    />
                ))}
            </div>
        </div>,
        document.body
    );

};

export default function RelatedTags(
    {
        tagType
        , relatedTo
    }) {
    const { tagList, setTagList } = useEbuxContext();
    const tags = tagList?.filter((tagItem) => tagItem?.tag_type === tagType
        && (tagItem?.tag_details && Array.isArray(tagItem?.tag_details) ? tagItem?.tag_details : [])?.map(i => i?.sku_or_keyword)?.indexOf(relatedTo) > -1
    );

    const handleRemoveTag = async (tagItem) => {
        const mapping = tagItem?.tag_details?.find(i => i?.sku_or_keyword === relatedTo);
        if (mapping?.id) {
            const res = await deleteSelectedTagMaping(tagItem.id, [mapping.id]);
            if (res) {
                setTagList(prev => prev.map(tag => {
                    if (tag.id === tagItem.id) {
                        return {
                            ...tag,
                            tag_details: tag.tag_details.filter(d => d.id !== mapping.id)
                        };
                    }
                    return tag;
                }));

                // Update tooltip data if it's currently open
                setInfoTooltip(prev => {
                    if (prev?.data) {
                        const newData = prev.data.filter(d => d.id !== tagItem.id);
                        if (newData.length === 0) return {};
                        return { ...prev, data: newData };
                    }
                    return prev;
                });
            }
        }
    };


    if (!tags?.length) return "-";

    const [infoTooltip, setInfoTooltip] = useState({});

    const toggleTooltip = (event, option, position = "top", type = "") => {
        const rect = event.currentTarget.getBoundingClientRect();
        const dataWithRemove = option.map(tag => ({
            ...tag,
            onRemove: () => handleRemoveTag(tag),
            type: type
        }));
        setInfoTooltip({ data: dataWithRemove, rect, position });
    };

    return (
        <div className={`flex relative items-center gap-2 w-full ${tags?.length > 1 ? '!w-[250px]' : tags?.length > 0 && tags?.[0]?.tag_name?.length <= 10 ? '!w-[120px]' : '!w-[150px]'}`}>
            {/* First Tag */}
            <div className="flex justify-start group">
                <span onMouseEnter={(e) => tags?.[0]?.tag_name?.length > 10 ? toggleTooltip(e, tags.slice(0, 1), "top", "hover") : null} onMouseLeave={() => setInfoTooltip({})}>
                    <Tag
                        tag_name={tags?.[0]?.tag_name?.length > 10 ? tags?.[0]?.tag_name?.substring(0, 10) + '...' : tags?.[0]?.tag_name}
                        tag_color={tags?.[0]?.tag_color}
                        onRemove={() => handleRemoveTag(tags?.[0])}
                    />
                </span>
                {/* +More Button */}
                {tags?.length > 1 && (

                    <button
                        type="button"
                        className="flex gap-1 ml-[2px] items-center rounded-full bg-gray-200 py-1 px-2 min-w-[80px]"
                        onClick={(e) => toggleTooltip(e, tags, "top")} // you can change "top" to "bottom", "left", or "right"
                    >
                        + {tags?.length - 1} more
                    </button>

                )}
                {
                    tags?.[0]?.tag_name &&
                    <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, tags?.[0]?.tag_name) }}> <IoMdCopy /></span>
                }
            </div>

            {/* Tooltip */}
            {infoTooltip?.data?.length ? (
                <Tooltip
                    infoTooltip={infoTooltip}
                    onClose={() => setInfoTooltip({})}
                />
            ) : <></>}
        </div>
    );
}