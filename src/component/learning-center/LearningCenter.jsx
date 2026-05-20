import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faMagnifyingGlass,
  faBookOpen,
  faChartLine,
  faRoute,
  //faFileLines,
} from "@fortawesome/free-solid-svg-icons";

import { categoryDetails, dashboardGuideData } from "./data";
import CategoryItem from "./CategoryItem";
import DashboardGuideItem from "./DashboardGuideItem";

export default function LearningCenter({previewImg,setPreviewImg}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("metrics");
  const [openCategory, setOpenCategory] = useState([]);
  const [openGuide, setOpenGuide] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
// const [previewImg, setPreviewImg] = useState(null);

  const toggleDrawer = () => {
  setIsOpen((prev) => {
    const next = !prev;
    
    if (!next) {
      setOpenCategory([]);
      setOpenGuide([]);
      setSearchTerm("");
      setActiveTab("metrics");
    }

    return next;
  });
};


  const filteredCategoryDetails = Object.keys(categoryDetails).reduce(
    (acc, category) => {
      const search = searchTerm.toLowerCase();

      if (!search) {
        acc[category] = categoryDetails[category];
        return acc;
      }

      const categoryMatch = category.toLowerCase().includes(search);

      const matchedItems = categoryDetails[category].filter((item) => {
        return (
          item.title?.toLowerCase().includes(search) ||
          item.formula?.toLowerCase().includes(search) ||
          item.desc?.toLowerCase().includes(search) ||
          item.points?.some((p) => p.toLowerCase().includes(search))
        );
      });

      if (categoryMatch || matchedItems.length > 0) {
        acc[category] = categoryMatch
          ? categoryDetails[category]
          : matchedItems;
      }

      return acc;
    },
    {}
  );

  return (
    <>
      
<button
  onClick={toggleDrawer}
  className="
    fixed bottom-[20px] right-[20px] z-50
    bg-black text-white
    rounded-[15px_6px_15px_15px]
    px-2 py-2
    flex items-center gap-2
    shadow-[0_2px_10px_rgba(0,0,0,0.2)]
    cursor-pointer
  "
>
  <img src="/assets/images/lightbulb.svg" alt="icon" className="w-4 h-4" />
  <span className="text-[14px] font-medium">Tutorial</span>
</button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[105]"
          onClick={() => setIsOpen(false)}
        />
      )}

      
      <div
        className={`fixed top-0 right-0 h-full w-[450px] bg-white z-[10000] shadow-2xl
        transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
       
        <div className="bg-[#1890FF] px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-start gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FontAwesomeIcon icon={faBookOpen} className="text-[22px]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Learning Center</h2>
              <p className="text-xs text-blue-100 opacity-90">
                Get help and learn features
              </p>
            </div>
          </div>

          <FontAwesomeIcon
            icon={faXmark}
            className="cursor-pointer text-[24px]"
            onClick={toggleDrawer}
          />
        </div>

       
        <div className="flex border-b text-sm font-medium px-6">
          <button
            onClick={() => {setActiveTab("metrics");
                           setOpenGuide([]);}}
            className={`flex-1 py-3 flex items-center justify-center gap-2 ${
              activeTab === "metrics"
                ? "text-[#1890FF] border-b-2 border-[#1890FF]"
                : "text-gray-500"
            }`}
          >
            <FontAwesomeIcon icon={faChartLine} />
            Metric Definitions
          </button>

          <button
            onClick={() => {setActiveTab("dashboard");
                        setOpenCategory([]);
            }}
            className={`flex-1 py-3 flex items-center justify-center gap-2 ${
              activeTab === "dashboard"
                ? "text-[#1890FF] border-b-2 border-[#1890FF]"
                : "text-gray-500"
            }`}
          >
            <FontAwesomeIcon icon={faRoute} />
            Dashboard Guide
          </button>
        </div>

       
        {activeTab === "metrics" && (
          <div className="p-6 pb-0 mb-6">
            <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 text-gray-500">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              <input
                className="w-full outline-none text-sm"
                placeholder="Search metrics, terms, or definitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <FontAwesomeIcon
                  icon={faXmark}
                  className="cursor-pointer text-sm"
                  onClick={() => setSearchTerm("")}
                />
              )}
            </div>
          </div>
        )}

        
         {activeTab === "metrics" && (
                  <>
                    <div className="px-6 pb-0 mb-4 flex items-center justify-between text-xs font-semibold text-gray-500 uppercase">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Browse by Category
                      </span>
                    </div>
        
                    <div className="px-6 space-y-3 flex-1 overflow-y-auto min-h-0">
                      {Object.keys(filteredCategoryDetails).map((cat) => {
                      
                        const uiMap = {
                          "On-Shelf Availability": {
                            img: "/assets/images/shopping-cart.svg",
                            iconBg: "bg-[#E8F4FF]",
                          },
                          "Share of Search (SOS) and Ranking": {
                            img: "/assets/images/search-check.svg",
                            iconBg: "bg-[#E8F4FF]",
                          },
                          Promotions: {
                            img: "/assets/images/badge-percent.svg",
                            iconBg: "bg-[#E8F4FF]",
                          },
                          "Ratings and Reviews": {
                            img: "/assets/images/ratingIcon.svg",
                            iconBg: "bg-[#E8F4FF]",
                          },
                          "Content Score": {
                            img: "/assets/images/monitor-up.svg",
                            iconBg: "bg-[#E8F4FF]",
                          },
                        };
        
                        return (
                          <CategoryItem
                            key={cat}
                            title={cat}
                            img={uiMap[cat].img}
                            iconBg={uiMap[cat].iconBg}
                            openCategory={openCategory}
                            setOpenCategory={setOpenCategory}
                            data={filteredCategoryDetails}
                            previewImg={previewImg}
                             setPreviewImg={setPreviewImg}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
        
                {activeTab === "dashboard" && (
                  <>
                    <div className="px-6 pt-6 pb-0 mb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                      Getting Started
                    </div>
        
                    <div className="px-6 space-y-3 flex-1 overflow-y-auto min-h-0 pb-6">
                      {dashboardGuideData.map((item, i) => (
                        <DashboardGuideItem
                          key={i}
                          item={item}
                          openGuide={openGuide}
                          setOpenGuide={setOpenGuide}
                             previewImg={previewImg}
                             setPreviewImg={setPreviewImg}
                        />
                      ))}

                      
                    </div>
                  </>
                )}

     

       {/* <div className="border-t px-4 py-3 flex justify-end text-sm">
          <button className="flex items-center gap-2 text-[#1890FF]">
            <FontAwesomeIcon icon={faFileLines} />
            Full Documentation
          </button>
        </div> */}
      </div>
    </>
  );
}
