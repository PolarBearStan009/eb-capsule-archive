import type { ClassificationTier } from "@/lib/documentPods";

const tierStyles: Record<
  ClassificationTier,
  { label: string; note: string; bg: string; text: string; border: string }
> = {
  1: {
    label: "Tier 1",
    note: "Do not read unless cleared",
    bg: "bg-[#ffe1e1]",
    text: "text-[#b1524f]",
    border: "border-[#ffc9c9]",
  },
  2: {
    label: "Tier 2",
    note: "Limited distribution",
    bg: "bg-[#fff1d6]",
    text: "text-[#a67a2e]",
    border: "border-[#ffe3ad]",
  },
  3: {
    label: "Tier 3",
    note: "General distribution",
    bg: "bg-[#e5f7ee]",
    text: "text-[#4a9a76]",
    border: "border-[#c9ecdb]",
  },
};

// Small pill showing how sensitive a document is. Hovering it shows the
// plain-language reminder of what that tier means.
export default function ClassificationBadge({
  tier,
}: {
  tier: ClassificationTier;
}) {
  const style = tierStyles[tier];

  return (
    <span
      title={style.note}
      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${style.bg} ${style.text} ${style.border}`}
    >
      {style.label}
    </span>
  );
}
