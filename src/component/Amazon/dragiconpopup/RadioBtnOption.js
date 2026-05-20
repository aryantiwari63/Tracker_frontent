import React from "react";

const RadioBtnOption=({options})=>{
    return(
        <>
         <div className="pl-4 ">
                    {options?.map((item, index) => (
                        <div key={index}>
                      <label htmlFor="amazon" className="text-[13px] ">
                        <input className=""
                          type="radio"
                          name={item.name}
                          value={item.id}
                          // checked={item.id}
                        />
                        {item.val}
                      </label>
                        </div>
                    ))}
                  </div>
                  </>
    )
}
export default RadioBtnOption