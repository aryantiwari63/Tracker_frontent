/* eslint-disable no-unused-vars */
import React from "react";
import { format, addDays } from "date-fns";
import {
  catalogHeaders,
  splitCatalogHeaders,
  csvCatalogHeadersExport,
} from "../../../utils/commonScreenConstant";

import Toast from "../../common-components/toast";
import { _POST } from "../../../services/axios.method";

import DatePicker from "../../DatePicker";

import MultiSearch from "../../common-components/MultiSearch/MultiSearch";
// import AmazonCampaigntableHeader from "./AmazonCampaignTableHeader";
import CatalogTable from "./CatalogTable";
import { CSVLink } from "react-csv";
import { HiDownload } from "react-icons/hi";
import ImportSideDrawer from "./ImportSideDrawer";
import { GET_COMMON_ACCOUNTS } from "../../../utils/constants";
import { cancelRequest, getLocalStorageAccounts, saveLocalStorageAccounts, defaultDateRange } from "../../../utils/helpers";
import BarGraph from "./BarGraph";
import FunnelGraph from "./FunnelGraph";
import "./catalogtable.css";
import IntentPopUp from "./IntentPopUp";
import _ from "lodash";

class Catalog extends React.Component {
  constructor(props) {
    super(props);
    const dateFilters = defaultDateRange();
    this.state = {
      loading: undefined,
      brands: [],
      download: 0,
      selectedBrand: "",
      e_genie_id: undefined,
      downloadType: undefined,
      headers: catalogHeaders,
      calState: [
        {
          showCalender: false,
          fullCalender: false,
          dateApplied: false,
        },
      ],
      dateRange: [
        {
          startDate: new Date(dateFilters["startDate"]),
          endDate: new Date(dateFilters["endDate"]),
          key: dateFilters["key"],
        },
      ],
      dateFilter: [],
      importType: undefined,
      offset: 0,
      nextCallRequired: false,
      products: [],
      productBreakdownData: [
        {
          amazonData: [],
          flipkartData: [],
          zeptoData: [],
          blinkitData: [],
        },
      ],
      filters: [],
      clearSearchFilter: false,
      showSideBar: false,
      dataBasedOn: "spend",
      isGraphLoaded: false,
      groupGraph: "day",
      trendGraphData: [],

      selectedProduct: [],
      selectedRow: [],
      activeConversion: undefined,
      isConversionGraphLoaded: false,
      conversionGraphData: [],
      csvStatus: undefined,
    };
    this.childRef = null;
    this.closeSideBar = this.closeSidebar.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.dataBasedOn !== this.state.dataBasedOn ||
      prevState.groupGraph !== this.state.groupGraph ||
      // prevState.selectedRow !== this.state.selectedRow ||
      prevState.selectedProduct !== this.state.selectedProduct
    ) {
      this.setState({
        activeConversion: undefined,
      });
      this.trendGraph();
    }

    if (prevState.activeConversion !== this.state.activeConversion) {
      // console.log("etstt", this.state.activeConversion);
      this.conversionGraph();
    }
  }

  async componentDidMount() {
    try {
      const result = await _POST(GET_COMMON_ACCOUNTS, {
        platforms: JSON.parse(localStorage.getItem("platforms")),
      });
      const data = result.data.data;
      if (!Array.isArray(data)) {
        console.error("Common Account Data  is not an array or is undefined");
        return;
      }

      const brands = data.map((item) => ({
        label: item.account_name,
        value: item.account_name,
        id: item.id,
      }));
      let accountsFilter = _.cloneDeep(brands);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
         let firstAccount = savedAccounts[0];
         let filterAccount = brands.find(acc => acc.value === firstAccount);
         if (filterAccount) {
            accountsFilter = [filterAccount]
            saveLocalStorageAccounts([accountsFilter[0]?.value])
         } else {
           saveLocalStorageAccounts([accountsFilter[0]?.value])
         }
      } else {
        saveLocalStorageAccounts([accountsFilter[0]?.value])
      }

      
      this.setState(
        {
          brands,
          selectedBrand: accountsFilter[0].id,
        },
        () => {
          this.getProductCatalog();
          this.trendGraph();
          this.conversionGraph();
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
  async closeSidebar() {
    this.setState({
      showSideBar: false,
    });
  }

  getProductCatalog = async () => {
    try {
      const { dateRange, offset, selectedBrand, filters } = this.state;

      this.setState({
        loading: "product",
      });
      const ourRequest = await cancelRequest();
      const res = await _POST(
        "/catalog/products",
        { dateRange, offset, selectedBrand, filters },
        {
          cancelToken: ourRequest.token,
        }
      );
      if (res?.data?.status) {
        this.setState({
          loading: undefined,
          products: res?.data?.data,
        });

        if (res?.data?.data.length === 50)
          this.setState({ nextCallRequired: true });
      }
    } catch (e) {
      console.error(e);
    }
  };

  applyDate = () => {
    this.onChangeDate({ selection: this.state.dateRange[0] }, "apply");
    this.setState({
      calState: {
        showCalender: false,
        fullCalender: false,
        dateApplied: true,
      },
    });
  };

  onChangeDate = (item, isApply) => {
    let { calState, e_genie_id } = this.state;
    defaultDateRange(item.selection);
    this.setState({ dateRange: [item.selection] }, () => {
      if (isApply) {
        this.trendGraph();
        if (e_genie_id) this.productSplit(e_genie_id);
      }
    });
    if (!calState.fullCalender) {
      this.setState(
        {
          calState: { ...calState, showCalender: false, dateApplied: true },
        },
        () => {
          this.trendGraph();
          this.conversionGraph();
          if (e_genie_id) this.productSplit(e_genie_id);
        }
      );
    }
  };

  productSplit = async (e_genie_id) => {
    try {
      const { dateRange, selectedBrand } = this.state;
      let startDate = format(dateRange[0].startDate, "yyyy-MM-dd");
      let endDate = format(dateRange[0].endDate, "yyyy-MM-dd");
      this.setState({
        loading: "productBreakdown",
      });
      const ourRequest = await cancelRequest();
      const res = await _POST(
        "/catalog/getCampaigns",
        { startDate, endDate, selectedBrand, e_genie_id },
        {
          cancelToken: ourRequest.token,
        }
      );
      if (res?.data?.status) {
        let productBreakdownData = [];
        productBreakdownData.push(res?.data?.data);
        this.setState({
          loading: undefined,
          productBreakdownData,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  applySearchFilter = (sFilters, current, objFirst, objSecond) => {
    let { filters } = this.state;

    let apiFilter = [objFirst, objSecond];

    if (!objFirst || !objSecond) filters[current] = [];
    else filters[current] = apiFilter;
    this.setState({ filters: { ...filters } }, () => {
      this.getProductCatalog();
    });
  };

  trendGraph = async () => {
    try {
      const {
        dateRange,
        dataBasedOn,
        selectedBrand,
        groupGraph,
        selectedProduct,
      } = this.state;
      let startDate = format(dateRange[0].startDate, "yyyy-MM-dd");
      let endDate = format(dateRange[0].endDate, "yyyy-MM-dd");
      this.setState({
        isGraphLoaded: false,
      });
      const ourRequest = await cancelRequest();
      const res = await _POST(
        "/catalog/trendBarGraph",
        {
          startDate,
          endDate,
          selectedBrand,
          dataBasedOn,
          groupGraph,
          selectedProduct,
        },
        {
          cancelToken: ourRequest.token,
        }
      );
      if (res?.data?.status) {
        // console.log("trendGraphData:::", res?.data?.data);
        this.setState({
          trendGraphData: res?.data?.data,
          isGraphLoaded: true,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  conversionGraph = async () => {
    try {
      const {
        dateRange,
        dataBasedOn,
        selectedBrand,
        // groupGraph,
        selectedProduct,
        activeConversion,
      } = this.state;
      let startDate = format(dateRange[0].startDate, "yyyy-MM-dd");
      let endDate = format(dateRange[0].endDate, "yyyy-MM-dd");
      this.setState({
        isConversionGraphLoaded: false,
      });
      const ourRequest = await cancelRequest();
      const res = await _POST(
        "/catalog/conversionGraph",
        {
          startDate,
          endDate,
          selectedBrand,
          dataBasedOn,
          // groupGraph,
          selectedProduct,
          activeConversion,
        },
        {
          cancelToken: ourRequest.token,
        }
      );
      if (res?.data?.status) {
        this.setState({
          conversionGraphData: res?.data?.data,
          isConversionGraphLoaded: true,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    let {
      selectedBrand,
      dateRange,
      calState,
      // showProductModal,
      download,
      headers,
      importType,
      brands,
      nextCallRequired,
      products,
      loading,
      productBreakdownData,
      clearSearchFilter,
      dataBasedOn,
      trendGraphData,
      isGraphLoaded,
      groupGraph,
      selectedProduct,
      conversionGraphData,
      isConversionGraphLoaded,
      activeConversion,
      showSideBar,
      selectedRow,
    } = this.state;
    return (
      <div>
        <div className="">
          <Toast></Toast>
          {importType && (
            <ImportSideDrawer
              title={importType === "new" ? "Import" : "Update Existing"}
              importType={importType}
              selectedRow={selectedRow}
              closeModal={() =>
                this.setState(
                  {
                    importType: undefined,
                  },
                  () => {
                    this.getProductCatalog();
                  }
                )
              }
            ></ImportSideDrawer>
          )}
          <section className=" flex-nowrap border p-4 bg-white sticky top-14 z-40">
            <div className="flex items-center justify-between">
              <div className="flipkart__selectfilter">
                <select
                  className="campaignselect "
                  onChange={(e) => {
                    this.setState({ selectedBrand: e.target.value }, () => {
                      const filterBrand = brands.find(ele => ele.id == e.target.value);
                      saveLocalStorageAccounts([filterBrand.label])
                      this.setState({
                        selectedRow: [],
                      });
                      this.getProductCatalog();
                      this.trendGraph();
                      this.conversionGraph();
                    });
                  }}
                >
                  {brands.map((row, i) => {
                    return (
                      <option
                        key={i}
                        selected={row.id === selectedBrand}
                        value={row.id}
                      >
                        {row.label}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className=" flipkart__calander mr-4">
                <DatePicker
                  onChangeDate={this.onChangeDate}
                  state={dateRange}
                  setState={(data) => this.setState({ dateRange: data })}
                  calState={calState}
                  setCalState={(data) => this.setState({ calState: data })}
                  position={""}
                  applyDate={this.applyDate}
                  platform={"ams"}
                  className="border"
                />
              </div>
            </div>
          </section>
          <div className="mt-4">
            <div className="flipkart__graphcard ">
              <div className="row">
                <div className="col_8 w-[69%]">
                  <div className="outerContainerTableMetric py-[20px] px-[20px] row w-full justify-between mb-[0px]">
                    <div className="row px-[10px] text-lg mb-[10px]">
                      <div className="col_6">
                        <b>Trend Graph</b>
                      </div>
                      <div className="col_3 ">
                        <select
                          className="campaignselect w-[70%] float-right"
                          onChange={(e) => {
                            this.setState({ groupGraph: e.target.value });
                          }}
                        >
                          <option selected={"day" === groupGraph} value="day">
                            Daily
                          </option>
                          <option selected={"week" === groupGraph} value="week">
                            Weekly
                          </option>
                          <option
                            selected={"month" === groupGraph}
                            value="month"
                          >
                            Monthly
                          </option>
                        </select>
                      </div>
                      <div className="col_3 ">
                        <select
                          className="campaignselect w-[80%] float-right"
                          onChange={(e) => {
                            this.setState({ dataBasedOn: e.target.value });
                          }}
                        >
                          <option
                            selected={"spend" === dataBasedOn}
                            value="spend"
                          >
                            Spend
                          </option>
                          <option
                            selected={"sales" === dataBasedOn}
                            value="sales"
                          >
                            Sales
                          </option>
                          <option
                            selected={"roas" === dataBasedOn}
                            value="roas"
                          >
                            ROAS
                          </option>
                          <option
                            selected={"impressions" === dataBasedOn}
                            value="impressions"
                          >
                            Impressions
                          </option>
                        </select>
                      </div>
                    </div>

                    <BarGraph
                      trendGraphData={trendGraphData}
                      dataBasedOn={dataBasedOn || "spend"}
                      isGraphLoaded={isGraphLoaded}
                      activeConversion={activeConversion}
                      setActiveConversion={(e) =>
                        this.setState({
                          activeConversion: e,
                        })
                      }
                    />
                  </div>
                </div>
                <div className=" w-[1%] bg-[#F5F8FA]"></div>
                <div className="col_4 w-[30%]">
                  <div className="outerContainerTableMetric py-[20px] px-[20px] row w-full justify-between mb-[0px] h-[100%]">
                    <div className="row px-[10px] text-lg">
                      <div className="col_12">
                        <b>
                          {activeConversion ? activeConversion : "Overall"}
                          &nbsp;Conversion
                        </b>
                      </div>
                    </div>

                    <FunnelGraph
                      activeConversion={activeConversion}
                      conversionGraphData={conversionGraphData}
                      isConversionGraphLoaded={isConversionGraphLoaded}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" pt-5">
            <div className="col_12">
              <div
                className="campaign__search outline-none "
                style={{ display: "flex" }}
              >
                <MultiSearch
                  saveSearch={{
                    key: "saved_search",
                    label: "Saved Search",
                    selectable: false,
                  }}
                  applySearchFilter={this.applySearchFilter}
                  clearSearch={clearSearchFilter}
                  setClearSearch={() =>
                    this.setState({
                      clearSearchFilter: false,
                    })
                  }
                  mediaName="catalog"
                />
                {/* <button
                  type="submit"
                  onClick={() => this.setState({ importType: "saved_search" })}
                  className="px-4 rounded-md  py-2 border bg-white campiagnbtn--ams"
                  style={{ marginLeft: 10 }}
                >
                  <b>+</b> Add New
                </button>

                <button
                  type="submit"
                  className="campiagnbtn--ams px-4 rounded-md  py-2 border bg-white"
                  onClick={() => {
                    //   setClearSearch(true);
                  }}
                >
                  <b>+</b> Add to existing
                </button> */}
                {/* <div className="hygieneButtonContainer w-[10%] h-[3rem]">
                  <button
                    onClick={() =>
                      this.setState({
                        showSideBar: !showSideBar,
                      })
                    }
                    disabled={selectedRow.length != 1}
                    className="hygieneButton__btn w-[100%] h-[3rem]"
                  >
                    <div className="hygieneButton m-[auto]">
                      <img
                        // className="header-buttons mr-1"
                        src="/assets/images/Hygiene.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                      <span>Hygiene Assistant</span>
                    </div>
                  </button>

                  {showSideBar ? (
                    <IntentPopUp
                      closeSideBar={this.closeSideBar}
                      selectedRow={selectedRow}
                      showSideBar={showSideBar}
                      setShowSideBar={(e) =>
                        this.setState({
                          showSideBar: e,
                        })
                      }
                    />
                  ) : null}
                </div> */}
              </div>
            </div>
            <div className="row ">
              <div className="row  justify-between pb-4  bg-white px-4">
                <div className="amazon__campheader"></div>
                <div className="col">
                  <div className="row justify-between items-center">
                    <div className="amazon__campheader mt-3 mr-3">
                      <button
                        onClick={() =>
                          this.setState({
                            showSideBar: !showSideBar,
                          })
                        }
                        disabled={selectedRow.length != 1}
                        className="hygieneButton__btn w-[100%] h-[2rem]"
                      >
                        <div className="hygieneButton m-[auto]">
                          <img
                            // className="header-buttons mr-1"
                            src="/assets/images/Hygiene.png"
                            alt=""
                            style={{ width: 8, height: 20 }}
                          />

                          <span>Hygiene Assistant</span>
                        </div>
                      </button>

                      {showSideBar ? (
                        <IntentPopUp
                          closeSideBar={this.closeSideBar}
                          selectedRow={selectedRow}
                          showSideBar={showSideBar}
                          setShowSideBar={(e) =>
                            this.setState({
                              showSideBar: e,
                            })
                          }
                        />
                      ) : null}
                    </div>
                    <div className="flex wrap justify-end ">
                      <div className="relative mt-3 mr-3">
                        {/* <button
                        onClick={() =>
                          this.setState({
                            importType: "import",
                          })
                        }
                        className={["campaign__btn"].join(" ")}
                      >
                        <b> + </b> &nbsp;&nbsp;Import
                      </button> */}
                        <select
                          className="campaignselect cursor-pointer"
                          onChange={(e) => {
                            this.setState({
                              importType: e.target.value,
                            });
                          }}
                        >
                          <option selected={undefined === importType} hidden>
                            <b> + </b> &nbsp;&nbsp;Import
                          </option>
                          <option
                            value="existing"
                            selected={"existing" === importType}
                          >
                            Edit existing
                          </option>
                          <option value="new" selected={"new" === importType}>
                            New
                          </option>
                        </select>
                      </div>
                      <div className="amazon__campheader mt-3">
                        <CSVLink
                          data={products}
                          headers={csvCatalogHeadersExport.map((row) => ({
                            label: row.title,
                            key: row.value,
                          }))}
                          asyncOnClick={true}
                          // onClick={async (event, done) => {
                          //   try {
                          //     this.setState({
                          //       loading: "start",
                          //     });
                          //     const ourRequest = await cancelRequest();
                          //     const res = await _POST(
                          //       "/catalog/products",
                          //       {
                          //         dateRange,
                          //         offset,
                          //         selectedBrand,
                          //         filters,
                          //         csvStatus: 1,
                          //       },
                          //       {
                          //         cancelToken: ourRequest.token,
                          //       }
                          //     );
                          //     if (res?.data?.status) {
                          //       this.setState({
                          //         loading: undefined,
                          //         products: res?.data?.data,
                          //       });
                          //       done(true);
                          //     }
                          //   } catch (e) {
                          //     console.log(e);
                          //   }
                          // }}
                          className="rounded-lg border row flex-end px-3 py-1 color-white items-center"
                          filename={`sample_${Date.now()}.csv`}
                        >
                          <HiDownload className="" />
                          {loading === "start" ? "Downloading..." : "Export"}
                        </CSVLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full p-4 bg-white mb-[30px]">
                <CatalogTable
                  dateRange={dateRange}
                  headers={headers}
                  download={download}
                  setDownload={(e) => this.setState({ download: e })}
                  platformId={selectedBrand}
                  ref={this.childRef}
                  isCheckboxRequired={true}
                  calState={calState}
                  nextCallRequired={nextCallRequired}
                  products={products}
                  productSplit={this.productSplit}
                  setEGenieId={(e) =>
                    this.setState({
                      e_genie_id: e,
                    })
                  }
                  setSelectedProduct={(e) =>
                    this.setState(
                      { selectedProduct: e }
                      // this.trendGraph()
                    )
                  }
                  setSelectedRow={(e) => {
                    this.setState({ selectedRow: e });
                  }}
                  selectedProduct={selectedProduct}
                  selectedRow={selectedRow}
                  productBreakdownData={productBreakdownData}
                  splitCatalogHeaders={splitCatalogHeaders}
                  loading={loading}
                  setLoading={(e) =>
                    this.setState({
                      loading: e,
                    })
                  }
                  from="catalog"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Catalog;
