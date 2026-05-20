import { useMemo, useRef, useEffect, useState } from 'react';
import Map from './MapComponent/map';
import { fetchGlobalViewContinentCountryAnalysisData } from './services/service';
import Loader from "../../common-components/Loader";
import { useEbuxContext } from "../../Context/EbuxProvider";
import { IoIosRedo } from 'react-icons/io';
import { FaTag, FaFolder, FaMapMarkerAlt } from "react-icons/fa";
const GlobalSummary = ({
  loading, setLoading,
  kpiData,
  setKpiData,
  handle_active_client_project_change,
  regions,
  setRegions,
  countriesData,
  setCountriesData,
  selectedRegion,
  setSelectedRegion,
  active_client_project,
  continent_country
}) => {
  const icons = {
    brand: <FaTag className="w-4 h-4 text-blue-500" />,
    category: <FaFolder className="w-4 h-4 text-blue-500" />,
    location: <FaMapMarkerAlt className="w-4 h-4 text-blue-500" />,
    "product Id": <FaFolder className="w-4 h-4 text-blue-500" />,
    "OSA Status": <FaTag className="w-4 h-4 text-blue-500" />,
    platform: <FaTag className="w-4 h-4 text-blue-500" />,
    "Dark Store": <FaMapMarkerAlt className="w-4 h-4 text-blue-500" />,
};

  const {
    // kpi, 
    kpiMap,
    selectedFilters,
    // , filters
    initKpiSet,
    setSelectedHeaderOpen,
    headerFilterChips
  } = useEbuxContext();
  const [expandedCountry, setExpandedCountry] = useState("All");
  const previous_active_client_project = useRef();
  useEffect(() => {
    initKpiSet("GLOBALVIEW");
  }, ["GLOBALVIEW"]);

  // Build countries data per continent
  useEffect(() => {
    const _countriesData = {};
    continent_country?.forEach(item => {
      if (!_countriesData?.[item?.continent]) {
        _countriesData[item?.continent] = [];
      }
      _countriesData[item?.continent].push({
        name: item?.country ?? "",
        flag: item?.flag ?? 'https://flagcdn.com/w20/in.png',
        metrics: Object?.keys(item?.project?.kpi)?.filter(i => i == "OR" || item?.project?.kpi?.[i])?.map(i => ({ label: i == "OR" ? "Ranking" : kpiMap?.[i]?.label ?? kpiMap?.[i]?.lable, key: i })),
        // [
        //   { label: 'On Shelf Availability:', key: "OSA"},
        //   { label: 'Share of Search:', key: "SOS" },
        //   { label: 'Ranking:', key: "OR" },
        //   { label: 'Content Score:', key: "CS"},
        //   { label: 'Promotions:', key: "PRO" },
        //   { label: 'Rating & Reviews:', key: "RR" },
        // ],
        project: item?.project
      });
    });

    setCountriesData(_countriesData ?? {});
    setRegions(Object.keys(_countriesData ?? {}).sort((a, b) => a.localeCompare(b)));
  }, [continent_country, setCountriesData, setRegions]);
  const changeRegion = async (continent) => {
    // if(continent==selectedRegion){return ;}
    setLoading(true);
    try {
      const x_dsm_client_ids = [];
      const x_dsm_client_country = [];
      (continent_country)?.forEach(i => {
        if ((continent === "All") || continent == i?.continent) {
          x_dsm_client_ids.push(i?.project?.client_project_id);
          x_dsm_client_country.push(i?.project?.country);
        }
      })
      const payload = {
        continent,
        continent_ids: [...new Set(x_dsm_client_ids)],
        country: [...new Set(x_dsm_client_country)],
        selectedFilters: {
          selectedDateRange: selectedFilters?.selectedDateRange,
          selectedPlatform: selectedFilters?.selectedPlatform ?? [], selectedBrand: selectedFilters?.selectedBrand ?? [], selectedCategory: selectedFilters?.selectedCategory ?? [], selectedLocation: selectedFilters?.selectedLocation ?? [], selectedKeyword: selectedFilters?.selectedKeyword ?? []
        }
      }
      const response = await fetchGlobalViewContinentCountryAnalysisData(payload);
      // const response2 = await fetchGlobalViewCombineFiltersPdpKw(payload);
      // console.log('response2response2response2',response2)
      setKpiData(response);
      console.log({ response });

      setSelectedRegion(continent);
      if (continent == 'All' && expandedCountry != 'All') {
        setExpandedCountry("All");
      }
      setLoading(false);

    } catch (error) {
      console.log({ error });
      setLoading(false);

    }
  }

  useEffect(() => {
    if (selectedRegion) {
      changeRegion(selectedRegion);
    }
  }, [JSON.stringify(selectedFilters)])
  // Update selected region and expanded country when active client project changes
  useEffect(() => {
    previous_active_client_project.current = JSON.stringify(active_client_project);
    // changeRegion(active_client_project?.continent);
    // setExpandedCountry(active_client_project?.country);
  }, [active_client_project]);

  // Compute current countries to display
  const currentCountries = useMemo(() => {
    if (selectedRegion == "All") {

      return Object.values(countriesData)?.flat()?.sort((a, b) => a.name.localeCompare(b.name)) ?? [];
    }
    return countriesData[selectedRegion]?.sort((a, b) => a.name.localeCompare(b.name)) ?? [];
  }, [countriesData, selectedRegion]);

  // Ensure first country is expanded by default if none expanded
  useEffect(() => {
    if ((!expandedCountry && currentCountries?.length) || (currentCountries?.length && currentCountries?.findIndex(i => i?.name == expandedCountry) == -1) && selectedRegion != "All") {
      setExpandedCountry(currentCountries[0].name);
    }
  }, [currentCountries, expandedCountry]);

  // Toggle single country
  const toggleCountry = (countryName) => {
    setExpandedCountry(prev => (prev === countryName ? null : countryName));
  };

  // Continent bounds and center
  const continentBound = useMemo(() => {
    const continentData = {
      all: { bounds: [[-90, -180], [90, 180]], center: [20, 0] },
      africa: { bounds: [[-35.0, -20.0], [38.0, 55.0]], center: [8.0, 21.0] },
      asia: { bounds: [[-10.0, 25.0], [82.0, 180.0]], center: [34.0, 100.0] },
      europe: { bounds: [[34.0, -25.0], [72.0, 45.0]], center: [54.0, 15.0] },
      'north america': { bounds: [[5.0, -170.0], [85.0, -30.0]], center: [54.0, -100.0] },
      'south america': { bounds: [[-60.0, -90.0], [15.0, -30.0]], center: [-15.0, -60.0] },
      australia: { bounds: [[-50.0, 110.0], [0.0, 180.0]], center: [-25.0, 135.0] },
      antarctica: { bounds: [[-90.0, -180.0], [-60.0, 180.0]], center: [-75.0, 0.0] },
    };
    return continentData[selectedRegion?.toLowerCase()];
  }, [selectedRegion]);

  const renderMetric = (country_name, metric_key) => {
    const d = kpiData?.rowData?.[country_name?.toLowerCase()] ?? {};
    const metric = d?.[metric_key] ?? {};

    return (<div
      className={` ${selectedFilters?.selectedDateRange?.isCompareToPrevious ? "grid grid-cols-3" : "flex"} gap-0`}
    // className="flex items-center gap-3 overflow-x-auto overflow-y-auto"
    >
      {/* <pre>{JSON.stringify(kpiMap)}</pre> */}
      <span className="font-bold text-gray-900 text-sm">
        {metric?.value !== null && metric?.value !== undefined
    ? `${metric.value}${(metric_key === "RR" || metric_key === "OR") ? "" : "%"}`
    : "-"}

        {/* {metric?.value}{metric_key == "RR" ? "" : "%"} */}
        </span>

      {metric?.reference != undefined ?
        <>
          <span className="text-gray-500 text-xs">{metric?.reference ?? 0}{metric_key == "RR" ? "" : "%"}</span>


          <span className={`flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-full ${Number(metric.delta) >= 0
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
            }`}>
            {Number(metric?.delta) >= 0 ? '▲' : '▼'} {isNaN(metric?.delta) ? 0 : Math.abs(metric.delta)}%
          </span>
        </>
        : <></>
      }
    </div>);
  }
  const renderMetricALL = (data, metric_key) => {
    const metric = data;
    console.log('metric_keymetric_key',metric_key)
    
    return (<div className={` ${selectedFilters?.selectedDateRange?.isCompareToPrevious ? "grid grid-cols-3" : "flex"} gap-0`}
    // "flex items-center gap-3 overflow-x-auto overflow-y-auto"
    >
      {/* <pre>{JSON.stringify(kpiMap)}</pre> */}
      <span className="font-bold text-gray-900 text-sm">
        {metric?.value !== null && metric?.value !== "" && metric?.value !== undefined
    ? `${metric.value}${(metric_key === "RR" || metric_key === "OR") ? "" : "%"}`
    : "-"}
        {/* {metric?.value}{metric_key == "RR" ? "" : "%"} */}
        </span>

      {metric?.reference != undefined ?
        <>
          <span className="text-gray-500 text-xs">{metric?.reference ?? 0}{metric_key == "RR" ? "" : "%"}</span>


          <span className={`flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-full ${Number(metric.delta) >= 0
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
            }`}>
            {Number(metric?.delta) >= 0 ? '▲' : '▼'} {isNaN(metric?.delta) ? 0 : Math.abs(metric.delta)}{metric_key == "RR" ? "" : "%"}
          </span>
        </>
        : <></>
      }
    </div>);
  }

  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white w-full rounded-lg shadow-md flex flex-col px-4 shadow-lg">
      {Object.values(headerFilterChips).some(values => values && values.length > 0) && (

        <div className='w-full m-2 p-2 flex flex-wrap gap-2 bg-[#FFFFFF] rounded-lg shadow-sm'>
          {Object.entries(headerFilterChips).filter(([, values]) => values.length > 0).map(([section, values]) => {
            const displayValues = values
              .slice(0, 2)
              .map((v) => v.label)
              .join(", ");

            const remaining = values.length - 2;
            const chipObj = {
              "segmentData": "Segment",
              "dynamicPData": "Dynamic-P",
              "staticPData": "Static P",
              "subBrandData": "Sub Brand",
              "productTypeData": "Product Type",
            }
            const formattedSection = (chipObj?.[section] ?? section)
              .split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            return (
              <div
                key={section}
                className="flex items-center gap-2 px-3 py-2  border-[1px] border-[#D9D9D9] rounded-lg text-sm cursor-pointer"
                onClick={() => setSelectedHeaderOpen({ edit: true })}
              >
                {icons[section] || <FaTag className="w-4 h-4 text-blue-500" />}
                <div className='flex gap-2'>
                  {/* <span className="font-medium">{section.charAt(0).toUpperCase() + section.slice(1)}</span> */}
                  <span className={`font-medium ${section == 'osa_remarks' ? 'min-w-[100px]' : ''}`}>{formattedSection}</span>
                  <span className="text-gray-600 truncate max-w-[160px]">
                    {displayValues}
                  </span>
                </div>
                {remaining > 0 && (
                  <span
                    // onClick={() => setSelectedHeaderOpen({ edit: true })}
                    className="inline-flex items-center justify-center text-gray-500 text-xs rounded-full px-2 py-[2px] whitespace-nowrap bg-[#F0F0F0]  transition"
                  >
                    +{remaining} more
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="items-center flex py-3 border-b border-gray-200 bg-white gap-2">
        <div className="flex-1">
          <h1 className="text-2xl flex  gap-2">Global Summary {loading && <Loader show={loading} fullScreen={false} />}</h1>

        </div>
        <div className="bg-gray-100 flex gap-3 overflow-x-auto rounded-lg">
          {[...(regions?.length ? ["All", ...regions] : [])].map((region) => (
            <button
              key={region}
              onClick={() => changeRegion(region)}
              className={`px-8 py-2.5 bg-gray-100 rounded-lg text-sm font-normal whitespace-nowrap transition-all ${selectedRegion === region
                ? 'bg-white border-2 border-gray-200 text-gray-900 shadow-lg'
                : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {region}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setOpen(!open);
          }}
          className={`graphIconBtn ${open ? 'arrowRotate' : ''}`}
        >
          <img src="/assets/images/toggleDown.svg" width={20} height={20} />
        </button>
      </div>

      {/* Region selector */}
      {/* <div className="flex gap-6 py-4 bg-white">
        <div className="flex-1"></div>
        
      </div> */}

      {/* Map and right panel */}

      {open ?
        <div className="flex flex-1">
          <div className="flex-1 flex items-center justify-center bg-white overflow-hidden">
            <Map
              handle_active_client_project_change={handle_active_client_project_change}
              kpiData={kpiData?.rowData}
              initZoom={selectedRegion === "All" ? 2.4 : selectedRegion === "North America" ? 3 : 4}
              currentCountries={currentCountries}
              mapCenter={continentBound?.center}
              maxBounds={continentBound?.bounds}
            />
          </div>

          {/* Right panel */}
          <div className="w-[26%] bg-gray-50 flex flex-col">
            <div className="px-4 py-2 bg-gray-50 shrink-0">
              <h1 className="text-xl">Country Deep Dive</h1>
            </div>

            <div className="h-[600px] overflow-y-auto px-4">
              <div className="space-y-3">

                {currentCountries.length > 1 ? (
                  <div key={"All"} className="bg-white rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleCountry("All")}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className="flex items-center gap-3"

                      >
                        <span className="font-medium text-gray-900 text-lg">All</span>
                      </div>
                      <span className="text-2xl text-gray-400 font-light">
                        {expandedCountry === "All" ? '−' : '+'}
                      </span>
                    </button>

                    {expandedCountry === "All" && kpiData?.footerData && (
                      <div className="bg-gray-50 p-4">
                        {/* {JSON.stringify(kpiData?.footerData )} */}
                        <div className="space-y-4">
                          {Object?.keys(kpiMap).map((kpi, index) =>

                          (kpiData?.footerData?.[kpi] ?
                            <div key={kpi + index} className="flex items-center justify-between">
                              <span className={`${selectedFilters?.selectedDateRange?.isCompareToPrevious ? "w-[45%]" : "w-[70%]"} text-sm text-gray-700`}>{kpiMap?.[kpi]?.lable}</span>
                              <span className={`${selectedFilters?.selectedDateRange?.isCompareToPrevious ? "w-[55%]" : "w-[30%]"} text-sm text-gray-700`}>
                                {renderMetricALL(kpiData?.footerData?.[kpi], kpi)}
                              </span>
                            </div>
                            : <></>
                          )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : <></>}
                {currentCountries.map((country) => (
                  <div key={country.name} className="bg-white rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleCountry(country.name)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className="flex items-center gap-3"
                      // onClick={(e) => {
                      //   e.stopPropagation();
                      //   handle_active_client_project_change(country?.project);
                      // }}
                      >
                        <span className="text-2xl">
                          <img src={country.flag} alt={`${country.name} flag`} className="w-5 h-3" />
                        </span>
                        <span className="font-medium text-gray-900 text-lg">{country.name}</span>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-2xl text-gray-400 font-light">
                          {expandedCountry === country.name ? '−' : '+'}
                        </span>
                        <button className='border border-gray-200 p-1' onClick={(e) => {
                          e.stopPropagation();
                          handle_active_client_project_change(country?.project);
                        }}>
                          <IoIosRedo />
                        </button>
                      </div>

                    </button>

                    {expandedCountry === country.name && country.metrics.length > 0 && (
                      <div className="bg-gray-50 p-4">
                        {/* {JSON.stringify(country.metrics)} */}
                        <div className="space-y-4">
                          {country.metrics.map((metric, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className={`${selectedFilters?.selectedDateRange?.isCompareToPrevious ? "w-[45%]" : "w-[70%]"} text-sm text-gray-700`}>{metric?.label}</span>
                              <span className={`${selectedFilters?.selectedDateRange?.isCompareToPrevious ? "w-[55%]" : "w-[30%]"} text-sm text-gray-700`}>

                                {renderMetric(country?.name, metric.key)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        : <></>}
    </div>
  );
};

export default GlobalSummary;
