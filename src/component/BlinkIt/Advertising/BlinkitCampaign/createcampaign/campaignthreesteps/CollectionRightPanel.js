import React from "react";

const CollectionRightPanel = ({ selectedData }) => {
  return (
    <div className="blinkit_rightpanel__selected-box flex flex-col px-4 pb-4">
      <div className="blinkit_rightpanel__selected-title h-[60px]">
        <div>
          <b>Collection preview</b>
          <div>
            Add products from a brand and category to create a collection
          </div>
        </div>
      </div>

      <div
        className="blinkit_rightpanel__productlist-card flex flex-col flex-1 pb-0 overflow-y-auto"
        id="selected-product-show"
      >
        <div className="flex py-2">
          <div className="flex-[0.2] font-semibold"></div>
          <div className="flex-[0.4] font-semibold">Product Name</div>
          <div className="flex-[0.4] font-semibold text-center">Variants</div>
        </div>

        <div className="flex flex-col justify-center items-center relative">
          {selectedData && selectedData.length > 0 ? (
            selectedData[0].products.map((data) => {
              return (
                <div
                  key={data.id}
                  className="flex justify-between items-center w-full py-2 border-b"
                >
                  <div className="flex-[0.2] flex items-center justify-center">
                    <img
                      src={data.image_url}
                      alt={data.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="flex-[0.4] truncate" title={data.name}>
                    {data.name}
                  </div>
                  <div className="flex-[0.4] truncate text-center">
                    {data.unit}
                  </div>
                </div>
              );
            })
          ) : (
            <div>No products available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionRightPanel;
