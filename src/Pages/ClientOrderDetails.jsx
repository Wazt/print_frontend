import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Upload, Search, Printer, Truck, FileText, CheckCircle2, ArrowRight, ExternalLink, Bell } from "lucide-react";

const STEPS = (t) => [
  { key: "upload", label: t("orderTracking.step1"), icon: Upload },
  { key: "review", label: t("orderTracking.step2"), icon: Search },
  { key: "bat", label: t("orderTracking.step3"), icon: FileText },
  { key: "production", label: t("orderTracking.step4"), icon: Printer },
  { key: "shipping", label: t("orderTracking.step5"), icon: Truck },
  { key: "delivery", label: t("orderTracking.step6"), icon: FileText },
  { key: "finished", label: t("orderTracking.step7"), icon: CheckCircle2 },
];

function StatusPill({ step, label }) {
  const styles = [
    { bg: "var(--ob-orl)", color: "var(--ob-or)" },
    { bg: "var(--ob-pl)", color: "var(--ob-p)" },
    { bg: "var(--ob-pl)", color: "var(--ob-p)" },
    { bg: "var(--step-active-bg)", color: "var(--step-active)" },
    { bg: "var(--ob-pl)", color: "var(--ob-p)" },
    { bg: "var(--ob-grnl)", color: "var(--ob-grn)" },
    { bg: "var(--ob-grnl)", color: "var(--ob-grn)" },
  ];
  const s = styles[step] || styles[0];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap"
      style={{ background: s.bg, color: s.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.color }} />
      {label || ""}
    </span>
  );
}

function Stepper({ current, steps }) {
  const [lineWidth, setLineWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const pct = (current / (steps.length - 1)) * 100;
      setLineWidth(pct);
    }, 300);
    return () => clearTimeout(timer);
  }, [current, steps.length]);

  return (
    <div className="relative flex justify-between px-1 py-6">
      {/* Track lines */}
      <div className="absolute top-[43px] left-0 right-0 h-[2px] z-0">
        <div
          className="absolute h-[2px] rounded-[1px] bg-[var(--step-pending-bg)]"
          style={{ left: "calc(100% / 14)", right: "calc(100% / 14)" }}
        />
        <div
          className="absolute h-[2px] rounded-[1px] transition-[width] duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            left: "calc(100% / 14)",
            width: `${lineWidth * (6 / 7)}%`,
            background: "linear-gradient(90deg, var(--step-done-line), var(--step-active-line))",
          }}
        />
      </div>

      {steps.map((step, i) => {
        const isDone = i < current;
        const isActive = i === current;

        return (
          <div key={step.key} className="flex-1 flex flex-col items-center relative z-[1] min-w-0">
            <div
              className={`w-[38px] h-[38px] rounded-full flex items-center justify-center text-[13px] font-medium transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isDone
                  ? "bg-[var(--step-done)] text-white"
                  : isActive
                  ? "bg-[var(--step-active)] text-white shadow-[0_0_0_5px_var(--step-active-bg)]"
                  : "bg-[var(--step-pending-bg)] text-[var(--step-pending)] border-[1.5px] border-[var(--step-pending)]"
              }`}
            >
              {isDone ? <Check size={17} strokeWidth={2.5} /> : i + 1}
            </div>
            <span
              className={`mt-[10px] text-[11.5px] text-center leading-tight max-w-[74px] ${
                isDone
                  ? "text-[var(--step-done)] font-medium"
                  : isActive
                  ? "text-[var(--step-active)] font-medium"
                  : "text-[var(--ob-txd)] font-normal"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function InfoGrid({ order, t }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[
        { label: t("orderTracking.product"), value: order.productName },
        { label: t("orderTracking.quantity"), value: order.quantity },
        { label: t("orderTracking.format"), value: order.format },
      ].map((item) => (
        <div key={item.label}>
          <div className="text-[11px] uppercase tracking-[0.06em] text-[var(--ob-txd)] mb-1">{item.label}</div>
          <div className="text-[14px] font-medium text-[var(--ob-tx)]">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ── PANEL 0: Upload ── */
function PanelUpload({ t }) {
  return (
    <div>
      <h3 className="font-['Syne'] text-[15px] font-semibold text-[var(--ink)] mb-1">{t("orderTracking.uploadTitle")}</h3>
      <p className="text-[13px] text-[var(--text-2)] leading-relaxed mb-4">{t("orderTracking.uploadDesc")}</p>
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-7 text-center bg-[var(--paper)] cursor-pointer hover:border-[var(--gold)] hover:bg-[var(--gold-bg)] transition-all duration-200 mb-4">
        <Upload className="mx-auto mb-2.5 text-[var(--text-3)]" size={28} />
        <div className="font-['Syne'] text-sm font-semibold text-[var(--ink)] mb-1">{t("orderTracking.uploadDrop")}</div>
        <div className="text-xs text-[var(--text-3)]">{t("orderTracking.uploadBrowse")}</div>
        <div className="flex gap-2 flex-wrap mt-3 justify-center">
          {["uploadPrintReady", "uploadDpi", "uploadCmyk", "uploadBleed"].map((k) => (
            <span key={k} className="bg-white border border-gray-100 rounded-md px-2.5 py-0.5 text-[11px] text-[var(--text-3)]">
              {t(`orderTracking.${k}`)}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-2.5 items-start bg-[var(--gold-bg)] border border-[var(--gold)]/20 rounded-lg p-3 text-xs text-amber-800 leading-relaxed">
        <span>💡</span>
        <span>{t("orderTracking.uploadHelp")} <strong>{t("orderTracking.uploadGuide")}</strong></span>
      </div>
    </div>
  );
}

/* ── PANEL 1: Review ── */
function PanelReview({ t }) {
  const checks = [
    { key: "checkResolution", status: "ok" },
    { key: "checkCmyk", status: "ok" },
    { key: "checkBleed", status: "pending" },
    { key: "checkFonts", status: "pending" },
    { key: "checkSafeZone", status: "pending" },
  ];
  return (
    <div>
      <div className="flex items-center gap-3 p-3 bg-[var(--pf-blue-light)] border border-[var(--pf-blue)]/15 rounded-xl mb-3">
        <div className="w-9 h-9 bg-[var(--pf-blue)] rounded-lg flex items-center justify-center text-white flex-shrink-0">
          <FileText size={15} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-[var(--ink)] truncate">carte-visite-v2.pdf</div>
          <div className="text-xs text-[var(--text-3)]">2.4 Mo</div>
        </div>
        <Check className="text-[var(--teal)]" size={18} />
      </div>

      <div className="bg-gradient-to-br from-[var(--ink)] to-[var(--ink-3)] rounded-xl p-5 text-white flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <Search size={22} />
        </div>
        <div className="flex-1">
          <div className="font-['Syne'] text-[15px] font-semibold mb-1">{t("orderTracking.reviewTitle")}</div>
          <div className="text-xs text-white/60 leading-relaxed">{t("orderTracking.reviewDesc")}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-['Syne'] text-xl font-bold text-[var(--gold-light)]">~4h</div>
          <div className="text-[11px] text-white/50">{t("orderTracking.reviewEta")}</div>
        </div>
      </div>

      <h4 className="font-['Syne'] text-[15px] font-semibold text-[var(--ink)] mb-2.5">{t("orderTracking.reviewChecks")}</h4>
      <div className="flex flex-col gap-1.5">
        {checks.map((c) => (
          <div key={c.key} className="flex items-center gap-2.5 p-2.5 bg-[var(--paper)] border border-gray-100 rounded-lg text-[13px]">
            <span className={`w-5.5 h-5.5 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
              c.status === "ok" ? "bg-[var(--teal-light)] text-[var(--teal)]" : "bg-[var(--paper-3)] text-[var(--text-3)]"
            }`}>
              {c.status === "ok" ? "✓" : "—"}
            </span>
            <span className="flex-1 text-[var(--ink)]">{t(`orderTracking.${c.key}`)}</span>
            <span className="text-[11px] text-[var(--text-3)]">
              {c.status === "ok" ? t("orderTracking.inProgress") : t("orderTracking.waiting")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PANEL 2: BAT ── */
function PanelBat({ t, onValidate }) {
  return (
    <div>
      <h3 className="font-['Syne'] text-[15px] font-semibold text-[var(--ink)] mb-1">{t("orderTracking.batReady")}</h3>
      <p className="text-[13px] text-[var(--text-2)] leading-relaxed mb-4">{t("orderTracking.batDesc")}</p>

      <div className="border-[1.5px] border-[var(--gold)] rounded-2xl overflow-hidden mb-4">
        <div className="bg-[var(--paper-2)] p-5 relative flex items-center justify-center min-h-[160px] border-b border-gray-100">
          {/* Crop marks */}
          <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-gray-400" />
          <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-gray-400" />
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-gray-400" />
          <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-gray-400" />
          {/* Sheet */}
          <div className="bg-white border border-gray-200 rounded-md w-[200px] h-[130px] flex flex-col overflow-hidden shadow-lg">
            <div className="bg-[var(--ink)] h-7 flex items-center px-2.5 gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
              <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
              <span className="w-2 h-2 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 p-2 grid grid-cols-2 gap-1">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-[var(--ink)] rounded-sm flex items-center justify-center text-[7px] text-white/60">
                  Dr. Rebai
                </div>
              ))}
            </div>
          </div>
          <span className="absolute top-3 right-3 bg-[var(--gold)] text-white font-['Syne'] text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">
            BAT v2
          </span>
        </div>
        <div className="p-3.5 flex items-center gap-3">
          <div className="flex-1">
            <div className="font-['Syne'] text-[13px] font-semibold text-[var(--ink)]">
              Planche imposee — 4 cartes / A4
            </div>
            <div className="text-xs text-[var(--text-3)] mt-0.5">RGB → CMJN, fond perdu ajoute</div>
          </div>
          <button className="px-4 py-2.5 border border-gray-200 rounded-lg text-[13px] font-medium text-[var(--text-2)] hover:bg-[var(--paper)] transition-colors flex items-center gap-1.5">
            {t("orderTracking.batViewPdf")} <ExternalLink size={12} />
          </button>
          <button
            onClick={onValidate}
            className="px-4 py-2.5 bg-[var(--teal)] text-white rounded-lg font-['Syne'] text-[13px] font-semibold hover:bg-[#0A6049] transition-colors flex items-center gap-1.5"
          >
            <Check size={14} /> {t("orderTracking.batValidate")}
          </button>
        </div>
      </div>

      <div className="flex gap-2.5 items-start bg-[var(--gold-bg)] border border-[var(--gold)]/20 rounded-lg p-3 text-xs text-amber-800 leading-relaxed mb-4">
        <span>⚠️</span>
        <span>{t("orderTracking.batWarning")}</span>
      </div>

      <div className="h-px bg-gray-100 my-4" />
      <h4 className="font-['Syne'] text-[15px] font-semibold text-[var(--ink)] mb-2.5">{t("orderTracking.batExchanges")}</h4>
      <div className="flex flex-col gap-2.5">
        <div>
          <div className="max-w-[75%] p-3 bg-[var(--paper-2)] text-[var(--ink)] rounded-xl rounded-bl-sm text-[13px] leading-relaxed">
            Conversion CMJN effectuee, fond perdu ajoute.
          </div>
          <div className="text-[10px] text-[var(--text-3)] mt-1">Graphiste PrintFlow · 14 mars, 14h30</div>
        </div>
        <div className="self-end">
          <div className="max-w-[75%] p-3 bg-[var(--ink)] text-white rounded-xl rounded-br-sm text-[13px] leading-relaxed">
            Les couleurs sont bien. Je valide.
          </div>
          <div className="text-[10px] text-white/40 mt-1 text-right">Vous · 14 mars, 15h12</div>
        </div>
      </div>
    </div>
  );
}

/* ── PANEL 3: Production ── */
function PanelProduction({ t }) {
  const prodSteps = [
    { key: "prodImposition", status: "done" },
    { key: "prodCtp", status: "done" },
    { key: "prodPrinting", status: "active" },
    { key: "prodFinishing", status: "pending" },
    { key: "prodQc", status: "pending" },
  ];
  return (
    <div>
      <h3 className="font-['Syne'] text-[15px] font-semibold text-[var(--ob-tx)] mb-1">{t("orderTracking.prodTitle")}</h3>
      <p className="text-[13px] text-[var(--ob-txm)] leading-relaxed mb-4">{t("orderTracking.prodDesc")}</p>

      <div className="bg-[var(--ob-surf2)] border border-[var(--ob-brd)] rounded-xl p-5 mb-4">
        {/* Sub-stepper title */}
        <div className="text-[13px] font-medium text-[var(--ob-txm)] mb-4 flex items-center gap-2">
          <Printer size={15} /> {t("lang") === "fr" ? "Avancement production" : "Production progress"}
        </div>

        {/* Dot sub-stepper */}
        <div className="flex items-center px-2.5">
          {prodSteps.map((s, i) => (
            <div key={s.key} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-3 h-3 rounded-full flex-shrink-0 transition-all duration-[400ms] ${
                  s.status === "done"
                    ? "bg-[var(--step-done)]"
                    : s.status === "active"
                    ? "bg-[var(--step-active)] shadow-[0_0_0_4px_var(--step-active-bg)]"
                    : "bg-[var(--step-pending-bg)] border-[1.5px] border-[var(--step-pending)]"
                }`}
              />
              {i < prodSteps.length - 1 && (
                <div
                  className={`flex-1 h-[2px] rounded-[1px] mx-1 ${
                    s.status === "done"
                      ? "bg-[var(--step-done-line)]"
                      : s.status === "active"
                      ? "bg-gradient-to-r from-[var(--step-active-line)] to-[var(--step-pending-bg)]"
                      : "bg-[var(--step-pending-bg)]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2.5 px-1">
          {prodSteps.map((s) => (
            <div
              key={s.key}
              className={`text-[11px] text-center flex-1 last:flex-none last:min-w-[52px] ${
                s.status === "done"
                  ? "text-[var(--step-done)]"
                  : s.status === "active"
                  ? "text-[var(--step-active)] font-medium"
                  : "text-[var(--ob-txd)]"
              }`}
            >
              {t(`orderTracking.${s.key}`)}
            </div>
          ))}
        </div>

        {/* Delivery bar */}
        <div className="flex items-center justify-between mt-6 p-3 px-4 rounded-lg bg-[var(--step-active-bg)] flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-[12px] text-[var(--step-active)]">
            <Truck size={15} /> {t("orderTracking.prodEta")}
          </div>
          <div className="text-[15px] font-medium text-[var(--step-active)] font-['Fraunces']">
            Mardi 19 mars 2026
          </div>
        </div>

        {/* Notification */}
        <div className="flex items-center gap-2.5 mt-3 p-3 px-4 rounded-lg border border-[var(--ob-brd)] bg-[var(--ob-surf)] text-[12px] text-[var(--ob-txm)] leading-relaxed">
          <Bell size={16} className="text-[var(--ob-txd)] flex-shrink-0" />
          <span>{t("orderTracking.prodNotify")}</span>
        </div>
      </div>
    </div>
  );
}

/* ── PANEL 4: Shipping ── */
function PanelShipping({ t }) {
  const trackSteps = [
    { key: "shipPickup", sub: "Alger — Centre de tri", time: "16 mars · 18h40", status: "done" },
    { key: "shipTransit", sub: "En cours de livraison", time: t("orderTracking.shipNow"), status: "active" },
    { key: "shipDelivery", sub: "Adresse de livraison", time: "Mardi 19 mars", status: "pending" },
  ];
  return (
    <div>
      <h3 className="font-['Syne'] text-[15px] font-semibold text-[var(--ink)] mb-1">{t("orderTracking.shipTitle")}</h3>
      <p className="text-[13px] text-[var(--text-2)] leading-relaxed mb-4">{t("orderTracking.shipDesc")}</p>

      <div className="bg-[var(--ink)] rounded-2xl p-5 text-white mb-3.5">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-white/10 rounded-lg px-3 py-1 font-['Syne'] text-[13px] font-bold tracking-wide">FEDEX</span>
          <span className="text-xs text-white/50 font-mono">7489 3214 8900 2</span>
        </div>
        <div className="flex flex-col">
          {trackSteps.map((s, i) => (
            <div key={s.key} className="flex gap-3.5 items-start py-2.5">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ${
                  s.status === "done" ? "bg-[var(--gold-light)]" : s.status === "active" ? "bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.2)]" : "bg-white/20"
                }`} />
                {i < trackSteps.length - 1 && <div className="w-px flex-1 bg-white/10 min-h-[16px] mt-1" />}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium mb-0.5">{t(`orderTracking.${s.key}`)}</div>
                <div className="text-[11px] text-white/50">{s.sub}</div>
              </div>
              <div className="text-[11px] text-white/40 pt-0.5 flex-shrink-0">{s.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── PANEL 5: Invoice ── */
function PanelInvoice({ t }) {
  const [selectedPayment, setSelectedPayment] = useState("bank");
  const lines = [
    { label: "Cartes de visite 85x55mm — 500 ex.", val: "4 800 DA" },
    { label: "Finition pelliculage mat recto", val: "1 200 DA" },
    { label: "Frais de livraison FedEx", val: "650 DA" },
    { label: "Prepresse & mise en page", val: "800 DA" },
  ];
  const payments = [
    { id: "bank", icon: "🏦", label: t("orderTracking.payBank"), sub: t("orderTracking.payBankSub") },
    { id: "cash", icon: "💵", label: t("orderTracking.payCash"), sub: t("orderTracking.payCashSub") },
    { id: "mobile", icon: "📱", label: t("orderTracking.payMobile"), sub: t("orderTracking.payMobileSub") },
  ];
  return (
    <div>
      <h3 className="font-['Syne'] text-[15px] font-semibold text-[var(--ink)] mb-1">{t("orderTracking.invoiceTitle")}</h3>
      <p className="text-[13px] text-[var(--text-2)] leading-relaxed mb-4">{t("orderTracking.invoiceDesc")}</p>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-3.5">
        <div className="bg-[var(--paper)] px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="font-['Syne'] text-[13px] font-semibold text-[var(--ink)]">{t("orderTracking.invoiceRef")} #FAC-2026-0047</span>
          <span className="text-xs text-[var(--text-3)]">{t("orderTracking.invoiceDate")} 19 mars 2026</span>
        </div>
        <div className="p-4">
          {lines.map((l, i) => (
            <div key={i} className={`flex justify-between py-1.5 text-[13px] ${i < lines.length - 1 ? "border-b border-gray-50" : ""}`}>
              <span className="text-[var(--text-2)]">{l.label}</span>
              <span className="font-medium text-[var(--ink)]">{l.val}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between px-4 py-3 bg-[var(--ink)]">
          <span className="font-['Syne'] text-sm font-semibold text-white/70">{t("orderTracking.invoiceTotal")}</span>
          <span className="font-['Syne'] text-lg font-bold text-white">7 450 DA</span>
        </div>
      </div>

      <div className="flex gap-2.5">
        {payments.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPayment(p.id)}
            className={`flex-1 p-3 border-[1.5px] rounded-xl text-center transition-all cursor-pointer ${
              selectedPayment === p.id ? "border-[var(--teal)] bg-[var(--teal-light)]" : "border-gray-100 hover:border-[var(--gold)]"
            }`}
          >
            <div className="text-xl mb-1">{p.icon}</div>
            <div className="text-xs font-medium text-[var(--ink)]">{p.label}</div>
            <div className="text-[11px] text-[var(--text-3)] mt-0.5">{p.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── PANEL 6: Finished ── */
function PanelFinished({ t }) {
  return (
    <div>
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-[var(--teal-light)] rounded-full mx-auto mb-4 flex items-center justify-center">
          <CheckCircle2 className="text-[var(--teal)]" size={28} />
        </div>
        <h3 className="font-['Syne'] text-xl font-bold text-[var(--ink)] mb-2">{t("orderTracking.finishedTitle")}</h3>
        <p className="text-sm text-[var(--text-2)] max-w-xs mx-auto leading-relaxed">{t("orderTracking.finishedDesc")}</p>
        <button className="mt-5 bg-[var(--ink)] text-white px-6 py-3 rounded-xl font-['Syne'] text-sm font-semibold hover:bg-[var(--ink-3)] transition-colors inline-flex items-center gap-2">
          {t("orderTracking.finishedReorder")} <ArrowRight size={14} />
        </button>
      </div>
      <div className="h-px bg-gray-100 my-4" />
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-[var(--paper)] rounded-lg py-2.5 px-3.5 text-center">
          <div className="text-[11px] text-[var(--text-3)] mb-0.5">{t("orderTracking.finishedDuration")}</div>
          <div className="text-sm font-medium text-[var(--teal)]">5 jours</div>
        </div>
        <div className="bg-[var(--paper)] rounded-lg py-2.5 px-3.5 text-center">
          <div className="text-[11px] text-[var(--text-3)] mb-0.5">{t("orderTracking.finishedRoundtrips")}</div>
          <div className="text-sm font-medium text-[var(--ink)]">1</div>
        </div>
        <div className="bg-[var(--paper)] rounded-lg py-2.5 px-3.5 text-center">
          <div className="text-[11px] text-[var(--text-3)] mb-0.5">{t("orderTracking.finishedPaid")}</div>
          <div className="text-sm font-medium text-[var(--ink)]">7 450 DA</div>
        </div>
      </div>
    </div>
  );
}

const PANELS = [PanelUpload, PanelReview, PanelBat, PanelProduction, PanelShipping, PanelInvoice, PanelFinished];

/* ══════════════════ MAIN PAGE ══════════════════ */
export default function ClientOrderDetails({ order }) {
  const { t } = useLanguage();
  const steps = STEPS(t);

  // Derive current step from order status (default to 3 for demo)
  const statusToStep = {
    PENDING: 0,
    ACCEPTED: 1,
    REVIEW: 1,
    BAT: 2,
    PROCESSING: 3,
    PROCESSED: 3,
    SHIPPED: 4,
    DELIVERED: 5,
    PAID: 5,
    FINISHED: 6,
  };
  const initialStep = statusToStep[order?.status?.toUpperCase()] ?? 3;
  const [currentStep, setCurrentStep] = useState(initialStep);

  const demoOrder = {
    id: order?.order_number || "#CMD-2026-0047",
    title: order?.items?.[0]?.product_name || "Cartes de visite",
    productName: order?.items?.[0]?.product_name || "Carte de visite",
    quantity: order?.items?.[0]?.quantity ? `${order.items[0].quantity} ex.` : "500 ex.",
    format: order?.items?.[0]?.format || "85x55 mm",
    status: order?.status || "PROCESSING",
  };

  const Panel = PANELS[currentStep];

  return (
    <div className="max-w-[720px]">
      {/* Page header */}
      <motion.div
        className="mb-7 flex items-start justify-between flex-wrap gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <div>
          <div className="text-[13px] text-[var(--ob-txd)] tracking-wide">{demoOrder.id}</div>
          <h1 className="font-['Fraunces'] text-[22px] font-medium text-[var(--ob-tx)] mt-1">{demoOrder.title}</h1>
        </div>
        <StatusPill step={currentStep} label={steps[currentStep]?.label} />
      </motion.div>

      {/* Main stepper */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mb-8"
      >
        <Stepper current={currentStep} steps={steps} />
      </motion.div>

      {/* Detail card */}
      <motion.div
        className="bg-[var(--card)] border border-[var(--ob-brd)] rounded-xl p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {/* Info grid */}
        <InfoGrid order={demoOrder} t={t} />

        {/* Panel content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Panel t={t} onValidate={() => setCurrentStep(3)} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Step nav bar (below card) */}
      <div className="flex gap-1 flex-wrap bg-[var(--ob-surf2)] rounded-xl p-1 mt-5">
        {steps.map((step, i) => (
          <button
            key={step.key}
            onClick={() => setCurrentStep(i)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
              i === currentStep
                ? "bg-[var(--step-active)] text-white"
                : "text-[var(--ob-txd)] hover:bg-[var(--ob-surf3)] hover:text-[var(--ob-tx)]"
            }`}
          >
            {i + 1}. {step.label}
          </button>
        ))}
      </div>

      {/* Other orders */}
      <div className="mt-8">
        <h3 className="font-['Syne'] text-[13px] font-semibold text-[var(--ob-tx)] mb-3.5">{t("orders.otherOrders")}</h3>
        {[
          { icon: "🖨", name: "Flyers A5 – Lab Perfect", meta: "#CMD-2026-0046 · 1000 ex.", status: 1 },
          { icon: "🗂", name: "Plaquette A3 – Saba Phone", meta: "#CMD-2026-0044 · 200 ex.", status: 5 },
        ].map((o, i) => (
          <div key={i} className="flex items-center gap-2.5 p-3 px-4 rounded-xl border border-[var(--ob-brd)] bg-[var(--ob-surf)] mb-2 cursor-pointer hover:border-[var(--ob-brd2)] hover:shadow-sm transition-all">
            <div className="w-9 h-9 bg-[var(--ob-surf2)] rounded-lg flex items-center justify-center text-base flex-shrink-0">
              {o.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-[var(--ob-tx)] truncate">{o.name}</div>
              <div className="text-[11px] text-[var(--ob-txd)]">{o.meta}</div>
            </div>
            <StatusPill step={o.status} label={steps[o.status]?.label} />
          </div>
        ))}
      </div>
    </div>
  );
}
