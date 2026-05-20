export default function InfoCard({ title, formula, desc, points }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <p className="text-sm text-gray-800 mb-2 text-start font-medium">{title}</p>

      {formula && (
        <p className="text-xs text-gray-600 mb-2 text-left">
          <span className="font-medium">Formula:</span> {formula}
        </p>
      )}

      <p className="text-xs text-gray-500 mb-2 leading-relaxed text-left">{desc}</p>

      {points && (
        <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
          {points.map((p, i) => (
            <li key={i} className="text-start">{p}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
