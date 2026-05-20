/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useState } from "react";
import { saveTag, editTag } from "../../services/tag.service";
import ColorPicker from "./ColorPicker";
import { useEbuxContext } from "../../Context/EbuxProvider";

export default function CreateTagPopup({ init_tag, tag, setTag, setOpenAddNewPopup, setLoading, fetchTag, restrictTagType }) {
   const { activeClientProject } = useEbuxContext();
   const enabledKPIs = activeClientProject?.kpi || {};
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const editRef = React.useRef(null);

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center bg-gray-100 px-6 py-2 rounded-t-lg">
          <h2 className="text-lg font-semibold">{(tag?.id > 0) ? "Edit" : "Add New"} Tag</h2>
          <button
            type="button"
            onClick={() => setOpenAddNewPopup(false)}
            className="text-gray-500 font-semibold hover:text-gray-700 transition-colors duration-200"
          >
            X
          </button>
        </div>

        <div className="bg-white px-6 py-4">
          <div className="mb-4 relative">
            <div className="mb-2 font-semibold">
              Tag Name And Color
            </div>
            <div className="flex">
              <input
                id="tag-input"
                className="w-full px-2 py-3 border rounded focus:border-sky-600 focus:outline focus:outline-blue-600"
                type="text"
                pattern="[A-Za-z0-9]*"
                placeholder="Enter Name"
                onChange={(e) => setTag((prev) => ({ ...prev, tag_name: e.target.value.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, ' ').substring(0, 50).trimStart() }))}
                value={tag?.tag_name ?? ""}
                autoComplete="off"
                maxLength="50"
              />
              <div
                className="border w-10 flex items-center justify-center cursor-pointer relative"
                onClick={() => setOpenColorPicker(!openColorPicker)}
              >
                <div
                  className="w-5 h-5 bg-white rounded-full "
                  style={{ backgroundColor: tag?.tag_color ?? "#ffffff", border: tag?.tag_color ?? "#ffffff" === '#ffffff' ? '1px solid rgba(0, 0, 0, 0.1)' : 'none' }}
                >
                  { }
                </div>
              </div>
              {openColorPicker === true && (
                <div className="tagColorPicker" ref={editRef} style={{ bottom: -5 }}>
                  <ColorPicker
                    selectedColor={tag?.tag_color ?? "#ffffff"}
                    onColorChange={(selectedColor) => {
                      setOpenColorPicker(false);
                      setTag((prev) => ({ ...prev, tag_color: selectedColor }));
                    }}
                  />
                </div>
              )}

            </div>
          </div>
          <div className="mb-4">
            <div className="mb-2 font-semibold">
              Tag Type
            </div>
            <div className="relative inline-block w-full">
              <select
                id="tagType"
                // className="w-full px-2 py-3 border rounded !bg-white focus:border-sky-600 focus:outline focus:outline-blue-600"
                className="appearance-none w-full !bg-white focus:border-sky-600  px-4 py-2 pr-10 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-gray-300"
                onChange={(e) => setTag((prev) => ({ ...prev, tag_type: e.target.value }))}
                value={tag?.tag_type ?? ""}
              >
                { (!restrictTagType || restrictTagType === 'Product') && (enabledKPIs?.OSA ||  enabledKPIs?.CS || enabledKPIs?.PRO || enabledKPIs?.RR || enabledKPIs?.SOD) ? <option value="Product">Product</option> : null }
                { (!restrictTagType || restrictTagType === 'Keyword') && (enabledKPIs?.SOS ||  enabledKPIs?.OR || enabledKPIs?.SOM) ? <option value="Keyword">Keyword</option> : null }
                {/* <option value="Keyword">Keyword</option> */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>


          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setOpenAddNewPopup(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400 transition-colors duration-200"

            >
              Cancel


            </button>
            <button
              type="submit"
              onClick={async (e) => {
                e.preventDefault();
                if (!tag?.tag_name || tag?.tag_name.trim() === "") {
                  alert("Please enter a valid tag name.");
                  return;
                } else {
                  setLoading(true);
                  if (tag?.id > 0) {
                    await editTag(tag);
                  } else {
                    await saveTag(tag);
                  }
                  setOpenAddNewPopup(false);
                  setLoading(false);
                  fetchTag();
                  setTag(init_tag);

                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >

              {(tag?.id > 0) ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}