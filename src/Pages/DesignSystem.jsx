import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package, Plus, Trash2, Download, Search, Check, X, ArrowLeft, ArrowRight,
  DollarSign, ShoppingCart, Inbox, Users, Clock, CheckCircle, AlertTriangle,
  TrendingUp, Home as HomeIcon, Printer, FileText,
} from "lucide-react";
import {
  Button, DataCard, DataTable, PageHeader, StatCard, StatusPill, EmptyState,
  FormField, Input, Textarea, Select, Toolbar, FilterChip, SectionTitle,
} from "@/Components/primitives";
import ThemeSwitcher from "@/Components/ThemeSwitcher";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

// ─── Token reference data ──────────────────────────────────────────────
const COLOR_TOKENS = [
  { group: "Surfaces", tokens: [
    { name: "--bg", light: "#F8FAFC", usage: "Page background" },
    { name: "--surface", light: "#FFFFFF", usage: "Cards, modals" },
    { name: "--surface-2", light: "#F1F5F9", usage: "Table headers, hover" },
    { name: "--surface-3", light: "#E2E8F0", usage: "Elevated borders" },
    { name: "--border", light: "#E2E8F0", usage: "Dividers, card borders" },
    { name: "--border-2", light: "#CBD5E1", usage: "Hover borders" },
  ]},
  { group: "Text", tokens: [
    { name: "--text", light: "#020617", usage: "Primary text" },
    { name: "--text-2", light: "#334155", usage: "Secondary text" },
    { name: "--text-3", light: "#64748B", usage: "Muted text" },
    { name: "--text-4", light: "#94A3B8", usage: "Hint / placeholder" },
  ]},
  { group: "Brand", tokens: [
    { name: "--brand", light: "#0F172A", usage: "Authority Navy — primary" },
    { name: "--brand-2", light: "#1E293B", usage: "Brand hover" },
    { name: "--brand-fg", light: "#FFFFFF", usage: "Text on brand" },
  ]},
  { group: "Accent", tokens: [
    { name: "--accent", light: "#0369A1", usage: "Trust Blue — CTAs, links" },
    { name: "--accent-2", light: "#0284C7", usage: "Accent hover" },
    { name: "--accent-bg", light: "#E0F2FE", usage: "Accent backgrounds" },
  ]},
  { group: "Status", tokens: [
    { name: "--success", light: "#16A34A", usage: "Success states" },
    { name: "--success-bg", light: "#DCFCE7", usage: "Success bg" },
    { name: "--warning", light: "#A16207", usage: "Warning — WCAG AA verified" },
    { name: "--warning-bg", light: "#FEF3C7", usage: "Warning bg" },
    { name: "--danger", light: "#DC2626", usage: "Errors, destructive" },
    { name: "--danger-bg", light: "#FEE2E2", usage: "Danger bg" },
    { name: "--info", light: "#0284C7", usage: "Informational" },
    { name: "--info-bg", light: "#E0F2FE", usage: "Info bg" },
  ]},
];

const TYPE_SCALE = [
  { size: "12px", className: "text-xs", usage: "Labels, captions, table headers" },
  { size: "14px", className: "text-sm", usage: "Body small, secondary text" },
  { size: "15px", className: "text-base", usage: "Body text" },
  { size: "17px", className: "text-lg", usage: "Emphasized body" },
  { size: "20px", className: "text-xl", usage: "Section titles" },
  { size: "24px", className: "text-2xl", usage: "Page titles (h1)" },
  { size: "30px", className: "text-3xl", usage: "Hero / KPI values" },
];

const RADIUS_TOKENS = [
  { name: "--radius-sm", value: "6px" },
  { name: "--radius", value: "8px" },
  { name: "--radius-lg", value: "12px" },
  { name: "--radius-xl", value: "16px" },
  { name: "--radius-pill", value: "999px" },
];

const SHADOW_TOKENS = [
  { name: "--shadow-card", label: "Card (default)" },
  { name: "--shadow-lift", label: "Lift (hover)" },
  { name: "--shadow-modal", label: "Modal" },
];

// ─── Helper components ─────────────────────────────────────────────────
function Section({ id, title, description, children }) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-[var(--text)] tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-[14px] text-[var(--text-3)] mt-1">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function Swatch({ name, value, usage }) {
  return (
    <div className="flex items-center gap-3 rounded-[var(--radius)] border border-[var(--border)] p-3 bg-[var(--surface)]">
      <div
        className="w-10 h-10 rounded-[var(--radius-sm)] border border-[var(--border)] flex-shrink-0"
        style={{ background: `var(${name})` }}
      />
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-mono font-semibold text-[var(--text)] truncate">
          {name}
        </div>
        <div className="text-[11px] text-[var(--text-3)] truncate">{value}</div>
        <div className="text-[11px] text-[var(--text-3)] truncate">{usage}</div>
      </div>
    </div>
  );
}

function Showcase({ label, children, code }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--surface-2)]">
        <div className="text-[11px] uppercase tracking-wider text-[var(--text-3)] font-semibold">
          {label}
        </div>
      </div>
      <div className="p-6">{children}</div>
      {code && (
        <div className="border-t border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
          <pre className="text-[11px] font-mono text-[var(--text-2)] overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────
export default function DesignSystem() {
  const { t } = useLanguage();
  const [filterActive, setFilterActive] = useState("all");
  const [searchDemo, setSearchDemo] = useState("");
  const [formDemo, setFormDemo] = useState({ name: "", notes: "", status: "active" });

  const demoRows = [
    { id: 1, name: "Business cards", qty: 500, status: "PENDING", total: 2500 },
    { id: 2, name: "Flyers A5", qty: 1000, status: "ACCEPTED", total: 4800 },
    { id: 3, name: "Banner 2×1m", qty: 2, status: "PAID", total: 6000 },
  ];

  const toc = [
    { id: "overview", label: "Overview" },
    { id: "tokens-colors", label: "Color tokens" },
    { id: "tokens-type", label: "Typography" },
    { id: "tokens-radius", label: "Radius" },
    { id: "tokens-shadows", label: "Shadows" },
    { id: "p-button", label: "Button" },
    { id: "p-statuspill", label: "StatusPill" },
    { id: "p-statcard", label: "StatCard" },
    { id: "p-datacard", label: "DataCard" },
    { id: "p-pageheader", label: "PageHeader" },
    { id: "p-formfield", label: "FormField" },
    { id: "p-toolbar", label: "Toolbar + FilterChip" },
    { id: "p-datatable", label: "DataTable" },
    { id: "p-emptystate", label: "EmptyState" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Topbar */}
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[1440px] h-[60px] px-6 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[var(--radius)] bg-[var(--brand)] flex items-center justify-center">
              <Printer size={18} className="text-[var(--brand-fg)]" />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-[var(--text)] leading-none">
                PrintFlow Design System
              </div>
              <div className="text-[11px] text-[var(--text-3)] mt-0.5 font-mono">
                v2.0 — Polished Enterprise
              </div>
            </div>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <Button asChild variant="outline" size="md">
              <Link to="/">
                <ArrowLeft size={15} />
                Back to app
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main layout: TOC sidebar + content */}
      <div className="mx-auto max-w-[1440px] px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* TOC */}
        <aside className="lg:w-56 lg:sticky lg:top-[84px] lg:self-start">
          <nav aria-label="Design system table of contents" className="space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-4)] px-3 mb-2">
              Contents
            </div>
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block px-3 py-1.5 text-[13px] text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-[var(--radius-sm)] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-12">
          {/* Overview */}
          <Section
            id="overview"
            title="PrintFlow Design System"
            description="A Polished-Enterprise SaaS design language. Authority Navy + Trust Blue. Inter + JetBrains Mono. WCAG 2.1 AA verified. Inspired by Notion, Stripe, and Linear."
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                label="Primitives"
                value={10}
                hint="Reusable building blocks"
                icon={Package}
                tone="accent"
              />
              <StatCard
                label="Design tokens"
                value={98}
                hint="CSS variables"
                icon={CheckCircle}
                tone="success"
              />
              <StatCard
                label="Tests"
                value={144}
                hint="Unit + integration + a11y"
                icon={TrendingUp}
                tone="success"
              />
            </div>
          </Section>

          {/* Color tokens */}
          <Section
            id="tokens-colors"
            title="Color tokens"
            description="Every color in the UI resolves to one of these CSS variables. Switch to dark mode (top right) to see the inversions."
          >
            {COLOR_TOKENS.map((group) => (
              <div key={group.group} className="space-y-2">
                <h3 className="text-[13px] font-semibold text-[var(--text-2)] uppercase tracking-wider">
                  {group.group}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.tokens.map((tk) => (
                    <Swatch key={tk.name} name={tk.name} value={tk.light} usage={tk.usage} />
                  ))}
                </div>
              </div>
            ))}
          </Section>

          {/* Typography */}
          <Section
            id="tokens-type"
            title="Typography scale"
            description="Single font family (Inter variable) across the app. JetBrains Mono reserved for IDs, codes, and order numbers."
          >
            <DataCard padded>
              <div className="space-y-4">
                {TYPE_SCALE.map((t) => (
                  <div key={t.size} className="flex items-baseline gap-6">
                    <div className="w-16 text-[11px] font-mono text-[var(--text-3)] flex-shrink-0">
                      {t.size}
                    </div>
                    <div className={`${t.className} text-[var(--text)] font-medium flex-1`}>
                      The quick brown fox
                    </div>
                    <div className="text-[11px] text-[var(--text-3)] hidden md:block">
                      {t.usage}
                    </div>
                  </div>
                ))}
              </div>
            </DataCard>
          </Section>

          {/* Radius */}
          <Section
            id="tokens-radius"
            title="Radius"
            description="Five radius tokens. Default is 8px (--radius)."
          >
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {RADIUS_TOKENS.map((r) => (
                <div
                  key={r.name}
                  className="flex flex-col items-center gap-2 p-4 bg-[var(--surface)] border border-[var(--border)]"
                  style={{ borderRadius: `var(${r.name})` }}
                >
                  <div
                    className="w-12 h-12 bg-[var(--accent)]"
                    style={{ borderRadius: `var(${r.name})` }}
                  />
                  <div className="text-[11px] font-mono font-semibold text-[var(--text)]">
                    {r.name}
                  </div>
                  <div className="text-[11px] text-[var(--text-3)]">{r.value}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* Shadows */}
          <Section
            id="tokens-shadows"
            title="Shadows"
            description="Three elevation tiers. Hover states use lift. Modals use modal. Focus rings use --shadow-focus."
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SHADOW_TOKENS.map((s) => (
                <div
                  key={s.name}
                  className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)]"
                  style={{ boxShadow: `var(${s.name})` }}
                >
                  <div className="text-[13px] font-semibold text-[var(--text)]">
                    {s.label}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-3)] mt-1">
                    {s.name}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Button */}
          <Section
            id="p-button"
            title="Button"
            description="5 variants × 4 sizes. Plus loading, disabled, icon-only."
          >
            <Showcase label="Variants" code={`<Button variant="accent">Accent</Button>`}>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </Showcase>

            <Showcase label="Sizes" code={`<Button size="sm">Small</Button>`}>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="accent" size="sm">Small</Button>
                <Button variant="accent" size="md">Medium</Button>
                <Button variant="accent" size="lg">Large</Button>
                <Button variant="outline" size="icon" aria-label="Remove">
                  <Trash2 size={14} />
                </Button>
              </div>
            </Showcase>

            <Showcase label="States" code={`<Button loading>Saving...</Button>`}>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="accent" loading>Saving...</Button>
                <Button variant="accent" disabled>Disabled</Button>
                <Button variant="outline" disabled>Disabled outline</Button>
                <Button variant="primary">
                  <Plus size={15} />
                  With icon
                </Button>
                <Button variant="accent">
                  Continue
                  <ArrowRight size={15} />
                </Button>
              </div>
            </Showcase>
          </Section>

          {/* StatusPill */}
          <Section
            id="p-statuspill"
            title="StatusPill"
            description="Semantic status badge with automatic tone mapping from status strings."
          >
            <Showcase label="Auto-mapped tones" code={`<StatusPill status="PAID" />`}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status="PENDING" />
                <StatusPill status="ACCEPTED" />
                <StatusPill status="PROCESSING" />
                <StatusPill status="DELIVERED" />
                <StatusPill status="PAID" />
                <StatusPill status="FINISHED" />
                <StatusPill status="REJECTED" />
                <StatusPill status="CANCELLED" />
              </div>
            </Showcase>

            <Showcase label="Explicit tones" code={`<StatusPill tone="info" label="Draft" />`}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone="accent" label="Accent" />
                <StatusPill tone="info" label="Info" />
                <StatusPill tone="success" label="Success" />
                <StatusPill tone="warning" label="Warning" />
                <StatusPill tone="danger" label="Danger" />
                <StatusPill tone="neutral" label="Neutral" />
              </div>
            </Showcase>

            <Showcase label="Sizes" code={`<StatusPill status="PAID" size="lg" />`}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status="PAID" size="sm" />
                <StatusPill status="PAID" size="md" />
                <StatusPill status="PAID" size="lg" />
                <StatusPill status="PAID" dot={false} />
              </div>
            </Showcase>
          </Section>

          {/* StatCard */}
          <Section
            id="p-statcard"
            title="StatCard"
            description="KPI card with label, value, hint, delta, icon, and 5 tones."
          >
            <Showcase label="Tones" code={`<StatCard label="..." value={42} tone="accent" />`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Default" value={1234} hint="Neutral KPI" icon={Package} />
                <StatCard label="Accent" value={42} hint="Primary metric" icon={ShoppingCart} tone="accent" />
                <StatCard label="Success" value="98%" hint="Uptime" icon={CheckCircle} tone="success" />
                <StatCard label="Warning" value={7} hint="Need attention" icon={AlertTriangle} tone="warning" />
                <StatCard label="Danger" value={3} hint="Critical" icon={X} tone="danger" />
                <StatCard label="Loading" value="—" loading icon={TrendingUp} />
              </div>
            </Showcase>

            <Showcase label="With delta" code={`<StatCard delta="+12%" deltaPositive />`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard
                  label="Revenue"
                  value="12,450 DZD"
                  delta="+12%"
                  deltaPositive
                  hint="vs last month"
                  icon={DollarSign}
                  tone="success"
                />
                <StatCard
                  label="Refunds"
                  value="320 DZD"
                  delta="-4%"
                  deltaPositive={false}
                  hint="vs last month"
                  icon={TrendingUp}
                  tone="danger"
                />
              </div>
            </Showcase>
          </Section>

          {/* DataCard */}
          <Section
            id="p-datacard"
            title="DataCard"
            description="Generic card wrapper with optional header and body."
          >
            <Showcase label="With header + action" code={`<DataCard title="..." action={...}>body</DataCard>`}>
              <DataCard
                title="Recent orders"
                description="Last 7 days"
                icon={Package}
                action={
                  <Button size="sm" variant="outline">
                    View all
                    <ArrowRight size={13} />
                  </Button>
                }
              >
                <p className="text-[14px] text-[var(--text-2)]">
                  Card body content goes here. Any children are rendered in the padded body area.
                </p>
              </DataCard>
            </Showcase>

            <Showcase label="Unpadded (for tables)" code={`<DataCard padded={false}>`}>
              <DataCard padded={false}>
                <div className="p-5 text-[14px] text-[var(--text-2)]">
                  When you need full-width children (like a DataTable), set <code>padded={false}</code>.
                </div>
              </DataCard>
            </Showcase>
          </Section>

          {/* PageHeader */}
          <Section
            id="p-pageheader"
            title="PageHeader"
            description="First child of every page. Renders an h1 with optional subtitle, icon, breadcrumb, and actions slot."
          >
            <Showcase label="Standard" code={`<PageHeader title="..." subtitle="..." actions={...} />`}>
              <PageHeader
                title="Orders"
                subtitle="Manage print orders end-to-end"
                icon={Package}
                actions={
                  <>
                    <Button variant="outline" size="md">
                      <Download size={15} />
                      Export
                    </Button>
                    <Button variant="accent" size="md">
                      <Plus size={15} />
                      New order
                    </Button>
                  </>
                }
              />
            </Showcase>
          </Section>

          {/* FormField */}
          <Section
            id="p-formfield"
            title="FormField + Input / Textarea / Select"
            description="Label + input wrapper with required asterisk, hint, and error support. Error takes precedence over hint."
          >
            <Showcase label="All field types" code={`<FormField label="Email" required><Input /></FormField>`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  label="Customer name"
                  htmlFor="ds-name"
                  required
                  hint="Displayed on invoices"
                >
                  <Input
                    id="ds-name"
                    placeholder="Acme Corp"
                    value={formDemo.name}
                    onChange={(e) => setFormDemo({ ...formDemo, name: e.target.value })}
                  />
                </FormField>
                <FormField
                  label="Status"
                  htmlFor="ds-status"
                >
                  <Select
                    id="ds-status"
                    value={formDemo.status}
                    onChange={(e) => setFormDemo({ ...formDemo, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </Select>
                </FormField>
                <FormField
                  label="Notes"
                  htmlFor="ds-notes"
                  error="Too long (max 500 characters)"
                  className="md:col-span-2"
                >
                  <Textarea
                    id="ds-notes"
                    rows={3}
                    placeholder="Delivery instructions..."
                    value={formDemo.notes}
                    onChange={(e) => setFormDemo({ ...formDemo, notes: e.target.value })}
                  />
                </FormField>
              </div>
            </Showcase>
          </Section>

          {/* Toolbar + FilterChip */}
          <Section
            id="p-toolbar"
            title="Toolbar + FilterChip"
            description="Search + filter chip toggle row used above DataTables and list views."
          >
            <Showcase label="Live" code={`<Toolbar search={...} onSearchChange={...} />`}>
              <Toolbar
                search={searchDemo}
                onSearchChange={setSearchDemo}
                searchPlaceholder="Search orders..."
                actions={<Button variant="outline">Export</Button>}
              />
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { value: "all", label: "All", count: 42 },
                  { value: "pending", label: "Pending", count: 8 },
                  { value: "paid", label: "Paid", count: 15 },
                  { value: "delivered", label: "Delivered", count: 19 },
                ].map((f) => (
                  <FilterChip
                    key={f.value}
                    active={filterActive === f.value}
                    onClick={() => setFilterActive(f.value)}
                    count={f.count}
                  >
                    {f.label}
                  </FilterChip>
                ))}
              </div>
            </Showcase>
          </Section>

          {/* DataTable */}
          <Section
            id="p-datatable"
            title="DataTable"
            description="Clean table with sticky header, empty state slot, loading skeleton, optional row click."
          >
            <Showcase label="Live table" code={`<DataTable columns={...} rows={...} />`}>
              <DataCard padded={false}>
                <DataTable
                  columns={[
                    { key: "id", header: "#", render: (r) => `#${r.id}` },
                    { key: "name", header: "Product" },
                    { key: "qty", header: "Qty", align: "right" },
                    {
                      key: "status",
                      header: "Status",
                      render: (r) => <StatusPill status={r.status} />,
                    },
                    {
                      key: "total",
                      header: "Total",
                      align: "right",
                      render: (r) => (
                        <span className="font-semibold tabular-nums">
                          {r.total.toLocaleString()} DZD
                        </span>
                      ),
                    },
                  ]}
                  rows={demoRows}
                  empty={<EmptyState icon={Package} title="No data" />}
                />
              </DataCard>
            </Showcase>
          </Section>

          {/* EmptyState */}
          <Section
            id="p-emptystate"
            title="EmptyState"
            description="Used inside empty tables, lists, and cards. Icon + title + description + optional CTA."
          >
            <Showcase label="With CTA" code={`<EmptyState icon={...} title="..." action={...} />`}>
              <DataCard padded={false}>
                <EmptyState
                  icon={Inbox}
                  title="No orders yet"
                  description="Create your first order to see it appear here."
                  action={
                    <Button variant="accent">
                      <Plus size={15} />
                      New order
                    </Button>
                  }
                />
              </DataCard>
            </Showcase>
          </Section>

          {/* Footer */}
          <div className="border-t border-[var(--border)] pt-6 text-[12px] text-[var(--text-3)]">
            PrintFlow Design System · v2.0 · Built with React 19 · Vite 6 · Tailwind CSS 4 ·
            Last updated April 2026 · See{" "}
            <Link to="/" className="text-[var(--accent)] hover:underline">
              CONTRIBUTING.md
            </Link>{" "}
            for guidelines.
          </div>
        </div>
      </div>
    </div>
  );
}
