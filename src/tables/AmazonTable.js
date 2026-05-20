import { useEffect, useState } from "react";
import amazonTable from "../data/Amazon/amazontable.json";
// import dummyData from "../data/Amazon/dummydata.json"
import axios from "axios";

const url="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5MSwiZXhwIjoxNjc3MjMzNzcyLCJpYXQiOjE2NzcxNDczNzJ9.aFXs6tb1za7h3JHYrhjRjedn3UIkuHEnN4GmWHNjqMo";
const AmazonTable = () => {
  const [showHeader, setShowHeader] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [data, setData] = useState([]);
  // api calling 
  const fileShow = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${url}`,
      },
    };

    try {
      const result = await axios.post(
        `http://3.111.72.126:8000/campaign/list`,
        null,
        config
      );
      setData(result.data.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error.message);
    }
  };
  
  useEffect(() => {
    // eslint-disable-next-line array-callback-return
    amazonTable[0].header.map((item) => {
      setShowHeader((prev) => {
        return {
          ...prev,
          [item.title]: item.default,
        };
      });
    });

    fileShow();
  }, []);
  return (
    <>
      <div className="relative overflow-x-auto">
        <button
          onClick={() => {
            setShowFilter(!showFilter);
          }}
        >
          fileds
        </button>
        {showFilter && (
          <div className="fixed top-4 bg-white w-max right-10 ">
            <div className="bg-gray-300 font-bold py-4 px-2">Add or Remove Column</div>
            {amazonTable[0].header.map((item, i) => {
              return (
                <div key={i}>
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showHeader[item.title]}
                      onChange={() => {
                        // setShowFilter(!showFilter)
                        setShowHeader((prev) => {
                          return {
                            ...prev,
                            [item.title]: !showHeader[item.title],
                          };
                        });
                      }}
                    />
                    {item.title}
                  </label>
                </div>
              );
            })}
          </div>
        )}
        <table>
          <thead className="bg-gray-200">
            <tr>
              {amazonTable[0].header.map((item) => {
                return (
                  <>
                    {showHeader[item.title] && (
                      <th className="px-6 py-3">{item.title}</th>
                    )}
                  </>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => {
              return (
                <>
                  <tr>
                    {showHeader.ID && <td className="px-6 py-3">{item?.id}</td>}
                    {showHeader.Campaign && (
                      <td className="px-6 py-3">{item?.campaign}</td>
                    )}
                    {showHeader.State && (
                      <td className="px-6 py-3">{item?.state}</td>
                    )}
                    {showHeader.Status && (
                      <td className="px-6 py-3">{item?.status}</td>
                    )}
                    {showHeader.Type && (
                      <td className="px-6 py-3">{item?._type}</td>
                    )}
                    {showHeader.Start_Date && (
                      <td className="px-6 py-3">{item?.start_date}</td>
                    )}
                    {showHeader.End_Date && (
                      <td className="px-6 py-3">{item?.end_date}</td>
                    )}
                    {showHeader.Budget && (
                      <td className="px-6 py-3">{item?.budget}</td>
                    )}
                    {showHeader.Targeting && (
                      <td className="px-6 py-3">{item?.targeting}</td>
                    )}
                    {showHeader.Campaign_Bidding_Strategy && (
                      <td className="px-6 py-3">
                        {item?.campaign_bidding_strategy}
                      </td>
                    )}
                    {showHeader.Portfolio && (
                      <td className="px-6 py-3">{item?.portfolio}</td>
                    )}
                    {showHeader.Top_of_Search_is && (
                      <td className="px-6 py-3">{item?.top_of_search_is}</td>
                    )}
                    {showHeader.Cost_Type && (
                      <td className="px-6 py-3">{item?.cost_type}</td>
                    )}
                    {showHeader.Impressions && (
                      <td className="px-6 py-3">{item?.impressions}</td>
                    )}
                    {showHeader.Clicks && (
                      <td className="px-6 py-3">{item?.clicks}</td>
                    )}
                    {showHeader.CTR && (
                      <td className="px-6 py-3">{item?._ctr}</td>
                    )}
                    {showHeader.Spend && (
                      <td className="px-6 py-3">{item?.spend}</td>
                    )}
                    {showHeader.Cpc && (
                      <td className="px-6 py-3">{item?._cpc}</td>
                    )}
                    {showHeader.Orders && (
                      <td className="px-6 py-3">{item?.orders}</td>
                    )}
                    {showHeader.ACOS && (
                      <td className="px-6 py-3">{item?._acos}</td>
                    )}
                    {showHeader.ROAS && (
                      <td className="px-6 py-3">{item?._roas}</td>
                    )}
                    {showHeader.Percent_of_Orders_ntb && (
                      <td className="px-6 py-3">
                        {item?._percent_of_orders_ntb}
                      </td>
                    )}
                    {showHeader.Viewable_Impressions && (
                      <td className="px-6 py-3">
                        {item?.viewable_impressions}
                      </td>
                    )}
                    {showHeader.VCOM && (
                      <td className="px-6 py-3">{item?._vcpm}</td>
                    )}
                    {showHeader.created_dttm && (
                      <td className="px-6 py-3">{item?.created_dttm}</td>
                    )}
                    {showHeader.modified_dttm && (
                      <td className="px-6 py-3">{item?.modified_dttm}</td>
                    )}
                    {showHeader.sales && (
                      <td className="px-6 py-3">{item?.sales}</td>
                    )}
                    {showHeader._ntb_order && (
                      <td className="px-6 py-3">{item?._ntb_order}</td>
                    )}
                    {showHeader._ntb_sales && (
                      <td className="px-6 py-3">{item?._ntb_sales}</td>
                    )}
                    {showHeader._percent_of_sales_ntb && (
                      <td className="px-6 py-3">
                        {item?._percent_of_sales_ntb}
                      </td>
                    )}
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AmazonTable;
