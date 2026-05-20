export const Radio = ({ label, desc, checked, onChange }) => (
  <label className="flex gap-2 items-start cursor-pointer">
    <input type="radio" checked={checked} onChange={onChange} />
    <div>
      <div className="text-sm">{label}</div>
      <div className="text-xs text-gray-500">{desc}</div>
    </div>
  </label>
);

export const Tab = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm border rounded ${active ? "bg-blue-600 text-white" : "bg-white"
      }`}
  >
    {children}
  </button>
);

export const Toggle = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`w-10 h-6 rounded-full relative ${checked ? "bg-blue-600" : "bg-gray-300"
      }`}
  >
    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition ${checked ? "left-5" : "left-0.5"
      }`} />
  </button>
);


export function TimeInput({
  value,
  onChange,
  disabledTimes = []
}) {
  const times = generateTimes();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-[#F9FAFB]"
    >
      <option value="" disabled>
        Select time
      </option>

      {times.map((time) => (
        <option
          key={time}
          value={time}
          disabled={disabledTimes.includes(time)} // ✅ WORKS
        >
          {time}
        </option>
      ))}
    </select>
  );
}

const generateTimes = () => {
  const result = [];
  for (let h = 0; h < 24; h++) {
    result.push(`${String(h).padStart(2, "0")}:00`);
  }
  return result;
};


export const IconBtn = ({ children, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded ${danger ? "bg-red-100 text-red-600" : "bg-blue-600 text-white"
      }`}
  >
    {children}
  </button>
);
