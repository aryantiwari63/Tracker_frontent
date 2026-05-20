// import ProductToolbar from "./ProductToolbar";
import ProductTable from "./ProductTable";
import { getProductAffectedData, updateProductPricingOutput } from "../service/service";
import { useEffect, useState } from "react";
import FilterBar from "../FilterBar";

const MARKETPLACES = ["Amazon", "Walmart", "Target", "Shopify"];
const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Applied", value: "APPLIED" },
  { label: "Executed", value: "EXECUTED" },
  { label: "Blocked", value: "BLOCKED" },
  { label: "Suggested", value: "SUGGESTED" }
];

export default function ProductsAffected() {
  const [affectedData, setAffectedData] = useState([]);
  const [loading, setLoading] = useState(true);


  // filter
  const [marketplace, setMarketplace] = useState(null);
  const [status, setStatus] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // filter

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  // pagination


  const getData = async (selectedMarketplace = null, selectedStatus = null, searchText = "", currentPage = page) => {
    setLoading(true);
    try {
      const payload = {
        page: currentPage,
        start: pageSize
      };

      if (selectedMarketplace && selectedMarketplace.length > 0) {
        payload.marketplace = selectedMarketplace;
      }

      if (selectedStatus) {
        payload.status = selectedStatus;
      }
      if (searchText) {
        payload.search = searchText;
      }
      const response = await getProductAffectedData(payload);

      setAffectedData(response?.data || []);
      setTotal(response?.total || 0);
      setTotalPages(response?.total_pages || 1);
      // setPage(response?.page || 1);
      setPage(response?.page && response.page > 0 ? response.page : 1);


      setSelectedIds([]);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(marketplace, status, search, page);
  }, [page]);



  useEffect(() => {
    if (page == 1) {
      getData(marketplace, status, search, 1);
    } else {
      setPage(1);
    }


  }, [marketplace, status, search]);



  const toggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === affectedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(affectedData.map((r) => r.id));
    }
  };


  const handlePause = async () => {
    if (selectedIds.length === 0) return;

    try {
      console.log('selectedIdsselectedIds', selectedIds)
      await updateProductPricingOutput({ ids: selectedIds, status: "PAUSED" });
      getData(marketplace, status, search); // refresh table
      setSelectedIds([]);
    } catch (e) {
      console.error("Pause failed", e);
    }
  };


  const handleOverride = async () => {
    if (selectedIds.length === 0) return;

    try {
      console.log('selectedIdsselectedIds', selectedIds)
      await updateProductPricingOutput({ ids: selectedIds, status: "OVERRIDE" });
      getData(marketplace, status, search);
      setSelectedIds([]);
    } catch (e) {
      console.error("Override failed", e);
    }
  };

  const handleOverrideRow = async (row) => {
    if (!window.confirm("Are you sure you want to override this rule?")) {
      return;
    }

    try {

      await updateProductPricingOutput({
        ids: [row.id],
        status: "OVERRIDE"
      });

      // refresh table
      getData(marketplace, status, search, page);

    } catch (error) {

      console.error("Override failed", error);

    }

  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto space-y-6">
        {/* <ProductToolbar /> */}
        <FilterBar
          STATUS_OPTIONS={STATUS_OPTIONS}
          MARKETPLACES={MARKETPLACES}
          onMarketplaceChange={(value) => setMarketplace(value)}
          onStatusChange={setStatus}
          status={status}
          onSearchChange={setSearch}

          type="products-affected"
          selectedCount={selectedIds.length}
          onPause={handlePause}
          onOverride={handleOverride}
        />

        {loading ? (
          <div className="text-center text-gray-400 py-10">
            Loading products...
          </div>
        ) : (
          <ProductTable
            rows={affectedData}
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            selectedIds={selectedIds}
            onToggleRow={toggleRow}
            onToggleAll={toggleAll}
            onOverrideRow={handleOverrideRow}
          />
        )}
      </div>
    </div>
  );
}
