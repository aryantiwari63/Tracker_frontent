import { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { accentThemeObj } from "../../../style/StyleConstants";
import { useSelector } from "react-redux";
const SavedColumnNames = ({ savedColNames, savedId, dataId, deleteColId }) => {
  const [open, setOpen] = useState(true);
  const platform = useSelector((state) => state?.CommonReducer);

  const handleOnChange = (id) => {
    savedId(dataId === id ? null : id);
  };

  const handleDelete = (id) => {
    deleteColId(id);
  };

  return (
    <div className="bg-white flex-1">
      <div
        className="flex gap-2 bg-[#e9ecef] py-2 px-3 items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="bg-white border border-[#d9d9d9]">
          {open ? <FiMinus size={13} /> : <FiPlus size={13} />}
        </div>
        <div className="mr-1 font-medium">Saved View</div>
        {/* <img src="/assets/images/imp.svg" className="w-[4px]" /> */}
      </div>

      {open && (
        <div className="px-3 flex flex-col gap-2 py-2">
          {savedColNames[0]?.map(
            (obj, index) =>
              !obj?.checked && (
                <div key={index} className="flex justify-between">
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      id={obj?.id}
                      name="checkbox-group"
                      className={`${
                        accentThemeObj[platform.platFormType]
                      } cursor-pointer`}
                      checked={dataId === obj?.id}
                      onChange={() => handleOnChange(obj?.id)}
                      disabled={obj?.nonSelectable}
                    />
                    <label
                      htmlFor={obj?.id}
                      className="text-[15px] font-medium"
                    >
                      {obj?.name}
                    </label>
                  </div>

                  <img
                    className="w-4  cursor-pointer"
                    src="/assets/images/trash.svg"
                    onClick={() => handleDelete(obj?.id)}
                  />
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default SavedColumnNames;
