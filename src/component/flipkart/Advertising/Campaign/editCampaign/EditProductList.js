import React from "react";
import Pagination from "../../../../pagination";
import { LIMIT } from "../../../../../utils/constants";
import EditListCard from "./EditListCard";

const EditProductList = ({
  productListtoShow = [],
  setSelectedProduct,
  selectedProduct,
  campaignData,
  error,
  totalData,
  setOffset,
  offset,
  setPage,
  page,
}) => {
  // const [offset, setOffset] = React.useState(0);
  // const [page, setPage] = React.useState(1);
  // const [totalData, setTotalData] = React.useState();
  const paginate = (direction) => {
    if (direction == "prev") {
      setPage(page - 1);
      setOffset(offset - LIMIT);
    } else {
      setPage(page + 1);
      setOffset(offset + LIMIT);
    }
  };
  // const selectAlls = (checked) => {
  //   if (productListtoShow && productListtoShow.length > 0) {
  //     if (checked) {
  //       setSelectedProduct([...productListtoShow]);
  //     } else {
  //       setSelectedProduct([]);
  //     }
  //   }
  // };
  React.useEffect(() => {
    if (campaignData.FSNs) {
      setSelectedProduct(
        productListtoShow.filter((item) => item.productid == campaignData.FSNs)
      );
    }
  }, []);
  return (
    <>
      <div className="row ">
        <div className="listproduct">
          <div className="listproduct__head">
            {/* <div>
              <label className="row items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="select_alls"
                  name="select_alls"
                  // value=""
                  className="listproduct__checkbox"
                  onChange={(e) => selectAlls(e.target.checked)}
                  value={
                    campaignData.select_alls ? campaignData.select_alls : null
                  }
                />

                <div className="listproduct__heading pl-1">
                  Select all in this page
                  <div className="listproduct__error-mark">*</div>
                </div>
              </label>
            </div> */}
            <div className="listproduct__count inline ">
              {totalData > 0
                ? `1 - ${totalData} of ${totalData} products`
                : null}
            </div>
          </div>
          <div className="row ">
            {productListtoShow.map((v, i) => {
              return (
                <div key={i} className="col_6">
                  <EditListCard
                    product={v}
                    setSelectedProduct={setSelectedProduct}
                    selectedProduct={selectedProduct}
                  />
                </div>
              );
            })}
          </div>
          {error.products && <p className="errorText">{error.products}</p>}

          {totalData > 10 ? (
            <Pagination paginate={paginate} page={page} totalData={totalData} />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default EditProductList;
