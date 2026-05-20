import { useLocation } from "react-router-dom";

import PricingRuleList from './PricingRuleList';
import CreateRule from './CreateRule';
import Header from './Header';
import StatsCard from './StatCard';
import ProductsAffected from "./Table";

import { faListUl, faBriefcase, faRotate, faPercent, faTriangleExclamation, faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";



const statsData = [
  {
    icon: faListUl,
    iconColor: 'text-[#2563EB]',
    iconBgColor: 'bg-[#DBEAFE]',
    value: '24',
    dataKey:'pricing_rules_count',
    label: 'Active Rules',
    badge: { text: 'Active', color: 'text-green-700' },
    variant: 'green',
    redirectTo: '/pricing-rule-engine',
    activeBorderColor: 'border-2 border-green-600 shadow-md',
    isDisabled: false
  },
  {
    icon: faBriefcase,
    iconColor: 'text-[#9333EA]',
    iconBgColor: 'bg-[#F3E8FF]',
    value: '1,247',
    dataKey:'active_product_pricing_count',
    label: 'Products Affected',
    trending: { type: true, icon: faArrowTrendUp, color: 'text-green-600' },
    redirectTo: '/pricing-rule-engine/products-affected',
    activeBorderColor: 'border-2 border-blue-600 shadow-md',
    isDisabled: false
  },
  {
    icon: faRotate,
    iconColor: 'text-[#EA580C]',
    iconBgColor: 'bg-[#FFEDD5]',
    value: '--',
    label: 'Price Changes Today',
    badge: { text: 'Live', color: 'text-[#036fff]' },
    isDisabled: true
  },
  {
    icon: faPercent,
    iconColor: 'text-[#16A34A]',
    iconBgColor: 'bg-[#DCFCE7]',
    value: '--',
    label: 'Avg Margin Protected',
    trending: { type: true, icon: faArrowTrendUp, color: 'text-green-600' },
    isDisabled: true
  },
  {
    icon: faTriangleExclamation,
    iconColor: 'text-[#DC2626]',
    iconBgColor: 'bg-[#FEE2E2]',
    value: '--',
    label: 'Conflicts Detected',
    badge: { text: 'Alert', color: 'text-red-700' },
    alert: false,
    isDisabled: true
  }
];

export default function PricingRuleEngine() {
  const location = useLocation();
  const page = location.pathname.split('/')[2] ?? 'pricing-rule-engine';
  console.log('location?.pathname', page)
  let ComponentToRender = null;
  // let isShowSidebar = true;

  if (page === "create-rule") ComponentToRender = <CreateRule />;
  else if (page === "products-affected") ComponentToRender = <ProductsAffected />;
  else if (page === "pricing-rule-engine") ComponentToRender = <PricingRuleList />;
  else ComponentToRender = <div className="flex justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"> Not Found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <div className="max-w-7xl mx-auto px-6 py-8"> */}
      <div className="mx-auto px-6 py-0">
        <Header />
        <div className="grid grid-cols-5 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
        {ComponentToRender}
      </div>
    </div>
  );
}
