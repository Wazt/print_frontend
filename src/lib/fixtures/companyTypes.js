/**
 * Company types and their allowed profile roles.
 * Matches the v1 plan §3.3.
 * This is frontend-only for now (prototype). When backend ships, move to shared enum source.
 */

export const COMPANY_TYPES = [
  { value: "IMPRIMERIE", labelFr: "Imprimerie", labelEn: "Print shop" },
  { value: "AGENCE_COMMUNICATION", labelFr: "Agence de communication", labelEn: "Communication agency" },
  { value: "FREELANCE", labelFr: "Freelance / Studio independant", labelEn: "Freelance / Independent studio" },
  { value: "CORPORATE", labelFr: "Entreprise (client final)", labelEn: "Corporate (end client)" },
  { value: "EDUCATION", labelFr: "Education / Institutionnel", labelEn: "Education / Institutional" },
  { value: "AUTRE", labelFr: "Autre", labelEn: "Other" },
];

export const PROFILE_ROLES = [
  // Leadership tier
  { value: "GERANT", labelFr: "Gerant", labelEn: "Manager", tier: "LEADERSHIP" },
  { value: "DIRECTEUR", labelFr: "Directeur", labelEn: "Director", tier: "LEADERSHIP" },
  { value: "DIRECTEUR_ARTISTIQUE", labelFr: "Directeur artistique", labelEn: "Art director", tier: "LEADERSHIP" },

  // Production tier
  { value: "INFOGRAPHE", labelFr: "Infographe", labelEn: "Graphic designer", tier: "PRODUCTION" },
  { value: "OPERATEUR_PRESSE", labelFr: "Operateur presse", labelEn: "Press operator", tier: "PRODUCTION" },
  { value: "PRE_PRESSE", labelFr: "Pre-presse", labelEn: "Pre-press", tier: "PRODUCTION" },
  { value: "RESPONSABLE_ATELIER", labelFr: "Responsable atelier", labelEn: "Workshop lead", tier: "PRODUCTION" },
  { value: "LIVRAISON", labelFr: "Livraison", labelEn: "Delivery", tier: "PRODUCTION" },

  // Commercial tier
  { value: "COMMERCIAL", labelFr: "Commercial", labelEn: "Sales", tier: "COMMERCIAL" },
  { value: "ACCOUNT_MANAGER", labelFr: "Account manager", labelEn: "Account manager", tier: "COMMERCIAL" },
  { value: "CHEF_DE_PROJET", labelFr: "Chef de projet", labelEn: "Project manager", tier: "COMMERCIAL" },
  { value: "RESPONSABLE_ACHATS", labelFr: "Responsable achats", labelEn: "Purchasing lead", tier: "COMMERCIAL" },
  { value: "DIRECTION_COMMUNICATION", labelFr: "Direction communication", labelEn: "Communication director", tier: "COMMERCIAL" },

  // Freelance
  { value: "FREELANCE_INFOGRAPHE", labelFr: "Freelance infographe", labelEn: "Freelance designer", tier: "PRODUCTION" },
  { value: "FREELANCE_COPYWRITER", labelFr: "Freelance copywriter", labelEn: "Freelance copywriter", tier: "PRODUCTION" },

  // Fallback
  { value: "AUTRE", labelFr: "Autre", labelEn: "Other", tier: "SUPPORT" },
];

export const ROLE_TIERS = [
  { value: "LEADERSHIP", labelFr: "Direction", labelEn: "Leadership" },
  { value: "PRODUCTION", labelFr: "Production", labelEn: "Production" },
  { value: "COMMERCIAL", labelFr: "Commercial", labelEn: "Commercial" },
  { value: "SUPPORT", labelFr: "Support", labelEn: "Support" },
];

export function getRoleLabel(value, isFr) {
  const r = PROFILE_ROLES.find((r) => r.value === value);
  if (!r) return value;
  return isFr ? r.labelFr : r.labelEn;
}

export function getRoleTier(value) {
  const r = PROFILE_ROLES.find((r) => r.value === value);
  return r?.tier || "SUPPORT";
}

export function getCompanyTypeLabel(value, isFr) {
  const t = COMPANY_TYPES.find((t) => t.value === value);
  if (!t) return value;
  return isFr ? t.labelFr : t.labelEn;
}
