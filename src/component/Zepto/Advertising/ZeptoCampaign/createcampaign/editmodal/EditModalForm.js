import React, { useState } from "react";
import { AiOutlineMinusCircle } from "react-icons/ai";
import {  BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";


const EditModalForm = () => {
  const [negativekeyword, setNegativekeyword] = useState(false);
  const filterstatus = [
    {
      label: "Pause",
      value: "pause",
    },
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Abort",
      value: "abort",
    },
  ];
  const campbudget = [
    {
      label: "Daily",
      value: "daily",
    },
    {
      label: "Weekly",
      value: "weekly",
    },
    {
      label: "Monthly",
      value: "monthly",
    },
  ];
  const percentage = [
    {
      label: "BY %",
      value: "%",
    },
  ];
  const location = [
    {
      label: "Delhi",
      value: "delhi",
    },
    {
      label: "Mumbai",
      value: "mumbai",
    },
  ];

  return (
    <>
      <div>
        <div className="row px-4 py-2">
          <div className="col_6 pr-1">
            <label htmlFor="">Status</label>
            <select className="w-full py-1.5 border text-xs">
              {filterstatus.map((item, i) => {
                return <option key={i} value={item.value}>{item.label}</option>;
              })}
            </select>
          </div>
          <div className="col_6">
            <label htmlFor="">Date</label>
            <input
              type="date"
              id="appt_0"
              name="appt_0"
              className="border custom-clock w-full text-xs py-1.5"
              value=""
            />
          </div>
        </div>
        <div className="row px-4 py-2">
          <label htmlFor="" className="row">
            Campaign Budget
          </label>
          <div className="col_3 pr-2">
            <select className="w-full py-1.5 border text-xs">
              {campbudget.map((item, i) => {
                return <option key={i} value={item.value}>{item.label}</option>;
              })}
            </select>
          </div>
          <div className="col_3 pr-1">
            <select className="w-full py-1.5 border text-xs">
              {percentage.map((item, i) => {
                return <option key={i} value={item.value}>{item.label}</option>;
              })}
            </select>
          </div>
          <div className="col_1 border  text-center px-6 ">
            <BiSolidUpArrow className="text-green-600 h-2" />
          </div>
          <div className="col_1 border py-2 px-5">
            <BiSolidDownArrow className="text-red-600" />
          </div>

          <div className="col ">
            <input
              type="text"
              placeholder="₹ Enter amount"
              className="border py-1.5  text-xs px-2  mx-1 "
            ></input>
          </div>
        </div>
        <div className="row px-4 py-2">
          <div className="row items-center">
            <div className="col_6">
            <label htmlFor="" className="text-xs">
              Add Keyword
            </label>
            <input
              type="text"
              placeholder="Enter keyword"
              className="text-gray-400 w-full  outline-none py-1.5 border text-xs "
            />
            </div>
            <div className="col_2 pl-1">
            <label htmlFor="" className="text-xs">
              Bid
            </label>
            <input
              type="number"
              placeholder="Input"
              className="text-gray-400 w-full  outline-none px-2 py-1.5 border text-xs"
            />
            </div>
          <div className="col_4 justify-evenly">
            <div className="row items-center">
          <div className="col text-xs pl-4 pt-4">Smart<br/>Keyword</div> 
          <div>
            <label className="switch">
              <input type="checkbox" 
              onClick={() => setNegativekeyword(!negativekeyword)}/>
              <span className="slider round slider--blinkit"></span>
              
            </label>
          </div>
            </div>
          </div>
          </div>
          <div className="row  mt-4 ">
            <textarea placeholder="Added Keyword"
              className="text-gray-400 w-full border outline-none px-2 py-2 text-xs"
              rows={3}
               />
           
          </div>
          {negativekeyword &&
          <div className="row  py-2">
            <div className="py-1 h-5">
              <AiOutlineMinusCircle />
            </div>
          
            <div className="col text-xs">Negative Keyword</div>
         
          
          <div className="row px-4 py-2 w-full border">
          <label>
            <input
              type="text"
              placeholder="Enter Keyword"
              name="abc"
              className="text-gray-200 outline-none text-xs"
            />
          </label>
        </div>
        </div>
            }
          
         
          <div className="row pt-2 text-xs">Location</div>
        </div>
        <div className="row px-4 w-full ">
          <div className="col_8 ">
            <select className="w-full py-2 border text-xs">
              {location.map((item, i) => {
                return <option key={i} value={item.value}>{item.label}</option>;
              })}
            </select>
          </div>
          <div className="col_3 px-2 py-2 text-xs">Pan India</div>
          <div className="col">
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round slider--blinkit"></span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditModalForm;
