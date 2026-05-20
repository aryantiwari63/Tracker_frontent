import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function DashboardGuideItem({
  item,
  openGuide,
  setOpenGuide,
  //previewImg,
  setPreviewImg,
}) {
  const isOpen = openGuide.includes(item.title);

  const toggleGuide = () => {
    setOpenGuide((prev) =>
      prev.includes(item.title)
        ? prev.filter((t) => t !== item.title)
        : [...prev, item.title],
    );
  };
  return (
    <div className="border rounded-xl overflow-hidden">
      <div
        onClick={toggleGuide}
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <div
            className={`${item.iconBg} ${item.iconColor} w-10 h-10 shrink-0 flex items-center justify-center rounded-lg`}
          >
            {!item.image && (
              <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
            )}

            {item.image && (
              <img src={item.image} alt="logo" className="w-5 h-5" />
            )}
          </div>
          <div className="">
            <p className="text-base font-medium text-gray-800 text-left">
              {item.title}
            </p>
          </div>
        </div>

        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="bg-gray-50 p-4">
          {/* ===== CUSTOM DESIGNS ===== */}

          {item.title === "Date Range" && (
            <div className="bg-gray-50  space-y-3 text-sm text-gray-600">
              <p className="mb-2  text-gray-600 leading-relaxed text-left">
                The Date Range helps you view dashboard data for a specific time
                period.
              </p>

              <h3 className="font-semibold  mb-2">Steps:</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-500">
                <li>
                  Look at the top center of the dashboard where it says{" "}
                  <span className="font-semibold">Current Date Range</span>.
                </li>
                <div className="flex justify-center my-2">
                  <img
                    src="/assets/images/daterange1.svg"
                    alt="OSA Example Table"
                    className="w-full  border border-gray-300 shadow-sm"
                      onClick={() =>
                      setPreviewImg("/assets/images/daterange1.svg")
                    }
                  />
                </div>
                <li>
                  Click on the <span className="font-semibold">date box</span> (
                  <span className="italic">
                    for example: 22/01/26 → 28/01/26
                  </span>
                  ).
                </li>
                <li>A calendar will open.</li>
                <li>
                  Select:
                  <div className="ml-6 mt-1">
                    <p>
                      • <span className="font-semibold">Start date</span>
                    </p>
                    <p>
                      • <span className="font-semibold">End date</span>
                    </p>
                  </div>
                </li>
                <li>
                  Quickly filter data by preset ranges like Yesterday, Last
                  7/15/30 days, Month-to-Date, or select a custom period for
                  focused analysis.
                </li>
                <li>Click Apply present at the bottom.</li>
                <div className="flex justify-center my-2 w-[50px] h-[24px]">
                  <img
                    src="/assets/images/daterange2.svg"
                    alt="OSA Example Table"
                    className="w-full  border border-gray-300 shadow-sm"
                    onClick={() =>
                      setPreviewImg("/assets/images/daterange2.svg")
                    }
                  />
                </div>
                <li>
                  The dashboard will automatically refresh and show data only
                  for the selected dates.
                </li>
              </ol>
              <p className="text-gray-600">
                To compare the current date range with previous date range you
                can use the Compare toggle button present at the top.
              </p>

              <div className="flex flex-col justify-center my-2">
                <div className="flex gap-2 mb-3">
                  <img
                    src="/assets/images/daterange3.svg"
                    alt="OSA Example Table"
                    className="w-[117px]  border border-gray-300 shadow-sm"
                    onClick={() =>
                      setPreviewImg("/assets/images/daterange3.svg")
                    }
                  />
                  <img
                    src="/assets/images/daterange4.svg"
                    alt="OSA Example Table"
                    className="w-[142px]  border border-gray-300 shadow-sm"
                    onClick={() =>
                      setPreviewImg("/assets/images/daterange4.svg")
                    }
                  />
                </div>
                <img
                  src="/assets/images/daterange5.svg"
                  alt="OSA Example Table"
                  className="w-[200px]  border border-gray-300 shadow-sm"
                  onClick={() => setPreviewImg("/assets/images/daterange5.svg")}
                />
              </div>

              <p className="text-gray-600">
                The Compare toggle lets you switch between a single-period
                snapshot and a period-over-period view. When OFF, the dashboard
                shows only current performance, and when ON, it displays
                previous values with directional changes, helping quickly
                identify trends, improvements, and declines across KPIs and
                platforms
              </p>
              <div className="flex flex-col gap-2 justify-center my-2">
                <img
                  src="/assets/images/daterange6.svg"
                  alt="OSA Example Table"
                  className="w-[220px]  border border-gray-300 shadow-sm"
                  onClick={() => setPreviewImg("/assets/images/daterange6.svg")}
                />
                <img
                  src="/assets/images/daterange7.svg"
                  alt="OSA Example Table"
                  className="w-[220px]  border border-gray-300 shadow-sm"
                  onClick={() => setPreviewImg("/assets/images/daterange7.svg")}
                />
              </div>
              <p className="text-gray-600">
                Select the desired date range and provide name for the date
                range and the click on Save. Then click on{" "}
                <span className="font-semibold">Apply</span> button at bottom
                right to save changes and show the results. To discard the
                changes click on <span className="font-semibold">Cancel</span>.
              </p>
            </div>
          )}

          {item.title === "Filters" && (
            <div className="bg-gray-50  space-y-3 text-sm text-gray-600">
              <p className="text-gray-600 leading-relaxed text-left mb-2">
                A Filter button is present at top right through which you can
                select your desired brand to analyze. After than you can even
                refine your results based on Category, Location, Product and OSA
                status by clicking on the dropdown button present at rightmost
                corner.
              </p>

              <h3 className="font-semibold  mb-2">Steps:</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-500">
                <li>
                  Click on the Filter button located at the top of the dashboard
                </li>
                <div className="flex flex-col gap-2 justify-center my-2">
                  <img
                    src="/assets/images/filterfield1.svg"
                    alt="OSA Example Table"
                    className="w-[55px] "
                    onClick={() =>
                      setPreviewImg("/assets/images/filterfield1.svg")
                    }
                  />
                </div>
                <p>
                  A drop-down will open through which you can select your
                  desired brand and other categories.
                </p>
                <li>
                  After selecting the brand and choosing the required filters
                  click on Apply at that particular entity where changes are
                  made for eg., Product Type. Then click on Apply at the bottom
                  right to save changes for all the other entities. You can
                  choose Clear All to undo the changes and go back to original.
                </li>
                <div className="flex flex-col gap-2 justify-center my-2">
                  <img
                    src="/assets/images/filterfield2.svg"
                    alt="OSA Example Table"
                    className="w-[130px] h-[116px]"
                    onClick={() =>
                      setPreviewImg("/assets/images/filterfield2.svg")
                    }
                  />
                </div>
                <li>
                  The dashboard updates instantly to reflect only the filtered
                  data a shown below
                </li>
                <div className="flex  gap-2 justify-center my-2">
                  <img
                    src="/assets/images/filterfield3.svg"
                    alt="OSA Example Table"
                    className="h-[55px]"
                    onClick={() =>
                      setPreviewImg("/assets/images/filterfield3.svg")
                    }
                  />
                </div>
                <li>
                  When you click on the compare toggle button (for the desired
                  date range), it compares the results for current date range to
                  compare date range. The results are shown as below:
                </li>
                <div className="flex  gap-2 justify-center my-2">
                  <img
                    src="/assets/images/filterfield4.svg"
                    alt="OSA Example Table"
                    className="h-[49px]"
                    onClick={() =>
                      setPreviewImg("/assets/images/filterfield4.svg")
                    }
                  />
                </div>
              </ol>
            </div>
          )}

          {item.title === "Understanding 6P Metrics" && (
            <div className="bg-gray-50  space-y-3 text-sm text-gray-600">
              <div className="space-y-3">
                <p>
                  <span className="font-semibold">OSA:</span> Measures the
                  percentage of time a product is available on a platform during
                  a defined period.
                </p>

                <p>
                  <span className="font-semibold">SoS:</span> Measures the
                  visibility dominance of a brand or product in on-platform
                  search results
                </p>

                <p>
                  <span className="font-semibold">Promotions:</span> Promotion
                  means the difference between the selling price SP and MRP
                </p>

                <p>
                  <span className="font-semibold">Ratings and reviews:</span>{" "}
                  Refers to Consumer-generated ratings and reviews provide
                  valuable social proof during purchasing decisions.
                </p>

                <p>
                  <span className="font-semibold">Content score:</span> Tells us
                  how complete and good the product information is on the
                  app/website.
                </p>

                <p>
                  <span className="font-semibold">Ranking:</span> The average
                  position at which a product appears in search results for a
                  defined keyword.
                </p>
              </div>
            </div>
          )}

          {item.title === "Graphical Analysis" && (
            <div className="bg-gray-50  space-y-3 text-sm text-gray-600">
              <p className="text-gray-600 mb-2">
                This option controls how data is grouped on the graph.
              </p>

              <h3 className="font-semibold  mb-2">Steps:</h3>

              <ol className="list-decimal pl-5 space-y-2  text-gray-500">
                <li>
                  Navigate to the Graphical Analysis section.
                  <img
                    src="/assets/images/graphical-analysis1.svg"
                    alt="Graphical Analysis Label"
                    className="mt-2"
                    onClick={() =>
                      setPreviewImg("/assets/images/graphical-analysis1.svg")
                    }
                  />
                </li>

                <li>
                  On the left side, click the dropdown that shows Daily by
                  default.
                  <img
                    src="/assets/images/graphical-analysis2.svg"
                    alt="Daily Dropdown"
                    className="mt-2"
                    onClick={() =>
                      setPreviewImg("/assets/images/graphical-analysis2.svg")
                    }
                  />
                </li>

                <li>
                  Choose one of the following:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>
                      <span className="font-semibold">Daily</span> – View
                      day-wise performance.
                    </li>
                    <li>
                      <span className="font-semibold">Weekly</span> – View
                      week-wise summarized trends.
                    </li>
                    <li>
                      <span className="font-semibold">Monthly</span> – View
                      month-wise aggregated data.
                    </li>
                  </ul>
                </li>

                <li>
                  Once selected, the chart updates automatically. Below shows
                  the OSA trend for all the platforms over the time.
                  <img
                    src="/assets/images/graphical-analysis3.svg"
                    alt="OSA Trend Graph"
                    className="h-[171px] mt-2"
                    onClick={() =>
                      setPreviewImg("/assets/images/graphical-analysis3.svg")
                    }
                  />
                </li>
              </ol>
            </div>
          )}

          {item.title === "Export & Reporting" && (
            <div className="bg-gray-50  space-y-3 text-sm text-gray-600">
              <p className="text-gray-600 mb-2">
                The Download icon (downward arrow at the top-right of each
                widget) allows you to export the displayed data for offline
                analysis, sharing, and reporting.
              </p>

              <h3 className="font-semibold mb-2">Steps:</h3>

              <ol className="list-decimal pl-5 space-y-2  text-gray-500">
                <li>
                  Navigate to the widget you want to export (for example, OSA by
                  Brand).
                </li>

                <li className="list-decimal ">
                  <div className="flex items-center gap-2">
                    Click the Download icon (⬇️) located in the top-right corner
                    of the widget.
                    <img
                      src="/assets/images/exportingicon.svg"
                      alt="Download Icon"
                      className="w-[19px] h-[21px]"
                      onClick={() =>
                        setPreviewImg("/assets/images/exportingicon.svg")
                      }
                    />
                  </div>
                </li>

                <li>
                  The system automatically downloads the data/visual in a
                  supported format.
                </li>

                <li>
                  Open the downloaded file and use it for reporting or further
                  analysis.
                </li>
              </ol>
            </div>
          )}

          {item.title === "Executive Summary and Customize Widget" && (
            <div className="bg-gray-50  space-y-3 text-sm text-gray-600">
              <p className="mb-2">
                This feature opens a replica of your dashboard, allowing you to
                drag and drop widgets (like OSA by Brand and OOS Days Overview)
                to swap their positions. You can rearrange any block this way to
                personalize your dashboard layout.
              </p>

              <h3 className="font-semibold mb-2">Steps:</h3>

              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  Locate the widget on the left side of the section title to
                  open the dashboard preview.{" "}
                </li>

                <li className="list-decimal ">
                  <div className="flex items-center gap-2">
                    Select any widget.
                    <img
                      src="/assets/images/executive1.svg"
                      alt="Download Icon"
                      className="w-[180px] h-[18px]"
                      onClick={() =>
                        setPreviewImg("/assets/images/executive1.svg")
                      }
                    />
                  </div>
                </li>
                <li>
                  Screen looks like as shown below.
                  <img
                    src="/assets/images/executive2.svg"
                    alt="Download Icon"
                    className="mt-2 h-[188px]"
                    onClick={() =>
                      setPreviewImg("/assets/images/executive2.svg")
                    }
                  />
                </li>

                <li>
                  Drag the selected widget and drop it near another widget (such
                  as OOS Days Overview).{" "}
                </li>
                <li>The two widgets will swap places automatically. </li>
                <li>
                  Repeat the same process with other blocks to arrange the
                  dashboard as per your preference.
                </li>
                <li>
                  Once done, click on Apply button at the bottom right corner to
                  save changes and view your customized dashboard layout.
                  <img
                    src="/assets/images/executive3.svg"
                    alt="Download Icon"
                    className=""
                    onClick={() =>
                      setPreviewImg("/assets/images/executive3.svg")
                    }
                  />
                  <ul className="list-disc mt-2">
                    <li>Daily – View day-wise performance.</li>
                    <li>Weekly – View week-wise summarized trends.</li>
                    <li>Monthly – View month-wise aggregated data.</li>
                  </ul>
                </li>

                <li>
                  To discard the changes and go back to original click on
                  Cancel.
                </li>
              </ol>
            </div>
          )}

          {item.title === "Trend Analysis" && (
            <div className="bg-gray-50  space-y-3 text-sm text-gray-600">
              <p className="">
                Trend Analysis module visualizes historical performance trends
                for up to 10 selected entities (categories, products, brands,
                etc.) through an interactive timeline chart and detailed data
                table.
              </p>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">
                  Part 1: Understanding the Graphical Analysis
                </p>
                <div>
                  <p className="mb-1">Step 1: Read the Timeline Chart</p>
                  <ul className="list-disc ml-6">
                    <li>Horizontal axis: Time period (weeks or months)</li>
                    <li>Vertical axis: Average metric value (e.g., Avg OSA)</li>
                    <li>Colored swim lanes: Each represents one entity</li>
                    <li>Lane position: Higher = better performance</li>
                    <li>Lane width: Thicker = higher metric percentage </li>
                  </ul>
                  <div className="my-1 w-full">
                    <img
                      src="/assets/images/learning-images/trendanalysis-step1.svg"
                      alt="Download Icon"
                      className="mt-2 w-full h-[190px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/trendanalysis-step1.svg",
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-1">Step 2: Change the Metric View</p>
                  <div className="">
                    <img
                      src="/assets/images/learning-images/trendanalysis-step2.svg"
                      alt="Download Icon"
                      className="mt-2 h-[188px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/trendanalysis-step2.svg",
                        )
                      }
                    />
                  </div>

                  <div className="mt-2">
                    <ul className="list-[upper-alpha] ml-6">
                      <li>
                        Click the metric dropdown (top-right, shows Avg OSA)
                      </li>
                      <li>Select from available options:</li>
                      <ul className="list-disc ml-4">
                        <li>Avg OSA (On-Shelf Availability)</li>
                        <li>Promotions</li>
                        <li>MRP</li>
                        <li>SP</li>
                        <li>Share of Search</li>
                        <li>Ranking</li>
                      </ul>

                      <li>Chart updates instantly with new metric</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <p className="mb-1">Step 3: Analyze Trends Over Time</p>
                  <ul className="list-disc ml-6">
                    <li>
                      Swim lanes move up/down = Performance ranking changes
                      week-to-week
                    </li>
                    <li>Lane widens = Metric percentage increasing</li>
                    <li>Lane narrows = Metric percentage decreasing</li>
                    <li>Scroll horizontally to view full date range</li>
                    <li>
                      Look for patterns: consistent leaders, declining
                      categories, improving products
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 4: Download the Chart</p>
                  <ul className="list-disc ml-6">
                    <li>
                      Click download icon (top-right of Graphical Analysis
                      section)
                    </li>
                    <li>Exports as PNG image</li>
                    <li>
                      Includes all visible entities and current date range
                    </li>
                    <li>Use for presentations or reports</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">
                  Part 2: Selecting Entities to Analyze
                </p>
                <div>
                  <p className="mb-1">
                    Step 5: Access Products Distribution Table
                  </p>
                  <ul className="list-disc ml-6">
                    <li>Located below the Graphical Analysis chart</li>
                    <li>Shows all available entities with performance data</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 6: Select Entities for Trend View</p>
                  <ul className="list-[upper-alpha] ml-6">
                    <li>Maximum 10 entities can be selected</li>
                    <li>
                      Filter by tabs (top of table):
                      <ul className="list-disc ml-4">
                        <li>Category</li>
                        <li>Product</li>
                        <li>Brand</li>
                        <li>Location</li>
                        <li>Platform</li>
                      </ul>
                    </li>
                    <li>
                      Click checkboxes next to entity names to add/remove from
                      chart
                    </li>
                    <li>
                      Selected entities appear in the Graphical Analysis above
                    </li>
                    <li>Deselect to remove from visualization</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 7: Review Numeric Data</p>
                  <p>Table columns:</p>
                  <ul className="list-disc ml-6">
                    <li>Category (or selected entity type): Entity name</li>
                    <li>
                      2026-Week-04: Metric value for specific week (e.g., 91.6%,
                      70.7%)
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">Part 3: Customizing the View</p>

                <div>
                  <p className="mb-1">Step 8: Toggle Time Granularity</p>
                  <ul className="list-[upper-alpha] ml-6">
                    <li>
                      Locate Weekly View dropdown (top-right of table) options
                      <ul className="list-disc ml-4">
                        <li>Weekly View: See week-by-week trends</li>
                        <li>Monthly View: See month-by-month trends</li>
                      </ul>
                    </li>
                    <li>Selection changes both chart and table</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 9: Sort the Data</p>
                  <div>
                    <p>Click Newest to Oldest dropdown (top-right) Options</p>
                    <ul className="list-disc ml-6">
                      <li>
                        Newest to Oldest: Most recent data first (default)
                      </li>
                      <li>Oldest to Newest: Historical data first</li>
                    </ul>
                    <p>Helps identify recent vs. historical patterns</p>
                  </div>
                </div>

                <div>
                  <p className="mb-1">Step 10: Customize Columns</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">Part 4: Exporting Data</p>
                <div>
                  <p className="mb-1">Step 11: Download Table Data</p>
                  <ul className="list-[upper-alpha] ml-6">
                    <li>
                      Click download icon next to Newest to Oldest dropdown
                      <div className="my-1">
                        <img
                          src="/assets/images/learning-images/trendanalysis-step11.svg"
                          alt="Download Icon"
                          className="mt-2 w-[110px]"
                          onClick={() =>
                            setPreviewImg(
                              "/assets/images/learning-images/trendanalysis-step11.svg",
                            )
                          }
                        />
                      </div>
                    </li>

                    <li>
                      Exports as CSV format Includes
                      <ul className="list-disc ml-4">
                        <li>All selected entities</li>
                        <li>All visible columns</li>
                        <li>Current sort order</li>

                        <li>Date range data</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {item.title === "Comprehensive Breakdown" && (
            <div className="bg-gray-50 space-y-3 text-sm text-gray-600">
              <p>
                Comprehensive Breakdown module provides multi-dimensional data
                analysis across Category, Brand, SKU, Location, and Platform
                with linked filtering and day-by-day trend analysis
                capabilities.
              </p>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">
                  Part 1: Understanding the Interface
                </p>

                <div>
                  <p className="mb-1">Step 1: Navigate Entity Tabs</p>
                  <ul className="list-[upper-alpha] ml-6">
                    <li>Top tabs allow switching between views:</li>
                    <ul className="list-disc ml-4">
                      <li>Category – Product categories</li>
                      <li>SKU – Individual product SKUs</li>
                      <li>Location – Geographic regions</li>
                      <li>Platform – E-commerce platforms</li>
                      <li>Brand – Brand names</li>
                    </ul>
                    <li>Number shows: Selected / Total available</li>
                    <li>Click any tab to change the breakdown view</li>
                  </ul>
                  <div className="w-full">
                    <img
                      src="/assets/images/learning-images/comprehensive-step1.svg"
                      alt="Download Icon"
                      className="mt-2 w-full h-[34px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/comprehensive-step1.svg",
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-1">Step 2: Review the Data Table</p>
                  <p className="mb-1">Standard columns:</p>
                  <ul className="list-disc ml-6">
                    <li>Checkbox: Select entities for filtering</li>
                    <li>Category/Entity Name: The item being analyzed</li>
                    <li>Trend Icon: Click to view day-by-day analysis</li>
                    <li>OSA %: On-shelf availability percentage</li>
                    <li>Previous Day’s OSA %: Comparison metric</li>
                  </ul>
                  <div className="w-full my-2">
                    <img
                      src="/assets/images/learning-images/comprehensive-step2.svg"
                      alt="Download Icon"
                      className="w-full h-[161px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/comprehensive-step2.svg",
                        )
                      }
                    />
                  </div>

                  <div className="mt-2">
                    <p>Summary row:</p>
                    <ul className="list-disc ml-6">
                      <li>Total Category: 9</li>
                      <li>OSA: 88.60%</li>
                      <li>Previous Day’s OSA: 84.83%</li>
                    </ul>
                    <div className="w-full my-2">
                      <img
                        src="/assets/images/learning-images/comprehensive-step2.1.svg"
                        alt="Download Icon"
                        className="w-full h-[37px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/comprehensive-step2.1.svg",
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">Part 2: Filtering Data</p>

                <div>
                  <p className="mb-1">
                    Step 3: Use Universal Filters (Top Bar)
                  </p>
                  <ul className="list-[upper-alpha] ml-6">
                    <li>Filter badges show current selections:</li>
                    <ul className="list-disc ml-4">
                      <li>0 Selected Category</li>
                      <li>0 Selected SKU</li>
                      <li>0 Selected Location</li>
                      <li>0 Selected Platform</li>
                      <li>0 Selected Brand</li>
                    </ul>
                  </ul>
                  <p className="my-1">To apply universal filters:</p>
                  <ul className="list-decimal ml-6">
                    <li>Click on any filter badge (e.g., “OSA”)</li>
                    <li>Select specific entities from dropdown</li>
                    <li>Click “Apply” button (top-right)</li>
                    <li>All tabs update with filtered data</li>
                  </ul>
                  <div className="w-full my-2">
                    <img
                      src="/assets/images/learning-images/comprehensive-step3.svg"
                      alt="Download Icon"
                      className="w-[129px] h-[224px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/comprehensive-step3.svg",
                        )
                      }
                    />
                  </div>

                  <div className="mt-1">
                    <p>Clear filters:</p>
                    <div className="flex gap-2">
                      {" "}
                      <p>Click Clear all button to remove all selections</p>
                      <img
                        src="/assets/images/learning-images/comprehensive-step3.1.svg"
                        alt="Download Icon"
                        className="h-[18px] w-[40px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/comprehensive-step3.1.svg",
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-1">Step 4: Apply Column-Level Filters</p>
                  <ul className="list-[upper-alpha] ml-6">
                    <li>
                      Click filter icon next to column headers (e.g., “OSA”,
                      “Previous Day’s OSA”)
                      <img
                        src="/assets/images/learning-images/comprehensive-step4.1.svg"
                        alt="Download Icon"
                        className="h-[28px] w-[274px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/comprehensive-step4.1.svg",
                          )
                        }
                      />
                    </li>
                    <li>Filter options:</li>
                    <ul className="list-disc ml-4">
                      <li>Greater than: Show values &gt; X%</li>
                      <li>Less than: Show values &lt; X%</li>
                      <li>Between: Show values within range (e.g., 70–90%)</li>
                      <li>Not between: Exclude values in range</li>
                      <li>Equals: Exact match</li>
                      <li>Not equals: Exclude specific value</li>
                    </ul>

                    <p className="mt-1">Summary row:</p>
                    <ul className="list-disc ml-4">
                      <li> Total Category: 9</li>
                      <li>OSA: 88.60%</li>
                      <li>Previous Days OSA: 84.83%</li>
                      <li>Not equals: Exclude specific value</li>
                    </ul>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/comprehensive-step4.2.svg"
                        alt="Download Icon"
                        className="h-[113px] w-[218px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/comprehensive-step4.2.svg",
                          )
                        }
                      />
                    </div>
                  </ul>

                  <div className="mt-2">
                    <p>Example use:</p>
                    <ul className="list-disc ml-6">
                      <li>Filter OSA &gt; 80% to see only high performers</li>
                      <li>
                        Filter Previous Day’s OSA &lt; 70% to identify issues
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <p className="mb-1">Step 5: Understand Linked Filtering</p>
                  <p>How it works:</p>
                  <ul className="list-disc ml-6">
                    <li>
                      Selecting an entity in one tab filters related data in
                      other tabs
                    </li>
                    <li>Example workflow:</li>
                    <ul className="list-decimal ml-4">
                      <li>Go to Brand tab</li>
                      <li>
                        click “Colgate” brand{" "}
                        <div className="my-2">
                          <img
                            src="/assets/images/learning-images/comprehensive-step5.svg"
                            alt="Download Icon"
                            className="h-[131px]"
                            onClick={() =>
                              setPreviewImg(
                                "/assets/images/learning-images/comprehensive-step5.svg",
                              )
                            }
                          />
                        </div>
                      </li>
                      <li>
                        Switch to Category tab → Only Colgate categories appear
                      </li>
                      <li>Switch to SKU tab → Only Colgate SKUs appear</li>
                      <li>
                        Switch to Location tab → Only selling locations appear
                        <div className="my-2">
                          <img
                            src="/assets/images/learning-images/comprehensive-step5.1.svg"
                            alt="Download Icon"
                            className="h-[214px] w-full"
                            onClick={() =>
                              setPreviewImg(
                                "/assets/images/learning-images/comprehensive-step5.1.svg",
                              )
                            }
                          />
                        </div>
                      </li>
                    </ul>
                  </ul>

                  <p className="mt-1">Benefits</p>
                  <ul className="list-disc ml-6">
                    <li>Cross-dimensional analysis</li>
                    <li>Quick drill-down from brand to SKU level</li>
                    <li>Maintain context across different views</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">
                  Part 3: Selecting and Analyzing Entities
                </p>

                <div>
                  <p className="mb-1">Step 6: Select Entities</p>
                  <ul className="list-[upper-alpha] ml-6">
                    <li>Check boxes next to entity names to select</li>
                    <li>Selected count updates in tab badges</li>
                    <li>Use selections for:</li>
                    <ul className="list-disc ml-4">
                      <li>Focused analysis</li>
                      <li>Bulk filtering across tabs</li>
                      <li>Export of specific entities</li>
                    </ul>
                  </ul>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/comprehensive-step6.svg"
                      alt="Download Icon"
                      className="h-[186px] w-full"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/comprehensive-step6.svg",
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <div className="flex gap-3">
                    {" "}
                    <p className="mb-1">Step 7: Sort Data</p>
                    <img
                      src="/assets/images/learning-images/comprehensive-step6.1.svg"
                      alt="Download Icon"
                      className="w-[13px] h-[15px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/comprehensive-step6.1.svg",
                        )
                      }
                    />
                  </div>
                  <ul className="list-[upper-alpha] ml-6">
                    <li>Click column headers to sort:</li>
                    <ul className="list-disc ml-4">
                      <li>Category: Alphabetical (A–Z, Z–A)</li>
                      <li>OSA: Performance order (low to high)</li>
                      <li>Previous Day’s OSA: Historical comparison</li>
                    </ul>
                    <li>Sorting arrows indicate active sort direction</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">
                  Part 4: Day-by-Day Trend Analysis
                </p>

                <div>
                  <p className="mb-1">Step 8: Open Trend Drawer</p>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/comprehensive-step6.2.svg"
                      alt="Download Icon"
                      className="w-[230px] h-[20px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/comprehensive-step6.2.svg",
                        )
                      }
                    />
                  </div>
                  <ul className="list-disc ml-6">
                    <li>
                      Locate the small graph icon (📊) next to each entity name
                    </li>
                    <li>Click the small graph icon next to any entity name</li>
                    <li>A drawer opens from the left side of the screen</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 9: Review Graphical Analysis</p>
                  <p>In the drawer:</p>
                  <ul className="list-[upper-alpha] ml-6">
                    <li>Top section: Graphical chart showing daily trend</li>
                  </ul>
                  <ul className="list-disc ml-6">
                    <li>Line graph with dates on X-axis</li>
                    <li>OSA percentage on Y-axis</li>
                    <li>Visualize performance over time</li>
                    <li>Identify spikes, dips, and patterns</li>
                  </ul>

                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/comprehensive-step9.svg"
                      alt="Download Icon"
                      className="w-full h-[110px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/comprehensive-step9.svg",
                        )
                      }
                    />
                  </div>

                  <div className="mt-2">
                    <p>Example insights:</p>
                    <ul className="list-disc ml-6">
                      <li>Rising trend = Improving availability</li>
                      <li>Falling trend = Deteriorating stock</li>
                      <li>Flat line = Stable performance</li>
                      <li>Volatile pattern = Inconsistent supply</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <p className="mb-1">Step 10: Review Tabular Breakdown</p>
                  <p className="mb-1">Bottom section of drawer:</p>
                  <ul className="list-[upper-alpha] ml-6">
                    <li>Day-by-day table with columns:</li>
                    <ul className="list-disc ml-4">
                      {" "}
                      <li>Date</li>
                      <li>OSA %</li>
                      <li>Change vs. previous day</li>
                      <li>Other relevant metrics</li>
                      <li>Date</li>
                      <li>OSA %</li>
                      <li>Change vs. previous day</li>
                      <li>Other relevant metrics</li>
                      <li>Shows exact daily values</li>
                      <li>Identify specific dates with issues</li>
                      <li>Track improvement/decline patterns</li>
                    </ul>
                  </ul>

                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/comprehensive-step10.svg"
                      alt="Download Icon"
                      className="w-full h-[105px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/comprehensive-step10.svg",
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-1">Step 11: Close the Drawer</p>
                  <ul className="list-disc ml-6">
                    <li>Click X or close button</li>
                    <li>Or click outside the drawer</li>
                    <li>Returns to main Comprehensive Breakdown view</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">Part 5: Exporting Data</p>

                <div>
                  <p className="mb-1">Step 12: Download Current View</p>
                  <ul className="list-[upper-alpha] ml-6">
                    <li>Click download button (top-right corner)</li>
                    <li>Exports as CSV format including:</li>
                    <ul className="list-disc ml-4">
                      <li>
                        Current tab’s data
                        (Category/SKU/Location/Platform/Brand)
                      </li>
                      <li>All visible columns</li>
                      <li>Applied filters</li>
                      <li>Selected entities (if any)</li>
                      <li>Current sort order</li>
                    </ul>
                  </ul>
                  <p className="mt-1">
                    Customize Column: lets you personalize table layouts by
                    selecting which breakdowns and metrics to display,
                    reordering columns, and saving custom views for future use.
                  </p>
                  <div className="mt-2">
                    <img
                      src="/assets/images/learning-images/comprehensive-step12.svg"
                      alt="Download Icon"
                      className="w-[25px] h-[18px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/comprehensive-step12.svg",
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {item.title === "Understanding Breakdowns vs Metrics" && (
            <div className="bg-gray-50 space-y-3 text-sm text-gray-600">
              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">Breakdowns (Entities)</p>

                <div>
                  <p className="mb-1">
                    What they are: Dimensional categories that organize data
                    Examples:
                  </p>
                  <ul className="list-disc ml-6">
                    <li>Category, Brand, SKU, Platform, Location</li>
                    <li>How they work:</li>
                    <li>Create rows or groupings in the table</li>
                    <li>Can be hierarchical (Category → Sub Brand → SKU)</li>
                    <li>Linked to related entities automatically</li>
                  </ul>
                  <p className="mt-1">
                    Use when: You want to analyze by something (by platform, by
                    location, by product)
                  </p>

                  <div className="mt-2">
                    <img
                      src="/assets/images/learning-images/Breackdown-1.svg"
                      alt="Download Icon"
                      className="w-full h-[182px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/Breackdown-1.svg",
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">Metrics (Metrics)</p>

                <div>
                  <p className="mb-1">
                    What they are: Numeric performance indicators Examples:
                  </p>
                  <ul className="list-disc ml-6">
                    <li>Numeric performance indicators</li>
                    <li>Examples:</li>
                    <ul className="list-disc ml-4">
                      <li>
                        OSA, Previous Days OSA, Total Score, Title Score, Last
                        in Stock, Purchases in Past Month
                      </li>
                    </ul>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">How they work:</p>
                  <ul className="list-disc ml-6">
                    <li>
                      Populate data columns with percentages, counts, or scores
                    </li>
                    <li>Can be compared side-by-side</li>
                  </ul>
                </div>

                <p className="mt-1">
                  Use when: You want to measure performance (how much, how many,
                  what percentage)
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">Quick Start Guide</p>

                <div>
                  <p className="mb-1">Step 1: Access the Feature</p>
                  <ul className="list-disc ml-6">
                    <li>
                      Click the column settings icon (or grid icon) in any table
                    </li>
                    <li>The “Customize Column” modal opens</li>
                    <li>Current view shows “3 Column Selected” (example)</li>
                    <div className="mt-2">
                      <img
                        src="/assets/images/learning-images/Breackdown-2.svg"
                        alt="Download Icon"
                        className="h-[132px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/Breackdown-2.svg",
                          )
                        }
                      />
                    </div>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 2: Left Panel – Available Options</p>
                  <div className="">
                    <p>Organized into sections</p>
                    <p>Saved Views:</p>
                    <ul className="list-disc ml-4">
                      <li>Previously saved custom layouts</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <p className="mb-1">
                    Step 3: Right Panel – Current Selection
                  </p>
                  <div className="mt-2">
                    <img
                      src="/assets/images/learning-images/Breackdown-3.svg"
                      alt="Download Icon"
                      className="h-[159px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/Breackdown-3.svg",
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-1">Step 4: Select Breakdowns</p>
                  <ul className="list-decimal ml-6">
                    <li>
                      Locate the breakdown you need in left panel (e.g.,
                      “Platform”, “Location (City)”, “SKU”)
                    </li>
                    <li>Check the box next to the breakdown name</li>
                    <li>
                      Instantly appears in the right panel under “Breakdowns”
                    </li>
                    <li>
                      The selection counter updates (e.g., “4 Column Selected”)
                    </li>
                  </ul>
                  <p className="mt-2">
                    Note: Breakdowns determine how data is grouped and
                    organized.
                  </p>
                </div>

                <div>
                  <p className="mb-1">Step 5: Select Metrics</p>
                  <ul className="list-decimal ml-6">
                    <li>
                      Scroll to find desired metrics in left panel under
                      “Digital Shelf” or other metric categories
                    </li>
                    <li>
                      Check the box next to metric names (e.g., “Total Score”,
                      “Title Score”)
                    </li>
                    <li>Metrics appear in right panel under “Metrics”</li>
                  </ul>
                  <p className="mt-2">
                    Note: Metrics are numeric performance values.
                  </p>
                </div>

                <div>
                  <p className="mb-1">Step 6: Remove Columns</p>
                  <ul className="list-disc ml-6">
                    <li>Uncheck boxes in left panel to remove from view</li>
                    <li>Or click the X next to items in right panel</li>
                    <li>Column is removed from current selection</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 7: Drag to Reorder (Right Panel)</p>
                  <ul className="list-decimal ml-6">
                    <li>
                      Locate the drag icon (dots) next to each breakdown/metric
                    </li>
                    <li>Click and hold the drag icon</li>
                    <li>Drag up or down to change order</li>
                    <li>Release to set new position</li>
                  </ul>

                  <div className="mt-2">
                    <p>Order determines:</p>
                    <ul className="list-decimal ml-6">
                      <li>Left-to-right column sequence in the table</li>
                      <li>Breakdown hierarchy (if applicable)</li>
                    </ul>
                  </div>

                  <div className="mt-2">
                    <p>Example:</p>
                    <ul className="list-disc ml-6">
                      <li>
                        Move “Platform” above “Category” → Platform becomes
                        first column
                      </li>
                      <li>
                        Move “OSA” above “Previous Day’s OSA” → OSA appears as
                        first metric column
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">Part 5: Saving Custom Views</p>
                <div className="mt-2">
                  <img
                    src="/assets/images/learning-images/Breackdown-4.svg"
                    alt="Download Icon"
                    className="w-full h-[264px]"
                    onClick={() =>
                      setPreviewImg(
                        "/assets/images/learning-images/Breackdown-4.svg",
                      )
                    }
                  />
                </div>

                <div>
                  <p className="mb-1">Step 8: Save Your Configuration</p>
                  <ul className="list-disc ml-6">
                    <li>Arrange columns as desired (add, remove, reorder)</li>
                    <li>Click the “Save” button (bottom-right)</li>
                    <li>Enter a name for your view</li>
                    <li>Click “Save” or “Confirm”</li>
                    <li>
                      Your view now appears under “Saved Views” section (left
                      panel)
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 9: Load a Saved View</p>
                  <ul className="list-decimal ml-6">
                    <li>Click “Saved Views” section (left panel) to expand</li>
                    <li>Select any saved view name</li>
                    <li>Right panel updates with that view’s configuration</li>
                    <li>Click “Apply” to load it into the table</li>
                  </ul>
                  <div className="mt-2">
                    <img
                      src="/assets/images/learning-images/Breackdown-5.svg"
                      alt="Download Icon"
                      className="w-full h-[301px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/Breackdown-5.svg",
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* ================= TAG MANAGER SECTION ================= */}

              <div className="flex flex-col gap-2 mt-4">
                <p className="my-1">Step 10: Set Default View</p>
                <ul className="list-desimal ml-6">
                  <li className="mb-1">Select or create your preferred view</li>
                  <li className="mb-1">
                    Look for “Set as Default” option (checkbox or button)
                  </li>
                  <li className="mb-1">Enable it</li>
                  <li className="mb-1">
                    This view will automatically load every time you:
                  </li>
                  <ul className="list-disc ml-6">
                    <li className="mb-1">Log into the dashboard</li>
                    <li className="mb-1">
                      Open the Comprehensive Breakdown module
                    </li>
                    <li className="mb-1">Refresh the page</li>
                  </ul>
                </ul>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">Part 6: Applying Changes</p>

                <p className="mb-1">Step 11: Apply to Table</p>
                <ul className="list-desimal ml-6">
                  <li className="mb-1">
                    After making selections and adjustments
                  </li>
                  <li className="mb-1">
                    Click “Apply” button (bottom-right, blue)
                  </li>
                  <li className="mb-1">Table closes</li>
                  <li className="mb-1">
                    Main dashboard updates with your custom column configuration
                  </li>
                </ul>

                <p className="mt-2 mb-1">Step 12: Cancel Changes</p>
                <ul className="list-disc ml-6">
                  <li className="mb-1">
                    Click “Cancel” button to discard changes
                  </li>
                  <li className="mb-1">
                    Table remains with previous configuration
                  </li>
                  <li className="mb-1">No changes are saved</li>
                </ul>
              </div>

              {/* ================= TAG MANAGER ================= */}

              <div className="flex flex-col gap-2 mt-4">
                <p className="font-bold my-1">Tag Manager</p>
                <p className="mb-1">
                  Located in the Tag Manager at the left panel of the dashboard.
                </p>
                <p className="mb-1">
                  The Tag Manager helps organize and categorize data using
                  customizable tags. Tags make it easier to group products or
                  keywords, apply filters, and perform targeted analysis across
                  the platform.
                </p>
              </div>

              <div className="mt-2">
                <img
                  src="/assets/images/learning-images/Breackdown-6.svg"
                  alt="Download Icon"
                  className="w-[128px] h-[185px]"
                  onClick={() =>
                    setPreviewImg(
                      "/assets/images/learning-images/Breackdown-6.svg",
                    )
                  }
                />
              </div>

              {/* ADD TAG */}
              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">1) Adding a Tag</p>
                <p className="mb-1 font-medium">Steps to Add a Tag</p>
                <ul className="list-decimal ml-6">
                  <li className="mb-1">
                    From the left panel, click on Tag Manager
                  </li>
                  <li className="mb-1">
                    On the Tag Manager screen, click “Add Tag”{" "}
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/Breackdown-7.svg"
                        alt="Download Icon"
                        className="w-[51px] h-[18px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/Breackdown-7.svg",
                          )
                        }
                      />
                    </div>
                  </li>
                  <li className="mb-1">In the Add Tag popup:</li>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/Breackdown-8.svg"
                      alt="Download Icon"
                      className="w-[116px] h-[89px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/Breackdown-8.svg",
                        )
                      }
                    />
                  </div>
                  <ul className="list-disc ml-6">
                    <li className="mb-1">
                      Enter the Tag Name (example: product or keyword name)
                    </li>
                    <li className="mb-1">
                      Select a color to visually distinguish the tag
                    </li>
                  </ul>
                  <li>Choose the Tag Type</li>
                  <li className="mb-1">
                    Review your inputs and click on the Apply button
                  </li>
                </ul>
                <p className="mb-1">
                  Once created, the tag becomes available for use across the
                  platform, helping you organize and analyze data more
                  efficiently.
                </p>
                <p>
                  Let’s give it a name as abc and choose type as Product, it
                  appears in the tag manager as shown below -{" "}
                </p>
                <div className="my-2">
                  <img
                    src="/assets/images/learning-images/Breackdown-9.svg"
                    alt="Download Icon"
                    className="w-[191px] h-[20px]"
                    onClick={() =>
                      setPreviewImg(
                        "/assets/images/learning-images/Breackdown-9.svg",
                      )
                    }
                  />
                </div>
              </div>

              {/* EDIT TAG */}
              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">2) Editing a Tag</p>
                <div className="my-2">
                  <img
                    src="/assets/images/learning-images/Breackdown-10.svg"
                    alt="Download Icon"
                    className="w-[116px] h-[27px]"
                    onClick={() =>
                      setPreviewImg(
                        "/assets/images/learning-images/Breackdown-10.svg",
                      )
                    }
                  />
                </div>
                <ul className="list-decimal ml-6">
                  <li className="mb-1">
                    Locate the tag in the Tag Manager list
                  </li>
                  <li className="mb-1">
                    Click the Edit (pencil) icon next to the tag name
                  </li>
                  <li className="mb-1">
                    Update the tag name, color, or tag type as needed
                  </li>
                  <li className="mb-1">
                    Click on the Update button to save your changes or choose
                    Cancel to discard them
                  </li>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/Breackdown-11.svg"
                      alt="Download Icon"
                      className="h-[130px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/Breackdown-11.svg",
                        )
                      }
                    />
                  </div>
                </ul>
              </div>

              {/* APPLYING TAGS */}
              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">3) Tag Application & Filtering</p>

                <p className="font-medium mb-1">
                  Applying Tags to Products (SKU Level - OSA, Content score,
                  Promotions, Ratings and Reviews)
                </p>
                <ul className="list-decimal ml-6">
                  <li className="mb-1">
                    Navigate to the Main Dashboard and select any metric, say,
                    OSA.
                  </li>
                  <li className="mb-1">
                    Go to the SKU tab under the Comprehensive Breakdown section.
                  </li>
                  <li className="mb-1">
                    Select one or more product SKUs using the checkboxes.
                  </li>
                  <li className="mb-1">
                    Click the Tag button at the top of the table.
                  </li>
                  <li className="mb-1">
                    In the tag selection popup:
                    <ul className="list-disc ml-4">
                      <li>
                        Select the tag(s) from the list (only Product-type tags
                        appear here).
                      </li>
                      <li>
                        You may select multiple tags for the same product.
                      </li>
                    </ul>
                  </li>
                  <li>Click Apply.</li>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/Breackdown-12.svg"
                      alt="Download Icon"
                      className="w-[230px] h-[130px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/Breackdown-12.svg",
                        )
                      }
                    />
                  </div>
                </ul>
                <p>
                  Once applied, the selected tags (for example, abc) will appear
                  in the Tags column for those product IDs.
                </p>

                <p className="font-medium mt-2 mb-1">
                  Applying Tags to Keywords (SoS, Ranking)
                </p>
                <ul className="list-decimal ml-6">
                  <li className="mb-1">From the Main Dashboard, open SoS.</li>
                  <li className="mb-1">
                    Navigate to Comprehensive Breakdown and go to the Keyword
                    section.
                  </li>
                  <li className="mb-1">
                    Select one or more keywords using the checkboxes.{" "}
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/Breackdown-13.svg"
                        alt="Download Icon"
                        className="w-[203px] h-[92px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/Breackdown-13.svg",
                          )
                        }
                      />
                    </div>
                  </li>
                  <li className="mb-1">Click the Tag button.</li>
                  <li className="mb-1">
                    From the popup, choose the required Keyword-type tag (for
                    example, def).
                  </li>
                  <li className="mb-1">Click Apply.</li>
                </ul>
                <div className="flex flex-col gap-1 mt-1">
                  <p>
                    The applied tag will become visible in the Tags column for
                    the selected keywords.
                  </p>
                  <p>Note: Only Keyword-type tags appear in SoS and Ranking.</p>
                </div>
              </div>

              {/* FILTERING */}
              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">Filtering the Keyword Tags - </p>

                <ul className="list-decimal ml-6">
                  <li className="mb-1">
                    Navigate to the Main Dashboard and open SoS.
                  </li>
                  <li className="mb-1">
                    Click the Filter option available at the top of the table.
                  </li>
                  <li className="mb-1">
                    In the filter panel, expand Keyword Tags.
                  </li>
                  <li className="mb-1">
                    Use the search bar if needed, or select one or more required
                    tags (for example, Keyword Tag 2).
                    <ul className="">
                      <li>
                        You may also use Select All to choose every available
                        tag.
                      </li>
                    </ul>
                  </li>
                  <li className="mb-1">Click Apply</li>
                </ul>
                <div className="my-1">
                  <p className="mt-1">
                    The table will now display only those products associated
                    with the selected tag(s).
                  </p>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/Breackdown-14.svg"
                      alt="Download Icon"
                      className=" h-[113px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/Breackdown-14.svg",
                        )
                      }
                    />
                  </div>
                </div>
                <div className="my-1">
                  {" "}
                  <div className="my-2">
                    <p className="mt-1">
                      The table updates to display only those keywords
                      associated with the Keyword tag 2 as shown below.
                    </p>

                    <img
                      src="/assets/images/learning-images/Breackdown-15.svg"
                      alt="Download Icon"
                      className="h-[146px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/Breackdown-15.svg",
                        )
                      }
                    />
                  </div>
                </div>

                <p className="font-medium mt-2 mb-1">
                  Filtering the Product Tags -
                </p>
                <ul className="list-decimal ml-6">
                  <li className="mb-1">
                    Click the Filter button available at the top of the
                    dashboard.
                  </li>
                  <li className="mb-1">
                    In the filter panel, expand Product Tags.
                  </li>
                  <li className="mb-1">
                    Use the search bar if needed, or select the required product
                    tag(for eg., Product Tag 1).
                  </li>
                  <li className="mb-1">
                    You may also use Select All to choose multiple tags.
                  </li>
                  <li className="mb-1">Click Apply.</li>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/Breackdown-16.svg"
                      alt="Download Icon"
                      className="h-[83px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/Breackdown-16.svg",
                        )
                      }
                    />
                  </div>
                </ul>

                <p className="mt-1">
                  You will now see all SKUs associated with the selected product
                  tag ie., Product Tag 1.
                </p>
                <div className="my-2">
                  <img
                    src="/assets/images/learning-images/Breackdown-17.svg"
                    alt="Download Icon"
                    className="h-[159px]"
                    onClick={() =>
                      setPreviewImg(
                        "/assets/images/learning-images/Breackdown-17.svg",
                      )
                    }
                  />
                </div>
              </div>

              {/* DELETE TAG */}
              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">4) Deleting a Tag</p>
                <ul className="list-decimal ml-6">
                  <li className="mb-1">Go to the Tag Manager.</li>
                  <li className="mb-1">
                    Find the tag you want to remove from the list.
                  </li>
                  <li className="mb-1">
                    Click the Delete (trash) icon next to the tag.
                  </li>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/Breackdown-18.svg"
                      alt="Download Icon"
                      className="h-[18px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/Breackdown-18.svg",
                        )
                      }
                    />
                  </div>
                  <li className="mb-1">Click Apply</li>
                </ul>
                <p className="mt-1">
                  The tag will be permanently removed and will no longer be
                  available for use. To delete all the present tags, click on
                  the trash icon present at the top.
                </p>

                <div className="my-2">
                  <img
                    src="/assets/images/learning-images/Breackdown-19.svg"
                    alt="Download Icon"
                    className="h-[33px]"
                    onClick={() =>
                      setPreviewImg(
                        "/assets/images/learning-images/Breackdown-19.svg",
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {item.title === "OSA by Brand Widget" && (
            <div className="bg-gray-50 space-y-3 text-sm text-gray-600">
              <p>
                OSA by Brand Widget allows you to compare your brands
                performance against competitors across different product brands
                for a selected time period.
              </p>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">Understanding the Widget</p>

                <div>
                  <p className="mb-1">1. Header Section</p>

                  <ul className="list-[upper-alpha] ml-6">
                    <li>
                      Title: “OSA by Brand” – Identifies the widget’s purpose
                    </li>
                    <li>
                      Date Range: Displays analysis period (e.g., W21/2026 →
                      W28/2026)
                    </li>
                    <li>
                      Legend:
                      <ul className="list-disc ml-4">
                        <li>Brand (blue) – Your brand’s performance</li>
                        <li>Competition (green) – Competitor performance</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">2. Chart Area</p>
                  <ul className="list-[upper-alpha] ml-6">
                    <li>
                      Y-Axis: Average OSA measured in percentages (0% to 100%)
                    </li>
                    <li>
                      X-Axis: Brand - displays different brand names (e.g.,
                      Colgate, Palmolive)
                    </li>
                    <li>
                      Bar Pairs: Each brand shows two bars
                      <ul className="list-disc ml-4">
                        <li>Blue bar = Your brands OSA</li>
                        <li>Green bar = Competitions OSA</li>
                      </ul>
                    </li>
                  </ul>

                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/osabrandwidget.svg"
                      alt="img"
                      className="h-[104px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/osabrandwidget.svg",
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-1">3. Download Button</p>
                  <ul className="list-disc ml-6">
                    <li>Located in top-right corner (download icon)</li>
                    <li>Exports current view as PNG image</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {item.title === "OSA and Promotions Performance Overview Widget" && (
            <div className="bg-gray-50 space-y-3 text-sm text-gray-600">
              <p className="my-1">
                OSA & Promotions Performance Overview Widget: It provides a
                comprehensive view of On-Shelf Availability (OSA) performance
                across multiple entities (brands or categories), with drill-down
                capabilities for detailed analysis, geographical insights, and
                competitive benchmarking.
              </p>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">Understanding the Widget</p>
                <div>
                  <p className="mb-1">
                    1.Top Section – Entity Performance Snapshot
                  </p>
                  <ul className="list-[upper-alpha] ml-6">
                    <li>
                      Displays 3–6 entities (brands or categories) in card
                      format
                    </li>
                    <li>
                      Each card shows:{" "}
                      <ul className="list-disc ml-4">
                        <li>Entity Name</li>
                        <li>Metrics</li>
                      </ul>
                    </li>
                    <li>Cards are drag-and-droppable for custom arrangement</li>
                    <li>
                      Edit button (top right) to modify entities or metrics
                    </li>
                  </ul>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/osaperformance1.svg"
                      alt="img"
                      className="h-[117px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/osaperformance1.svg",
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-1">
                    2. Bottom Section - Detailed Analysis (Filtered by Selected
                    Entity)
                  </p>
                  <ul className="list-disc ml-6">
                    <li>
                      Daily Performance: Graphical trends and comprehensive
                      breakdown
                    </li>
                    <li>
                      Drill Down: Platform, location, product distribution
                    </li>
                    <li>Competition Analysis: Comparative brand performance</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">Step-by-Step Guide</p>
                <p className="font-bold">
                  Part 1: Configuring the Entity Snapshot
                </p>
                <div>
                  <p className="mb-1">Step 1: View Current Entities</p>
                  <ul className="list-disc ml-6">
                    <li>
                      The top section displays your currently selected entities
                      (3-6 cards)
                    </li>
                    <li>
                      Each card shows the entity name, promotions percentage,
                      and OSA percentage
                    </li>
                    <li>
                      Review the current selection to determine if changes are
                      needed
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 2: Rearranging Entity Cards</p>
                  <ul className="list-disc ml-6">
                    <div className="flex gap-2">
                      <li>Click and hold the nine dots</li>
                      <img
                        src="/assets/images/learning-images/osaperformance2.svg"
                        alt="img"
                        className="h-[15px] mt-[2px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/osaperformance2.svg",
                          )
                        }
                      />
                    </div>
                    <li>
                      Drag the card left or right to your desired position
                    </li>
                    <li>Release to drop the card in the new position</li>
                    <li>
                      The cards will automatically reorder based on your
                      preference
                    </li>
                    <li>
                      This allows you to prioritize entities based on importance
                      or analysis needs
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 3: Edit Entities or Metrics</p>
                  <ul className="list-disc ml-6">
                    <li className="">
                      Click the Edit button in the top-right corner of the
                      widget
                      <img
                        src="/assets/images/learning-images/osaperformance3.svg"
                        alt="img"
                        className="h-[15px] w-[28px] my-2"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/osaperformance3.svg",
                          )
                        }
                      />
                    </li>
                    <li>An editing interface will appear</li>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/osaperformance4.svg"
                        alt="img"
                        className=""
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/osaperformance4.svg",
                          )
                        }
                      />
                    </div>
                  </ul>
                  <ul className="list-[upper-alpha] ml-6">
                    <li>
                      To change entities:
                      <ul className="list-disc ml-4">
                        <li>Deselect current entities by clicking on them</li>
                        <li>Select new entities from the available list</li>
                        <li>Ensure you select between 3-6 entities</li>
                      </ul>
                    </li>
                    <li>
                      To change metrics:
                      <ul className="list-disc ml-4">
                        <li>
                          Toggle between available metrics (e.g., OSA,
                          Promotions, Sales)
                        </li>
                        <li>
                          Select the metrics you want displayed on the cards
                        </li>
                      </ul>
                    </li>
                    <li>
                      Click Apply to confirm changes or choose Cancel to discard
                      changes and go back to original.
                    </li>
                    <li>The widget will refresh with your new selections</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 4: Analyzing Entity Performance</p>
                  <ul className="list-disc ml-6">
                    <li>Click on any entity card in the top section</li>
                    <li>
                      The card will become highlighted or show a selected state
                    </li>
                    <li>
                      The bottom section will automatically filter to show only
                      that entitys data
                    </li>
                    <li>
                      All three analysis sections (Graphical Analysis,
                      Region-wise Performance, Movers and Shakers) will update
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <p className="mb-1">Step 5: Review Graphical Analysis</p>
                <p>
                  1. Locate the Graphical Analysis section on the left side of
                  the bottom area
                </p>
                <div className="my-2">
                  <img
                    src="/assets/images/learning-images/osaperformance5.svg"
                    alt="img"
                    className="h-[209px]"
                    onClick={() =>
                      setPreviewImg(
                        "/assets/images/learning-images/osaperformance5.svg",
                      )
                    }
                  />
                </div>

                <div>
                  <p className="mb-1">2. Time Selection</p>
                  <ul className="list-disc ml-6">
                    <li>
                      Use the dropdown (default: Daily) to change time
                      granularity
                    </li>
                    <li>
                      Options typically include: Hourly, Daily, Weekly, Monthly
                    </li>
                  </ul>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/osaperformance6.svg"
                      alt="img"
                      className="h-[126px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/osaperformance6.svg",
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-1">3. Read the Stacked Area Chart:</p>
                  <ul className="list-disc ml-6">
                    <li>
                      Y-axis shows Promotions as a percentage (0% to 100%)
                    </li>
                    <li>X-axis shows the time period</li>
                    <li>
                      Each colored layer represents a different platform (e.g.,
                      Swiggy Instamart, Zepto, BigBaske)
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1">4. Platform Legend</p>
                  <ul className="list-disc ml-6">
                    <li>
                      Colored buttons above the chart indicate each platform
                    </li>
                    <li>
                      Click any platform button to show/hide that platforms data
                    </li>
                    <li>
                      Active platforms are highlighted; inactive ones are grayed
                      out
                    </li>
                  </ul>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/osaperformance7.svg"
                      alt="img"
                      className="h-[17px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/osaperformance7.svg",
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-1">5. Interpret Trends:</p>
                  <ul className="list-disc ml-6">
                    <li>Rising areas = improving performance</li>
                    <li>Declining areas = performance drop</li>
                    <li>Compare platform contributions over time</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <p className="mb-1">
                  Step 6: Explore Region-wise OSA Performance
                </p>
                <div className="flex flex-col gap-2">
                  <div>
                    <p>
                      1. Locate the Region-wise OSA Performance section on the
                      right side
                    </p>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/osaperformance8.svg"
                        alt="img"
                        className="h-[144px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/osaperformance8.svg",
                          )
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <p>2. View the Geographic Map:</p>
                    <ul className="list-disc ml-6">
                      <li>
                        The map displays regions color-coded by performance
                      </li>
                      <li>
                        Hover over any region to see its name and OSA percentage
                      </li>
                      <li>
                        Colors typically range from green (high OSA) to red (low
                        OSA)
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p>3. Use the Hierarchy:</p>
                    <ul className="list-disc ml-6">
                      <li>Click on a region to drill down to states</li>
                      <li>Click on a state to drill down to cities</li>
                      <div className="my-2">
                        <img
                          src="/assets/images/learning-images/osaperformance9.svg"
                          alt="img"
                          className="h-[137px]"
                          onClick={() =>
                            setPreviewImg(
                              "/assets/images/learning-images/osaperformance9.svg",
                            )
                          }
                        />
                      </div>
                      <li>Click on a city to drill down to pincode level</li>
                      <li>
                        Use the breadcrumb trail (if available) to navigate back
                        up
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p>4. Review the Tabular View:</p>
                    <ul className="list-disc ml-6">
                      <li>Below or alongside the map is a data table</li>
                      <div className="my-2">
                        <img
                          src="/assets/images/learning-images/osaperformance10.svg"
                          alt="img"
                          className="h-[138px]"
                          onClick={() =>
                            setPreviewImg(
                              "/assets/images/learning-images/osaperformance10.svg",
                            )
                          }
                        />
                      </div>
                      <li>Columns show: Location, Promotions, OSA</li>
                      <li>
                        Rows list each geographic unit (e.g., North, South,
                        East, West)
                      </li>
                      <li>
                        Click on location names (blue links) to drill down
                      </li>
                      <li className="list-disc">
                        <div className="flex items-center gap-1">
                          <span>
                            Sort columns by clicking headers to identify
                            best/worst performers
                          </span>

                          <img
                            src="/assets/images/learning-images/osaperformance11.svg"
                            alt="img"
                            className="h-[16px]"
                            onClick={() =>
                              setPreviewImg(
                                "/assets/images/learning-images/osaperformance11.svg",
                              )
                            }
                          />
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    5. Analyze Performance:
                    <ul className="list-disc ml-6">
                      <li>Identify regions with low OSA requiring attention</li>
                      <li>Compare regional performance differences</li>
                      <li>
                        Plan targeted interventions for underperforming areas
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-1">Step 7: Analyze OSA Movers and Shakers</p>
                <ul className="list-disc ml-6">
                  <li>
                    Locate the OSA Movers and Shakers section at the bottom left
                  </li>
                  <div className="my-2">
                    {" "}
                    <img
                      src="/assets/images/learning-images/osaperformance12.svg"
                      alt="img"
                      className="h-[130px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/osaperformance12.svg",
                        )
                      }
                    />
                  </div>
                </ul>
              </div>

              <div>
                <p className="mb-1">6. Select Filters</p>
                <ul className="list-disc ml-6">
                  <li>
                    Use the dropdown (default: All Products) to filter the view
                  </li>
                  <li>
                    Options: All Products, Growing products, Declining Products
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">7. Review Product List</p>
                <ul className="list-disc ml-6">
                  <li>
                    Table shows: Product name, Promotions percentage, OSA
                    percentage
                  </li>
                  <li>
                    Indicators show movement direction (up arrow = growing, down
                    arrow = declining)
                  </li>
                  <div className="my-2">
                    {" "}
                    <img
                      src="/assets/images/learning-images/osaperformance13.svg"
                      alt="img"
                      className="h-[108px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/osaperformance13.svg",
                        )
                      }
                    />
                  </div>
                </ul>
              </div>

              <div>
                <p className="mb-1">8. Interpret Data</p>
                <ul className="list-disc ml-6">
                  <li>
                    Growing products (green up arrows): Products with OSA
                    improvement
                  </li>
                  <li>
                    Declining products (red down arrows): Products with OSA
                    deterioration
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 8: Open the Insight Drawer</p>
                <ul className="list-disc ml-6">
                  <li>
                    Click the bulb icon (Insight button) on the entity card you
                    want to analyze
                    <img
                      src="/assets/images/learning-images/osaperformance14.svg"
                      alt="img"
                      className="h-[21px] my-1"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/osaperformance14.svg",
                        )
                      }
                    />
                  </li>
                  <li>
                    A drawer will slide in from the right side of the screen.
                  </li>
                  <li>The drawer remains open while you continue analyzing</li>
                  <li>
                    The drawer header shows OSA Performance or Planview or
                    selected metric
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">
                  Step 9: Access Daily Performance (First Section)
                </p>
                <ul className="list-disc ml-6">
                  <li>
                    Ensure the Daily Performance tab is selected (first tab in
                    the drawer)
                  </li>
                  <li>
                    This view shows temporal trends and day-by-day breakdown
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">
                  Step 10: Analyze the Graphical Analysis Chart
                </p>
                <p className="mb-1">A) View the Stacked Area Chart</p>
                <ul className="list-disc ml-6">
                  <li>Similar to the main widget, but more detailed</li>
                  <li>Y-axis: Promotions (0% to 100%)</li>
                  <li>X-axis: Time period (dates)</li>
                  <li>
                    Each colored area represents a platform or product line
                  </li>
                </ul>
                <div className="my-2">
                  {" "}
                  <img
                    src="/assets/images/learning-images/osaperformance15.svg"
                    alt="img"
                    className="h-[100px]"
                    onClick={() =>
                      setPreviewImg(
                        "/assets/images/learning-images/osaperformance15.svg",
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <p className="mb-1">B) Time Granularity</p>
                <ul className="list-disc ml-6">
                  <li>
                    Use the Daily dropdown to change view (Weekly, Monthly)
                  </li>
                </ul>
                <div className="my-2">
                  {" "}
                  <img
                    src="/assets/images/learning-images/osaperformance16.svg"
                    alt="img"
                    className="h-[101px]"
                    onClick={() =>
                      setPreviewImg(
                        "/assets/images/learning-images/osaperformance16.svg",
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <p className="mb-1">C) Platform Filters</p>
                <ul className="list-disc ml-6">
                  <li>Multiple platform buttons appear above the chart</li>
                  <li>Click to toggle specific platforms on/off</li>
                  <li>
                    Active filters are highlighted (e.g., Any, All / Swiggy,
                    Instamart)
                  </li>
                </ul>
                <div className="my-2">
                  {" "}
                  <img
                    src="/assets/images/learning-images/osaperformance17.svg"
                    alt="img"
                    className="h-[17px]"
                    onClick={() =>
                      setPreviewImg(
                        "/assets/images/learning-images/osaperformance17.svg",
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <p className="mb-1">
                  Step 11: Review Comprehensive Breakdown Table
                </p>
                <ul className="list-[upper-alpha] ml-6">
                  <li>Scroll down to the Comprehensive Breakdown section</li>
                  <div className="my-2">
                    {" "}
                    <img
                      src="/assets/images/learning-images/osaperformance18.svg"
                      alt="img"
                      className="h-[192px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/osaperformance18.svg",
                        )
                      }
                    />
                  </div>
                  <li>
                    Platform-Level Data:
                    <div>
                      <p className="mb-1">
                        Step 9: Access Daily Performance (First Section)
                      </p>
                      <ul className="list-disc ml-6">
                        <li>Table columns: Platform, OSA, Promotions</li>
                        <li>
                          Rows list individual platforms (Swiggy Instamart,
                          Zepto, BigBasket, Flipkart, Blinkit)
                        </li>
                      </ul>
                    </div>
                  </li>

                  <li>
                    Summary Rows:
                    <ul className="list-disc ml-6">
                      <li>Total Platform: Shows platform count</li>
                      <li>Avg OSA: Average OSA across all platforms</li>
                      <li>
                        Avg Promotions: Average promotions across platforms
                      </li>
                    </ul>
                  </li>
                  <div className="my-2">
                    {" "}
                    <img
                      src="/assets/images/learning-images/osaperformance19.svg"
                      alt="img"
                      className="h-[29px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/osaperformance19.svg",
                        )
                      }
                    />
                  </div>

                  <li>
                    Export Option
                    <ul className="list-disc ml-6">
                      <li className="list-disc ">
                        <div className="flex items-center gap-1">
                          <span>Download icon allows CSV/Excel export</span>

                          <img
                            src="/assets/images/learning-images/osaperformance20.svg"
                            alt="img"
                            className="h-[15px]"
                            onClick={() =>
                              setPreviewImg(
                                "/assets/images/learning-images/osaperformance20.svg",
                              )
                            }
                          />
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    Daily Comparison
                    <ul className="list-disc ml-6">
                      <li>
                        Expand multiple dates to compare day-over-day
                        performance
                      </li>
                      <li>Identify patterns or weekly trends</li>
                      <li>Spot platform-specific issues on particular days</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">
                  Step 12: Access Drill Down Views (Second Section)
                </p>
                <ul className="list-disc ml-6">
                  <li>Click the Drill Down tab inside the insight drawer</li>
                  <li>
                    This view segments performance by platform, location, and
                    product
                  </li>
                </ul>
                <div className="my-2">
                  <img
                    src="/assets/images/learning-images/osaperformance21.svg"
                    alt="img"
                    className="h-[280px]"
                    onClick={() =>
                      setPreviewImg(
                        "/assets/images/learning-images/osaperformance21.svg",
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <p className="mb-1">Step 13: Analyze Platform Distribution</p>
                <ul className="list-decimal ml-6">
                  <li>Locate Platform Distribution in the top-left section</li>
                  <li>View Platform List:</li>
                  <ul className="list-disc ml-4">
                    <li>Checkboxes allow multi-select filtering (optional)</li>
                    <li>Platforms listed with brand logos/icons</li>
                    <li>Columns: Platform, OSA, Promotions</li>
                  </ul>
                  <li>
                    Summary Metrics:
                    <ul className="list-disc ml-4">
                      <li>
                        Bottom shows: Total Platform count, Avg OSA, Avg
                        Promotions
                      </li>
                    </ul>
                  </li>

                  <li>
                    Export:
                    <ul className="list-disc ml-4">
                      <li>Click download icon to download this data</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 14: Analyze Location Distribution</p>
                <ul className="list-decimal ml-6">
                  <li>Locate Location Distribution in the top-right section</li>
                  <li>
                    View options:
                    <ul className="list-disc ml-4">
                      <li>Similar structure to Platform Distribution</li>
                      <li>Columns: Location, OSA, Promotions</li>
                      <li>
                        Locations listed (e.g., Bangalore, New Delhi, Mumbai,
                        Kolkata, Chennai)
                      </li>
                    </ul>
                  </li>
                  <li>
                    Summary:
                    <ul className="list-disc ml-4">
                      <li>
                        Total Location count, Avg OSA, Avg Promotions displayed
                        at bottom
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 15: Analyze Product Distribution</p>
                <ul className="list-decimal ml-6">
                  <li>Locate Product Distribution in the bottom section</li>
                  <li>
                    View Product Details:
                    <ul className="list-disc ml-4">
                      <li>Comprehensive product list with full names</li>
                      <li>Columns: Products, SKU IDs, OSA, Promotions</li>
                    </ul>
                  </li>

                  <li>
                    SKU Information:
                    <ul className="list-disc ml-4">
                      <li>Each product shows its unique SKU ID</li>
                      <li>Useful for inventory and system tracking</li>
                    </ul>
                  </li>

                  <li>
                    Performance Metrics:
                    <ul className="list-disc ml-4">
                      <li>Individual product OSA and promotion percentages</li>
                      <li>Identify top products and problem SKUs</li>
                    </ul>
                  </li>
                  <li>
                    Summary Row:
                    <ul className="list-disc ml-4">
                      <li>Total Products: Shows product count (e.g., 65)</li>
                      <li>Total SKU IDs: Shows total SKUs (e.g., 148)</li>
                      <li>Avg OSA and Avg Promotions</li>
                    </ul>
                  </li>

                  <li>
                    Selection:
                    <ul className="list-disc ml-4">
                      <li>
                        Checkboxes allow filtering main view by specific
                        products
                      </li>
                      <li>Select products to focus analysis</li>
                    </ul>
                  </li>
                  <li>
                    Export:
                    <ul className="list-disc ml-4">
                      <li className="list-disc ">
                        <div className="flex items-center gap-1">
                          <span>
                            Download product-level data for offline analysis
                          </span>

                          <img
                            src="/assets/images/learning-images/osaperformance20.svg"
                            alt="img"
                            className="h-[15px]"
                            onClick={() =>
                              setPreviewImg(
                                "/assets/images/learning-images/osaperformance20.svg",
                              )
                            }
                          />
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    Export Option
                    <ul className="list-disc ml-4">
                      <li className="list-disc ">
                        <div className="flex items-center gap-2">
                          <span>Download icon allows CSV/Excel export</span>

                          <img
                            src="/assets/images/learning-images/osaperformance20.svg"
                            alt="img"
                            className="h-[15px]"
                            onClick={() =>
                              setPreviewImg(
                                "/assets/images/learning-images/osaperformance20.svg",
                              )
                            }
                          />
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 16: Apply Cross-Filters</p>
                <ul className="list-decimal ml-6">
                  <li>
                    Select specific rows
                    <ul className="list-disc ml-4">
                      <li>
                        Click checkboxes next to any platform, location, or
                        product
                      </li>
                      <li>Multiple selections allowed</li>
                    </ul>
                  </li>
                  <li>
                    Cascading Filter Effect:
                    <ul className="list-disc ml-4">
                      <li>
                        Selecting a platform filters the location and product
                        views
                      </li>
                      <li>
                        Selecting a location filters platforms and products that
                        operate there
                      </li>
                      <li>
                        Selecting products filters to relevant platforms and
                        locations
                      </li>
                    </ul>
                  </li>
                  <li>
                    Reset Filters:{" "}
                    <ul>
                      <li>Uncheck all boxes or use cut button to reset</li>
                    </ul>
                  </li>

                  <li>
                    Dynamic Analysis:
                    <ul className="list-disc ml-4">
                      <li>Use combinations to answer specific questions</li>
                      <li>
                        Example: How does BigBasket perform in Mumbai for
                        Product X?
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">
                  Step 17: Access Competition Analysis (Third Section)
                </p>
                <ul className="list-disc ml-6">
                  <li>
                    Click the Competition Analysis tab in the insight
                    drawer(third tab)
                  </li>
                  <li>
                    This view compares your entity against competitor brands
                  </li>
                </ul>
                <div className="my-2">
                  <img
                    src="/assets/images/learning-images/osaperformance22.svg"
                    alt="img"
                    className="h-[201px]"
                    onClick={() =>
                      setPreviewImg(
                        "/assets/images/learning-images/osaperformance22.svg",
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <p className="mb-1">Step 18: View the Competition Chart</p>

                <ul className="list-decimal ml-6">
                  <li>
                    Graphical Comparison:
                    <ul className="list-disc ml-4">
                      <li>Bar chart shows OSA comparison across brands</li>
                      <li>Y-axis: OSA (0% to 100%)</li>
                      <li>X-axis: Brand names</li>
                      <li>
                        Each brand represented by a vertical bar (light blue for
                        competitors, darker blue for your brand)
                      </li>
                    </ul>
                  </li>

                  <li>
                    Graphical Comparison:
                    <ul className="list-disc ml-4">
                      <li>Compare bar heights to see relative performance</li>
                      <li>
                        Your brand may be highlighted in a different shade
                      </li>
                      <li>
                        Scroll right if more brands exist than fit on screen
                      </li>
                    </ul>
                  </li>

                  <li>
                    Interpretation:
                    <ul className="list-disc ml-4">
                      <li>Higher bars = better OSA performance</li>
                      <li>Identify where you lead or lag competitors</li>
                      <li>Benchmark against category average</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">
                  Step 19: Analyze Competition Distribution Table
                </p>
                <ul className="list-decimal ml-6">
                  <li>
                    Left Table - Entity-Level View:
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/osaperformance23.svg"
                        alt="img"
                        className="h-[129px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/osaperformance23.svg",
                          )
                        }
                      />
                    </div>
                    <ul className="list-disc ml-4">
                      <li> Columns: Entity, OSA, Promotions</li>
                      <li> Rows: List of competitor brands </li>
                      <li>
                        {" "}
                        Shows OSA and promotion percentages for each competitor
                      </li>
                    </ul>
                  </li>

                  <li>
                    Sort Functionality:
                    <ul className="list-disc ml-4">
                      <li>
                        Click column headers to sort by Entity, OSA, or
                        Promotions
                      </li>
                      <li>Ascending/descending indicators (▲▼)</li>
                    </ul>
                  </li>

                  <li>
                    Summary Row:
                    <ul className="list-disc ml-4">
                      <li>
                        Total Entity: Shows number of entities being compared
                      </li>
                      <i>Avg OSA and Avg Promotions: Category averages</i>
                    </ul>
                  </li>

                  <li>
                    Select a Competitor:
                    <ul className="list-disc ml-4">
                      <li>Click on any brand name in the left table</li>
                      <li>The row becomes highlighted</li>
                      <li>Right table updates to show that brands products</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 20: View Product-Level Competition</p>
                <ul className="list-decimal ml-6">
                  <li>
                    Right Table - Product Details:
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/osaperformance24.svg"
                        alt="img"
                        className="h-[192px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/osaperformance24.svg",
                          )
                        }
                      />
                    </div>
                    <ul className="list-disc ml-4">
                      <li>
                        {" "}
                        Appears after selecting a brand from the left table
                      </li>
                      <li>
                        {" "}
                        Columns: Brand Name - Products (changes based on
                        selected brand), OSA, Promotions
                      </li>
                      <li>Lists all products for the selected competitor</li>
                    </ul>
                  </li>

                  <li>
                    Product Comparison:
                    <ul className="list-disc ml-4">
                      <li>See which competitor products perform well</li>
                      <li>Compare product-level OSA and promotions</li>
                      <li>Identify competitive threats or opportunities</li>
                    </ul>
                  </li>

                  <li>
                    Summary Metrics:
                    <ul className="list-disc ml-4">
                      <li>Total Products count for that brand</li>
                      <i>Avg OSA and Avg Promotions at product level</i>
                    </ul>
                  </li>

                  <li>
                    Switching Brands:
                    <ul className="list-disc ml-4">
                      <li>Click different brands in left table</li>
                      <li>
                        Right table updates instantly with that brands products
                      </li>
                      <li>Compare product portfolios across competitors</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">
                  Step 21: Apply Filters in Competition View
                </p>
                <ul className="list-decimal ml-6">
                  <li>
                    Toggle Metric View:
                    <ul className="list-disc ml-4">
                      <li>
                        {" "}
                        Click OSA button (top right) to toggle between OSA and
                        other metrics
                      </li>
                      <li>Options may include: OSA, Promotions, Sales</li>
                    </ul>
                  </li>

                  <li>
                    Filter by Performance:
                    <ul className="list-disc ml-4">
                      <li>
                        Use available dropdowns to filter by date range or
                        performance tiers
                      </li>
                    </ul>
                  </li>

                  <li>
                    Cross-Reference:
                    <ul className="list-disc ml-4">
                      <li>
                        Combine with other tabs to understand competitive
                        dynamics
                      </li>
                      <i>
                        Example: Competitor X performs better in Region Y
                        because...
                      </i>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 22: Apply Multi-Dimensional Filters</p>
                <ul className="list-decimal ml-6">
                  <li>
                    Within Any Drawer Section:
                    <ul className="list-disc ml-4">
                      <li> Filters can be applied cumulatively across tabs</li>
                      <li>
                        Selections in one tab may persist when switching tabs
                        (depending on configuration)
                      </li>
                    </ul>
                  </li>

                  <li>
                    Row-Level Selection:
                    <ul className="list-disc ml-4">
                      <li>
                        {" "}
                        Click on any row in platform, location, product, brand,
                        or date tables{" "}
                      </li>
                      <li>That row becomes the active filter </li>
                      <li>
                        All related views update to reflect that selection{" "}
                      </li>
                    </ul>
                  </li>

                  <li>
                    Example Workflow:
                    <ul className="list-disc ml-4">
                      <li>Go to Drill Down tab</li>
                      <li>Select BigBasket platform</li>
                      <li>
                        Switch to Daily Performance tab - data now shows only
                        BigBasket
                      </li>
                      <li>Return to Drill Down - select Mumbai location</li>
                      <li>
                        Data now shows BigBasket performance in Mumbai only
                      </li>
                      <li>
                        Switch to Competition Analysis - see how competitors
                        perform on BigBasket in Mumbai
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 23: Download and Export Data</p>
                <ul className="list-decimal ml-6">
                  <li>
                    Download Buttons:
                    <ul className="list-disc ml-4">
                      <li> Look for download icons in each section</li>
                      <li>
                        Available in: Graphical Analysis, Comprehensive
                        Breakdown, Platform/Location/Product Distribution,
                        Competition tables
                      </li>
                    </ul>
                  </li>

                  <li>
                    Export Process:
                    <ul className="list-disc ml-4">
                      <li className="list-disc ">
                        <div className="flex items-center gap-2">
                          <span>Click the download button</span>

                          <img
                            src="/assets/images/learning-images/osaperformance20.svg"
                            alt="img"
                            className="h-[15px]"
                            onClick={() =>
                              setPreviewImg(
                                "/assets/images/learning-images/osaperformance20.svg",
                              )
                            }
                          />
                        </div>
                      </li>
                      <li>
                        Select format (PNG for charts, CSV/Excel for tables)
                      </li>
                      <li>Current filters are applied to export</li>
                      <li>File downloads to your default location</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 24: Close the Insight Drawer</p>
                <ul className="list-disc ml-6">
                  <li>
                    Click the X button (top right of drawer) or click outside
                    the drawer
                  </li>
                  <li> The drawer slides closed</li>
                  <li>
                    You return to the main OSA Performance Overview widget
                  </li>
                  <li>
                    Your entity selection in the top section remains active
                  </li>
                  <li>
                    All bottom section views remain filtered to that entity
                  </li>
                </ul>
              </div>
            </div>
          )}

          {item.title === "OOS Days Overview Widget" && (
            <div className="bg-gray-50 space-y-3 text-sm text-gray-600">
              <p className="my-1">
                OOS Days Overview Widget: It uses an intuitive bubble chart to
                display OOS (Out-of-Stock) duration, product count, and
                distribution across different entities (Category, Platform, or
                Location), helping you identify critical stock availability
                issues that need immediate attention.
              </p>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">Understanding the Widget</p>

                <div>
                  <p className="mb-1">1. Header Section</p>
                  <ul className="list-disc ml-6">
                    <li>Title: “OOS Days Overview” – identifies the widget</li>
                    <li>
                      Date Range Analysis period (e.g., “22/01/2026 –
                      28/01/2026”)
                    </li>
                    <li>
                      Select View Dropdown: Toggle between Category, Platform,
                      or Location view
                    </li>
                  </ul>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/osaoverview1.svg"
                      alt="img"
                      className="h-[75px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/osaoverview1.svg",
                        )
                      }
                    />
                  </div>
                </div>

                <ul className="list-disc ml-6">
                  <li>
                    <strong>Download Button:</strong> Export the bubble chart as
                    PNG
                  </li>
                </ul>

                <div>
                  <p className="mb-1">2. Bubble Chart Visualization</p>
                  <ul className="list-decimal ml-6">
                    <li>
                      Y-Axis: “OOS Days” – Vertical position indicates duration
                      of stock-out
                    </li>
                    <li>
                      X-Axis: Selected entity (Category/Platform/Location names){" "}
                    </li>
                    <li> Bubbles Each bubble represents one brand</li>
                    <ul className="list-disc ml-4">
                      <li>Vertical Position: Higher = more OOS days</li>
                      <li>Bubble Size: Larger = more products out of stock</li>
                      <li>
                        Number Inside: Total count of OOS products for that
                        brand
                      </li>
                    </ul>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/osaoverview2.svg"
                        alt="img"
                        className="h-[177px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/osaoverview2.svg",
                          )
                        }
                      />
                    </div>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">3. Interactive Slider</p>
                  <ul className="list-disc ml-6">
                    <li>Located below the chart</li>
                    <li>Allows narrowing the view to specific entity ranges</li>
                    <li>Useful when many entities make the chart crowded</li>
                  </ul>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/osaoverview3.svg"
                      alt="img"
                      className="h-[31px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/osaoverview3.svg",
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-1">
                    4. OOS Days Breakdown Drawer (Accessed by clicking bubbles)
                  </p>
                  <ul className="list-disc ml-6">
                    <li>
                      Header: Shows Brand, Location, and Total OOS Products
                    </li>
                    <li>Download Button: Export detailed table as CSV</li>
                    <li>
                      View Toggle: Switch between Consecutive and Cumulative
                      views
                    </li>
                    <li>
                      Detailed Table: Product-level breakdown with platforms,
                      pincodes, and dates
                    </li>
                    <li>
                      Color Legend: Visual guide for OOS severity (High to Low)
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">Step-by-Step Guide</p>

                <div>
                  <p className="mb-1">Step 1: Select Your Analysis Entity</p>
                  <ul className="list-decimal ml-6">
                    <li>
                      Locate the “Select View” dropdown in the top-right corner
                    </li>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/osaoverview4.svg"
                        alt="img"
                        className="h-[82px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/osaoverview4.svg",
                          )
                        }
                      />
                    </div>
                    <li>
                      Click to reveal options
                      <ul className="list-disc ml-4">
                        <li>Category: View OOS days by product category</li>
                        <li>Platform: View OOS days by platform</li>
                        <li>Location: View OOS days by geographic location</li>
                      </ul>
                    </li>
                    <li>Select your desired view</li>
                    <li>
                      The chart automatically refreshes with the new entity
                      breakdown
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 2: Review the Date Range</p>
                  <ul className="list-disc ml-6">
                    <li>
                      Check the date range displayed below the title (e.g.,
                      “22/01/2026 – 28/01/2026”)
                    </li>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/osaoverview5.svg"
                        alt="img"
                        className="h-[21px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/osaoverview5.svg",
                          )
                        }
                      />
                    </div>
                    <li>This indicates the period being analyzed</li>
                  </ul>
                </div>

                <p className="font-bold my-1">Bubble Graph Analysis</p>

                <div>
                  <p className="mb-1">Step 3: Understand Bubble Positioning</p>
                  <ul className="list-decimal ml-6">
                    <li>
                      Vertical Axis (Y-Axis): OOS Days
                      <ul className="list-disc ml-4">
                        <li>
                          Bubbles positioned higher have experienced longer
                          out-of-stock periods
                        </li>
                        <li>Grid lines help estimate exact values</li>
                      </ul>
                    </li>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/osaoverview6.svg"
                        alt="img"
                        className="h-[142px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/osaoverview6.svg",
                          )
                        }
                      />
                    </div>
                    <li>
                      Horizontal Axis (X-Axis): Entity
                      <ul className="list-disc ml-4">
                        <li>
                          Shows the selected entity type (e.g., cities:
                          Bangalore, New Delhi, Kolkata, Mumbai)
                        </li>
                        <li>Each vertical column represents one entity</li>
                        <li>Entities are ordered left to right</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 4: Interpret Bubble Size</p>
                  <ul className="list-decimal ml-6">
                    <li>
                      Bubble Diameter:
                      <ul className="list-disc ml-4">
                        <li>Larger bubbles = more products out of stock</li>

                        <li>Smaller bubbles = fewer products out of stock</li>
                      </ul>
                    </li>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/osaoverview7.svg"
                        alt="img"
                        className="h-[75px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/osaoverview7.svg",
                          )
                        }
                      />
                    </div>
                    <li>
                      Number Inside Bubble:
                      <ul className="list-decimal ml-4">
                        <li>
                          Locate the Select View: dropdown in the top-right
                          corner
                          <ul className="list-disc">
                            <li>Displays the exact count of OOS products</li>
                            <li>
                              Example: 125 means 125 products were OOS, 18 means
                              18 products were OOS
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li>
                      Visual Quick Assessment:
                      <ul className="list-disc">
                        <li>
                          Large bubbles high on the chart = Critical issue (many
                          products OOS for many days)
                        </li>
                        <li>
                          Small bubbles low on the chart = Minor issue (few
                          products OOS for few days)
                        </li>
                        <li>
                          Large bubbles low on the chart = Many products had
                          brief stockouts
                        </li>
                        <li>
                          Small bubbles high on the chart = Few products had
                          extended stockouts
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 5: Hover Over Bubbles for Details</p>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/osaoverview8.svg"
                      alt="img"
                      className="h-[151px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/osaoverview8.svg",
                        )
                      }
                    />
                  </div>
                  <ul className="list-decimal ml-6">
                    <li>Move your cursor over any bubble</li>

                    <li>
                      A tooltip appears showing:
                      <ul className="list-disc ml-4">
                        <li>Brand Name: Which brand this bubble represents</li>
                        <li>
                          Entity Name: The specific category/platform/location
                        </li>
                        <li>
                          OOS Days: Number of days products were out of stock
                        </li>
                        <li>
                          Total OOS Products: Count of products that experienced
                          stockouts
                        </li>
                      </ul>
                    </li>

                    <li>
                      Use hover to quickly scan multiple bubbles without
                      clicking
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 7: Focus on Specific Entities</p>
                  <ul className="list-decimal ml-6">
                    <li>Locate the horizontal slider below the chart</li>

                    <li>
                      Slider has two handles
                      <ul className="list-disc ml-4">
                        <li>Left handle: Sets the starting entity</li>
                        <li>Right handle: Sets the ending entity</li>
                      </ul>
                    </li>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/osaoverview9.svg"
                        alt="img"
                        className="h-[28px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/osaoverview9.svg",
                          )
                        }
                      />
                    </div>

                    <li>
                      To narrow the view:
                      <ul className="list-disc ml-4">
                        <li>
                          Click and drag the left handle to the right to exclude
                          leftmost entities
                        </li>
                        <li>
                          Click and drag the right handle to the left to exclude
                          rightmost entities
                        </li>
                        <li>
                          The chart zooms to show only entities within the
                          selected range
                        </li>
                      </ul>
                      <div className="my-2">
                        <img
                          src="/assets/images/learning-images/osaoverview10.svg"
                          alt="img"
                          className="h-[114px]"
                          onClick={() =>
                            setPreviewImg(
                              "/assets/images/learning-images/osaoverview10.svg",
                            )
                          }
                        />
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 8: Export the Bubble Chart</p>
                  <ul className="list-disc ml-6">
                    <li>Click the download (↓) in the top-right corner</li>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/osaoverview11.svg"
                        alt="img"
                        className="h-[14px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/osaoverview11.svg",
                          )
                        }
                      />
                    </div>
                    <li>The chart exports as a PNG image</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 9: Open the Breakdown Drawer</p>
                  <ul className="list-disc ml-6">
                    <li>Click on any bubble in the chart</li>
                    <li>
                      A drawer slides in from the right side of the screen
                    </li>
                  </ul>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/osaoverview12.svg"
                      alt="img"
                      className="h-[191px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/osaoverview12.svg",
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-1">Step 10: Review the Drawer Header</p>

                  <ul className="list-decimal ml-6">
                    <li>
                      Header Information
                      <ul className="list-disc ml-4">
                        {" "}
                        <li>Title: OOS Days Breakdown</li>
                        <li>Subtitle: Shows the product you clicked</li>
                        <li>Entity: Specific entity</li>
                        <li>Total OOS Products: Count summary</li>
                      </ul>
                    </li>

                    <li>
                      Download Button: CSV export option (top-right of drawer)
                    </li>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/osaoverview11.svg"
                        alt="img"
                        className="h-[14px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/osaoverview11.svg",
                          )
                        }
                      />
                    </div>
                    <li>This header provides context for all data below</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 11: Table Structure</p>
                  <ul className="list-disc ml-6">
                    <li>
                      The table shows product-level granularity with these
                      columns:
                    </li>
                  </ul>
                  <ul className="list-decimal ml-6">
                    <li>
                      {" "}
                      Product: Full product name and description
                      <li>
                        Platform: Sales channel (e.g., Blinkit, BigBasket,
                        calculation
                      </li>
                      <li>Pincode: Specific pincodes where product was OOS</li>
                      <li>
                        OOS Days: Number of days the product was out of stock
                      </li>
                      <li>
                        View Toggle (Consecutive/Cumulative): Changes OOS Days
                        calculation
                      </li>
                      <li>
                        Date Range (OOS Days): Specific dates when OOS occurred
                      </li>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 12: Understand the Product Column</p>

                  <ul className="list-decimal ml-6">
                    <li>
                      {" "}
                      Full Product Details
                      <ul className="list-disc ml-4">
                        <li>Complete product name with variant details</li>
                      </ul>
                    </li>
                    <li>
                      Sorting:{" "}
                      <ul className="list-disc ml-4">
                        <li>Click the column header to sort alphabetically</li>
                        <li className="list-disc">
                          <div className="flex gap-2">
                            <span>Use to group similar products together</span>
                            <img
                              src="/assets/images/learning-images/osaoverview13.svg"
                              alt="img"
                              className="h-[14px] mt-1"
                              onClick={() =>
                                setPreviewImg(
                                  "/assets/images/learning-images/osaoverview13.svg",
                                )
                              }
                            />
                          </div>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 13: Analyze Platform Distribution</p>

                  <ul className="list-decimal ml-6">
                    <li>
                      {" "}
                      Platform Column:
                      <ul className="list-disc ml-4">
                        <li>
                          Shows branded platform icons and names (Flipkart,
                          Blinkit, Flipkart Supermart, Bigbasket, Amazon Fresh,
                          Swiggy Instamart, Zepto)
                        </li>
                        <li>
                          Each row represents a unique product-platform-pincode
                          combination
                        </li>
                      </ul>
                    </li>
                    <li>
                      Key Insights:{" "}
                      <ul className="list-disc ml-4">
                        Same product appearing multiple times = OOS on multiple
                        platforms
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <div>
                  <p className="mb-1">Step 14: Review Pincode Details</p>
                  <p className="mb-1">1. Pincode Column:</p>
                  <ul className="list-disc ml-6">
                    <li>Shows specific delivery pincodes</li>
                    <li>Format: [Pincode] / [City or Area Name]</li>
                  </ul>
                  <p className="mb-1">2. Sorting:</p>
                  <ul className="list-disc ml-6">
                    <li>Click header to group by pincode</li>
                    <li>Reveals geographic clusters of stockouts</li>
                  </ul>
                </div>
                <p className="my-2">Part 7: Consecutive vs. Cumulative Views</p>
                <div className="my-2">
                  <img
                    src="/assets/images/learning-images/osaoverview14.svg"
                    alt="img"
                    className="h-[59px]"
                    onClick={() =>
                      setPreviewImg(
                        "/assets/images/learning-images/osaoverview14.svg",
                      )
                    }
                  />
                </div>
                <div>
                  <p className="mb-1">Step 15: Understand View Types</p>
                  <ul className="list-disc ml-6">
                    <li>
                      Toggle Location: Dropdown in the OOS Days column header
                    </li>
                    <li>Two view options:</li>
                  </ul>
                  <p className="mb-1">A. Consecutive View (Default)</p>
                  <ul className="list-decimal ml-6">
                    <li>
                      Definition: Shows the longest uninterrupted streak of OOS
                      days
                    </li>
                    <li>OOS Days Column: Displays consecutive count</li>
                    <li>
                      Date Range Column: Shows exact start and end dates of the
                      streak
                    </li>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/osaoverview15.svg"
                        alt="img"
                        className="h-[115px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/osaoverview15.svg",
                          )
                        }
                      />
                    </div>
                    <li>
                      Example:
                      <ul className="list-disc ml-4">
                        <li>OOS Days: 7</li>
                        <li>Date Range: 22/01/2026-28/01/2026</li>
                        <li>
                          Meaning: Product was OOS for 7 days from Jan 22 to Jan
                          28
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">B. Cumulative View</p>
                  <ul className="list-decimal ml-6">
                    <li>
                      Definition: Shows total number of OOS days, even if
                      non-consecutive
                    </li>
                    <li>
                      OOS Days Column: Displays sum of all OOS days within the
                      date range
                    </li>
                    <li>
                      Date Range Column: Shows - (empty) as dates are
                      non-consecutive
                    </li>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/osaoverview16.svg"
                        alt="img"
                        className="h-[168px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/osaoverview16.svg",
                          )
                        }
                      />
                    </div>
                    <li>
                      Example:{" "}
                      <ul className="list-disc ml-3">
                        <li>OOS Days: 7</li>
                        <li>Date Range: -</li>
                        <li>
                          Meaning: Product was OOS for 7 total days, possibly
                          spread across the period (e.g., OOS on Jan 22, 24, 25,
                          26, 27, 28, and 29)
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <div>
                  <p className="mb-1">Step 16: Toggle Between Views</p>
                  <ul className="list-decimal ml-6">
                    <li>
                      Click the Consecutive or Cumulative dropdown in the OOS
                      Days column header
                    </li>
                    <li>Select your preferred view</li>
                    <li>The table refreshes with updated calculations</li>
                  </ul>
                </div>

                <p className="my-2">Part 8:Interpreting Color Intensity </p>
                <div>
                  <p className="mb-1">Step 17: Use the Color Heat Map</p>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/osaoverview17.svg"
                      alt="img"
                      className="h-[164px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/osaoverview17.svg",
                        )
                      }
                    />
                  </div>
                  <p className="mb-1">1. Color Schemes:</p>
                  <ul className="list-disc ml-6">
                    <li>Each row in the OOS Days column is color-coded</li>
                    <li>
                      Darker Shade: Higher number of OOS days (more severe)
                    </li>
                    <li>
                      Lighter Shade: Lower number of OOS days (less severe)
                    </li>
                  </ul>
                  <p className="mb-1">2. Legend:</p>
                  <ul className="list-disc ml-6">
                    <li>Located at the bottom-right corner of the drawer</li>
                    <li>
                      Shows gradient from High OOS Days (dark) to Low OOS Days
                      (light)
                    </li>
                    <li>Use as reference when scanning the table</li>
                  </ul>

                  <p className="mb-1">3. Visual Scanning:</p>
                  <ul className="list-disc ml-6">
                    <li>Quickly scroll through table looking for dark rows</li>
                    <li>Dark rows = Products with severe OOS issues</li>
                    <li>Alternating colors suggest mixed performance</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">
                    Step 18: Prioritize Actions Based on Color
                  </p>
                  <p className="mb-1">1. Dark Shade Rows (7+ days):</p>
                  <ul className="list-disc ml-6">
                    <li>Action: Immediate investigation required</li>
                  </ul>
                  <p className="mb-1">2. Medium Rows (3-6 days):</p>
                  <ul className="list-disc ml-6">
                    <li>Action: Review within 24-48 hours</li>
                  </ul>
                  <p className="mb-1">3. Light Shade Rows (1-2 days):</p>
                  <ul className="list-disc ml-6">
                    <li>Action: Monitor, standard follow-up</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 19: View Specific OOS Dates</p>
                  <ul className="list-decimal ml-6">
                    <li className="list-disc">
                      Calendar Icon: Small calendar icon
                      <img
                        src="/assets/images/learning-images/osaoverview18.svg"
                        alt="img"
                        className="inline h-[15px] align-middle mx-1 cursor-pointer"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/osaoverview18.svg",
                          )
                        }
                      />
                      appears next to OOS Days number in each row
                    </li>

                    <li>
                      Functionality:
                      <ul className="list-disc ml-4">
                        <li>A popup appears showing exact dates</li>
                        <li>In Consecutive View:</li>
                        <li>
                          Shows continuous date range (e.g., Jan 22, Jan 23, Jan
                          24, Jan 25, Jan 26, Jan 27, Jan 28)
                        </li>
                        <li>In Cumulative View:</li>
                        <li>
                          Shows individual dates (e.g., Jan 22, Jan 24, Jan 25,
                          Jan 28, Jan 29)
                        </li>
                        <li>Gaps indicate days when product was in stock</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <div>
                  <p className="mb-1">Step 20: Sort by Column</p>
                  <ul className="list-decimal ml-6">
                    <li>
                      Click on column headers to sort:
                      <ul className="list-disc ml-4">
                        <li>Click the calendar icon</li>
                        <div className="my-2">
                          <img
                            src="/assets/images/learning-images/osaoverview19.svg"
                            alt="img"
                            className="h-[177px]"
                            onClick={() =>
                              setPreviewImg(
                                "/assets/images/learning-images/osaoverview19.svg",
                              )
                            }
                          />
                        </div>
                        <li>Product: Alphabetical order (A-Z or Z-A)</li>
                        <li>Platform: Platform name alphabetically</li>
                        <li>Pincode: Numerical order</li>
                        <li>
                          OOS Days: Ascending (lowest to highest) or Descending
                          (highest to lowest)
                        </li>
                        <li>Date Range: Chronologically</li>
                      </ul>
                    </li>
                    <li>
                      Sorting Indicators:{" "}
                      <ul className="list-disc ml-4">
                        <li>
                          Small arrows ▲ appear next to active sort column
                        </li>
                        <li>
                          Click once for ascending, twice for descending, three
                          times to remove sort
                        </li>
                      </ul>
                    </li>
                    <li>
                      Multi-Column Sorting:
                      <ul className="list-disc ml-4">
                        <li>
                          {" "}
                          Some tables support holding Shift while clicking
                          additional columns
                        </li>
                        <li>
                          Creates hierarchical sorting (e.g., sort by Platform,
                          then by OOS Days within each platform)
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 21: Download the Breakdown Table</p>
                  <ul className="list-disc ml-6">
                    <li>
                      {" "}
                      Click the download icon (top-right corner of drawer)
                    </li>
                    <li>Export Format: CSV (Comma-Separated Values)</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 22: Close the Drawer</p>
                  <ul className="list-disc ml-6">
                    <li>Click the X button (top-left corner of drawer)</li>
                    <li>Or click outside the drawer area on the main chart</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {item.title === "SOS (Share of Search) Analysis Widget" && (
            <div className="bg-gray-50 space-y-3 text-sm text-gray-600">
              <p>
                SOS (Share of Search) Analysis Widget: It tracks how often your
                products appear in search results compared to competitors,
                providing crucial insights into your digital discoverability,
                keyword performance, and ranking distribution.
              </p>

              <p className="font-bold my-1">Understanding the Widget</p>

              <div>
                <p className="font-bold my-1">SoS Analysis</p>
                <ul className="list-decimal ml-6">
                  <li>
                    Header Section
                    <ul className="list-disc ml-4">
                      <li>Title: SOS Analysis</li>
                      <li>
                        Select View Dropdown: Choose entity type
                        (Category/Brand/Platform/Location)
                        <div className="my-2">
                          <img
                            src="/assets/images/learning-images/oso-widget1.svg"
                            alt="img"
                            className="h-[107px]"
                            onClick={() =>
                              setPreviewImg(
                                "/assets/images/learning-images/oso-widget1.svg",
                              )
                            }
                          />
                        </div>
                      </li>
                      <li>
                        Select Metrics Dropdown: Toggle between Overall SOS,
                        Organic SOS, Paid SOS
                        <div className="my-2">
                          <img
                            src="/assets/images/learning-images/oso-widget2.svg"
                            alt="img"
                            className="h-[86px]"
                            onClick={() =>
                              setPreviewImg(
                                "/assets/images/learning-images/oso-widget2.svg",
                              )
                            }
                          />
                        </div>
                      </li>
                      <li>Download Button: Export visualization as PNG</li>
                    </ul>
                  </li>
                  <li>
                    Bar Chart Visualization
                    <ul className="list-disc ml-4">
                      <li>Y-Axis: Overall SOS percentage (0% to 100%)</li>
                      <li>
                        X-Axis: Selected entities (e.g., categories, platforms,
                        locations)
                      </li>
                      <li>Blue Bars: Actual SOS performance</li>
                      <li>
                        Gray Bars: Maximum possible (100%) for visual reference
                      </li>
                      <li>
                        Horizontal Scroll: Navigate through multiple entities
                      </li>
                    </ul>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/oso-widget3.svg"
                        alt="img"
                        className="h-[98px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/oso-widget3.svg",
                          )
                        }
                      />
                    </div>
                  </li>

                  <p className="my-2 font-bold">Tabular View</p>
                  <li>
                    Tabular View (Bottom Left)
                    <ul className="list-disc ml-4">
                      <li>
                        Keyword Type Breakdown: Shows how different keyword
                        types contribute to overall SOS
                      </li>
                      <li>
                        Expandable Rows: Click to reveal actual keywords within
                        each type
                      </li>
                      <li>Columns: Keyword Type, SOS %, Ranking</li>
                    </ul>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/oso-widget4.svg"
                        alt="img"
                        className="h-[93px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/oso-widget4.svg",
                          )
                        }
                      />
                    </div>
                  </li>

                  <p className="my-2 font-bold">Rank Distribution</p>
                  <li>
                    Rank Distribution Panel (Right Side)
                    <ul className="list-disc ml-4">
                      <li>
                        Mobile-Friendly Layout: Visualizes search result slots
                      </li>
                      <li>
                        Color-Coded Cards: Shows frequency of appearance in each
                        position
                      </li>
                      <li>
                        Layout Options: Toggle between 1-4 columns display
                      </li>
                      <li>
                        Category Label: Shows which entity is being analyzed
                      </li>
                    </ul>
                  </li>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/oso-widget5.svg"
                      alt="img"
                      className="h-[138px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/oso-widget5.svg",
                        )
                      }
                    />
                  </div>

                  <li>
                    Comprehensive Breakdown Drawer (Accessed via insight bulb
                    button)
                    <ul className="list-disc ml-4">
                      <li>
                        {" "}
                        Daily Performance Tab: Historical SOS trends by platform
                      </li>
                      <li>
                        Drill Down Tab: Platform, location, and keyword
                        segmentation
                      </li>
                      <li>
                        Competition Analysis Tab: Competitive brand comparison
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <p className="font-bold my-1">Step-by-Step Guide</p>
              <p className="font-bold mb-1">SoS Analysis</p>

              <div>
                <p className="mb-1">step1: Select Your Analysis Entity</p>
                <ul className="list-decimal ml-6">
                  <li>
                    Locate the Select View: dropdown in the top-right area
                  </li>
                  <li>
                    Click to reveal entity options:
                    <ul className="list-disc ml-4">
                      <li>Category: Analyze by product categories</li>
                      <li>Brand: Analyze by brand names</li>

                      <li>Platform: Analyze by e-commerce platforms</li>
                      <li>Location: Analyze by geographic regions/cities</li>
                      <div className="my-2">
                        <img
                          src="/assets/images/learning-images/oso-widget6.svg"
                          alt="img"
                          className="h-[78px]"
                          onClick={() =>
                            setPreviewImg(
                              "/assets/images/learning-images/oso-widget6.svg",
                            )
                          }
                        />
                      </div>
                      <li>Select your desired entity type</li>

                      <li>
                        The entire widget refreshes to show that entity
                        breakdown
                      </li>
                      <li>Default: Category view (as shown in example)</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 2: Choose Your SOS Metric Type</p>
                <ul className="list-decimal ml-6">
                  <li>
                    Locate the Select Metrics: dropdown next to Select View
                  </li>
                  <li>
                    Click to reveal metric options:
                    <ul className="list-disc ml-4">
                      <li>
                        {" "}
                        Overall SOS: Combined organic and paid visibility
                      </li>
                      <li>Organic SOS: Organic search results only</li>

                      <li>Paid SOS: Sponsored/advertised placements only</li>
                    </ul>
                  </li>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/oso-widget7.svg"
                      alt="img"
                      className="h-[71px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/oso-widget7.svg",
                        )
                      }
                    />
                  </div>
                  <li>Select your desired metric</li>
                  <li>
                    The bar chart and all downstream data update to reflect this
                    metric
                  </li>
                  <li>Default: Overall SOS</li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 3: Read the Visualization</p>
                <ul className="list-decimal ml-6">
                  <li>
                    Bar Structure:
                    <ul className="list-disc ml-4">
                      <li> Blue filled portion: Your actual SOS performance</li>
                      <li>
                        Gray unfilled portion: Remaining market share
                        (competitors + null)
                      </li>

                      <li>
                        Height comparison: Taller blue bars = better performance
                      </li>
                    </ul>
                  </li>
                  <li>
                    X-Axis Labels:
                    <ul className="list-disc ml-4">
                      <li>Entity names displayed below each bar</li>
                    </ul>
                  </li>
                  <li>
                    Y-Axis Scale:
                    <ul className="list-disc ml-4">
                      <li>Percentage from 0% to 100%</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">
                  Step 4: Identify Performance Leaders and Laggards
                </p>

                <ul className="list-disc ml-6">
                  <li>
                    If more entities exist than fit on screen, use horizontal
                    scrolling
                  </li>
                  <li>
                    Mouse/Trackpad: Scroll horizontally over the chart area
                  </li>
                  <li>
                    Scroll Bar: Click and drag the horizontal scroll bar below
                    the chart
                  </li>

                  <li>
                    All entities in your portfolio are accessible through
                    scrolling
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 6: Select an Entity for Deep Dive</p>
                <ul className="list-decimal ml-6">
                  <li>Click directly on any bar in the chart</li>
                  <li>
                    The selected bar becomes highlighted or visually distinct
                  </li>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/oso-widget8.svg"
                      alt="img"
                      className="h-[153px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/oso-widget8.svg",
                        )
                      }
                    />
                  </div>
                  <li>
                    Automatic Filtering:
                    <ul className="list-disc ml-4">
                      <li>
                        Tabular View below updates to show keyword breakdown for
                        that entity
                      </li>
                      <li>
                        Rank Distribution Panel on right updates to show
                        position distribution
                      </li>
                      <li>All data synchronizes to the selected entity</li>
                    </ul>
                  </li>
                  <li>
                    Default Selection: First entity (leftmost bar) is selected
                    by default
                  </li>
                </ul>
              </div>

              <p className="my-1 font-bold">Tabular View</p>

              <div>
                <p className="mb-1">Step 7: Review Keyword Type Breakdown</p>
                <ul className="list-decimal ml-6">
                  <li>
                    {" "}
                    Located in the bottom-left section labeled Tabular View
                  </li>
                  <li>Shows the selected entity</li>
                  <li>
                    Table Structure:
                    <ul className="list-disc ml-4">
                      <li>Column 1: Keyword Type (with sortable header ⬍)</li>
                      <li>Column 2: SOS % (contribution to overall SOS)</li>
                      <li>Column 3: Ranking (average search position)</li>
                    </ul>
                  </li>
                </ul>
                <div className="my-2">
                  <img
                    src="/assets/images/learning-images/oso-widget9.svg"
                    alt="img"
                    className="h-[196px]"
                    onClick={() =>
                      setPreviewImg(
                        "/assets/images/learning-images/oso-widget9.svg",
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <p className="mb-1">Step 8: Understand Keyword Types</p>
                <p className="mb-1">
                  The table categorizes keywords into strategic types:
                </p>
                <ul className="list-decimal ml-6">
                  <li>
                    Brand Keyword
                    <ul className="list-disc ml-4">
                      <li>Definition: Keywords containing your brand name</li>
                    </ul>
                  </li>
                  <li>
                    Category Keyword
                    <ul className="list-disc ml-4">
                      <li>Definition: Generic product category terms</li>
                    </ul>
                  </li>
                  <li>
                    Competition Keyword
                    <ul className="list-disc ml-4">
                      <li>
                        Definition: Keywords containing competitor brand names
                      </li>
                    </ul>
                  </li>
                  <li>
                    Lineage Keyword
                    <ul className="list-disc ml-4">
                      <li>
                        Definition: Product-line-specific or variant keywords
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 9: Sort and Prioritize</p>
                <ul className="list-decimal ml-6">
                  <li>
                    Click column headers to sort:
                    <ul className="list-disc ml-4">
                      <li>Keyword Type: Alphabetical organization</li>
                      <li>
                        SOS: Find highest/lowest contributing keyword types
                      </li>
                      <li>
                        Ranking: Identify keyword types with best/worst
                        positions
                      </li>
                    </ul>
                  </li>
                  <li>
                    Sorting Indicators: Small arrows (⬍) show active sort
                    direction
                  </li>
                  <li>
                    Strategic Sorting:
                    <ul className="list-disc ml-4">
                      <li>Sort by SOS (descending) to find biggest drivers</li>
                      <li>
                        Sort by Ranking (ascending) to find best-positioned
                        keyword groups
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 10: Expand to View Actual Keywords</p>
                <ul className="list-decimal ml-6">
                  <li>Click on any Keyword Type row (e.g., Brand Keywor)</li>
                  <li>
                    Row expands to show individual keywords within that type
                  </li>
                  <li>
                    Expanded View Shows:
                    <ul className="list-disc ml-4">
                      <li>Each specific keyword</li>
                      <li>SOS % for that individual keyword</li>
                      <li>Ranking for that keyword</li>
                    </ul>
                  </li>
                </ul>
                <div className="my-2">
                  <img
                    src="/assets/images/learning-images/oso-widget11.svg"
                    alt="img"
                    className="h-[125px]"
                    onClick={() =>
                      setPreviewImg(
                        "/assets/images/learning-images/oso-widget11.svg",
                      )
                    }
                  />
                </div>
              </div>

              <p className="my-1 font-bold">Rank Distribution</p>
              <div>
                <p className="mb-1">Step 11: Understand the Visual Layout</p>
                <ul className="list-decimal ml-6">
                  <li>1. Located on the right side of the widget</li>
                  <li>Header: Rank Distribution with layout selector</li>
                  <li>Entity Label: Shows which entity is being analyzed</li>
                  <li>
                    Card Grid: Represents search result positions P0 through P10
                    <ul className="list-disc ml-4">
                      <li>P0: Top position (most valuable)</li>
                      <li>P1-P10: Subsequent positions, descending in value</li>
                      <li>Layout mimics mobile shopping app search results</li>
                    </ul>
                  </li>
                </ul>
                <div className="my-2">
                  <img
                    src="/assets/images/learning-images/oso-widget12.svg"
                    alt="img"
                    className="h-[182px]"
                    onClick={() =>
                      setPreviewImg(
                        "/assets/images/learning-images/oso-widget12.svg",
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <p className="mb-1">Step 12: Interpret Card Colors</p>
                <ul className="list-decimal ml-6">
                  <li>
                    Color Intensity indicates frequency of appearance:
                    <ul className="list-disc ml-4">
                      <li>
                        Dark Blue/Navy: High frequency - your products appear
                        here very often
                      </li>
                      <li>
                        Medium Blue: Moderate frequency - regular appearances
                      </li>
                      <li>
                        Light Blue: Low frequency - occasional appearances
                      </li>
                      <li>Very Light/White: Minimal to no appearances</li>
                    </ul>
                  </li>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/oso-widget13.svg"
                      alt="img"
                      className="h-[52px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/oso-widget13.svg",
                        )
                      }
                    />
                  </div>

                  <li>
                    Visual Scanning:
                    <ul className="list-disc ml-4">
                      <li>More dark cards = Better overall visibility</li>
                      <li>
                        Dark cards concentrated at top (P0-P2) = Excellent
                        performance
                      </li>
                      <li>
                        Dark cards only at bottom (P8-P10) = Poor visibility,
                        buried in results
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 13: Understand Position Indicators</p>
                <ul className="list-disc ml-6">
                  <li>
                    Green Checkmark (✓): Appears in top-right corner indicating
                    paid positions
                  </li>
                  <li>
                    Position Labels: P0, P1, P2, etc., clearly marked on each
                    card
                  </li>

                  <li>
                    Progress Bars: Below position labels show relative frequency
                    visually
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 14: Hover for Detailed Metrics</p>
                <ul className="list-decimal ml-6">
                  <li>Move cursor over any position card (P0-P10)</li>
                  <li>
                    Tooltip displays:
                    <ul className="list-disc ml-4">
                      <li>
                        Position Number: Confirms the ranking position (e.g.,
                        Position 0)
                      </li>
                      <li>
                        Number of Occurrences: How many times your product
                        appeared in this position across all analyzed searches
                      </li>
                      <li>Example: Position 2: 1,247 occurrences</li>
                    </ul>
                  </li>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/oso-widget14.svg"
                      alt="img"
                      className="h-[112px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/oso-widget14.svg",
                        )
                      }
                    />
                  </div>
                  <li>
                    Use this data to:
                    <ul className="list-disc ml-4">
                      <li> Quantify exact visibility at each position</li>
                      <li> Compare position frequencies</li>
                      <li> Identify position improvement opportunities</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 15: Change Layout Configuration</p>
                <ul className="list-decimal ml-6">
                  <li>
                    Locate Select Layout: dropdown in the Rank Distribution
                    header
                  </li>
                  <li>
                    Layout Options:
                    <ul className="list-disc ml-4">
                      <li>1 in a Row: Single-column layout (vertical stack)</li>
                      <li>2 in a Row: Two-column grid</li>
                      <li>
                        3 in a Row: Three-column grid (default in example)
                      </li>
                      <li>
                        4 in a Row: Four-column compact grid (note: the option
                        shown is 3 in a Row but typically 4 in a Row is also
                        available)
                      </li>
                    </ul>
                  </li>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/oso-widget15.svg"
                      alt="img"
                      className="h-[114px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/oso-widget15.svg",
                        )
                      }
                    />
                  </div>

                  <li className="mb-1">
                    Selection Impact:
                    <ul className="list-disc ml-6">
                      <li>Changes only visual arrangement, not data</li>
                      <li>Use based on screen size and preference</li>
                      <li>
                        More columns = more compact, requires less scrolling
                      </li>
                      <li>Fewer columns = larger cards, easier to read</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 16: Strategic Interpretation</p>
                <p>Position Value Hierarchy:</p>
                <ul className="list-disc ml-6">
                  <li>
                    P0 (Top Position): Highest click-through rate, most valuable
                  </li>
                  <li>
                    P1-P2: Still highly visible, strong conversion potential
                  </li>
                  <li>
                    P3-P5: Visible on first screen (mobile), moderate
                    performance
                  </li>
                  <li>P6-P10: Below the fold, low click-through rates</li>
                </ul>
              </div>

              <div>
                <p className="mb-1">Step 17: Download the Widget</p>
                <ul className="list-decimal ml-6">
                  <li>Click the download button in the top-right corner</li>
                  <li>Export Format: PNG image</li>
                  <li>
                    Includes in Export:
                    <ul className="list-disc ml-4">
                      <li>Complete bar chart with all visible entities</li>
                      <li>Current slider selection range</li>
                      <li>Selected entity highlighting</li>
                      <li>Tabular view of keyword breakdown</li>
                      <li>Rank distribution panel</li>
                      <li>All headers, labels, and legends</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <p className="font-bold my-1">Insight Drawer</p>

                <div>
                  <p className="mb-1">Step 18: Open the Insight Drawer</p>
                  <ul className="list-decimal ml-6">
                    <li>
                      Locate the bulk icon (Insight button) next to the selected
                      entity
                      <ul className="list-disc ml-4">
                        <li>
                          Typically appears near the entity name in the tabular
                          view or next to the selected bar
                        </li>
                      </ul>
                    </li>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/oso-widget16.svg"
                        alt="img"
                        className="h-[18px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/oso-widget16.svg",
                          )
                        }
                      />
                    </div>
                    <li>Click the bulk icon</li>
                    <li>
                      A drawer slides in from the right side of the screen
                    </li>
                    <li>
                      Header displays:
                      <ul className="list-disc ml-4">
                        <li>SOS Performance</li>
                        <li>Selected entity name</li>
                      </ul>
                    </li>
                    <li>The drawer provides three analytical tabs</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold my-1">A) Daily Performance</p>

                  <div>
                    <p className="mb-1">Step 19: Access Daily Performance</p>
                    <ul className="list-disc ml-6">
                      <li>
                        Ensure the Daily Performance tab is selected (first tab)
                      </li>
                      <li>This tab shows temporal trends in SOS performance</li>
                    </ul>
                  </div>

                  <div>
                    <p className="mb-1">
                      Step 20: Analyze the Graphical Analysis Chart
                    </p>
                    <ul className="list-disc ml-6">
                      <li>Section Title: Graphical Analysis</li>
                      <li>
                        Date Range: Displayed below title (e.g., 22/01/2026 →
                        28/01/2026)
                      </li>
                      <li>
                        Time Granularity Dropdown: Select Daily (default),
                        Weekly, or Monthly views
                      </li>
                    </ul>
                  </div>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/oso-widget17.svg"
                      alt="img"
                      className="h-[138px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/oso-widget17.svg",
                        )
                      }
                    />
                  </div>
                  <div>
                    <p>Chart Structure:</p>
                    <ul className="list-decimal ml-6">
                      <li>Y-Axis: SOS percentage</li>
                      <li>X-Axis: Time period (dates)</li>
                      <li>
                        Multi-Line Graph: Each colored line represents a
                        different platform
                        <ul className="list-disc ml-4">
                          <li>
                            Example platforms: Blinkit, Flipkart Supermart,
                            Zepto, Swiggy Instamart, Bigbasket, Flipkart, Amazon
                            Fresh
                          </li>
                          <li>
                            Avg of All (red line): Overall average across all
                            platforms
                          </li>
                        </ul>
                      </li>
                    </ul>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/oso-widget18.svg"
                        alt="img"
                        className="h-[127px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/oso-widget18.svg",
                          )
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <p className="my-1">Platform Legend:</p>
                    <ul className="list-disc ml-6">
                      <li>
                        Colored buttons above the chart identify each platform
                      </li>
                      <li>
                        Toggle Platforms: Click any platform button to show/hide
                        that line
                      </li>
                      <li>
                        Active platforms are highlighted; inactive ones are
                        grayed out
                      </li>
                      <li>Use to focus on specific platform comparisons</li>
                    </ul>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/oso-widget19.svg"
                        alt="img"
                        className="h-[65px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/oso-widget19.svg",
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-1">
                    Step 21: Review Comprehensive Breakdown Table
                  </p>
                  <ul className="list-disc ml-6">
                    <li>Scroll down to Comprehensive Breakdown section</li>
                    <li>Date Range: Displayed below title</li>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/oso-widget20.svg"
                        alt="img"
                        className="h-[41px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/oso-widget20.svg",
                          )
                        }
                      />
                    </div>
                    <li>
                      Filter Options: Filter By button (top-right) for
                      additional filtering
                    </li>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/oso-widget21.svg"
                        alt="img"
                        className="h-[82px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/oso-widget21.svg",
                          )
                        }
                      />
                    </div>
                    <li className="list-disc">
                      {" "}
                      <div className="flex gap-2">
                        <span>
                          Export Icons: Download and full-screen expand options
                        </span>
                        <img
                          src="/assets/images/learning-images/osaoverview11.svg"
                          alt="img"
                          className="h-[14px] mt-1"
                          onClick={() =>
                            setPreviewImg(
                              "/assets/images/learning-images/osaoverview11.svg",
                            )
                          }
                        />
                      </div>
                    </li>
                  </ul>

                  <p className="my-1">Table Structure:</p>
                  <ul className="list-decimal ml-6">
                    <li>
                      Expandable Date Rows: Click disclosure triangle (▶) to
                      expand
                      <ul className="list-disc ml-4">
                        <li>Shows individual date (e.g., 22-01-2026)</li>
                        <li>Initially collapsed to show summary only</li>
                      </ul>
                    </li>
                  </ul>

                  <p className="my-1">Expanded Date View:</p>
                  <ul className="list-decimal ml-6">
                    <li>
                      Platform Breakdown:
                      <ul className="list-disc ml-4">
                        <li>Each row shows a platform with logo</li>
                        <li>Columns: Platform, SOS %, Ranking</li>
                        <li>Example: Blinkit - 45.5% SOS - 5.52 Ranking</li>
                      </ul>
                    </li>
                  </ul>

                  <p className="my-1">Summary Rows:</p>
                  <ul className="list-decimal ml-6">
                    <li>Total Date: Count of days analyzed</li>
                    <li>
                      Total Platform: Number of platforms tracked (e.g., 10)
                    </li>
                    <li>
                      Avg SOS: Average SOS across all platforms for that date
                    </li>
                    <li>Avg Ranking: Average ranking position</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold my-1">B) Drill Down</p>
                  <div>
                    <p className="mb-1">Step 22: Access Drill Down View</p>
                    <ul className="list-disc ml-6">
                      <li>
                        Click the Drill Down tab in the drawer (second tab)
                      </li>
                      <li>
                        This view segments SOS by platform, location, and
                        keyword
                      </li>
                    </ul>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/oso-widget22.svg"
                        alt="img"
                        className="h-[123px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/oso-widget22.svg",
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-1">Step 23: Analyze Platform Distribution</p>
                  <ul className="list-disc ml-6">
                    <li>Section Title: Platform Distribution (top-left)</li>
                    <li>Date Range: Displayed below title</li>
                    <li>
                      Controls: Filter By, download, and expand icons
                      (top-right)
                    </li>
                  </ul>

                  <p className="my-1">Table Columns:</p>
                  <ul className="list-decimal ml-6">
                    <li>
                      Platform: E-commerce platform name with logo
                      <ul className="list-disc ml-4">
                        <li>Checkboxes for multi-select filtering</li>
                      </ul>
                    </li>

                    <li>SOS %: Share of search percentage on that platform</li>
                    <li>Ranking: Average search position on that platform</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 24: Analyze Location Distribution</p>
                  <ul className="list-disc ml-6">
                    <li>Section Title: Location Distribution (top-right)</li>
                    <li>Same structure as Platform Distribution</li>
                  </ul>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/oso-widget23.svg"
                      alt="img"
                      className="h-[156px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/oso-widget23.svg",
                        )
                      }
                    />
                  </div>

                  <p className="my-1">Table Columns:</p>
                  <ul className="list-disc ml-6">
                    <li>Location: City name with checkbox</li>
                    <li>SOS %: Share of search in that geography</li>
                    <li>Ranking: Average position in that market</li>
                  </ul>

                  <p className="my-1">Summary Rows:</p>
                  <ul className="list-decimal ml-6">
                    <li>Total Date: Count of days analyzed</li>
                    <li>
                      Total Platform: Number of platforms tracked (e.g., 10)
                    </li>
                    <li>Avg SOS: Average SOS across all platforms</li>
                    <li>Avg Ranking: Average ranking position</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">Step 25: Analyze Keyword Distribution</p>
                  <ul className="list-disc ml-6">
                    <li>
                      Section Title: Keyword Distribution (bottom section)
                    </li>
                    <li>Full-width table spanning the page</li>
                  </ul>
                  <div className="my-2">
                    <img
                      src="/assets/images/learning-images/oso-widget24.svg"
                      alt="img"
                      className="h-[128px]"
                      onClick={() =>
                        setPreviewImg(
                          "/assets/images/learning-images/oso-widget24.svg",
                        )
                      }
                    />
                  </div>

                  <p className="my-1">Table Columns:</p>
                  <ul className="list-disc ml-6">
                    <li>Keywords: Specific search terms with checkbox</li>
                    <li>SOS %: Share of search for that keyword</li>
                    <li>Ranking: Average position for that keyword</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1">
                    Step 26: Apply Cross-Dimensional Filters
                  </p>
                  <ul className="list-decimal ml-6">
                    <li>
                      Select checkboxes in any table (Platform, Location,
                      Keyword)
                    </li>
                    <li>
                      Filtering Effect:
                      <ul className="list-disc ml-4">
                        <li>
                          Selecting a platform filters locations to those
                          available on that platform
                        </li>
                        <li>
                          Selecting a location filters platforms operating there
                        </li>
                        <li>
                          Selecting keywords filters to relevant platforms and
                          locations
                        </li>
                      </ul>
                    </li>
                    <li>
                      Multi-select: Check multiple items to build complex
                      filters
                    </li>
                    <li>Reset: Uncheck all boxes or look for cross option</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold my-1">C) Competition Analysis</p>

                  <div className="mb-1">
                    <p className="mb-1">Step 27: Access Competition Analysis</p>
                    <ul className="list-disc ml-6">
                      <li>
                        Click the Competition Analysis tab in the drawer (third
                        tab)
                      </li>
                      <li>
                        This view compares your performance against competitor
                        brands
                      </li>
                    </ul>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/oso-widget25.svg"
                        alt="img"
                        className="h-[162px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/oso-widget25.svg",
                          )
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-1">
                      Step 28: Review the Competition Bar Graph
                    </p>
                    <ul className="list-disc ml-6">
                      <li>Section Title: Competition Analysis</li>
                      <li>Date Range: Displayed below title</li>
                      <li>
                        Metric Toggle: SOS button (top-right) to switch between
                        SOS and Ranking views
                      </li>
                      <div className="my-2">
                        <img
                          src="/assets/images/learning-images/oso-widget26.svg"
                          alt="img"
                          className="h-[94px]"
                          onClick={() =>
                            setPreviewImg(
                              "/assets/images/learning-images/oso-widget26.svg",
                            )
                          }
                        />
                      </div>

                      <li className="list-disc">
                        {" "}
                        <div className="flex gap-2">
                          <span>Download Icon: Export chart as PNG</span>
                          <img
                            src="/assets/images/learning-images/osaoverview11.svg"
                            alt="img"
                            className="h-[14px] mt-1"
                            onClick={() =>
                              setPreviewImg(
                                "/assets/images/learning-images/osaoverview11.svg",
                              )
                            }
                          />
                        </div>
                      </li>
                    </ul>

                    <p className="my-1">Chart Structure:</p>
                    <ul className="list-decimal ml-6">
                      <li>Y-Axis: SOS percentage (0% to 100%)</li>
                      <li>X-Axis: Brand names</li>
                      <li>
                        Bubble Visualization: Each brand represented by a
                        rounded bar/bubble
                        <ul className="list-disc ml-4">
                          <li>Height indicates: SOS percentage</li>
                          <li>
                            Color: Blue for your brand, lighter blue for
                            competitors
                          </li>
                          <li>Gray bars: Maximum (100%) reference</li>
                        </ul>
                      </li>
                    </ul>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/oso-widget27.svg"
                        alt="img"
                        className="h-[136px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/oso-widget27.svg",
                          )
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <p className="my-1">
                      Step 29: Analyze Competition Distribution Table
                    </p>
                    <ul className="list-decimal ml-6">
                      <li>
                        Section Title: Competition Distribution (bottom-left)
                      </li>
                      <li>Date Range: Displayed</li>
                      <li>Controls: Filter By, download, expand icons</li>
                    </ul>
                    <div className="my-2">
                      <img
                        src="/assets/images/learning-images/oso-widget28.svg"
                        alt="img"
                        className="h-[132px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/oso-widget28.svg",
                          )
                        }
                      />
                    </div>

                    <p className="my-1">Table Structure:</p>
                    <ul className="list-disc ml-6">
                      <li>Column 1: Entity (brand name)</li>
                      <li>Column 2: SOS % (share of search)</li>
                      <li>Column 3: Ranking (average position)</li>
                    </ul>

                    <p className="my-1">
                      Note: - in Ranking column may indicate competitors dont
                      track detailed ranking or data unavailable
                    </p>
                  </div>

                  <div className="mt-1">
                    <p className="mb-1">
                      Step 30: Explore Keyword-Level Competition
                    </p>
                    <ul className="list-disc ml-6">
                      <li>Section Title: Entity + Keywords (bottom-right)</li>
                      <li>
                        Connected to left table: Shows keyword breakdown for
                        selected entity
                      </li>
                    </ul>

                    <p className="my-1">Table Structure:</p>
                    <ul className="list-disc ml-6">
                      <li>Keywords: Specific search terms</li>
                      <li>SOS %: Your share for that keyword</li>
                      <li>Ranking: Your average position</li>
                    </ul>
                  </div>

                  <div className="mt-1">
                    <p className="mb-1">
                      Step 31: Competitor Selection and Analysis
                    </p>
                    <ul className="list-decimal ml-6">
                      <li>
                        Click on any competitor brand in the Competition
                        Distribution table (left side)
                      </li>
                      <li>The keyword table on the right updates to show:</li>
                      <ul className="list-disc ml-4">
                        <li>That competitors keyword performance</li>
                        <li>Their SOS and ranking for each keyword</li>
                        <li>Their keyword portfolio composition</li>
                      </ul>
                    </ul>
                    <div className="mb-2">
                      <img
                        src="/assets/images/learning-images/oso-widget29.svg"
                        alt="img"
                        className="h-[176px]"
                        onClick={() =>
                          setPreviewImg(
                            "/assets/images/learning-images/oso-widget29.svg",
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          )}

         
        </div>
      )}
    </div>
  );
}
