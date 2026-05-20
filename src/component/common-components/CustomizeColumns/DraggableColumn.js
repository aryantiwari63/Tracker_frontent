import { PiDotsNineBold } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import "./CustomizeColPopup.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { platformColor } from "../../../utils/colorConstant";

const DraggableColumn = ({ obj, id, setListArr, listArr, platform }) => {
  const bgcolor = platformColor[platform][200];
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled: obj?.disable });

  const style = {
    transform: CSS?.Transform?.toString(transform),
    transition,
  };

  const handleOnChange = () => {
    const newArr = listArr.map((obj) => {
      return obj?.id === id ? { ...obj, checked: false, showCol: false } : obj;
    });
    setListArr(newArr);
  };

  return (
    <div
      className="my-2"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div
        className={`box-border rounded-md flex justify-between px-4 items-center p-2 border border-[#D6D6D7]`}
        style={{
          backgroundColor: obj?.disable
            ? "rgb(229 231 235"
            : obj.columnType == "dsa"
            ? bgcolor
            : "white",
        }}
      >
        <div className="flex gap-4 items-center">
          <PiDotsNineBold size={20} color="#53545E" />
          <div>{obj?.title}</div>
        </div>
        <RxCross2
          className="cursor-pointer"
          size={20}
          color="#53545E"
          onClick={() => {
            !obj?.disable && handleOnChange();
          }}
        />
      </div>
    </div>
  );
};

export default DraggableColumn;
