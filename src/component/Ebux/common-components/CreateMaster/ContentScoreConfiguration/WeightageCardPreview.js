export function WeightageCardPreview({ label = "Platform", title, subtitle, imgSrc }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3 py-4 px-4">
        {/* Icon Box */}
        <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
          <img
            src={imgSrc}
            alt={title}
            className="w-8 h-8 object-contain object-center block"
          />
        </div>

        {/* Text Section */}
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <h4 className="mt-1 text-lg font-semibold text-gray-900 leading-tight">{title}</h4>
          <p className="mt-1 text-md text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}