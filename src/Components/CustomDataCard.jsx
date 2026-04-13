import React from 'react';

const OrderDataCard = ({
  title = "Orders",
  count = 156,
  icon = "📦",
  timeframe = "Today",
  color = "blue",
  data
}) => {
  const colorVariants = {
    blue: { bg: "var(--ob-pl)", text: "var(--ob-p2)" },
    green: { bg: "var(--ob-grnl)", text: "var(--ob-grn)" },
    purple: { bg: "var(--ob-pl)", text: "var(--ob-p2)" },
    amber: { bg: "var(--ob-orl)", text: "var(--ob-or)" },
    red: { bg: "var(--ob-redl)", text: "var(--ob-red)" },
    teal: { bg: "var(--ob-tll)", text: "var(--ob-tl)" },
  };

  const c = colorVariants[color] || colorVariants.blue;

  return (
    <div
      className="rounded-[13px] border border-[var(--ob-brd)] p-[14px] w-full transition-all duration-200 hover:border-[var(--ob-brd2)] hover:-translate-y-[1px] relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #131728, #181D30)" }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[11px] font-semibold text-[var(--ob-txm)]">{title}</h3>
        <div
          className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-sm"
          style={{ background: c.bg }}
        >
          <span>{icon}</span>
        </div>
      </div>

      <div className="flex flex-col">
        <h2 className="font-['Syne'] text-[28px] font-bold text-[var(--ob-tx)] leading-none">{data}</h2>
        <span className="text-[10px] text-[var(--ob-txd)] mt-1.5">{timeframe}</span>
      </div>
    </div>
  );
};

export default React.memo(OrderDataCard);
