import { RARITY_COLORS } from '../lib/constants';

export default function GearSlot({ gear, slotLabel }) {
  const r = RARITY_COLORS[gear.rarity] || RARITY_COLORS.Empty;
  const isEmpty = gear.rarity === "Empty";
  return (
    <div
      className="relative flex flex-col items-center justify-center shrink-0"
      style={{
        width: 52,
        height: 52,
        borderRadius: 6,
        border: `2px solid ${r.border}`,
        background: isEmpty ? "#111827" : `linear-gradient(135deg, ${r.bg}22, ${r.bg}44)`,
      }}
    >
      <span className="text-[8px] text-gray-400 mb-px">{slotLabel}</span>
      {isEmpty ? (
        <span className="text-base" style={{ color: "#374151" }}>—</span>
      ) : (
        <>
          <span className="text-[11px] font-bold" style={{ color: r.border }}>
            {gear.enhancement ? `+${gear.enhancement}` : r.label}
          </span>
          {gear.masterForgery && (
            <span
              className="absolute top-px right-0.5 text-[8px] font-bold rounded px-0.5"
              style={{ color: "#FDE68A", background: "#78350F" }}
            >
              M{gear.masterForgery}
            </span>
          )}
        </>
      )}
    </div>
  );
}
