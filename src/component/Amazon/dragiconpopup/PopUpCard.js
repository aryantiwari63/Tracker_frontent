import React from "react";
import { BsArrowsMove } from "react-icons/bs";

const PopupCard = ({ serial_no, title, options ,cardtype}) => {

  // const [isRadio, setIsRadio] = useState(5);


  // const handleChange = (e) => {
  //   // string passed in
  //   // a string returned by default
  //   console.log(e.currentTarget.value);
  //   // add + to the event to make the value a number
  //   setIsRadio(+e.currentTarget.value);
  // };
  return (
    <>
    <div className="p-1 h-full ">
      <div className=" bg-white border rounded h-full" >
        <div className={["row  py-1 amscard__header",
      cardtype==="one" && "amscard__header--one",
      cardtype==="two" && "amscard__header--two",
      cardtype==="three" && "amscard__header--three",
      cardtype==="four" && "amscard__header--four",
      cardtype==="five" && "amscard__header--five",
      cardtype==="six" && "amscard__header--six",
      cardtype==="seven" && "amscard__header--seven",
      cardtype==="eight" && "amscard__header--eight"
    ].join((" "))}>
          <div className="col pl-2">
            <div className="row ">
          <button className="border rounded px-2 py-0.5 font-semibold ">
            {serial_no}
          </button>
          <h2 className="text-base font-semibold px-1">{title}</h2>
            </div>

          </div>
          <div>
          <button className="pt-1.5 bg-slate-100 rounded-lg text-gray-400 ">
            <BsArrowsMove />
          </button>
          </div>
        </div>
        <div className="">
          <div className=" ">
            {options?.map((item, index) => (
              <div key={index} className="pl-3">
                <label htmlFor={item.name} className="text-[13px] ">
                  <input
                    type="checkbox"
                    name={item.name}
                    value={item.id}
                    // onChange={handleChange}
                    // checked={isRadio === item.id}
                    // checked={item.id}
                 
                  />
                {item.val}
                
                </label>
              </div>
            ))}
            {/* <FontAwesomeIcon icon="fa-sharp fa-regular fa-grip-dots-vertical" style={{color: "#6b6d70",}} /> */}
          </div>
          
        </div>
      </div>
    </div>
    </>
  );
};

export default PopupCard;
