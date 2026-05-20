import { PiDotsNineBold } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";

const NonDraggableColumn = ({ obj }) => {
  return (
    <div className="my-2">
      <div
        className={`box-border rounded-md flex justify-between px-4 items-center bg-gray-100 p-2 border border-[#D6D6D7]`}
      >
        <div className="flex gap-4 items-center">
          <PiDotsNineBold size={20} color="#53545E" />
          <div>{obj?.title}</div>
        </div>
        <RxCross2 className="cursor-pointer" size={20} color="#53545E" />
      </div>
    </div>
  );
};

export default NonDraggableColumn;
