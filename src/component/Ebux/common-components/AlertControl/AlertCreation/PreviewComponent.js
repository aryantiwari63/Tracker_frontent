import React, { useState, useMemo } from "react";
import { fetchPreviewData } from "../services/service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useEbuxContext } from "../../../Context/EbuxProvider";


export default function PreviewComponent({ alertControlObj }) {
  const { filters } = useEbuxContext();
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]); // Array of arrays (one per condition group)
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleRunReview = async () => {
    setLoading(true);
    setShowResults(true);
    setActiveTab(0);
    try {
      const activeClientProject = JSON.parse(localStorage.getItem("active_client_project") || "{}");
      const itemsPayload = { ...(alertControlObj.items || {}) };

      const tagProductsWebPids = (itemsPayload.selectedTags || []).flatMap(t => t.tag_details?.map(d => String(d.sku_or_keyword)) || []);
      const tagKeywordsKws = (itemsPayload.selectedTagsKW || []).flatMap(t => t.tag_details?.map(d => String(d.sku_or_keyword)) || []);

      if (tagProductsWebPids.length > 0) {
        const matchingProducts = (filters?.products || []).filter(p => tagProductsWebPids.includes(String(p.web_pid || p.value)));
        const existingIds = new Set((itemsPayload.selectedProductId || []).map(p => String(p.value)));
        const uniqueMatchingProducts = matchingProducts.filter(p => !existingIds.has(String(p.value)));
        itemsPayload.selectedProductId = [...(itemsPayload.selectedProductId || []), ...uniqueMatchingProducts];
      }

      if (tagKeywordsKws.length > 0) {
        const matchingKeywords = (filters?.keyword || []).filter(k => tagKeywordsKws.includes(String(k.keyword_name || k.value || k.label)));
        const existingKws = new Set((itemsPayload.selectedKeyword || []).map(k => String(k.value)));
        const uniqueMatchingKeywords = matchingKeywords.filter(k => !existingKws.has(String(k.value)));
        itemsPayload.selectedKeyword = [...(itemsPayload.selectedKeyword || []), ...uniqueMatchingKeywords];
      }

      let response = await fetchPreviewData({
        ...alertControlObj,
        items: itemsPayload,
        client_project_es_id: activeClientProject?.client_project_es_id
      });
      // Ensure we have an array of arrays (one for each OR group)
      const processedData = Array.isArray(response)
        ? Array.isArray(response[0])
          ? response
          : [response]
        : [];

      console.log("Processed Preview Data", processedData);
      setResults(processedData);
    } catch (error) {
      console.error("Error fetching preview data:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productStr) => {
    if (!productStr) return "-";
    return productStr.includes("::") ? productStr.split("::")[1] : productStr;
  };

  const getOSABadge = (osa) => {
    const value = parseFloat(osa);
    if (isNaN(value)) return <span className="text-gray-400">-</span>;

    if (value === 0) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
          0%
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
          {value}%
        </span>
      );
    }
  };

  // Determine which columns should be visible for the current active tab
  const activeColumns = useMemo(() => {
    // alertControlObj.conditions is an array of groups, each group is an array of AND conditions
    const groupConditions = alertControlObj.conditions[activeTab] || [];
    const metrics = groupConditions.map((c) => c.metric);

    return {
      stock: metrics.includes("Out-of-Stocks Days"),
      osa: metrics.includes("On-Shelf Availability Percentage"),
      promotion: metrics.includes("Promotion Percentage"),
      sellingPrice: metrics.includes("Selling Price"),
      mrp: metrics.includes("Maximum Retail Price"),
      score: metrics.includes("Content Score"),
      imageScore: metrics.includes("Image Score"),
      bulletinScore: metrics.includes("Bulletin Score"),
      descScore: metrics.includes("Description Score"),
      titleScore: metrics.includes("Title Score"),
      aPlusScore: metrics.includes("A+ Score"),
      ratings: metrics.includes("Product Ratings"),
      reviews: metrics.includes("Review Count"),
      sos: metrics.some((m) => m === "Overall Share of Search"),
      paidSos: metrics.some((m) => m === "Paid Share of Search"),
      organicSos: metrics.some((m) => m === "Organic Share of Search"),
      or: metrics.some((m) => m === "Overall Ranking"),
      paidOr: metrics.some((m) => m === "Paid Ranking"),
      organicOr: metrics.some((m) => m === "Organic Ranking"),
    };
  }, [alertControlObj.conditions, activeTab]);

  const entityLabel = useMemo(() => {
    const entity = alertControlObj.entity || "Products";
    if (entity === "Products") return "Product Name";
    if (entity === "Brands") return "Brand Name";
    if (entity === "Keywords") return "Keyword Name";
    if (entity === "Categories") return "Category Name";
    if (entity === "Platforms") return "Platform Name";
    if (entity === "Locations") return "Location Name";
    if (entity === "keywordCategory") return "Keyword Category";
    return "Name";
  }, [alertControlObj.entity]);

  const getEntityValue = (item) => {
    const entity = alertControlObj.entity || "Products";
    if (entity === "Products") return getProductName(item.Products);
    if (entity === "Brands") return item.Products || "-";
    if (entity === "Keywords") return item.Products || "-";
    if (entity === "Categories") return item.Products || "-";
    if (entity === "Platforms") return item.Products || "-";
    if (entity === "Locations") return item.Products || "-";
    if (entity === "keywordCategory") return item.Products || "-";
    return "-";
  };

  const scopeLabel = useMemo(() => {
    const isKeywordMetrics = ["SOS", "OR"].includes(alertControlObj.kpi);
    const {
      selectedBrand = [],
      selectedCategory = [],
      selectedPlatform = [],
      selectedLocation = [],
      selectedProductId = [],
      selectedKeywordCategory = [],
      selectedKeyword = [],
      selectedTags = [],
      selectedTagsKW = [],
    } = alertControlObj.items || {};

    const parts = [];

    if (isKeywordMetrics) {
      if (selectedKeyword?.length > 0)
        parts.push(`${selectedKeyword.length} Keywords`);
      if (selectedTagsKW?.length > 0)
        parts.push(`${selectedTagsKW.length} Keyword Tags`);
      if (selectedKeywordCategory?.length > 0)
        parts.push(`${selectedKeywordCategory.length} Categories`);
      if (selectedBrand?.length > 0)
        parts.push(`${selectedBrand.length} Brands`);
      if (selectedPlatform?.length > 0)
        parts.push(`${selectedPlatform.length} Platforms`);
      if (selectedLocation?.length > 0)
        parts.push(`${selectedLocation.length} Locations`);
    } else {
      if (selectedProductId?.length > 0)
        parts.push(`${selectedProductId.length} Products`);
      if (selectedTags?.length > 0)
        parts.push(`${selectedTags.length} Product Tags`);
      if (selectedBrand?.length > 0)
        parts.push(`${selectedBrand.length} Brands`);
      if (selectedCategory?.length > 0)
        parts.push(`${selectedCategory.length} Categories`);
      if (selectedPlatform?.length > 0)
        parts.push(`${selectedPlatform.length} Platforms`);
      if (selectedLocation?.length > 0)
        parts.push(`${selectedLocation.length} Locations`);
    }

    return parts.length > 0 ? parts.join(" / ") : "--";
  }, [alertControlObj.kpi, alertControlObj.items]);

  const currentResults = results[activeTab] || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight">
          Preview your alert
        </h1>
        <p className="text-[#64748B] text-[15px]">
          Validate your alert configuration using current marketplace data.
        </p>
      </div>


      <div className="bg-[#F9FAFB] shadow-sm border border-[#E2E8F0] rounded-[16px] p-4 flex flex-col gap-4 overflow-hidden">

        <div className="bg-[#F8FAFC] border-b border-[#E2E8F0]">

          <h2 className="text-[18px] font-semibold text-[#0F172A]">

            Configuration Summary
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-[80px]">

          <div className="space-y-4">

            <div className="flex items-center  gap-[10px] py-1 border-b border-[#F1F5F9]">

              <span className="min-w-[80px] text-[#64748B] text-sm font-medium">
                Entity Type:
              </span>
              <span className="text-[#0F172A] text-sm font-medium capitalize text-start">

                {alertControlObj.entity || "Products"}
              </span>
            </div>
            <div className="flex items-center  gap-[10px] py-1 border-b border-[#F1F5F9]">

              <span className="min-w-[80px] text-[#64748B] text-sm font-medium">
                Scope:
              </span>
              <span className="text-[#0F172A] text-sm font-medium text-start">

                {scopeLabel}
              </span>
            </div>
          </div>
          <div className="space-y-4">

            <div className="flex items-center gap-[10px] py-1 border-b border-[#F1F5F9]">

              <span className="min-w-[92px] text-[#64748B] text-sm font-medium">
                Metric Focus:
              </span>
              <span className="text-[#0F172A] text-sm font-medium text-start">

                {alertControlObj.metricType || "Product"} Based
              </span>
            </div>
            <div className="flex items-center gap-[10px] py-1 border-b border-[#F1F5F9]">

              <span className="min-w-[92px] text-[#64748B] text-sm font-medium">
                Conditions:
              </span>
              <span className="text-[#0F172A] text-sm font-medium text-start">

                {/* {alertControlObj.conditions[activeTab]?.length || 0} Rules (Group {activeTab + 1}) */}
                {alertControlObj?.conditions?.length || 0} Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => handleRunReview()}
        disabled={loading}
        className="self-start flex items-center gap-2 bg-[#1890FF]  disabled:bg-[#93C5FD] text-white px-5 py-3 rounded-[2px] text-sm font-medium transition-all shadow-md"
      >
        {loading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            Processing...
          </>
        ) : (
          <>

            <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white">
              <FontAwesomeIcon icon={faPlay} className="text-white text-[8px] ml-[2px]" />
            </div> Run Review
          </>
        )}
      </button>

      {showResults && (
        <div className="bg-white shadow-lg border border-[#E2E8F0] rounded-[20px] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#F1F5F9]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-[#191919]">
                  Preview Results
                </h2>
                <p className="text-sm text-[#64748B] mt-1">
                  {loading
                    ? "Analyzing database..."
                    : currentResults.length > 0
                      ? `Found ${currentResults.length} items for this condition group`
                      : "No matches found for the current configuration"}
                </p>
              </div>
            </div>

            {/* Tab Navigation - Only show if multiple arrays exist */}
            {results.length > 1 && (
              <div className="flex gap-2 border-b border-[#F1F5F9]">
                {results.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`px-4 py-2 text-sm font-semibold transition-all border-b-2 ${activeTab === idx
                      ? "border-[#2563EB] text-[#2563EB]"
                      : "border-transparent text-[#64748B] hover:text-[#0F172A]"
                      }`}
                  >
                    Condition {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F8FAFC] text-[#64748B] uppercase text-[11px] font-bold tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4">{entityLabel}</th>
                  {activeColumns.stock && (
                    <th className="px-6 py-4 text-center">Stock Days</th>
                  )}
                  {activeColumns.score && (
                    <th className="px-6 py-4 text-center">Content Score</th>
                  )}
                  {activeColumns.titleScore && (
                    <th className="px-6 py-4 text-center">Title Score</th>
                  )}
                  {activeColumns.descScore && (
                    <th className="px-6 py-4 text-center">Desc Score</th>
                  )}
                  {activeColumns.bulletinScore && (
                    <th className="px-6 py-4 text-center">Bulletin Score</th>
                  )}
                  {activeColumns.imageScore && (
                    <th className="px-6 py-4 text-center">Image Score</th>
                  )}
                  {activeColumns.aPlusScore && (
                    <th className="px-6 py-4 text-center">A+ Score</th>
                  )}
                  {activeColumns.ratings && (
                    <th className="px-6 py-4 text-center">Ratings</th>
                  )}
                  {activeColumns.reviews && (
                    <th className="px-6 py-4 text-center">Reviews</th>
                  )}
                  {activeColumns.sellingPrice && (
                    <th className="px-6 py-4 text-center">Selling Price</th>
                  )}
                  {activeColumns.mrp && (
                    <th className="px-6 py-4 text-center">MRP</th>
                  )}
                  {activeColumns.promotion && (
                    <th className="px-6 py-4 text-center">Promotion</th>
                  )}
                  {activeColumns.osa && <th className="px-6 py-4">OSA</th>}
                  {activeColumns.sos && <th className="px-6 py-4">SOS</th>}
                  {activeColumns.paidSos && (
                    <th className="px-6 py-4 whitespace-nowrap">Paid SOS</th>
                  )}
                  {activeColumns.organicSos && (
                    <th className="px-6 py-4 whitespace-nowrap">Organic SOS</th>
                  )}
                  {activeColumns.or && <th className="px-6 py-4">OR</th>}
                  {activeColumns.paidOr && (
                    <th className="px-6 py-4">Paid OR</th>
                  )}
                  {activeColumns.organicOr && (
                    <th className="px-6 py-4">Organic OR</th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F5F9]">
                {currentResults.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-[#F8FAFC] transition-colors group"
                  >
                    <td className="px-6 py-4 max-w-[300px]">
                      <div className="flex gap-2 font-semibold text-[#0F172A] line-clamp-2">
                        {alertControlObj.entity === "Products" && (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-[24px] h-[24px] object-contain"
                          />
                        )}
                        {
                          getEntityValue(item)
                        }
                      </div>
                    </td>

                    {activeColumns.stock && (
                      <td className="px-6 py-4 text-center">
                        <span className="text-[#0F172A] font-medium">
                          {item.oos_total ?? item.oos_consecutive ?? "-"}
                        </span>
                      </td>
                    )}

                    {activeColumns.score && (
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                          {item.total_score ?? "-"}
                        </span>
                      </td>
                    )}
                    {activeColumns.titleScore && (
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                          {item.title_score ?? "-"}
                        </span>
                      </td>
                    )}
                    {activeColumns.descScore && (
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                          {item.desc_score ?? "-"}
                        </span>
                      </td>
                    )}
                    {activeColumns.bulletinScore && (
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                          {item.bulletin_score ?? "-"}
                        </span>
                      </td>
                    )}
                    {activeColumns.imageScore && (
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                          {item.image_score ?? "-"}
                        </span>
                      </td>
                    )}
                    {activeColumns.aPlusScore && (
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                          {item.a_plus_score ?? "-"}
                        </span>
                      </td>
                    )}
                    {activeColumns.ratings && (
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                          {item.rating_value ?? "-"}
                        </span>
                      </td>
                    )}
                    {activeColumns.reviews && (
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                          {item.review_count ?? "-"}
                        </span>
                      </td>
                    )}

                    {activeColumns.sellingPrice && (
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-[#0F172A]">
                          {item.price_sp ? `₹${item.price_sp}` : "-"}
                        </span>
                      </td>
                    )}

                    {activeColumns.mrp && (
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-[#0F172A]">
                          {item.price_rp ? `₹${item.price_rp}` : "-"}
                        </span>
                      </td>
                    )}

                    {activeColumns.promotion && (
                      <td className="px-6 py-4 text-center">
                        <span className="text-orange-600 font-bold">
                          {item.promotion ?? item.promo_val
                            ? `${item.promotion || item.promo_val}%`
                            : "-"}
                        </span>
                      </td>
                    )}

                    {activeColumns.osa && (
                      <td className="px-6 py-4">{getOSABadge(item.osa)}</td>
                    )}

                    {activeColumns.sos && (
                      <td className="px-6 py-4">{getOSABadge(item.sos)}</td>
                    )}

                    {activeColumns.paidSos && (
                      <td className="px-6 py-4">
                        {getOSABadge(item.paid_sos)}
                      </td>
                    )}

                    {activeColumns.organicSos && (
                      <td className="px-6 py-4">
                        {getOSABadge(item.organic_sos)}
                      </td>
                    )}

                    {activeColumns.or && (
                      <td className="px-6 py-4">{getOSABadge(item.or)}</td>
                    )}

                    {activeColumns.paidOr && (
                      <td className="px-6 py-4">{getOSABadge(item.paid_or)}</td>
                    )}

                    {activeColumns.organicOr && (
                      <td className="px-6 py-4">
                        {getOSABadge(item.organic_or)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
