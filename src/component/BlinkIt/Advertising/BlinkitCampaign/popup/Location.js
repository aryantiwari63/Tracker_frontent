import React from "react";
import { FETCH_LOCATION } from "../../../../../utils/constants";
import LocationPopup from "../../../../common-components/Popups/LocationPopup";
import { IoIosSearch } from "react-icons/io";
import { _POST } from "../../../../../services/axios.method";
import LocationConfirm from "./LocationConfirm";

const Location = ({
  setShowPopup,
  selectedCheckBox,
  callApi,
  campaignSelection,
}) => {
  const [search, setSearch] = React.useState("");
  const [city, setCity] = React.useState([]);
  const [location, setLocation] = React.useState([]);
  const [selectedLocation, setSelectedLocation] = React.useState("pan_india");
  const [selectAll, setSelectAll] = React.useState(false); // for select All
  const [selectedCity, setSelectedCity] = React.useState([]);
  const [confirm, setConfirm] = React.useState(false);
  const [loading,setLoading] = React.useState(false)
  let status =
    selectedLocation === "pan_india"
      ? `All selected campaigns (${selectedCheckBox?.campaign?.length}) will be updated to Pan India.`
      : `All selected cities will be added to the selected campaigns (${selectedCheckBox?.campaign?.length}). If a location already exists in a campaign, no changes will be made.`;

  const getLocation = async () => {
    try {
      const resp = await _POST(FETCH_LOCATION);
      let result = resp?.data?.data?.location.map((item) => {
        return {
          id: item.blinkit_id,
          name: item.name,
        };
      });
      setLocation(result);
      setCity(result);
    } catch (error) {
      console.error(error);
    }
  };

  const searchCities = () => {
    let tempCity = location.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    setCity(tempCity);
  };

  const handleCheckBox = (e) => {
    console.error(selectedCity, "single");

    if (selectedCity.length && selectedCity.includes(e)) {
      let tempArray = selectedCity.filter((item) => item !== e);
      setSelectedCity(tempArray);
    } else {
      setSelectedCity([...selectedCity, e]);
    }
    setSelectedLocation("selected_city");
  };

  const handleAllCheckBox = (checked) => {
    // console.error(checked, "all");
    if (checked) {
      let tempArray = location.map((item) => item.id);
      setSelectedCity(tempArray);
      setSelectedLocation("pan_india");
    } else {
      setSelectedCity([]);
    }
  };

  const handleApply = async () => {
    setLoading(true)
    setConfirm(false);
    let message;
    let data = selectedCheckBox?.campaign?.map((item) => {
      if (selectedLocation == "pan_india") {
        message = "Location set to pan India";
      }
      if (selectedLocation == "selected_city") {
        message = "Location set for multiple selected cities";
      }
      return {
        campaign_id: [item.campaign_id],
        campaign_name: [item.campaign_name],
        action_type: "campaign",
        action: "campaign_location_action",
        action_message: message,
        media_type: "Blinkit",
        action_status: 10,
        segment: item?.campaign_type,
        location: selectedLocation,
        ...(selectedLocation === "selected_city" && {
          cities: selectedCity.join(","),
        }),
      };
    });
    await callApi(data);
    setLoading(false)
    setShowPopup(false);
    campaignSelection(false);
  };

  React.useEffect(() => {
    if (search) {
      searchCities();
    } else {
      setCity(location);
    }
  }, [search]);

  React.useEffect(() => {
    handleAllCheckBox(selectAll);
  }, [selectAll]);

  React.useEffect(() => {
    getLocation();
  }, []);

  // Handle initial selection when "Pan India" is selected
  React.useEffect(() => {
    if (selectedLocation === "pan_india") {
      setSelectAll(true);
      setSelectedCity(location.map((item) => item.id)); // Select all cities
      handleAllCheckBox(selectAll);
    }
  }, [selectedLocation, location]);

  return (
    <>
      <LocationPopup
        setShowPopup={setShowPopup}
        platform={"blinkit"}
        setTempView={() => {}}
        applyAction={() => setConfirm(true)}
        extrasmall
        disableButton={selectedCity.length === 0}
        title={`Add Location | ${selectedCheckBox?.campaign?.length} Campaign Selected`}
        progress={loading}
      >
        <div className="flex flex-col col-span-1 gap-1 py-5 px-4 font-inter text-base font-normal leading-6 text-left">
          <div className="flex gap-2 bg-white items-center px-3 py-2 border">
            <input
              type="radio"
              id="panIndia"
              name="location"
              value="panIndia"
              checked={selectedLocation === "pan_india"}
              onChange={() => {
                setSelectedLocation("pan_india");
              }}
            />
            <label
              htmlFor="panIndia"
              className="font-inter text-base font-normal leading-6 text-left"
            >
              Pan India
            </label>
          </div>
          <div className="pt-2 mt-2 border bg-white">
            <div className="pb-4 border-b">
              <div className="flex gap-2  items-center px-3">
                <input
                  type="radio"
                  id="selectCities"
                  name="location"
                  value="selectCities"
                  checked={selectedLocation === "selected_city"}
                  onChange={() => {
                    setSelectedLocation("selected_city");
                    setSelectedCity([]);
                  }}
                />
                <label
                  htmlFor="selectCities"
                  className="font-inter text-base font-medium leading-6 text-center"
                >
                  Select Cities
                </label>
              </div>
              <div className="px-3 mt-2 flex relative">
                <IoIosSearch
                  size={20}
                  className="absolute left-5 top-2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="h-[37px] border w-full px-1 pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div
              style={{
                maxHeight: "320px",
                minHeight: "320px",
                overflowY: "auto",
              }}
            >
              <li className="px-3 py-3 flex gap-2 border-b sticky top-0 z-10 bg-[white]">
                <input
                  type="checkbox"
                  checked={location.length == selectedCity.length}
                  onChange={(e) => {
                    setSelectAll(e.target.checked);
                    handleAllCheckBox(e.target.checked);
                    setSelectedLocation(
                      e.target.checked ? "pan_india" : "selected_city"
                    );
                  }}
                />
                <span className="font-semibold">Select All</span>
              </li>
              {city.map((item) => {
                return (
                  <li
                    className="px-3 py-3 flex gap-2 border-b cursor-pointer"
                    key={item.id}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCity.includes(item.id)}
                      value={item.id}
                      onChange={() => {
                        // setSelectedLocation("selected_city");
                        handleCheckBox(item.id);
                      }}
                    />
                    <span onClick={() => handleCheckBox(item.id)}>
                      {item.name}
                    </span>{" "}
                  </li>
                );
              })}
            </div>
          </div>
        </div>
      </LocationPopup>
      {confirm && (
        <LocationConfirm
          handleSuccess={handleApply}
          handleCancel={() => setConfirm(false)}
          status={status}
        />
      )}
    </>
  );
};

export default Location;
