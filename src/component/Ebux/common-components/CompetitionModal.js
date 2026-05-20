import { useEffect, useState } from "react";
import Popup from "../../common-components/Popups/Popup";
import { getEbuxBrands } from "../services/ebux.service";

const CompetitionModal = ({
  showPopup,
  closePopup=()=>{},
  // brands = [],
  // categories = [],
  title = "Competition",
  onApply = () => alert("Apply button clicked!"),
  buttonText = "Apply",
  smallsize = "460px",
}) => {
  const [selectedBrands,setSelectedBrands ] = useState([]);
  const [brands,setBrands ] = useState([]);
  const [selectedCategories, ] = useState([]);
  // const [selectedBrands, setSelectedBrands] = useState([]);
  // const [selectedCategories, setSelectedCategories] = useState([]);
  const [highlighted, setHighlighted] = useState(null);

  const handleBrandChange = (value) => {
    if (value && selectedBrands.includes(value)) {
      setSelectedBrands((prev) => prev.filter((item) => item !== value));
    }else{
      setSelectedBrands((prev) => [...prev, value]);
    }
  };

  // const handleCategoryChange = (e) => {
  //   const value = e.target.value;
  //   if (value && !selectedCategories.includes(value)) {
  //     setSelectedCategories((prev) => [...prev, value]);
  //   }
  // };

  const [loadingReport, setLoadingReport] = useState(false);
  useEffect(() => {
    async function fetchData() {
      setLoadingReport(true);
      const res_brand = await getEbuxBrands(false); 
      setBrands(res_brand);    
      setLoadingReport(false);
      }

    fetchData();
  }, []);

  const handleCompetitorClick = (competitor) => {
    setHighlighted((prev) => (prev === competitor ? null : competitor));
  };

  const combinedSelectedItems = [...selectedBrands, ...selectedCategories];
  const uniqueSelectedItems = [...new Set(combinedSelectedItems)];

  const handleApply = () => {
    onApply(selectedBrands);
    closePopup();
  };
  return (
    <>
      {showPopup && (
        <Popup
          title={title}
          setShowPopup={closePopup}
          platform="flipkart"
          applyAction={handleApply}
          buttonText={buttonText}
          smallsize={smallsize}
        >
          {/* Popup Content */}
          {/* <div className="grid grid-cols-2 gap-2 px-4 mt-4">
            <div>
              <label className="text-[18px] font-medium">Brand</label>
              <select
                className="border px-2 p-2 w-full"
                onChange={handleBrandChange}
                value=""
              >
                <option value="">Select a brand</option>
                {brands.map((brand, index) => (
                  <option key={index} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[18px] font-medium">Category</label>
              <select
                className="border px-2 p-2 w-full"
                onChange={handleCategoryChange}
                value=""
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div> */}

          <div className="border mx-4 mt-4">
            <div className="competitionModal__SubHeading">
              <label className="text-base font-semibold">
                Select Competition
              </label>
            </div>
            <div className="competitionModalTagWrap">
            {/* <button className="competitionModalTag tagActive">Lipton</button> */}
            {loadingReport?'Loding...':<>{
              brands.map((b,i)=><button className={`competitionModalTag ${selectedBrands.includes(b?.value)?"tagActive":""}`} onClick={()=>handleBrandChange(b?.value)} key={`${i}-${b.value}`}>{b.label}</button>)
            }</>}
              {uniqueSelectedItems.map((item, index) => (
                <button
                  key={index}
                  className={`border w-14 h-6 text-xs font-normal p-1 mx-2 ${
                    highlighted === item
                      ? "border border-[#40A9FF] bg-white text-black"
                      : "bg-white"
                  }`}
                  onClick={() => handleCompetitorClick(item)}
                >
                  {item}
                </button>  
              ))}
            </div>
          </div>
        </Popup>
      )}
    </>
  );
};

export default CompetitionModal;
