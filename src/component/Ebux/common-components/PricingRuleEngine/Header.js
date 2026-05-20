// import { Plus } from 'lucide-react';
import { Link, useLocation } from "react-router-dom";

export const BREADCRUMBS = {
  "/pricing-rule-engine": "Pricing Rules",
  "/pricing-rule-engine/create-rule": "Create Rule",
  "/pricing-rule-engine/products-affected": "Products Affected"
};

export default function Header() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  const edit_rule = location.state?.edit_rule || null;

  let currentPath = "";
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        {pathnames.map((segment, index) => {
          currentPath += `/${segment}`;
          const isLast = index === pathnames.length - 1;
          let label = BREADCRUMBS[currentPath] || segment;
          if (
            currentPath === "/pricing-rule-engine/create-rule" &&
            edit_rule
          ) {
            label = "Edit Rule";
          }

          return (
            <span key={currentPath} className="flex items-center gap-2">
              {index !== 0 && <span>›</span>}

              {isLast ? (
                <span className="text-gray-900 font-medium">{label}</span>
              ) : (
                <Link
                  to={currentPath}
                  className="hover:text-gray-900 transition"
                >
                  {label}
                </Link>
              )}
            </span>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pricing Rules</h1>
          <p className="text-gray-600">
            Configure intelligent pricing strategies based on competitor data and business constraints
          </p>
        </div>

        <Link to={"/pricing-rule-engine/create-rule"} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors">
          {/* <Plus size={20} /> */}
          + Create New Rule
        </Link>
      </div>
    </div>
  );
}
