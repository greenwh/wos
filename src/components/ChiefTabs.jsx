export default function ChiefTabs({ chiefs, activeChief, onSelect }) {
  const names = Object.keys(chiefs);

  return (
    <div className="flex gap-1 px-3 py-2 overflow-x-auto bg-[#0F172A]">
      {names.map(name => (
        <button
          key={name}
          onClick={() => onSelect(name)}
          className={`px-4 py-1.5 rounded text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
            name === activeChief
              ? "bg-[#1E293B] text-white border-b-2 border-blue-500"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
