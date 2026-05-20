export default function ProductToolbar() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4">
      {/* Left */}
      <div className="flex items-center gap-3 flex-1">
        <input
          type="text"
          placeholder="Search by SKU, Name..."
          className="w-[450px] px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        />

        {["Platform", "Status"].map((label) => (
          <button
            key={label}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">2 selected</span>

        <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
          Apply Selected
        </button>

        <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          Pause
        </button>

        <button className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm">
          Override
        </button>
      </div>
    </div>
  );
}
