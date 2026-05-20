
import React from "react";
import Tooltip from "../../../Tooltip";


const IndiviualSuggestedTable=()=>{
  let currency = localStorage.getItem("currency");

    const producttable=[
        {
            
            id:1,
            name:"amazon upi",
            value:"amazonupi",
            type:["exact","expanded"],
            suggestedbid:`${currency}50`
        },
        {
            
            id:2,
            name:"amazon pay",
            value:"amazonpay",
            type:["exact","expanded"],
            suggestedbid:`${currency}50`
        },
        {
            
            id:3,
            name:"amazon refer",
            value:"amazonrefer",
            type:["exact"],
            suggestedbid:`${currency}50`
        },
        {
            
            id:4,
            name:"amazon upi",
            value:"amazonupi",
            type:["expanded"],
            suggestedbid:`${currency}50`
        },
       
    ]
    

    return(
        <>
        <table className= "w-full targetTable">
            <thead className="border bg-gray-100">
                <tr className="w-full text-left">
                  
                   <th></th>
                    <th className="">Sugg bid<Tooltip/></th>
                    <th className="">Type<Tooltip/></th>
                    <th className=""><button className="text-blue-400 ">Add All</button></th>
                </tr>
            </thead>
            
            <tbody>
              {producttable.map((item,i)=>{
                return(
                    <tr key={i} >
                    <td>{item.name}</td>
                    <td>{item.suggestedbid}</td>
                    <td>{item.type}</td>
                   
                    <td><button>Add</button></td>
                </tr>                  
                )
              })

              } 
            </tbody>
        </table>
        </>
    )
}

export default IndiviualSuggestedTable;