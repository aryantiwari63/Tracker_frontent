import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import FilterBar from './FilterBar';
import PricingRuleCard from './PricingRuleCard';
import { getAllPriceingRuleData, statusUpdatePriceingRuleData, deletePriceingRuleData } from './service/service';
import PricingRuleSkeleton from './PricingRuleSkeleton';

const target_list = {
  under_cut: "Under Cut",
  increase_by: "Increase By",
  equal_to: "Equal To",
  set_price: "Set Price"
}
const our_price_is = {
  between: "With in Of",
  not_between: "Outside Of",
  equal_to: "Equal To",
  greater_than: "Higher Than",
  less_than: "Lower Than"
}
const MARKETPLACES = ["Amazon", "Walmart", "Target"];
const STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Deleted", value: "Deleted" }
];
const useFilterBar = true;

export default function PricingRuleList() {
  const [pricingRules, setPricingRules] = useState([]);
  const [pricingRulesData, setPricingRulesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // filter
  const [marketplace, setMarketplace] = useState(null);
  const [status, setStatus] = useState(null);
  const [search, setSearch] = useState("");
  // filter


  const getRules = async (selectedMarketplace = null, selectedStatus = null, searchText = "") => {
    setLoading(true);

    try {
      const payload = {};

      if (selectedMarketplace && selectedMarketplace.length > 0) {
        payload.marketplace = selectedMarketplace;
      }

      if (selectedStatus) {
        payload.status = selectedStatus;
      }
      if (searchText) {
        payload.search = searchText;
      }
      const data = await getAllPriceingRuleData(payload);
      setPricingRulesData(data);
      // console.log('datadatadatadata', data)
      const rules = data?.map((rule) => ({
        id: rule?.id ?? "",
        title: rule?.rule_name ?? "",
        description: rule?.description ?? "",
        last_applied: rule?.last_applied ?? "",
        last_applied_ago: rule?.last_applied_ago ?? "",
        price_changes_last_24h: rule?.price_changes_last_24h ?? "",
        badges: [
          ...(rule?.active ?? false ? [{ text: 'Active', color: 'bg-green-100 text-green-700' }] : [{ text: rule?.is_delete ? 'Deleted' : 'Inactive', color: 'bg-red-100 text-red-700' }])
        ],
        metadata: {
          marketplace: [...new Set(rule?.or_rules?.flatMap(r => r?.and_rules?.map(a => a.competitor).filter(Boolean)))]?.join(', '),
          products: rule?.apply_to ?? "",
          // lastApplied: 'Last applied: 2 hours ago',
          // priceChanges: 89
        },
        details: {
          condition: {
            label: 'IF Condition',
            value: `Our price is <span class="text-blue-600 font-semibold">${our_price_is?.[rule?.or_rules[0]?.and_rules[0]?.our_price_is ?? ''] ?? ''} ${rule?.or_rules[0]?.and_rules[0]?.value1 ?? ''}${['between', 'not_between']?.indexOf(rule?.or_rules[0]?.and_rules[0]?.our_price_is ?? '') > -1 ? "," : " "}${rule?.or_rules[0]?.and_rules[0]?.value2 ?? ''}${rule?.or_rules[0]?.and_rules[0]?.unit ?? ''}</span> ${rule.or_rules[0]?.and_rules[0]?.competitor ?? ''}`
          },
          action: {
            label: 'THEN Action',
            value: `${target_list?.[rule?.then_actions?.target ?? ''] ?? ''} ${rule?.then_actions?.competitor ?? ''} <span class="text-green-600 font-semibold">${rule?.then_actions?.target != "equal_to" ? rule?.then_actions?.value ?? '' : ''}${rule?.then_actions?.unit ?? ''}</span>`
          },
          guardrails: {
            label: 'Guardrails',
            value: 'Max change: <span class="text-orange-600 font-semibold">' + (rule?.with_limits_guardrails?.maximum_update_in_a_day ?? 0) + '/day</span>'
          }
        },
        isActive: rule?.active ?? false,
        is_deleted: rule?.is_delete ?? false
      }));
      console.log({ data });
      setPricingRules(rules);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getRules(marketplace, status, search);
  }, [marketplace, status, search]);

  const history = useHistory();

  const handleEditRule = (ruleId) => {
    console.log('rule to edit', pricingRulesData.find(r => r.id === ruleId));
    history.push({
      pathname: "/pricing-rule-engine/create-rule",
      state: { edit_rule: pricingRulesData.find(r => r.id === ruleId) }
    });
  };


  const handleToggle = async (ruleId, newStatus) => {

    setPricingRules(prev =>
      prev.map(rule =>
        rule.id === ruleId
          ? {
            ...rule,
            isActive: newStatus,
            badges: [
              {
                text: newStatus ? "Active" : "Inactive",
                color: newStatus
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            ]
          }
          : rule
      )
    );

    try {
      await statusUpdatePriceingRuleData({
        id: ruleId,
        active: newStatus
      });
    } catch (error) {
      setPricingRules(prev =>
        prev.map(rule =>
          rule.id === ruleId
            ? { ...rule, isActive: !newStatus }
            : rule
        )
      );
    }
  };



  const handleDeleteRule = async (ruleId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this pricing rule?"
    );

    if (!confirmed) return;

    const previousRules = pricingRules;
    setPricingRules(prev => prev.filter(rule => rule.id !== ruleId));

    try {
      await deletePriceingRuleData({ id: ruleId });
    } catch (error) {
      setPricingRules(previousRules);
      alert("Failed to delete rule. Please try again.");
    }
  };



  return (
    <div className="">

      {useFilterBar && (
        <FilterBar
          STATUS_OPTIONS={STATUS_OPTIONS} MARKETPLACES={MARKETPLACES}
          onMarketplaceChange={(value) => setMarketplace(value)}
          onStatusChange={setStatus} status={status} onSearchChange={setSearch}
          type="active-rule"
        />
      )}

      <div>
        {loading ? (
          <>
            <PricingRuleSkeleton />
            <PricingRuleSkeleton />
            <PricingRuleSkeleton />
          </>
        ) : pricingRules.length === 0 ? (
          <NoDataFound />
        ) : (
          pricingRules.map((rule) => (
            <PricingRuleCard
              key={rule.id}
              {...rule}
              onEdit={handleEditRule}
              onToggle={handleToggle}
              onDelete={handleDeleteRule}
            />
          ))
        )}
      </div>


    </div>
  );
}


const NoDataFound = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      className="mb-4 text-gray-400"
    >
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" />
      <path d="M22 26h20M22 34h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>

    <h3 className="text-lg font-semibold text-gray-700">
      No data found
    </h3>
    <p className="text-sm text-gray-500 mt-1">
      Try changing filters or clearing selection
    </p>
  </div>
);
