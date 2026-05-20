import MasterSidebar from './MasterSidebar';

import BrandMaster from './BrandMaster';
import BrandMasterList from './BrandMasterList';

import SubBrandMaster from './SubBrandMaster';
import SubBrandMasterList from './SubBrandMasterList';

import CategoryMaster from './CategoryMaster';
import CategoryMasterList from './CategoryMasterList';

import SubCategoryMaster from './SubCategoryMaster';
import SubCategoryMasterList from './SubCategoryMasterList';

import LocationMaster from './LocationMaster';
import ByBoxSellerSettings from './ByBoxSellerSettings/index';
import ByBoxTrends from './ByBoxSellerSettings/Trends';
import KeywordConfiguration from './KeywordConfiguration';
import ProductSkuMapping from './ProductSkuMapping';

import { useLocation } from "react-router-dom";
import ContentScoreConfiguration from './ContentScoreConfiguration';
import ContentScoreConfigurationPreview from './ContentScoreConfiguration/ContentScoreConfigurationPreview';

export default function CreateMaster() {
  const location = useLocation();
  const page = location.pathname.split('/')[2]??'brand';
  console.log('location?.pathname',page)
  let ComponentToRender = null;
  let isShowSidebar = true;

  if (page === "brand") ComponentToRender = <BrandMasterList />;
  else if (page === "add-brand") ComponentToRender = <BrandMaster />;

  else if (page === "sub-brand") ComponentToRender = <SubBrandMasterList />;
  else if (page === "add-sub-brand") ComponentToRender = <SubBrandMaster />;

  else if (page === "category") ComponentToRender = <CategoryMasterList />;
  else if (page === "add-category") ComponentToRender = <CategoryMaster />;

  else if (page === "sub-category") ComponentToRender = <SubCategoryMasterList />;
  else if (page === "add-sub-category") ComponentToRender = <SubCategoryMaster />;
  
  else if (page === "location") ComponentToRender = <LocationMaster />;

  else if (page === "by-box-seller-settings"){ isShowSidebar=false; ComponentToRender = <ByBoxSellerSettings />}
  else if (page === "by-box-trends"){ isShowSidebar=false; ComponentToRender = <ByBoxTrends />}

  else if (page === "keyword-configuration"){ isShowSidebar=false; ComponentToRender = <KeywordConfiguration />}

  else if (page === "product-sku-mapping"){ isShowSidebar=false; ComponentToRender = <ProductSkuMapping />}
  
  else if (page === "content-score-configuration"){ isShowSidebar=false; ComponentToRender = <ContentScoreConfiguration />}
  else if (page === "content-score-configuration-preview"){ isShowSidebar=false; ComponentToRender = <ContentScoreConfigurationPreview />}

  else ComponentToRender = <div className="flex justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                              Not Found
                          </div>;

  return (
    <div className="bg-gray-50 flex mt-2 min-h-[800px]">
      {
        isShowSidebar ? <MasterSidebar /> :<></>  
      }
      
      {ComponentToRender}
    </div>
  );
}
