import React from "react";
import "../../catalogtable.css";
import { _POST } from "../../../../../services/axios.method";
import { cancelRequest } from "../../../../../utils/helpers";

const HygieneBlock = ({ catalogDetails }) => {
  const [actionDetails, setActionDetails] = React.useState({});

  const catalogActionsDetails = async () => {
    try {
      if (catalogDetails?.e_genie_id) {
        const ourRequest = await cancelRequest();
        const res = await _POST(
          "/catalog/getCatalogAction",
          {
            e_genie_id: catalogDetails?.e_genie_id,
          },
          {
            cancelToken: ourRequest.token,
          }
        );
        if (res?.data?.data?.data) {
          setActionDetails({ ...res?.data?.data?.data });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };
  React.useEffect(() => {
    catalogActionsDetails();
  }, [catalogDetails]);
  const createCatalogAction = async (data, field, platform, status) => {
    try {
      const res = await _POST("/catalog/createAction", {
        data,
        field,
        platform,
        status,
      });
      if (res?.data?.status.code == 200) {
        catalogActionsDetails();
      }
    } catch (e) {
      console.error(e);
    }
  };
  const deleteCatalogAction = async () => {
    try {
      const res = await _POST("/catalog/deleteCatalogAction", {
        e_genie_id: catalogDetails?.e_genie_id,
      });
      if (res?.data?.status.code == 200) {
        catalogActionsDetails();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const platformListing = [
    {
      label: "Flipkart",
      value: "flipkart",
    },
    {
      label: "Blinkit",
      value: "blinkit",
    },
    {
      label: "Amazon",
      value: "amazon",
    },
    {
      label: "Zepto",
      value: "zepto",
    },
  ];
  const [selectedPlatform, setSelectedPlatform] = React.useState("flipkart");

  React.useEffect(() => {
    setTimeout(() => {
      if (
        Object.keys(catalogDetails).length &&
        !catalogDetails?.flipkart_product_id
      ) {
        // eslint-disable-next-line no-unsafe-optional-chaining
        let initialplatform = (platformListing
          ?.map((item) => {
            if (catalogDetails && catalogDetails[`${item.value}_product_id`]) {
              return item.value;
            }
          })
          .filter((e) => e !== undefined))[0];

        setSelectedPlatform(initialplatform);
      }
    }, 2000);
  }, [catalogDetails]);

  let allplatformPlag = {
    Flipkart: {
      name:
        catalogDetails?.flipkart_product_name == catalogDetails.product_name ||
        (actionDetails && actionDetails?.flipkart?.flipkart_product_name),
      rate:
        catalogDetails?.flipkart_product_price == catalogDetails.product_mrp ||
        (actionDetails && actionDetails?.flipkart?.flipkart_product_price),
      weight:
        catalogDetails?.flipkart_product_weight ==
          catalogDetails.product_weight ||
        (actionDetails && actionDetails?.flipkart?.flipkart_product_weight),
      indegridients:
        catalogDetails?.flipkart_product_ingredients ==
          catalogDetails.ingredients ||
        (actionDetails &&
          actionDetails?.flipkart?.flipkart_product_ingredients),
      flavor:
        catalogDetails?.flipkart_product_flavours == catalogDetails.flavour ||
        (actionDetails && actionDetails?.flipkart?.flipkart_product_flavours),
      description:
        catalogDetails?.flipkart_product_desc == catalogDetails.description ||
        (actionDetails && actionDetails?.flipkart?.flipkart_product_desc),
    },
    Blinkit: {
      name:
        catalogDetails?.blinkit_product_name == catalogDetails.product_name ||
        (actionDetails && actionDetails?.blinkit?.blinkit_product_name),
      rate:
        catalogDetails?.blinkit_product_price == catalogDetails.product_mrp ||
        (actionDetails && actionDetails?.blinkit?.blinkit_product_price),
      weight:
        catalogDetails?.blinkit_product_weight ==
          catalogDetails.product_weight ||
        (actionDetails && actionDetails?.blinkit?.blinkit_product_weight),
      indegridients:
        catalogDetails?.blinkit_product_ingredients ==
          catalogDetails.ingredients ||
        (actionDetails && actionDetails?.blinkit?.blinkit_product_ingredients),
      flavor:
        catalogDetails?.blinkit_product_flavours == catalogDetails.flavour ||
        (actionDetails && actionDetails?.blinkit?.blinkit_product_flavours),
      description:
        catalogDetails?.blinkit_product_desc == catalogDetails.description ||
        (actionDetails && actionDetails?.blinkit?.blinkit_product_desc),
    },
    Amazon: {
      name:
        catalogDetails?.amazon_product_name == catalogDetails.product_name ||
        (actionDetails && actionDetails?.amazon?.amazon_product_name),
      rate:
        catalogDetails?.amazon_product_price == catalogDetails.product_mrp ||
        (actionDetails && actionDetails?.amazon?.amazon_product_price),
      weight:
        catalogDetails?.amazon_product_weight ==
          catalogDetails.product_weight ||
        (actionDetails && actionDetails?.amazon?.amazon_product_weight),
      indegridients:
        catalogDetails?.amazon_product_ingredients ==
          catalogDetails.ingredients ||
        (actionDetails && actionDetails?.amazon?.amazon_product_ingredients),
      flavor:
        catalogDetails?.amazon_product_flavours == catalogDetails.flavour ||
        (actionDetails && actionDetails?.amazon?.amazon_product_flavours),
      description:
        catalogDetails?.amazon_product_desc == catalogDetails.description ||
        (actionDetails && actionDetails?.amazon?.amazon_product_desc),
    },
    Zepto: {
      name:
        catalogDetails?.zepto_product_name == catalogDetails.product_name ||
        (actionDetails && actionDetails?.zepto?.zepto_product_name),
      rate:
        catalogDetails?.zepto_product_price == catalogDetails.product_mrp ||
        (actionDetails && actionDetails?.zepto?.zepto_product_price),
      weight:
        catalogDetails?.zepto_product_weight == catalogDetails.product_weight ||
        (actionDetails && actionDetails?.zepto?.zepto_product_weight),
      indegridients:
        catalogDetails?.zepto_product_ingredients ==
          catalogDetails.ingredients ||
        (actionDetails && actionDetails?.zepto?.zepto_product_ingredients),
      flavor:
        catalogDetails?.zepto_product_flavours == catalogDetails.flavour ||
        (actionDetails && actionDetails?.zepto?.zepto_product_flavours),
      description:
        catalogDetails?.zepto_product_desc == catalogDetails.description ||
        (actionDetails && actionDetails?.zepto?.zepto_product_desc),
    },
  };

  return (
    <>
      <div className="px-10">
        <div className="">
          <div className="py-4">
            <label className="text-base font-bold text-[#00000073] ">
              Accuracy Overview
            </label>
          </div>

          <div>
            {/* {catalogDetails && catalogDetails?.blinkit_product_id?"":null} */}
            {catalogDetails && catalogDetails?.blinkit_product_id ? (
              <div className="flex justify-between border-b pb-2">
                <button
                  onClick={() => setSelectedPlatform("blinkit")}
                  className={`text-base font-medium ${
                    selectedPlatform === "blinkit" ? "text-[#007AFF]" : ""
                  }`}
                >
                  Blinkit
                </button>
                <div className="">
                  {Object.values(allplatformPlag["Blinkit"]).every(
                    (v) => v === true
                  ) ? (
                    <div className="pt-2">
                      <img
                        src="/assets/images/match.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  ) : (
                    <div className="pt-2">
                      <img
                        src="/assets/images/notmatch.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : null}
            {catalogDetails && catalogDetails?.flipkart_product_id ? (
              <div className="flex justify-between py-2 border-b">
                <button
                  onClick={() => setSelectedPlatform("flipkart")}
                  className={`text-base font-medium ${
                    selectedPlatform === "flipkart" ? "text-[#007AFF]" : ""
                  }`}
                >
                  Flipkart
                </button>
                <div>
                  {Object.values(allplatformPlag["Flipkart"]).every(
                    (v) => v === true
                  ) ? (
                    <div className="pt-2">
                      <img
                        src="/assets/images/match.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  ) : (
                    <div className="pt-2">
                      <img
                        src="/assets/images/notmatch.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : null}
            {catalogDetails && catalogDetails?.amazon_product_id ? (
              <div className="flex justify-between py-2 border-b">
                <button
                  onClick={() => setSelectedPlatform("amazon")}
                  className={`text-base font-medium ${
                    selectedPlatform === "amazon" ? "text-[#007AFF]" : ""
                  }`}
                >
                  Amazon
                </button>
                <div className="">
                  {Object.values(allplatformPlag["Amazon"]).every(
                    (v) => v === true
                  ) ? (
                    <div className="pt-2">
                      <img
                        src="/assets/images/match.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  ) : (
                    <div className="pt-2">
                      <img
                        src="/assets/images/notmatch.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : null}
            {catalogDetails && catalogDetails?.zepto_product_id ? (
              <div className="flex justify-between py-2 border-b">
                <button
                  onClick={() => setSelectedPlatform("zepto")}
                  className={`text-base font-medium ${
                    selectedPlatform === "zepto" ? "text-[#007AFF]" : ""
                  }`}
                >
                  Zepto
                </button>
                <div>
                  {Object.values(allplatformPlag["Zepto"]).every(
                    (v) => v === true
                  ) ? (
                    <div className="pt-2">
                      <img
                        src="/assets/images/match.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  ) : (
                    <div className="pt-2">
                      <img
                        src="/assets/images/notmatch.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="py-4">
          <label className="text-base font-bold text-[#00000073]">
            Product Details
          </label>
          <div className="pt-3">
            <p className="hygieneproduct ">
              <label className="text-base">Name</label>
              <span className="px-1">:</span>
              <label className="text-gray-400 text-base">
                {(catalogDetails && catalogDetails.product_name) || "N/A"}
              </label>
            </p>
            <p className="hygieneproduct">
              <label className="text-base">Rate</label>
              <span className="px-1">:</span>
              <label className="text-gray-400 text-base">
                {(catalogDetails && catalogDetails.product_mrp) || "N/A"}
              </label>
            </p>
            <p className="hygieneproduct">
              <label className="text-base">Weight</label>
              <span className="px-1">:</span>
              <label className="text-gray-400 text-base">
                {(catalogDetails && catalogDetails.product_weight) || "N/A"}
              </label>
            </p>
            <p className="hygieneproduct">
              <label className="text-base">Indegredient</label>
              <span className="px-1">:</span>
              <label className="text-gray-400 text-base">
                {(catalogDetails && catalogDetails.ingredients) || "N/A"}
              </label>
            </p>
            <p className="hygieneproduct">
              <label className="text-base">Flavor</label>
              <span className="px-1">:</span>
              <label className="text-gray-400 text-base">
                {(catalogDetails && catalogDetails.flavour) || "N/A"}
              </label>
            </p>
            <p className="hygieneproduct">
              <label className="text-base">Description</label>
              <span className="px-1">:</span>
              <label className="text-gray-400 text-base">
                {(catalogDetails && catalogDetails.description) || "N/A"}
              </label>
            </p>
          </div>
        </div>
        <div>
          <div className="hygieneSelectContainer  flex justify-between">
            <div className="flex">
              <select
                className="sidepopupleftpanel__selectdropdown "
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                {platformListing?.map((item) => {
                  if (
                    catalogDetails &&
                    catalogDetails[`${item.value}_product_id`]
                  ) {
                    return (
                      <>
                        <option value={item.value}>{item.label}</option>
                      </>
                    );
                  }
                })}
              </select>
              <div>
                <a
                  href={
                    selectedPlatform == "amazon"
                      ? `https://www.amazon.in/dp/${catalogDetails.amazon_product_id}`
                      : selectedPlatform == "zepto"
                      ? `https://www.zeptonow.com/pn/potato-new/pvid/${catalogDetails.zepto_product_id}`
                      : selectedPlatform == "blinkit"
                      ? `https://blinkit.com/prn/kelloggs-chocos-with-whole-grain-kids-cereal/prid/${catalogDetails.blinkit_product_id}`
                      : `https://www.flipkart.com/xiaomi-11i-5g-purple-mist-128-gb/p/itmb0fd5926fb0d5?pid=${catalogDetails.flipkart_product_id}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="pt-2 px-1">
                    <img
                      src="/assets/images/arrow-up-right_catalog.png"
                      alt=""
                      style={{ width: 30 }}
                    />
                  </button>
                </a>
              </div>
            </div>

            <button className="flex justify-between border border-gray-400 px-2 py-2 ">
              <div className="pt-1 px-0.5">
                <img src="/assets/images/Undo.svg" alt="undo" />
              </div>
              <button
                className=""
                onClick={() => deleteCatalogAction(catalogDetails)}
              >
                Reset
              </button>
            </button>
          </div>
          <div>
            <div>
              <div className="flex justify-between py-2">
                <label className="text-base">Name</label>
                <div>
                  {(catalogDetails &&
                    `${catalogDetails[`${selectedPlatform}_product_name`]}` ==
                      catalogDetails.product_name) ||
                  (actionDetails &&
                    actionDetails[selectedPlatform] &&
                    actionDetails[selectedPlatform][
                      `${selectedPlatform}_product_name`
                    ]) ? (
                    <div className="pt-2">
                      <img
                        src="/assets/images/match.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  ) : (
                    <div className="pt-2">
                      <img
                        src="/assets/images/notmatch.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex">
                <input
                  type="text"
                  className="form-control outline-none"
                  id="name"
                  name="name"
                  placeholder="Enter name"
                  value={
                    Object.keys(catalogDetails).length
                      ? `${catalogDetails[`${selectedPlatform}_product_name`]}`
                      : null
                  }
                />
                {catalogDetails &&
                `${catalogDetails[`${selectedPlatform}_product_name`]}` !=
                  catalogDetails?.product_name ? (
                  Object.keys(actionDetails).length &&
                  actionDetails[selectedPlatform][
                    `${selectedPlatform}_product_name`
                  ] ? (
                    <img
                      src="/assets/images/catalogForce.png"
                      alt=""
                      className="hygieneinputForce_img"
                    />
                  ) : (
                    <div
                      onClick={() =>
                        createCatalogAction(
                          catalogDetails,
                          `${selectedPlatform}_product_name`,
                          selectedPlatform,
                          true
                        )
                      }
                    >
                      <img
                        src="/assets/images/catalogForceButton.png"
                        alt=""
                        className="hygieneinput_img"
                      />
                    </div>
                  )
                ) : null}
              </div>
            </div>
            <div>
              <div className="flex justify-between py-2">
                <label className="text-base">Rate</label>
                <div>
                  {(catalogDetails &&
                    `${catalogDetails[`${selectedPlatform}_product_price`]}` ==
                      catalogDetails.product_mrp) ||
                  (actionDetails &&
                    actionDetails[selectedPlatform] &&
                    actionDetails[selectedPlatform][
                      `${selectedPlatform}_product_price`
                    ]) ? (
                    <div className="pt-2">
                      <img
                        src="/assets/images/match.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  ) : (
                    <div className="pt-2">
                      <img
                        src="/assets/images/notmatch.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex">
                <input
                  type="text"
                  className="form-control outline-none"
                  id="rate"
                  name="rate"
                  placeholder="Enter rate"
                  value={
                    catalogDetails &&
                    `${catalogDetails[`${selectedPlatform}_product_price`]}`
                  }
                />

                {catalogDetails &&
                `${catalogDetails[`${selectedPlatform}_product_price`]}` !=
                  catalogDetails?.product_mrp ? (
                  Object.keys(actionDetails).length &&
                  actionDetails[selectedPlatform][
                    `${selectedPlatform}_product_price`
                  ] ? (
                    <img
                      src="/assets/images/catalogForce.png"
                      alt=""
                      className="hygieneinputForce_img"
                    />
                  ) : (
                    <div
                      onClick={() =>
                        createCatalogAction(
                          catalogDetails,
                          `${selectedPlatform}_product_price`,
                          selectedPlatform,
                          true
                        )
                      }
                    >
                      <img
                        src="/assets/images/catalogForceButton.png"
                        alt=""
                        className="hygieneinput_img"
                      />
                    </div>
                  )
                ) : null}
              </div>
            </div>
            <div>
              <div className="flex justify-between py-2">
                <label className="text-base">Weight</label>
                <div>
                  {(catalogDetails &&
                    `${catalogDetails[`${selectedPlatform}_product_weight`]}` ==
                      catalogDetails.product_weight) ||
                  (actionDetails &&
                    actionDetails[selectedPlatform] &&
                    actionDetails[selectedPlatform][
                      `${selectedPlatform}_product_weight`
                    ]) ? (
                    <div className="pt-2">
                      <img
                        src="/assets/images/match.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  ) : (
                    <div className="pt-2">
                      <img
                        src="/assets/images/notmatch.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex">
                <input
                  type="text"
                  className="form-control"
                  id="weight"
                  name="name"
                  placeholder="Enter weight"
                  value={
                    catalogDetails &&
                    `${catalogDetails[`${selectedPlatform}_product_weight`]}`
                  }
                />

                {catalogDetails &&
                `${catalogDetails[`${selectedPlatform}_product_weight`]}` !=
                  catalogDetails?.product_weight ? (
                  Object.keys(actionDetails).length &&
                  actionDetails[selectedPlatform][
                    `${selectedPlatform}_product_weight`
                  ] ? (
                    <img
                      src="/assets/images/catalogForce.png"
                      alt=""
                      className="hygieneinputForce_img"
                    />
                  ) : (
                    <div
                      onClick={() =>
                        createCatalogAction(
                          catalogDetails,
                          `${selectedPlatform}_product_weight`,
                          selectedPlatform,
                          true
                        )
                      }
                    >
                      <img
                        src="/assets/images/catalogForceButton.png"
                        alt=""
                        className="hygieneinput_img"
                      />
                    </div>
                  )
                ) : null}
              </div>
            </div>
            <div>
              <div className="flex justify-between py-2">
                <label className="text-base">Indegredient</label>
                <div>
                  {(catalogDetails &&
                    `${
                      catalogDetails[`${selectedPlatform}_product_ingredients`]
                    }` == catalogDetails.ingredients) ||
                  (actionDetails &&
                    actionDetails[selectedPlatform] &&
                    actionDetails[selectedPlatform][
                      `${selectedPlatform}_product_ingredients`
                    ]) ? (
                    <div className="pt-2">
                      <img
                        src="/assets/images/match.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  ) : (
                    <div className="pt-2">
                      <img
                        src="/assets/images/notmatch.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex">
                <input
                  type="text"
                  className="form-control outline-none"
                  id="indegredient"
                  name="indegredient"
                  placeholder="Enter indegredient"
                  value={
                    catalogDetails &&
                    `${
                      catalogDetails[`${selectedPlatform}_product_ingredients`]
                    }`
                  }
                />
                {catalogDetails &&
                `${
                  catalogDetails[`${selectedPlatform}_product_ingredients`]
                }` != catalogDetails?.ingredients ? (
                  Object.keys(actionDetails).length &&
                  actionDetails[selectedPlatform][
                    `${selectedPlatform}_product_ingredients`
                  ] ? (
                    <img
                      src="/assets/images/catalogForce.png"
                      alt=""
                      className="hygieneinputForce_img"
                    />
                  ) : (
                    <div
                      onClick={() =>
                        createCatalogAction(
                          catalogDetails,
                          `${selectedPlatform}_product_ingredients`,
                          selectedPlatform,
                          true
                        )
                      }
                    >
                      <img
                        src="/assets/images/catalogForceButton.png"
                        alt=""
                        className="hygieneinput_img"
                      />
                    </div>
                  )
                ) : null}
              </div>
            </div>
            <div>
              <div className="flex justify-between py-2">
                <label className="text-base">Flavor</label>
                <div>
                  {(catalogDetails &&
                    `${
                      catalogDetails[`${selectedPlatform}_product_flavours`]
                    }` == catalogDetails.flavour) ||
                  (actionDetails &&
                    actionDetails[selectedPlatform] &&
                    actionDetails[selectedPlatform][
                      `${selectedPlatform}_product_flavours`
                    ]) ? (
                    <div className="pt-2">
                      <img
                        src="/assets/images/match.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  ) : (
                    <div className="pt-2">
                      <img
                        src="/assets/images/notmatch.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex">
                <input
                  type="text"
                  className="form-control outline-none"
                  id="flavor"
                  name="flavor"
                  placeholder="Enter flavor"
                  value={
                    catalogDetails &&
                    `${catalogDetails[`${selectedPlatform}_product_flavours`]}`
                  }
                />
                {catalogDetails &&
                `${catalogDetails[`${selectedPlatform}_product_flavours`]}` !=
                  catalogDetails?.flavour ? (
                  Object.keys(actionDetails).length &&
                  actionDetails[selectedPlatform][
                    `${selectedPlatform}_product_flavours`
                  ] ? (
                    <img
                      src="/assets/images/catalogForce.png"
                      alt=""
                      className="hygieneinputForce_img"
                    />
                  ) : (
                    <div
                      onClick={() =>
                        createCatalogAction(
                          catalogDetails,
                          `${selectedPlatform}_product_flavours`,
                          selectedPlatform,
                          true
                        )
                      }
                    >
                      <img
                        src="/assets/images/catalogForceButton.png"
                        alt=""
                        className="hygieneinput_img"
                      />
                    </div>
                  )
                ) : null}
              </div>
            </div>
            <div>
              <div className="flex justify-between py-2">
                <label className="test-base">Description</label>
                <div>
                  {(catalogDetails &&
                    `${catalogDetails[`${selectedPlatform}_product_desc`]}` ==
                      catalogDetails.description) ||
                  (actionDetails &&
                    actionDetails[selectedPlatform] &&
                    actionDetails[selectedPlatform][
                      `${selectedPlatform}_product_desc`
                    ]) ? (
                    <div className="">
                      <img
                        src="/assets/images/match.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  ) : (
                    <div className="pt-2">
                      <img
                        src="/assets/images/notmatch.png"
                        alt=""
                        style={{ width: 14 }}
                      />
                    </div>
                  )}
                </div>
              </div>
              {/* <div className="flex items-end"> */}
              <div className="flex">
                <input
                  type="text"
                  className="form-control outline-none"
                  id="description"
                  name="description"
                  placeholder="Enter description"
                  value={
                    catalogDetails &&
                    `${catalogDetails[`${selectedPlatform}_product_desc`]}`
                  }
                />
                {catalogDetails &&
                `${catalogDetails[`${selectedPlatform}_product_desc`]}` !=
                  catalogDetails?.description ? (
                  Object.keys(actionDetails).length &&
                  actionDetails[selectedPlatform][
                    `${selectedPlatform}_product_desc`
                  ] ? (
                    <img
                      src="/assets/images/catalogForce.png"
                      alt=""
                      className="hygieneinputForce_img"
                    />
                  ) : (
                    <div
                      onClick={() =>
                        createCatalogAction(
                          catalogDetails,
                          `${selectedPlatform}_product_desc`,
                          selectedPlatform,
                          true
                        )
                      }
                    >
                      <img
                        src="/assets/images/catalogForceButton.png"
                        alt=""
                        className="hygieneinput_img"
                      />
                    </div>
                  )
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default HygieneBlock;
