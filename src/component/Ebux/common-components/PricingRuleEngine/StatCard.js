// import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, Link } from "react-router-dom";
import { getHeaderCardSettings } from "./service/service";

export default function StatsCard({
  icon,
  iconColor,
  iconBgColor,
  value,
  dataKey,
  label,
  badge,
  trending,
  alert,
  // variant = 'default',
  redirectTo = '#',
  activeBorderColor,
  isDisabled = false
}) {
  const location = useLocation();
  const isActive =  redirectTo && location.pathname === redirectTo;

    const [headerSettingsData, setHeaderSettingsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    const data = await getHeaderCardSettings();
    setHeaderSettingsData(data || []);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const displayValue = loading ? '--' : headerSettingsData?.[dataKey] ?? value;
  return (
    <Link to={redirectTo}>
      {/* <div className={`bg-white rounded-xl p-6 ${variant === 'green' ? 'border-2 border-green-500' : 'border border-gray-200'}`}> */}
      <div
        className={`
           rounded-xl p-6 transition
            ${isDisabled ? 'opacity-50 shadow-none cursor-not-allowed' : 'bg-white hover:shadow-lg'}
          ${isActive
            ? activeBorderColor
            : "border-2 border-[#E5E7EB] shadow-md"
          }
        `}
      >

        <div className="flex items-start justify-between mb-4">
          <div className={`${iconBgColor} p-2.5 rounded-lg w-[40px] h-[40px]`}>
            {/* <Icon size={20} className={iconColor} /> */}
            <FontAwesomeIcon icon={icon} className={`text-lg ${iconColor}`} />

          </div>
          <div className="flex items-center gap-2">
            {badge && (
              <span className={`text-xs font-medium px-2 py-1 rounded ${badge.color}`}>
                {badge.text}
              </span>
            )}
            {trending?.type && (
              <div className={trending.color}>
                <FontAwesomeIcon icon={trending.icon} className="text-lg" />
              </div>
            )}
            {alert && (
              <div className="text-red-600">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0L0 14h16L8 0zm0 4l5.5 9h-11L8 4z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="text-3xl font-bold text-gray-900 mb-1">{displayValue}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </Link>
  );
}
