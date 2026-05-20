import React, { useState } from "react";
import { GET_BLINKIT_CITIES_LIST } from "../../../../../../../utils/constants";
import { _GET } from "../../../../../../../services/axios.method";

const CampaignRegion = ({
  setCampaignData,
  campaignData,
  handleChange,
  error,
}) => {
  // const cities = [
  //   {
  //     id: 1,
  //     name: "Delhi",
  //     value: "delhi",
  //   },
  //   {
  //     id: 2,
  //     name: "Mumbai",
  //     value: "mumbai",
  //   },
  //   {
  //     id: 3,
  //     name: "Jaipur",
  //     value: "jaipur",
  //   },
  //   {
  //     id: 4,
  //     name: "Ajmer",
  //     value: "ajmer",
  //   },
  //   {
  //     id: 5,
  //     name: "Uttar Pradesh",
  //     value: "up",
  //   },
  //   {
  //     id: 6,
  //     name: "Goa",
  //     value: "goa",
  //   },
  // ];
  const [cities, setCities] = React.useState([]);
  const [initialset, setInitialset] = React.useState(false);
  const getCities = async () => {
    const res = await _GET(GET_BLINKIT_CITIES_LIST);

    if (res.data?.data?.data?.length) {
      setCities([...res.data.data.data]);
    }
  };

  // React.useEffect(() => {
  //   console.log("campaignData cities", cities);
  // }, [cities]);
  React.useEffect(() => {
    if (campaignData?.location === "cities") {
      getCities();
    }
  }, [campaignData?.location]);
  const [Selected, setSelected] = useState([]);
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    // console.log("campaignData Selected", Selected);
    setCampaignData({
      ...campaignData,
      cities: Selected,
    });
  }, [Selected]);
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    // console.log("campaignData campaignData.cities", campaignData.cities);

    if (campaignData?.cities?.length && !initialset) {
      setTimeout(function () {
        setSelected([...campaignData.cities]);
      }, 2000);
      setInitialset(true);
    }
  }, [campaignData.cities]);
  const CampaignCities = ({ title }) => {
    const handleSelect = () => {
      let currentElement = cities.filter((item) => item.name === title);
      setSelected([...Selected, ...currentElement]);
    };
    const handleRemove = () => {
      setSelected((prev) => prev.filter((item) => item.name !== title));
    };

    return (
      <>
        <div
          className={[
            "searchproductfield__selectedoptions",
            "searchproductfield__selectedoptions--sel",
            Selected.some((ele) => ele.name === title) &&
              "searchproductfield__selectedoptions--active",
          ].join(" ")}
        >
          <button
            className="px-1 searchproductfield__delbutton"
            onClick={handleRemove}
          >
            x
          </button>
          <button className="" onClick={handleSelect}>
            {title}
          </button>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="row  text-xs font-semibold ">Set campaign region</div>
      <div className="row">
        <div className="col_2 py-3 px-1">
          <label className="pl-2" htmlFor="location">
            <input
              type="radio"
              name="location"
              value={"panIndia"}
              // onClick={(e) => setLocation(e.target.value)}
              checked={campaignData?.location == "panIndia"}
              onChange={handleChange}
            />
            Pan India
          </label>
        </div>
        <div className="py-3 px-1 col_2">
          <label className="pl-2" htmlFor="location">
            <input
              type="radio"
              name="location"
              value={"cities"}
              checked={campaignData?.location == "cities"}
              // onClick={(e) => setLocation(e.target.value)}
              onChange={handleChange}
            />
            Select cities
          </label>
        </div>
        {campaignData?.location === "cities" && (
          <div className="row">
            {cities?.map((item) => (
              // eslint-disable-next-line react/jsx-key
              <CampaignCities
                title={item.name}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            ))}
          </div>
        )}
      </div>
      {error.location && <p className="errorText">{error.location}</p>}
      {error.cities && <p className="errorText">{error.cities}</p>}
      {error.inputError && <p className="errorText">{error.inputError}</p>}
      {error.inputKeywordError && (
        <p className="errorText">{error.inputKeywordError}</p>
      )}
      {error.inputSmartKeywordError && (
        <p className="errorText">{error.inputSmartKeywordError}</p>
      )}
      {error.categoryValue && (
        <p className="errorText">{error.categoryValue}</p>
      )}
    </>
  );
};
export default CampaignRegion;
