export default function PricingRuleSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4 animate-pulse">
      {/* Title */}
      <div className="h-4 w-1/3 bg-gray-200 rounded mb-3"></div>

      {/* Description */}
      <div className="h-3 w-2/3 bg-gray-200 rounded mb-5"></div>

      {/* Meta row */}
      <div className="flex gap-4 mb-6">
        <div className="h-3 w-24 bg-gray-200 rounded"></div>
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
      </div>

      {/* Details boxes */}
      <div className="grid grid-cols-3 gap-4">
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
