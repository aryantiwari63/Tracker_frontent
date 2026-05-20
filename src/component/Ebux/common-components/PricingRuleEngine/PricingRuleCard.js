import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faPen, faTrash, faClock, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

export default function PricingRuleCard({
  title,
  description,
  badges,
  metadata,
  details,
  isActive,
  hasConflict,
  id,
  onEdit,
  onToggle,
  onDelete,
  is_deleted = false,
  // last_applied,
  last_applied_ago,
  price_changes_last_24h
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className={`${is_deleted ? 'opacity-50' : ''} bg-white border border-gray-200 rounded-xl p-6 mb-4 hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {badges.map((badge, index) => (
              <span
                key={index}
                className={`text-xs font-medium px-2.5 py-1 rounded-md ${badge.color}`}
              >
                {badge.text}
              </span>
            ))}
            {hasConflict && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-red-50 text-red-700 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 0L0 10h12L6 0z" />
                </svg>
                Conflict
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>

        {is_deleted ? null : 
        <div className="flex items-center gap-3 ml-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isActive} className="sr-only peer"
              onChange={(e) => onToggle(id, e.target.checked)} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          {/* <button className="p-1 hover:bg-gray-100 rounded transition-colors" onClick={() => onEdit(id)}>
            <FontAwesomeIcon icon={faEllipsisVertical} className={` text-lg `} />
          </button> */}
          <div className="relative" ref={menuRef}>
            <button
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              onClick={() => setOpenMenu(prev => !prev)}
            >
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                className="text-lg text-gray-600"
              />
            </button>

            {/*DROPDOWN MENU */}
            {openMenu && (
              <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-blue-600"
                  onClick={() => {
                    onEdit(id);
                    setOpenMenu(false);
                  }}
                >
                  <FontAwesomeIcon
                icon={faPen}
                className="text-lg text-blue-600"
              /> Edit
                </button>

                <button
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={() => {
                    onDelete(id);
                    setOpenMenu(false);
                  }}
                >
                  <FontAwesomeIcon
                icon={faTrash}
                className="text-lg text-red-600"
              /> Delete
                </button>
              </div>
            )}
          </div>
        </div>}
      </div>

      <div className="flex items-center gap-4 mb-6 text-sm">
        <div className="flex items-center gap-1.5">
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2812_12993)">
              <path d="M14.9733 2.83828L13.4065 0.358203C13.267 0.136719 13.0182 0 12.7529 0H2.99669C2.73146 0 2.48263 0.136719 2.34318 0.358203L0.773646 2.83828C-0.0357294 4.11797 0.680677 5.89805 2.19279 6.10313C2.30216 6.1168 2.41427 6.125 2.52365 6.125C3.23732 6.125 3.87169 5.81328 4.30646 5.33203C4.74122 5.81328 5.3756 6.125 6.08927 6.125C6.80294 6.125 7.43732 5.81328 7.87208 5.33203C8.30685 5.81328 8.94122 6.125 9.6549 6.125C10.3713 6.125 11.0029 5.81328 11.4377 5.33203C11.8752 5.81328 12.5068 6.125 13.2205 6.125C13.3326 6.125 13.442 6.1168 13.5514 6.10313C15.069 5.90078 15.7881 4.1207 14.976 2.83828H14.9733ZM13.6635 6.96992H13.6608C13.5158 6.98906 13.3682 7 13.2178 7C12.8787 7 12.5533 6.94805 12.2498 6.85508V10.5H3.49982V6.85234C3.19357 6.94805 2.86544 7 2.52638 7C2.37599 7 2.2256 6.98906 2.08068 6.96992H2.07794C1.96583 6.95352 1.85646 6.93438 1.74982 6.90703V10.5V12.25C1.74982 13.2152 2.53458 14 3.49982 14H12.2498C13.2151 14 13.9998 13.2152 13.9998 12.25V10.5V6.90703C13.8904 6.93438 13.7811 6.95625 13.6635 6.96992Z" fill="#2563EB" />
            </g>
            <defs>
              <clipPath id="clip0_2812_12993">
                <path d="M0 0H15.75V14H0V0Z" fill="white" />
              </clipPath>
            </defs>
          </svg>


          <span className="text-gray-700">{metadata.marketplace}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2812_13000)">
              <path d="M1.38633 1.59961L0 4.375H5.6875V0.875H2.56211C2.06445 0.875 1.61055 1.15664 1.38633 1.59961ZM6.5625 4.375H12.25L10.8637 1.59961C10.6395 1.15664 10.1855 0.875 9.68789 0.875H6.5625V4.375ZM12.25 5.25H0V11.375C0 12.3402 0.784766 13.125 1.75 13.125H10.5C11.4652 13.125 12.25 12.3402 12.25 11.375V5.25Z" fill="#9333EA" />
            </g>
            <defs>
              <clipPath id="clip0_2812_13000">
                <path d="M0 0H12.25V14H0V0Z" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <span className="text-gray-700">{metadata.products}</span>
        </div>
        {/* {metadata.lastApplied && */}
          <div className="flex items-center gap-1.5">
              <FontAwesomeIcon
                icon={faClock}
                className="text-[#EA580C]"
              /> 
            <span className="text-gray-700">{metadata.lastApplied}Last Applied : {last_applied_ago??"--"}</span>
          </div>
          {/* } */}
        {/* {metadata.priceChanges && */}
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-[#16A34A]"
              />
            <span className="text-green-700 font-medium">{metadata.priceChanges}  {price_changes_last_24h??0} price changes today</span>
          </div>
        {/* } */}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_2812_13028)">
                <path d="M6 12C7.5913 12 9.11742 11.3679 10.2426 10.2426C11.3679 9.11742 12 7.5913 12 6C12 4.4087 11.3679 2.88258 10.2426 1.75736C9.11742 0.632141 7.5913 0 6 0C4.4087 0 2.88258 0.632141 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 7.5913 0.632141 9.11742 1.75736 10.2426C2.88258 11.3679 4.4087 12 6 12ZM3.97969 3.87422C4.16484 3.35156 4.66172 3 5.21719 3H6.58359C7.40156 3 8.0625 3.66328 8.0625 4.47891C8.0625 5.00859 7.77891 5.49844 7.31953 5.76328L6.5625 6.19687C6.55781 6.50156 6.30703 6.75 6 6.75C5.68828 6.75 5.4375 6.49922 5.4375 6.1875V5.87109C5.4375 5.66953 5.54531 5.48438 5.72109 5.38359L6.75937 4.78828C6.86953 4.725 6.9375 4.60781 6.9375 4.48125C6.9375 4.28437 6.77812 4.12734 6.58359 4.12734H5.21719C5.1375 4.12734 5.06719 4.17656 5.04141 4.25156L5.03203 4.27969C4.92891 4.57266 4.60547 4.725 4.31484 4.62187C4.02422 4.51875 3.86953 4.19531 3.97266 3.90469L3.98203 3.87656L3.97969 3.87422ZM5.25 8.25C5.25 8.05109 5.32902 7.86032 5.46967 7.71967C5.61032 7.57902 5.80109 7.5 6 7.5C6.19891 7.5 6.38968 7.57902 6.53033 7.71967C6.67098 7.86032 6.75 8.05109 6.75 8.25C6.75 8.44891 6.67098 8.63968 6.53033 8.78033C6.38968 8.92098 6.19891 9 6 9C5.80109 9 5.61032 8.92098 5.46967 8.78033C5.32902 8.63968 5.25 8.44891 5.25 8.25Z" fill="#1E3A8A" />
              </g>
              <defs>
                <clipPath id="clip0_2812_13028">
                  <path d="M0 0H12V12H0V0Z" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <span className="text-xs font-semibold text-blue-900">{details.condition.label}</span>
          </div>
          <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: details.condition.value }} />
        </div>

        <div className="bg-green-50 rounded-lg p-4">

          <div className="flex items-center gap-2 mb-2">
            <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_2812_13039)">
                <path d="M8.18906 1.04552C8.32734 0.724431 8.22421 0.349431 7.94062 0.143181C7.65703 -0.0630692 7.27031 -0.0443192 7.00546 0.185368L1.00546 5.43537C0.771089 5.64162 0.686714 5.97209 0.79687 6.26271C0.907026 6.55334 1.18828 6.75021 1.49999 6.75021H4.11328L2.31093 10.9549C2.17265 11.276 2.27578 11.651 2.55937 11.8572C2.84296 12.0635 3.22968 12.0447 3.49453 11.8151L9.49453 6.56506C9.7289 6.35881 9.81328 6.02834 9.70312 5.73771C9.59296 5.44709 9.31406 5.25256 8.99999 5.25256H6.38671L8.18906 1.04552Z" fill="#14532D" />
              </g>
              <defs>
                <clipPath id="clip0_2812_13039">
                  <path d="M0 0H10.5V12H0V0Z" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <span className="text-xs font-semibold text-green-900">{details.action.label}</span>
          </div>
          <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: details.action.value }} />
        </div>

        <div className="bg-orange-50 rounded-lg p-4">

          <div className="flex items-center gap-2 mb-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_2812_13049)">
                <path d="M6.00001 0C6.10782 0 6.21564 0.0234375 6.31407 0.0679688L10.7274 1.94063C11.243 2.15859 11.6274 2.66719 11.625 3.28125C11.6133 5.60625 10.657 9.86016 6.61876 11.7938C6.22735 11.9813 5.77267 11.9813 5.38126 11.7938C1.34298 9.86016 0.386729 5.60625 0.375011 3.28125C0.372667 2.66719 0.757042 2.15859 1.27267 1.94063L5.68829 0.0679688C5.78439 0.0234375 5.8922 0 6.00001 0ZM6.00001 1.56563V10.425C9.23439 8.85938 10.1039 5.39297 10.125 3.31406L6.00001 1.56563Z" fill="#7C2D12" />
              </g>
              <defs>
                <clipPath id="clip0_2812_13049">
                  <path d="M0 0H12V12H0V0Z" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <span className="text-xs font-semibold text-orange-900">{details.guardrails.label}</span>
          </div>
          <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: details.guardrails.value }} />
        </div>
      </div>
    </div>
  );
}
