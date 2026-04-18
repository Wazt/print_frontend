/**
 * Mock contact + company + membership fixtures for the prototype.
 * Keeps everything in-memory — no backend calls.
 *
 * When the real backend ships, delete this file and replace the imports
 * with service calls to /contacts, /memberships, etc.
 */

export const MOCK_COMPANIES = [
  {
    id: "c-001",
    name: "Agence Pixel Alger",
    type: "AGENCE_COMMUNICATION",
    email: "contact@agence-pixel.dz",
    phone: "+213 21 50 11 22",
    address: "Hydra, Alger",
  },
  {
    id: "c-002",
    name: "Studio Alpha",
    type: "AGENCE_COMMUNICATION",
    email: "hello@studioalpha.dz",
    phone: "+213 21 66 77 88",
    address: "Bab Ezzouar, Alger",
  },
  {
    id: "c-003",
    name: "Imprimerie Saba",
    type: "IMPRIMERIE",
    email: "contact@saba-print.dz",
    phone: "+213 21 44 55 66",
    address: "Rouiba, Alger",
  },
  {
    id: "c-004",
    name: "Phoenix Print",
    type: "IMPRIMERIE",
    email: "info@phoenix.dz",
    phone: "+213 21 88 99 00",
    address: "Oran",
  },
  {
    id: "c-005",
    name: "Freelance",
    type: "FREELANCE",
    email: null,
    phone: null,
    address: "N/A",
  },
  {
    id: "c-006",
    name: "Lab Perfect",
    type: "CORPORATE",
    email: "commercial@labperfect.dz",
    phone: "+213 21 12 34 56",
    address: "Constantine",
  },
  {
    id: "c-007",
    name: "Universite d'Alger",
    type: "EDUCATION",
    email: "communication@univ-alger.dz",
    phone: "+213 21 63 00 00",
    address: "Ben Aknoun, Alger",
  },
  {
    id: "c-008",
    name: "Agence Pixel Alger",
    type: "AGENCE_COMMUNICATION",
    email: "info@agence-pixel.dz",
    phone: "+213 555 00 00 11",
    address: "Oran · succursale",
    isDuplicateOf: "c-001",
  },
];

export const MOCK_CONTACTS = [
  {
    id: "p-001",
    full_name: "John Doe",
    email: "john@example.com",
    phone: "+213 555 11 22 33",
    avatar_url: null,
    notes: "Freelance infographe disponible sur plusieurs agences",
    linked_user_id: null,
    created_at: "2025-11-03T10:00:00Z",
  },
  {
    id: "p-002",
    full_name: "Big Joe",
    email: "joe@saba-print.dz",
    phone: "+213 555 22 22 11",
    avatar_url: null,
    notes: null,
    linked_user_id: "u-admin-001",
    created_at: "2025-09-15T10:00:00Z",
  },
  {
    id: "p-003",
    full_name: "Alice Terki",
    email: "alice@freelance.dz",
    phone: "+213 555 33 44 55",
    avatar_url: null,
    notes: "Specialiste packaging + edition",
    linked_user_id: null,
    created_at: "2025-08-21T10:00:00Z",
  },
  {
    id: "p-004",
    full_name: "Mohamed Aissa",
    email: "mohamed@agence-pixel.dz",
    phone: "+213 555 44 55 66",
    avatar_url: null,
    notes: null,
    linked_user_id: null,
    created_at: "2025-07-04T10:00:00Z",
  },
  {
    id: "p-005",
    full_name: "Yacine Benhamou",
    email: "yacine@studioalpha.dz",
    phone: "+213 555 66 77 88",
    avatar_url: null,
    notes: null,
    linked_user_id: null,
    created_at: "2025-06-12T10:00:00Z",
  },
  {
    id: "p-006",
    full_name: "Karim Mansouri",
    email: "karim@agence-pixel.dz",
    phone: "+213 555 77 88 99",
    avatar_url: null,
    notes: null,
    linked_user_id: null,
    created_at: "2025-05-20T10:00:00Z",
  },
  {
    id: "p-007",
    full_name: "Lina Saadi",
    email: "lina@studioalpha.dz",
    phone: "+213 555 88 99 00",
    avatar_url: null,
    notes: null,
    linked_user_id: null,
    created_at: "2025-04-10T10:00:00Z",
  },
  {
    id: "p-008",
    full_name: "Raouf Fares",
    email: "raouf@freelance.dz",
    phone: "+213 555 00 11 22",
    avatar_url: null,
    notes: "Freelance copywriter + DA",
    linked_user_id: null,
    created_at: "2025-03-03T10:00:00Z",
  },
  {
    id: "p-009",
    full_name: "Nadia Salmi",
    email: "nadia@studioalpha.dz",
    phone: "+213 555 11 33 55",
    avatar_url: null,
    notes: null,
    linked_user_id: null,
    created_at: "2025-02-14T10:00:00Z",
  },
  {
    id: "p-010",
    full_name: "Hichem Belkacem",
    email: "hichem@saba-print.dz",
    phone: "+213 555 22 44 66",
    avatar_url: null,
    notes: "Operateur presse GTO",
    linked_user_id: null,
    created_at: "2025-01-20T10:00:00Z",
  },
  {
    id: "p-011",
    full_name: "Samir Dahmani",
    email: "samir@phoenix.dz",
    phone: "+213 555 33 55 77",
    avatar_url: null,
    notes: null,
    linked_user_id: null,
    created_at: "2024-12-01T10:00:00Z",
  },
  {
    id: "p-012",
    full_name: "Fatima Zerrouk",
    email: "fatima@labperfect.dz",
    phone: "+213 555 44 66 88",
    avatar_url: null,
    notes: null,
    linked_user_id: null,
    created_at: "2024-11-11T10:00:00Z",
  },
];

export const MOCK_MEMBERSHIPS = [
  // John Doe — Infographe in 3 places (cross-company)
  { id: "m-001", contact_id: "p-001", company_id: "c-001", profile_role: "INFOGRAPHE", is_primary: true, start_date: "2024-06-01" },
  { id: "m-002", contact_id: "p-001", company_id: "c-002", profile_role: "INFOGRAPHE", is_primary: false, start_date: "2024-09-01" },
  { id: "m-003", contact_id: "p-001", company_id: "c-005", profile_role: "FREELANCE_INFOGRAPHE", is_primary: false, start_date: "2024-01-01" },

  // Big Joe — Gerant at Imprimerie Saba
  { id: "m-004", contact_id: "p-002", company_id: "c-003", profile_role: "GERANT", is_primary: true, start_date: "2020-01-01" },

  // Alice — Freelance infographe
  { id: "m-005", contact_id: "p-003", company_id: "c-005", profile_role: "FREELANCE_INFOGRAPHE", is_primary: true, start_date: "2023-03-01" },
  { id: "m-006", contact_id: "p-003", company_id: "c-001", profile_role: "INFOGRAPHE", is_primary: false, start_date: "2025-02-01" },

  // Mohamed — Directeur Artistique at Agence Pixel
  { id: "m-007", contact_id: "p-004", company_id: "c-001", profile_role: "DIRECTEUR_ARTISTIQUE", is_primary: true, start_date: "2022-09-01" },

  // Yacine — Chef de projet at Studio Alpha
  { id: "m-008", contact_id: "p-005", company_id: "c-002", profile_role: "CHEF_DE_PROJET", is_primary: true, start_date: "2023-06-01" },

  // Karim — Commercial at Agence Pixel
  { id: "m-009", contact_id: "p-006", company_id: "c-001", profile_role: "COMMERCIAL", is_primary: true, start_date: "2022-01-15" },

  // Lina — Account Manager at Studio Alpha
  { id: "m-010", contact_id: "p-007", company_id: "c-002", profile_role: "ACCOUNT_MANAGER", is_primary: true, start_date: "2023-11-01" },

  // Raouf — Freelance copywriter
  { id: "m-011", contact_id: "p-008", company_id: "c-005", profile_role: "FREELANCE_COPYWRITER", is_primary: true, start_date: "2022-05-01" },

  // Nadia — Infographe at Studio Alpha
  { id: "m-012", contact_id: "p-009", company_id: "c-002", profile_role: "INFOGRAPHE", is_primary: true, start_date: "2024-01-10" },

  // Hichem — Operateur presse at Imprimerie Saba
  { id: "m-013", contact_id: "p-010", company_id: "c-003", profile_role: "OPERATEUR_PRESSE", is_primary: true, start_date: "2021-04-01" },

  // Samir — Gerant at Phoenix Print
  { id: "m-014", contact_id: "p-011", company_id: "c-004", profile_role: "GERANT", is_primary: true, start_date: "2019-07-01" },

  // Fatima — Responsable achats at Lab Perfect
  { id: "m-015", contact_id: "p-012", company_id: "c-006", profile_role: "RESPONSABLE_ACHATS", is_primary: true, start_date: "2023-08-01" },
];

export const MOCK_DUPLICATE_ALERTS = [
  {
    id: "d-001",
    existing_company_id: "c-001",
    new_company_id: "c-008",
    created_by_user_id: "u-signup-001",
    created_by_email: "new.user@pixel-oran.dz",
    resolved: false,
    created_at: "2026-04-15T09:22:00Z",
  },
];

// ─────────────────────────────────────────────────────────────
// Helpers — in-memory "queries" that mimic future API shapes
// ─────────────────────────────────────────────────────────────

export function getCompanyById(id) {
  return MOCK_COMPANIES.find((c) => c.id === id) || null;
}

export function getContactById(id) {
  return MOCK_CONTACTS.find((c) => c.id === id) || null;
}

export function getMembershipsForContact(contactId) {
  return MOCK_MEMBERSHIPS.filter((m) => m.contact_id === contactId).map((m) => ({
    ...m,
    company: getCompanyById(m.company_id),
  }));
}

export function getMembershipsForCompany(companyId) {
  return MOCK_MEMBERSHIPS.filter((m) => m.company_id === companyId).map((m) => ({
    ...m,
    contact: getContactById(m.contact_id),
  }));
}

export function getContactsByRole(role) {
  const membershipsByContact = {};
  MOCK_MEMBERSHIPS.filter((m) => m.profile_role === role).forEach((m) => {
    if (!membershipsByContact[m.contact_id]) {
      membershipsByContact[m.contact_id] = [];
    }
    membershipsByContact[m.contact_id].push({ ...m, company: getCompanyById(m.company_id) });
  });
  return Object.entries(membershipsByContact).map(([cid, memberships]) => ({
    contact: getContactById(cid),
    memberships,
  }));
}

export function listAllContacts(filters = {}) {
  const { search, role, companyType } = filters;
  let result = MOCK_CONTACTS.map((c) => ({
    ...c,
    memberships: getMembershipsForContact(c.id),
  }));

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
    );
  }

  if (role && role !== "all") {
    result = result.filter((c) =>
      c.memberships.some((m) => m.profile_role === role)
    );
  }

  if (companyType && companyType !== "all") {
    result = result.filter((c) =>
      c.memberships.some((m) => m.company?.type === companyType)
    );
  }

  return result;
}

export function getInitials(fullName) {
  if (!fullName) return "?";
  return fullName
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function avatarGradient(seed) {
  const colors = [
    ["#0369A1", "#38BDF8"],
    ["#16A34A", "#4ADE80"],
    ["#CA8A04", "#FACC15"],
    ["#DC2626", "#F87171"],
    ["#0F172A", "#334155"],
    ["#7C3AED", "#A78BFA"],
  ];
  let sum = 0;
  for (let i = 0; i < (seed || "x").length; i++) sum += seed.charCodeAt(i);
  const [a, b] = colors[sum % colors.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
}
