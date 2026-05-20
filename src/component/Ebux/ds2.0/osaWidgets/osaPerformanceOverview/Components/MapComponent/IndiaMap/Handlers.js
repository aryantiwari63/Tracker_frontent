import { zoomIntoPincode,zoomIntoCity, zoomIntoRegion, zoomIntoState, zoomOutRegion } from "./mapHelpers";
import { 
  // citiesData, 
  stateRegionMap } from "./Constant";
export const handleCountryClick = (setSelectedCities, setSelectedStates, setLabelMarkers, setSelectedRegion, changeMode, changeRegion, map) => {
  



  changeMode("region");
      changeRegion(null);
      setSelectedRegion(null);
      setSelectedStates([]);
      setSelectedCities([]);
      setLabelMarkers([]);
      
  zoomOutRegion(map);
};

export const handleRegionClick = (region, setSelectedCities, setSelectedStates, setLabelMarkers, setSelectedRegion, changeMode, changeRegion, map,
      filters,
      Country) => {
        if(Country!="India") {
          const _data={};
          filters?.locationPincode?.filter(city => city.region === region)?.forEach(i => {
            if(!_data[i?.city??""]){
              _data[i?.city??""]={name: (i?.city??""), region: (i?.region??""), lat: (i?.latitude??""), lng: (i?.longitude??"") }
            }
          });
          const cities =Object.values(_data);
          setSelectedCities(cities);
          setLabelMarkers([]);
          changeMode("city");
          
        }else{
          const regionStates = Object.keys(stateRegionMap).filter(state => stateRegionMap[state] === region);
  
          setSelectedCities([]);
          setSelectedStates(regionStates);
          setLabelMarkers(regionStates);

          changeMode("state");
        }
  
  setSelectedRegion(region);

  changeRegion(region);
  

  zoomIntoRegion(region, map);
};

export const handleStateClick = (stateName, setSelectedCities, setLabelMarkers, changeMode, changeState, map,filters) => {
  // const cities = citiesData.filter(city => city.state === stateName);
  const _data={};
   filters?.locationPincode?.filter(city => city.state === stateName)?.forEach(i => {
    if(!_data[i?.city??""]){
      _data[i?.city??""]={name: (i?.city??""), state: (i?.state??""), lat: (i?.latitude??""), lng: (i?.longitude??"") }
    }
   });
// console.log({"sagar":stateName},cities);
  const cities =Object.values(_data);
  // alert(JSON.stringify(cities))
  setSelectedCities(cities);
  setLabelMarkers([]);
  changeMode("city");
  changeState(stateName);

  zoomIntoState(stateName, map);
};

export const handleCityClick = (cityName, setSelectedPincodeList, setLabelMarkers, changeMode, changeCity, map,filters) => {
  // const cities = citiesData.filter(city => city.state === cityName);
  
    const pincodeList =filters?.locationPincode?.filter(city => city.city === cityName)?.map(i => ({
     name: (i?.lable??i?.pincode??""), state: (i?.state??""), city: (i?.city??""),   lat: (i?.latitude??""), lng: (i?.longitude??"") 
   }));
// console.log({"sagar":cityName},cities);
 
  // alert(JSON.stringify(pincodeList))
  setSelectedPincodeList(pincodeList);
  setLabelMarkers([]);
  changeMode("pincode");
  changeCity(cityName);

  // zoomIntoCity(pincodeList?.[0]?.state, map);
  zoomIntoCity(pincodeList, map);
};


export const handlePincodeClick = (pincode, setSelectedDarkStoreList, setLabelMarkers, changeMode, changePincode, map,filters) => {
  // const cities = citiesData.filter(city => city.state === pincode);
    
    
    const darkStoreList =filters?.locationPincode?.filter(city => city.pincode?.toString() === pincode?.toString())?.map(i => ({
     name: (i?.address??i?.store_id??""), state: (i?.state??""), city: (i?.city??""),pincode:(i?.pincode??""),   lat: (i?.latitude??""), lng: (i?.longitude??"") 
   }));
// console.log({"sagar":pincode},cities);
 
  // alert(JSON.stringify(darkStoreList))
  setSelectedDarkStoreList(darkStoreList);
  setLabelMarkers([]);
  changeMode("darkstore");
  changePincode(pincode);

  // zoomIntoCity(pincodeList?.[0]?.state, map);
  zoomIntoPincode(darkStoreList, map);
};

// handler.js

// export const handleCityClick = (stateName) => {
//     const citiesInState = citiesData.filter(city => city.state === stateName);

//     if (citiesInState.length > 0) {
//       // const clickedCity = citiesInState[0];
//       // console.log("Clicked City Name:", clickedCity.name);
  
//       // const samplePoints = [
//       //   [clickedCity.lat, clickedCity.lng, 0.8], // Amazon
//       //   [clickedCity.lat + 0.05, clickedCity.lng + 0.05, 0.6], // Flipkart
//       // ];
  
//       // setHeatmapPoints(samplePoints);
//     } else {
//       // console.log("No cities found for state:", stateName);
//     }
// };
  
