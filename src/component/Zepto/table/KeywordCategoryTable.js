import React from "react";
import Pagination from "../../pagination";
const Table = ({
  headers,
  content,
  sortData,
  paginate,
  totalData,
  page,
}) => { 
  return (
    <>
      <table className=" text-left w-full campaignsTable  ">
        <thead>
          <tr className="bg-slate-100 ">
            {headers.map((item) => {
              return (
                <>
                  <th className="flex-column ">
                    <div className="flex items-center ">
                      <span className="ml-2 flex">{item.title}</span>
                      <span className="">
                        {item.showSort ? (
                          <div className="sortArrow cursor-pointer ml-4  ">
                            <div onClick={() => sortData(item?.value, 1)}>
                              ▲
                            </div>

                            <div
                              className="downArrow"
                              onClick={() => sortData(item?.value, -1)}
                            >
                              ▼
                            </div>
                          </div>
                        ) : null}
                      </span>
                    </div>
                  </th>
                </>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {content && content.length > 0
            ? content.map((items) => {
                return (
                  <>
                    <tr  className="">
                      {items.category && <td className="">{items.category}</td>}
                      {items.spends && <td>{items.spends}</td>}
                      {items.ROAS && <td>{items.ROAS}</td>}
                      {items.clicks && <td>{items.clicks}</td>}
                      {items.CTR && <td>{items.CTR}</td>}
                   
                    </tr>
                  </>
                );
              })
            : "No Data found"}
        </tbody>
      </table>
      {totalData > 10 ? (
        <Pagination paginate={paginate} page={page} totalData={totalData} />
      ) : null}
    </>
  );
};

export default Table;
