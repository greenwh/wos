export default function StarBar({ stars, slivers }) {
  const filled = stars || 0;
  const partial = slivers || 0;
  return (
    <div className="flex items-center gap-px">
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 12 12">
          <polygon
            points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.2 3,11 3.5,7.5 1,5 4.5,4.5"
            fill={i < filled ? "#FBBF24" : "#374151"}
            stroke={i < filled ? "#F59E0B" : "#4B5563"}
            strokeWidth="0.5"
          />
        </svg>
      ))}
      {partial > 0 && (
        <span className="text-[9px] text-gray-400 ml-0.5">+{partial}</span>
      )}
    </div>
  );
}
