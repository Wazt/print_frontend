import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Upload, Search, Printer, Truck, FileText, CheckCircle2, ArrowRight, ExternalLink, ChevronRight } from "lucide-react";

const STEPS = (t) => [
  { key: "upload", label: t("orderTracking.step1"), icon: Upload },
  { key: "review", label: t("orderTracking.step2"), icon: Search },
  { key: "bat", label: t("orderTracking.step3"), icon: FileText },
  { key: "production", label: t("orderTracking.step4"), icon: Printer },
  { key: "shipping", label: t("orderTracking.step5"), icon: Truck },
  { key: "delivery", label: t("orderTracking.step6"), icon: FileText },
  { key: "finished", label: t("orderTracking.step7"), icon: CheckCircle2 },
];

function StatusPill({ step }) {
  const colors = [
    "bg-[var(--gold-bg)] text-[var(--gold)]",
    "bg-indigo-50 text-indigo-700",
    "bg-indigo-50 text-indigo-700",
    "bg-orange-50 text-orange-700",
    "bg-purple-50 text-purple-800",
    "bg-[var(--teal-light)] text-[var(--teal)]",
    "bg-[var(--ink)] text-white",
  ];
  const dots = [
    "bg-[var(--gold)]",
    "bg-indigo-700",
    "bg-indigo-700",
    "bg-orange-700",
    "bg-purple-800",
    "bg-[var(--teal)]",
    "bg-[var(--gold-light)]",
  ];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colors[step]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[step]}`} />
      {STEPS(() => "")[step]?.label || ""}
    </span>
  );
}

function Stepper({ current, steps }) {
  return (
    <div className="flex items-start px-6 pt-6">
      {steps.map((step, i) => (
        <div key={step.key} className="flex-1 flex flex-col items-center relative cursor-pointer">
          {i < steps.length - 1 && (
            <div
              className={`absolute top-3.5 left-1/2 right-[-50%] h-0.5 z-0 transition-colors duration-300 ${
                i < current ? "bg-[var(--teal)]" : i === current ? "bg-gradient-to-r from-[var(--teal)] to-gray-200" : "bg-gray-200"
              }`}
            />
          )}
          <div
            className={`w-7 h-7 rounded-full z-10 flex items-center justify-center text-[11px] font-semibold border-2 transition-all duration-300 ${
              i < current
                ? "bg-[var(--teal)] border-[var(--teal)] text-white"
                : i === current
                ? "bg-[var(--ink)] border-[var(--ink)] text-white shadow-[0_0_0_4px_rgba(13,21,35,0.08)]"
                : "bg-white border-gray-200 text-[var(--text-3)]"
            }`}
          >
            {i < current ? <Check size={12} /> : i + 1}
          </div>
          <span
            className={`mt-2 text-[11px] font-medium text-center leading-tight max-w-[70px] ${
              i < current ? "text-[var(--teal)]" : i === current ? "text-[var(--ink)] font-semibold" : "text-[var(--text-3)]"
            }`}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function InfoGrid({ order, t }) {
  return (
    <div className="grid grid-cols-3 gap-2.5 mb-4">
      <div className="bg-[var(--paper)] rounded-lg py-2.5 px-3.5">
        <div className="text-[11px] text-[var(--text-3)] mb-0.5">{t("orderTracking.product")}</div>
        <div className="text-sm font-medium text-[var(--ink)]">{order.productName}</div>
      </div>
      <div className="bg-[var(--paper)] rounded-lg py-2.5 px-3.5">
        <div className="text-[11px] text-[var(--text-3)] mb-0.5">{t("orderTracking.quantity")}</div>
        <div className="text-sm font-medium text-[var(--ink)]">{order.quantity}</div>
      </div>
      <div className="bg-[var(--paper)] rounded-lg py-2.5 px-3.5">
        <div className="text-[11px] text-[var(--text-3)] mb-0.5">{t("orderTracking.format")}</div>
        <div className="text-sm font-medium text-[var(--ink)]">{order.format}</div>
      </div>
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
      <h3 className="font-['Syne'] text-[15px] font-semibold text-[var(--ink)] mb-1">{t("orderTracking.prodTitle")}</h3>
      <p className="text-[13px] text-[var(--text-2)] leading-relaxed mb-4">{t("orderTracking.prodDesc")}</p>

      <div className="bg-[var(--paper-2)] rounded-xl p-5 mb-3.5">
        <div className="flex mb-3.5">
          {prodSteps.map((s, i) => (
            <div key={s.key} className="flex-1 text-center relative">
              {i < prodSteps.length - 1 && (
                <div className={`absolute top-3 left-1/2 w-full h-0.5 z-0 ${
                  s.status === "done" ? "bg-[var(--teal)]" : s.status === "active" ? "bg-gradient-to-r from-[var(--teal)] to-gray-200" : "bg-gray-200"
                }`} />
              )}
              <div className={`w-6.5 h-6.5 rounded-full mx-auto mb-1.5 relative z-10 flex items-center justify-center text-[10px] border-2 transition-all ${
                s.status === "done"
                  ? "bg-[var(--teal)] border-[var(--teal)] text-white"
                  : s.status === "active"
                  ? "bg-[var(--ink)] border-[var(--ink)] text-white animate-pulse"
                  : "bg-white border-gray-200 text-[var(--text-3)]"
              }`}>
                {s.status === "done" ? <Check size={10} /> : s.status === "active" ? "▶" : i + 1}
              </div>
              <div className={`text-[11px] ${
                s.status === "done" ? "text-[var(--teal)]" : s.status === "active" ? "text-[var(--ink)] font-semibold" : "text-[var(--text-3)]"
              }`}>
                {t(`orderTracking.${s.key}`)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between p-2.5 px-3.5 bg-white border border-gray-100 rounded-lg">
          <span className="text-xs text-[var(--text-3)]">{t("orderTracking.prodEta")}</span>
          <span className="font-['Syne'] text-sm font-semibold text-[var(--ink)]">Mardi 19 mars 2026</span>
        </div>
      </div>

      <div className="flex gap-2.5 items-start bg-[var(--pf-blue-light)] border border-[var(--pf-blue)]/20 rounded-lg p-3 text-xs text-blue-900 leading-relaxed">
        <span>📬</span>
        <span>{t("orderTracking.prodNotify")}</span>
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
    <div className="max-w-[960px]">
      {/* Page header */}
      <div className="mb-7">
        <h1 className="font-['Syne'] text-2xl font-bold text-[var(--ink)] mb-1">{t("orders.myOrders")}</h1>
        <p className="text-sm text-[var(--text-3)]">{t("orders.trackSubtitle")}</p>
      </div>

      {/* Step nav bar */}
      <div className="flex gap-1 flex-wrap bg-[var(--paper)] rounded-xl p-1 mb-5">
        {steps.map((step, i) => (
          <button
            key={step.key}
            onClick={() => setCurrentStep(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              i === currentStep ? "bg-[var(--ink)] text-white" : "text-[var(--text-3)] hover:bg-white/70 hover:text-[var(--ink)]"
            }`}
          >
            {i + 1}. {step.label}
          </button>
        ))}
      </div>

      {/* Order card */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(13,21,35,0.04)] mb-5">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
          <div className="flex-1">
            <div className="font-['Syne'] text-[13px] font-bold text-[var(--text-3)] tracking-wide">{demoOrder.id}</div>
            <div className="font-['Syne'] text-base font-semibold text-[var(--ink)]">{demoOrder.title}</div>
          </div>
          <StatusPill step={currentStep} />
        </div>

        {/* Stepper */}
        <Stepper current={currentStep} steps={steps} />

        {/* Panel content */}
        <div className="px-6 pb-6 mt-6">
          <InfoGrid order={demoOrder} t={t} />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <Panel t={t} onValidate={() => setCurrentStep(3)} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Other orders */}
      <div className="mt-6">
        <h3 className="font-['Syne'] text-[13px] font-semibold text-[var(--ink)] mb-3.5">{t("orders.otherOrders")}</h3>
        {[
          { icon: "🖨", name: "Flyers A5 – Lab Perfect", meta: "#CMD-2026-0046 · 1000 ex.", status: 1 },
          { icon: "🗂", name: "Plaquette A3 – Saba Phone", meta: "#CMD-2026-0044 · 200 ex.", status: 5 },
        ].map((o, i) => (
          <div key={i} className="flex items-center gap-2.5 p-3 px-4 rounded-xl border border-gray-100 bg-white mb-2 cursor-pointer hover:border-gray-200 hover:shadow-sm transition-all">
            <div className="w-9 h-9 bg-[var(--paper-2)] rounded-lg flex items-center justify-center text-base flex-shrink-0">
              {o.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-[var(--ink)] truncate">{o.name}</div>
              <div className="text-[11px] text-[var(--text-3)]">{o.meta}</div>
            </div>
            <StatusPill step={o.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
