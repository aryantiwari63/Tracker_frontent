import React from "react";

const BudgetTrentContent=()=>{
    return(
        <>
        <div className="">
         <div className="pr-1">
         
          <ul className="pl-3">
            
            <li className=" budgettrendcontentli ">
              <span className="chart-color " style={{backgroundColor:"#0081F7"}} ></span>
              <div className="chart-content ">
                <h6 className="text-sm">Money Available</h6>
                <h2 className="font-extrabold text-xl">100%</h2>  
              </div>
            </li>
           
            <li className="budgettrendcontentli ">
              <span className="chart-color" style={{backgroundColor:"#50CD89"}}></span>
              <div className="chart-contents ">
                <h6 className="text-sm">
                  Campaign Buget
                  <p className="text-sm">(Money Blocked)</p>
                </h6>
                <h2 className="font-extrabold text-xl ">0%</h2>
              </div>
            </li>
            <li className=" budgettrendcontentli">
              <span className="chart-color "style={{backgroundColor:"#FFC700"}} ></span>
              <div className="chart-contents">
                <h6 className="text-sm">
                  Available Wallet
                  <p className="text-sm">Balance</p>
                </h6>
                <h2 className="font-extrabold text-xl ">100%</h2>
              </div>
            </li>
            
            <li className=" budgettrendcontentli">
              <span className="chart-color" style={{backgroundColor:"#BCC4D0"}} ></span>
              <div className="chart-contents justify-between">
                <h6 className="text-sm">Potential Wallet</h6>
                <h2 className="font-extrabold text-xl ">100%</h2>
              </div>
            </li>
          </ul>
        </div>
        </div>
        </>
    )
}

export default BudgetTrentContent