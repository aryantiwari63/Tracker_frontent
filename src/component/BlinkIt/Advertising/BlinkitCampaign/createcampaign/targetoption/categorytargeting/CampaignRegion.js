import React, { useState } from "react";
import { GET_BLINKIT_CITIES_LIST } from "../../../../../../../utils/constants";
import { _GET } from "../../../../../../../services/axios.method";

const CampaignRegion = ({
  setCampaignData,
  campaignData,
  handleChange,
  error,
}) => {
  const [cities, setCities] = React.useState([]);
  const getCities = async () => {
    const res = await _GET(GET_BLINKIT_CITIES_LIST);

    if (res.data?.data?.data?.length) {
      setCities([...res.data.data.data]);
    }
  };

  React.useEffect(() => {
    if (campaignData?.location === "cities") {
      getCities();
    }
  }, [campaignData?.location]);
  React.useEffect(() => {
    if (campaignData?.location === "panIndia") {
      setCampaignData({
        ...campaignData,
        cities: [],
      });
      setSelected([]);
    }
  }, [campaignData?.location]);
  const [Selected, setSelected] = useState([]);
  const [initialset, setInitialset] = React.useState(false);

  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      cities: Selected,
    });
  }, [Selected]);
  React.useEffect(() => {
    if (campaignData?.cities?.length && !initialset) {
      setSelected([...campaignData.cities]);

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
          <button className="" onClick={handleSelect}>
            {title}
          </button>
          <button
            className="px-1 searchproductfield__delbutton"
            onClick={handleRemove}
          >
            x
          </button>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="text-md font-bold leading-6"> Select campaign region</div>
      <div className="text-xs mt-1">
        {" "}
        Choose locations where your audience is most active
      </div>
      <div className="row">
        <div className="col_2 py-3 px-1">
          <label className="pl-2 flex items-center gap-2" htmlFor="location">
            <input
              type="radio"
              name="location"
              value={"panIndia"}
              id="location"
              // onClick={(e) => setLocation(e.target.value)}
              checked={campaignData?.location === "panIndia"}
              onChange={handleChange}
              className="accent-green-600"
            />
            Pan India
          </label>
        </div>
        <div className="py-3 px-1 col_2">
          <label className="pl-2 flex items-center gap-2 " htmlFor="cities">
            <input
              type="radio"
              name="location"
              id="cities"
              value={"cities"}
              checked={campaignData?.location === "cities"}
              onChange={handleChange}
              className="accent-green-600"
            />
            Select cities
          </label>
        </div>
        {campaignData?.location === "cities" && (
          <div className="row gap-2">
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
    </>
  );
};
export default CampaignRegion;
