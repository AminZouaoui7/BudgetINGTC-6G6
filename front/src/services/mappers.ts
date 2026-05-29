import type {
  Alert,
  AlertType,
  Budget,
  BudgetPeriod,
  Category,
  CategoryType,
  Transaction,
  User,
} from "../app/types";

const CATEGORY_META_PREFIX = "__budget_meta__:";
const BUDGET_COLORS = [
  "#3eb3f2",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#6366f1",
];
const CATEGORY_ICONS = [
  "Wallet",
  "Briefcase",
  "TrendingUp",
  "ShoppingCart",
  "Car",
  "Home",
  "Gamepad2",
  "Heart",
  "CreditCard",
];

type CategoryMetadata = {
  note?: string;
  type?: CategoryType;
  color?: string;
  icon?: string;
};

function toNumber(value: unknown, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function hashString(value: string) {
  return value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function pickFromPalette(seed: string, palette: string[]) {
  return palette[hashString(seed) % palette.length];
}

function guessCategoryType(name: string, description?: string): CategoryType {
  const source = `${name} ${description ?? ""}`.toLowerCase();
  const incomeKeywords = [
    "salary",
    "salaire",
    "freelance",
    "revenu",
    "income",
    "invest",
    "prime",
    "bonus",
  ];

  return incomeKeywords.some((keyword) => source.includes(keyword))
    ? "income"
    : "expense";
}

function parseCategoryMetadata(description?: string): CategoryMetadata {
  if (!description?.startsWith(CATEGORY_META_PREFIX)) {
    return { note: description };
  }

  try {
    return JSON.parse(description.slice(CATEGORY_META_PREFIX.length)) as CategoryMetadata;
  } catch {
    return { note: description };
  }
}

export function buildCategoryDescription(metadata: CategoryMetadata) {
  return `${CATEGORY_META_PREFIX}${JSON.stringify(metadata)}`;
}

export function mapUser(raw: any): User {
  return {
    id: toNumber(raw?.id),
    fullName: raw?.fullName ?? raw?.name ?? raw?.email ?? "Utilisateur",
    email: raw?.email ?? "",
    phoneNumber: raw?.phoneNumber ?? "",
    address: raw?.address ?? "",
    role: raw?.role === "admin" ? "admin" : "user",
    isActive: Boolean(raw?.isActive),
    avatar: raw?.avatar,
    createdAt: raw?.createdAt,
    updatedAt: raw?.updatedAt,
  };
}

export function mapCategory(raw: any): Category {
  const metadata = parseCategoryMetadata(raw?.description);
  const name = raw?.name ?? "Categorie";
  const type = raw?.type ?? metadata.type ?? guessCategoryType(name, metadata.note);

  return {
    id: toNumber(raw?.id),
    name,
    description: metadata.note ?? raw?.description ?? "",
    color: raw?.color ?? metadata.color ?? pickFromPalette(name, BUDGET_COLORS),
    icon: raw?.icon ?? metadata.icon ?? pickFromPalette(name, CATEGORY_ICONS),
    type,
    userId: raw?.userId ? toNumber(raw.userId) : undefined,
    createdAt: raw?.createdAt,
    updatedAt: raw?.updatedAt,
  };
}

export function mapTransaction(raw: any, categories: Category[] = []): Transaction {
  const categoryId = raw?.categoryId != null ? toNumber(raw.categoryId) : null
  const category = raw?.category ? mapCategory(raw.category) : categories.find((item) => item.id === categoryId) ?? null

  return {
    id: toNumber(raw?.id),
    date: raw?.date ?? new Date().toISOString().split("T")[0],
    description: raw?.description ?? "",
    amount: Math.abs(toNumber(raw?.amount)),
    type: raw?.type === "income" ? "income" : "expense",
    categoryId,
    category,
    userId: toNumber(raw?.userId),
    budgetId: raw?.budgetId != null ? toNumber(raw.budgetId) : null,
    author: raw?.author ? { id: toNumber(raw.author.id), fullName: raw.author.fullName, email: raw.author.email } : null,
    createdAt: raw?.createdAt,
    updatedAt: raw?.updatedAt,
  }
}

export function mapBudget(
  raw: any,
  transactions: Transaction[] = [],
): Budget {
  const id = toNumber(raw?.id)
  const spent = transactions
    .filter((transaction) => transaction.budgetId === id && transaction.type === "expense")
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0)

  const members = Array.isArray(raw?.participants)
    ? raw.participants.map((member: any) => mapUser(member))
    : []

  return {
    id,
    name: raw?.name ?? "Budget",
    amount: toNumber(raw?.amount),
    spent,
    description: raw?.description ?? "",
    periodType: (raw?.periodType as BudgetPeriod) ?? "monthly",
    isShared: Boolean(raw?.isshared ?? raw?.isShared),
    ownerId: toNumber(raw?.ownerId),
    owner: raw?.owner ? mapUser(raw.owner) : undefined,
    members,
    startDate: raw?.startDate ?? new Date().toISOString().split("T")[0],
    endDate: raw?.endDate ?? new Date().toISOString().split("T")[0],
    color: pickFromPalette(String(id || raw?.name || "budget"), BUDGET_COLORS),
    createdAt: raw?.createdAt,
    updatedAt: raw?.updatedAt,
  }
}

function normalizeAlertType(rawType: string): AlertType {
  if (rawType === "exceeded") {
    return "danger";
  }

  if (rawType === "threshold") {
    return "warning";
  }

  return "info";
}

export function mapComment(raw: any): Comment {
  return {
    id: toNumber(raw?.id),
    content: raw?.content ?? "",
    transactionId: toNumber(raw?.transactionId),
    author: raw?.author
      ? {
          id: toNumber(raw.author.id),
          fullName: raw.author.fullName,
          email: raw.author.email,
        }
      : null,
    createdAt: raw?.createdAt,
    updatedAt: raw?.updatedAt,
  };
}

export function mapAlert(raw: any): Alert {
  return {
    id: toNumber(raw?.id),
    type: normalizeAlertType(raw?.type ?? ""),
    rawType: raw?.type,
    message: raw?.message ?? "",
    budgetId: raw?.budgetId != null ? toNumber(raw.budgetId) : undefined,
    timestamp: raw?.createdAt ?? raw?.updatedAt ?? new Date().toISOString(),
    isRead: Boolean(raw?.isRead),
    createdAt: raw?.createdAt,
    updatedAt: raw?.updatedAt,
  };
}
