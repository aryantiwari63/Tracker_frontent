import React, { useRef } from "react";

const ListCard = ({ product, setSelectedProduct, selectedProduct }) => {
  const selectProduct = () => {
    productCheckboxRef.current.click();
    productCheckboxRef.current.checked
      ? setSelectedProduct([...selectedProduct, product])
      : setSelectedProduct(
          selectedProduct.filter((item) => item.productid !== product.productid)
        );
  };
  const productCheckboxRef = useRef(null);
  // let currency = localStorage.getItem("currency");

  return (
    <>
      <div className="p-4" onClick={selectProduct}>
        <div className="listcard row">
          <div className="col overflow-hidden">
            <div className="row overflow-hidden">
              <div className="listproduct__image ">
                {/* <img src={"/assets/images/product-img.jpg"} alt="" /> */}
                <img
                  src={
                    product.image != ""
                      ? `${product.image}`
                      : "/assets/images/product-img.jpg"
                  }
                  alt=""
                />
              </div>
              <div className="listcard__product pl-2 ">
                <div className="listcard__producttitle ">
                  {product.title}
                  {/* <p>{product.product}</p> */}
                </div>
                <div className="listcard__productinfo">{product.productid}</div>
                {product.minlistingprice || product.maxlistingprice ? (
                  <div className="listcard__productamt">
                    {`${
                      product.listingcurrency == "INR"
                        ? "₹"
                        : product.listingcurrency
                    }${product.minlistingprice}-${
                      product.listingcurrency == "INR"
                        ? "₹"
                        : product.listingcurrency
                    }${product.maxlistingprice}`}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div>
            <input
              ref={productCheckboxRef}
              data-name="V1 Test FSN1"
              type="checkbox"
              style={{ zIndex: -1, position: "relative" }}
              id="select_pro0"
              name="products[]"
              value="LDTET5UD5BF6YZZB"
              checked={selectedProduct.some(
                (item) => item.productid === product.productid
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default ListCard;
