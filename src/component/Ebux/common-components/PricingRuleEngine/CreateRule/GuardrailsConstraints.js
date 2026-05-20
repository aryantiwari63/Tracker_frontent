import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield } from "@fortawesome/free-solid-svg-icons";

export default function GuardrailsConstraints({ 
  minPriceValue, 
  setMinPriceValue, 
  maxPriceCeiling, 
  setMaxPriceCeiling,
  maxPriceChangeValue,
  setMaxPriceChangeValue,
  minInventoryLevel,
  setMinInventoryLevel
}) {
  return (
    <div className="rounded-2xl bg-orange-50 border border-orange-100 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
          <FontAwesomeIcon icon={faShield} className="text-white text-lg" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          WITH LIMITS – Guardrails & Constraints
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Minimum Price */}
        <FieldCard title="Minimum Price (Floor)">
          <div className="grid grid-cols-2 gap-3 w-full">
            <select className="px-3 py-3 border border-gray-200 rounded-lg text-sm w-full bg-[#F9FAFB]">
              <option>Cost + Margin %</option>
            </select>

            <input
              type="text"
              placeholder="15"
              value={minPriceValue}
              onChange={(e) => setMinPriceValue(e.target.value)}
              className="px-3 py-3 border border-gray-200 rounded-lg text-sm w-full bg-[#F9FAFB]"
            />
          </div>
        </FieldCard>

        <FieldCard title="Maximum Price (Ceiling)">
          <div className="grid grid-cols-2 gap-3 w-full">
            <select className="px-3 py-3 border border-gray-200 rounded-lg text-sm w-full bg-[#F9FAFB]">
              <option>MRP / MAP</option>
            </select>

            <input
              type="text"
              placeholder="15"
              value={maxPriceCeiling}
              onChange={(e) => setMaxPriceCeiling(e.target.value)}
              className="px-3 py-3 border border-gray-200 rounded-lg text-sm w-full bg-[#F9FAFB]"
            />
          </div>
        </FieldCard>

        {/* Max Price Change */}
        <FieldCard title="Max Price Change Per Day">
          <div className="grid grid-cols-2 gap-3 w-full">
            <input
              type="text"
              placeholder="15"
              value={maxPriceChangeValue}
              onChange={(e) => setMaxPriceChangeValue(e.target.value)}
              className="px-3 py-3 border border-gray-200 rounded-lg text-sm w-full bg-[#F9FAFB]"
            />
            <select className="px-3 py-3 border border-gray-200 rounded-lg text-sm w-full bg-[#F9FAFB]">
              <option>%</option>
            </select>
          </div>
        </FieldCard>

        {/* Inventory */}
        <FieldCard title="Minimum Inventory Level">
          <div className="grid grid-cols-1 gap-3 w-full">
            <input
              type="text"
              placeholder="15"
              value={minInventoryLevel}
              onChange={(e) => setMinInventoryLevel(e.target.value)}
              className="px-3 py-3 border border-gray-200 rounded-lg text-sm w-full bg-[#F9FAFB]"
            />
          </div>
        </FieldCard>

      </div>

      {/* Time Based Restrictions */}
      {/* <div className="bg-white border border-orange-200 rounded-xl p-5 space-y-4">
        <label className="flex items-center gap-3 text-gray-900 font-medium">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
          Apply Time-Based Restrictions
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
          <div>
            <label className="label">Active Days</label>
            <select className="input w-full">
              <option>All Days</option>
            </select>
          </div>

          <div>
            <label className="label">Start Time</label>
            <div className="relative">
              <input
                className="input w-full pr-10"
                placeholder="--:-- --"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                ⏰
              </span>
            </div>
          </div>

          <div>
            <label className="label">End Time</label>
            <div className="relative">
              <input
                className="input w-full pr-10"
                placeholder="--:-- --"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                ⏰
              </span>
            </div>
          </div>
        </div>
      </div> */}
    </div>

    
  );
}


function FieldCard({ title, children }) {
  return (
    <div className="bg-white border border-orange-200 rounded-xl p-4 py-6 px-6">
      <label className="font-inter text-xs font-medium leading-none tracking-[-0.5px] text-[#374151] label mb-3">{title}</label>
      <div className="flex gap-3 pt-2">{children}</div>
    </div>
  );
}
