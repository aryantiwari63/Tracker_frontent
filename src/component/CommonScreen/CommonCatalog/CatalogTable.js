/* eslint-disable */
import React from "react";
import { connect } from "react-redux";

import { CSVDownload } from "react-csv";
import LoaderSpinner from "../../common-components/loader-spinner";
import { platformDetails } from "../../../utils/commonScreenConstant";
import "./catalogtable.css";

class CatalogTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: [],
      body: [],
      totalData: 0,
      offset: 0,
      page: 1,

      dataLIMIT: 0,
      pageEnd: false,
      summaryData: [],
      activeProductId: undefined,
      activePlatformId: undefined,
    };
    this.currency = localStorage.getItem("currency");
    this.currency_format = localStorage.getItem("currency_format");
  }

  setDataLIMIT = () => {
    this.setState({ dataLIMIT: this.state.dataLIMIT + 50 }, () => {
      if (this.state.pageEnd === false) {
        this.initProcess();
      }
    });
  };

  csvHeader = (headers) => {
    let headersKey = [];
    headers.map((row) => {
      if (row.checked === true) {
        headersKey.push({ label: row.title, key: row.value });
      }
    });
    return headersKey;
  };

  // initLoad = ()=>{
  //   let expandState = [];
  //   if (this.state.loading === true) {
  //     return false;
  //   }
  //   if (this.props.download == 1) {
  //     // console.log(headers, name, "download123");
  //     this.setState(
  //       {
  //         csvData: expandState?.data,
  //         csvHeaders: this.csvHeader(headers),
  //         loading: false,
  //         csvReady: true,
  //       },
  //       () => {
  //         this.props.setDownload(0);
  //       }
  //     );
  //   } else {
  //     // const expandState = this.props.CampaignSearchReducer[tableData]?.data;
  //     let totalData = expandState?.totalData || 0;
  //     let summaryData = expandState?.summaryData || null;
  //     // console.log("expandState", expandState);
  //     let expandStateData = [];
  //     expandStateData = expandState?.data ? expandState?.data : [];
  //     this.setState(
  //       {
  //         body: [...this.state.body, ...expandStateData],
  //         totalData,
  //         loading: false,
  //         summaryData,
  //         csvReady: false,
  //       },
  //       () => {
  //         // this.props.setDownload(0);

  //         if (expandState?.data?.length < 50) {
  //           this.setState({ pageEnd: true });
  //         }
  //       }
  //     );
  //   }
  // }

  // componentDidMount() {
  //   // console.log("payload:::::::", this.props.filters);
  //   this.initLoad();
  // }

  toBeCalculated = (breakdown) => {
    // console.log("breakdown::::", breakdown);
    let fields = ["spend", "sales", "roas", "impressions"];
    let fieldType = {
      spend: "rs",
      sales: "rs",
      roas: "decimal",
      impressions: "number",
    };
    let fixedValue = { spend: null, sales: null };
    let calculatedFields = [];
    fields.map((field) => {
      let calculation = null;
      let value = {};
      if (field !== "roas") {
        breakdown.map((breakedObj) => {
          calculation += Number(breakedObj[field]);
        });
      } else {
        if (fixedValue["sales"] === 0 || fixedValue["sales"] === null) {
          calculation = 0;
        } else {
          calculation = fixedValue["sales"] / fixedValue["spend"];
        }
      }
      if (field === "spend" || field === "sales") {
        fixedValue[field] = calculation;
      }
      value = `${
        fieldType[field] === "rs"
          ? this.currency +
            Number(calculation).toLocaleString(this.currency_format, {
              maximumFractionDigits: 0,
            })
          : "" + Number(calculation).toLocaleString(this.currency_format)
      }`;

      calculatedFields.push(value);
    });
    return calculatedFields.map((val) => (
      <div
        className=" css_td p-2  width-[auto] align-middle"
        style={{ minWidth: "auto" }}
      >
        {val}
      </div>
    ));
  };

  handleAllCheckBox = (e, products) => {
    const { setSelectedProduct, setSelectedRow } = this.props;
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedProduct(products.map((index) => index.id));
      setSelectedRow(products);
    } else {
      setSelectedProduct([]);
      setSelectedRow([]);
    }
    console.log(products.map((index) => index.id));
  };

  handleCheckBox = (e, row) => {
    const isChecked = e.target.checked;
    const { setSelectedProduct, selectedProduct, setSelectedRow, selectedRow } =
      this.props;
    if (isChecked) {
      setSelectedProduct([...selectedProduct, row.id]);
      setSelectedRow([...selectedRow, row]);
    } else {
      setSelectedProduct([
        ...selectedProduct.filter((item) => item !== row.id),
      ]);
      setSelectedRow([
        ...selectedRow.filter((item) => item.e_genie_id !== row.e_genie_id),
      ]);
    }
  };
  render() {
    const { sort, activeProductId, activePlatformId } = this.state;
    // const { bodyContent, isCheckboxRequired, headers } = this.props;
    const {
      isCheckboxRequired,
      headers,
      products,
      productSplit,
      productBreakdownData,
      splitCatalogHeaders,
      loading,
      setEGenieId,
      selectedProduct,
    } = this.props;
    // const selectedCheckBox = [];
    // console.log("selectedProduct::::::::::::::::", selectedProduct);
    return (
      <>
        <table className="h-full outer-product_table" style={{ width: "100%" }}>
          <thead
            className={
              isCheckboxRequired
                ? "campaignreportcheckbox__tablehead table-fixed sticky top-0 left-0 z-[35]"
                : "campaignreport__tablehead table-fixed sticky top-0 left-0 z-[35]"
            }
          >
            <tr className="h-16">
              {isCheckboxRequired === true && (
                <th className="pr-6 pl-2 " width="2%">
                  <input
                    className="h-16 "
                    type="checkbox"
                    checked={
                      products?.length > 0 &&
                      selectedProduct?.length === products?.length
                    }
                    onChange={(e) => this.handleAllCheckBox(e, products)}
                    disabled={products?.length > 0 ? false : true}
                  />
                </th>
              )}
              <th width="5%" colSpan="1"></th>

              {headers.map((item, i) => {
                if (item.showCol) {
                  return (
                    <th>
                      <div className="tableHead px-4">
                        <p>{item.title}</p>
                      </div>
                    </th>
                  );
                }
              })}
            </tr>
          </thead>
          <tbody>
            {loading === "products" && (
              <>
                <td
                  className="p-2"
                  colSpan={16}
                  rowSpan={3}
                  style={{ alignItems: "center", verticalAlign: "middle" }}
                >
                  <div className="loaderStyle p-2 row sticky ">
                    <LoaderSpinner />
                  </div>
                </td>
              </>
            )}
            {products && products.length > 0 ? (
              products?.map((row, i) => {
                return (
                  <>
                    <tr
                      className={
                        isCheckboxRequired
                          ? "tableContentCheckBox "
                          : "tablecontent "
                      }
                      id={`tr-${row.e_genie_id}`}
                    >
                      {isCheckboxRequired === true && (
                        <td className="pl-2 min-w-max  ">
                          <input
                            className="h-16"
                            type="checkbox"
                            checked={selectedProduct
                              .map((id) => id)
                              .includes(row.id)}
                            onChange={(e) => this.handleCheckBox(e, row)}
                          />
                        </td>
                      )}
                      <td className="p-3 ">
                        <i
                          className={`${
                            activeProductId === row.e_genie_id
                              ? "fa fa-angle-up cursor-pointer float-left"
                              : "fa fa-angle-down cursor-pointer float-left"
                          }`}
                          title="Details"
                          onClick={() =>
                            this.setState(
                              {
                                activeProductId:
                                  activeProductId === row.e_genie_id
                                    ? undefined
                                    : row.e_genie_id,
                                activePlatformId: undefined,
                              },
                              () => {
                                if (this.state.activeProductId) {
                                  setEGenieId(row.e_genie_id);
                                  productSplit(row.e_genie_id);
                                  document
                                    .getElementById(`tr-${row.e_genie_id}`)
                                    ?.scrollIntoView({
                                      behavior: "smooth",
                                    });
                                }
                              }
                            )
                          }
                        ></i>
                        {/* <i className="fa fa-light fa-eye float-right cursor-pointer"></i> */}
                        <img
                          className="float-right"
                          src="/assets/images/active-circle.svg"
                          alt=""
                        ></img>
                      </td>
                      {headers.map(
                        (header, headerIndex) =>
                          header.showCol && (
                            <td className={`p-2 `} key={headerIndex}>
                              {header?.multiValue ? (
                                <>
                                  <b>
                                    {header.value !== "product_name" ? (
                                      <a
                                        href={
                                          header.multiValue[0] ==
                                          "amazon_product_name"
                                            ? `https://www.amazon.in/dp/${row["amazon_product_id"]}`
                                            : header.multiValue[0] ==
                                              "zepto_product_name"
                                            ? `https://www.zeptonow.com/pn/potato-new/pvid/${row["zepto_product_id"]}`
                                            : header.multiValue[0] ==
                                              "blinkit_product_name"
                                            ? `https://blinkit.com/prn/kelloggs-chocos-with-whole-grain-kids-cereal/prid/${row["blinkit_product_id"]}`
                                            : `https://www.flipkart.com/xiaomi-11i-5g-purple-mist-128-gb/p/itmb0fd5926fb0d5?pid=${row["flipkart_product_id"]}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {row[header.multiValue[0]]}
                                      </a>
                                    ) : (
                                      <>{row[header.multiValue[0]]}</>
                                    )}
                                  </b>
                                  {row[header.multiValue[0]] ? (
                                    <>
                                      <br />
                                      <p>
                                        {header.isMain
                                          ? "Weight " +
                                            row[header.multiValue[1]]
                                          : "Rating " +
                                            row[header.multiValue[1]]}{" "}
                                        | {"MRP " + row[header.multiValue[2]]}
                                      </p>
                                    </>
                                  ) : (
                                    <b>-</b>
                                  )}
                                </>
                              ) : row[header.value] ? (
                                row[header.value]
                              ) : (
                                "-"
                              )}
                            </td>
                          )
                      )}
                    </tr>
                    {activeProductId === row.e_genie_id && (
                      <tr className="fold ">
                        <td
                          // colSpan="2"
                          style={{
                            backgroundColor: "#fff",
                            width: "3%",
                            height: "0px",
                            verticalAlign: "top",
                          }}
                        >
                          {/* <th
                            className="bg-slate-400"
                            style={{ width: "inherit" }}
                          ></th> */}
                        </td>
                        <td
                          colSpan="10"
                          style={{ border: "1px solid transparent" }}
                        >
                          <div
                            className="table_scroll"
                            style={{
                              height: activePlatformId ? 400 : 250,
                              minHeight: activePlatformId ? 400 : 250,
                            }}
                          >
                            <div
                              className="css_table"
                              id={`innertable-${activeProductId}`}
                            >
                              <div className="css_thead">
                                <div className="css_tr">
                                  <div
                                    className="css_th"
                                    width="2%"
                                    colSpan="1"
                                  ></div>

                                  {splitCatalogHeaders.map((item, i) => {
                                    if (item.showCol) {
                                      return (
                                        <div className="css_th">
                                          <p>{item.title}</p>
                                        </div>
                                      );
                                    }
                                  })}
                                </div>
                              </div>
                              <div className="css_tbody">
                                {productBreakdownData &&
                                productBreakdownData.length > 0 &&
                                loading !== "productBreakdown"
                                  ? platformDetails?.map((row, i) => {
                                      if (
                                        productBreakdownData[0].hasOwnProperty(
                                          row.value
                                        )
                                      )
                                        return (
                                          <>
                                            <div className="css_tr h-[4rem] border-b-[1px] border-[rgba(0, 0, 0, 0.1)] text-[13px] font-normal leading-[18px]">
                                              <div
                                                style={{
                                                  minWidth: "auto",
                                                }}
                                                className="css_sd p-2 text-center width-[auto]  align-middle"
                                              >
                                                <i
                                                  className={`${
                                                    activePlatformId === row.id
                                                      ? "fa fa-angle-up cursor-pointer"
                                                      : "fa fa-angle-down cursor-pointer"
                                                  }`}
                                                  onClick={() => {
                                                    if (
                                                      productBreakdownData[0][
                                                        row.value
                                                      ].length > 0
                                                    )
                                                      this.setState({
                                                        activePlatformId:
                                                          activePlatformId ===
                                                          row.id
                                                            ? undefined
                                                            : row.id,
                                                      });

                                                    document
                                                      .getElementById(
                                                        `innertable-${activeProductId}`
                                                      )
                                                      ?.scrollIntoView({
                                                        behavior: "smooth",
                                                      });
                                                  }}
                                                ></i>
                                              </div>
                                              <div
                                                className="css_sd p-2 width-[auto] align-middle"
                                                style={{
                                                  minWidth: "auto",
                                                }}
                                              >
                                                <b>{row.title}</b>
                                              </div>
                                              <div
                                                className="css_td p-2 width-[auto] align-middle"
                                                style={{
                                                  minWidth: "auto",
                                                }}
                                              >
                                                {"Campaign( " +
                                                  productBreakdownData[0][
                                                    row.value
                                                  ].length +
                                                  " )"}
                                              </div>
                                              {this.toBeCalculated(
                                                productBreakdownData[0][
                                                  row.value
                                                ]
                                              )}
                                            </div>
                                            {activePlatformId === row.id && (
                                              <>
                                                {productBreakdownData[0][
                                                  row.value
                                                ].map((platformBreakdown) => (
                                                  <div className="css_tr h-[4rem] border-b-[1px] border-[rgba(0, 0, 0, 0.1)] text-[13px] font-normal leading-[18px]">
                                                    <div
                                                      style={{
                                                        minWidth: "auto",
                                                      }}
                                                      className="p-2 text-center width-[auto] "
                                                    ></div>
                                                    <div className="css_sd p-2 width-[auto] align-middle">
                                                      {row.title}
                                                    </div>
                                                    <div className="css_sd p-2 width-[auto] align-middle">
                                                      {
                                                        platformBreakdown.campaign_name
                                                      }
                                                    </div>
                                                    <div className="css_td p-2 width-[auto] align-middle">
                                                      {this.currency +
                                                        Number(
                                                          platformBreakdown.spend
                                                        ).toLocaleString(
                                                          this.currency_format,
                                                          {
                                                            maximumFractionDigits: 0,
                                                          }
                                                        )}
                                                    </div>
                                                    <div className="css_td p-2 width-[auto] align-middle">
                                                      {this.currency +
                                                        Number(
                                                          platformBreakdown.sales
                                                        ).toLocaleString(
                                                          this.currency_format,
                                                          {
                                                            maximumFractionDigits: 0,
                                                          }
                                                        )}
                                                    </div>
                                                    <div className="css_td p-2 width-[auto] align-middle">
                                                      {Number(
                                                        platformBreakdown.roas
                                                      ).toLocaleString(
                                                        this.currency_format,
                                                        {
                                                          maximumFractionDigits: 2,
                                                        }
                                                      )}
                                                    </div>
                                                    <div className="css_td p-2 width-[auto] align-middle">
                                                      {Number(
                                                        platformBreakdown.impressions
                                                      ).toLocaleString(
                                                        this.currency_format,
                                                        {
                                                          maximumFractionDigits: 0,
                                                        }
                                                      )}
                                                    </div>
                                                  </div>
                                                ))}
                                              </>
                                            )}
                                          </>
                                        );
                                    })
                                  : loading !== "productBreakdown"
                                  ? "No Data Found"
                                  : null}
                                {loading === "productBreakdown" && (
                                  <>
                                    <td
                                      className="p-2"
                                      colSpan={16}
                                      rowSpan={3}
                                      style={{
                                        alignItems: "center",
                                        verticalAlign: "middle",
                                      }}
                                    >
                                      <div className="loaderStyle p-2 row sticky ">
                                        <LoaderSpinner />
                                      </div>
                                    </td>
                                  </>
                                )}
                              </div>
                              {/* {activePlatformId && (
                                <div className="css_tfoot">
                                  <div
                                    className="css_th"
                                    width="2%"
                                    colSpan="1"
                                  ></div>
                                  {splitCatalogHeaders.map((item, i) => {
                                    if (item.showCol) {
                                      return (
                                        <div className="css_th">
                                          <p>{item.title}</p>
                                        </div>
                                      );
                                    }
                                  })}
                                </div>
                              )} */}
                              {/* </div> */}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            ) : !loading ? (
              <tr>
                <div className="p-2 row sticky "> No Data Found</div>
              </tr>
            ) : null}
          </tbody>
          <tfoot className="sticky bottom-0 left-0 z-[35] flipkarttable__footer"></tfoot>
          <tfoot className="sticky bottom-0 z-[999]"></tfoot>
        </table>
      </>
    );
  }
}
//

export default CatalogTable;
