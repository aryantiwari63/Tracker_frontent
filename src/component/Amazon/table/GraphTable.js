import React from "react";


const GraphTable=({header,body})=>{
    return(
        <>
        <div className="overflow-x-scroll block whitespace-nowrap">
        <table className="h-full  ">
            <thead>
                <tr>
                   {header?.map((item,i)=>{
                    return(
                        <th key={i} className="px-2.5 text-xs " >{item.name}</th>
                    )
                   })}
                </tr>
            </thead>
            <tbody>
                {body?.map((item,i)=>{
                    return (
                      <tr key={i} className="">
                        <td className="pl-2 text-sm ">{item.campaigntype}</td>
                        <td className="text-right pr-1">{item.impressions}</td>
                        <td className="px-0.5">{item.clicks}</td>
                        <td className="px-0.5 text-left">{item.spend}</td>
                        <td className="px-0.5 text-left">{item.sale}</td>
                        <td className="px-1 text-left">{item.roas}</td>
                        <td className="px-1 text-left">{item.cpc}</td>
                        <td className="px-1 text-left">{item.cpa}</td>
                        <td className="px-1 text-left">{item.ctr}</td>
                        <td className=" text-left">{item.cvr}</td>
                      </tr>
                    );
                })}

            </tbody>
        </table>
        </div>
        </>
    )
}
export default GraphTable