import { CheckCircle } from "lucide-react";
import React from "react";

function StatusBadge({ status }) {
  const getStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-[var(--ob-orl)] text-[var(--ob-or)] border-[rgba(232,98,42,0.2)]";
      case "printed":
      case "finished":
      case "delivered":
        return "bg-[var(--ob-grnl)] text-[var(--ob-grn)] border-[rgba(61,214,140,0.2)]";
      case "in_progress":
      case "processing":
      case "accepted":
        return "bg-[var(--ob-tll)] text-[var(--ob-tl)] border-[rgba(26,188,176,0.2)]";
      case "cancelled":
      case "rejected":
        return "bg-[var(--ob-redl)] text-[var(--ob-red)] border-[rgba(240,80,80,0.2)]";
      default:
        return "bg-[var(--ob-surf2)] text-[var(--ob-txm)] border-[var(--ob-brd)]";
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${getStyle(status)} px-2 py-[2px] rounded-full text-[9px] font-semibold border whitespace-nowrap`}
    >
      <CheckCircle size={11} />
      {status}
    </span>
  );
}

export default React.memo(StatusBadge);
