import React from "react";

/**
 * DataTable — clean table with sticky header, hover, mobile fallback
 *
 * Props:
 *   columns: [{ key, header, render?, className?, align? }]
 *   rows: any[]
 *   onRowClick?: (row) => void
 *   loading?: bool
 *   empty?: ReactNode
 */
export default function DataTable({
  columns,
  rows,
  onRowClick,
  loading,
  empty,
  rowKey = "id",
}) {
  if (loading) {
    return (
      <div className="p-6 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-[var(--surface-2)] rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return <div className="p-12">{empty}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--surface-2)] border-b border-[var(--border)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)] px-4 py-3 text-${
                  col.align || "left"
                } ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row[rowKey] || i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-[var(--border)] last:border-0 transition-colors ${
                onRowClick ? "cursor-pointer hover:bg-[var(--surface-2)]" : ""
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-[14px] text-[var(--text-2)] text-${col.align || "left"} ${col.className || ""}`}
                >
                  {col.render ? col.render(row) : row[col.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
