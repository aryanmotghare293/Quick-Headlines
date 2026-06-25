import {
  Activity,
  BriefcaseBusiness,
  Clapperboard,
  Cpu,
  FlaskConical,
  Trophy,
} from "lucide-react";

export const CATEGORIES = [
  { id: "technology", label: "Technology", icon: Cpu },
  { id: "business", label: "Business", icon: BriefcaseBusiness },
  { id: "sports", label: "Sports", icon: Trophy },
  { id: "health", label: "Health", icon: Activity },
  { id: "entertainment", label: "Entertainment", icon: Clapperboard },
  { id: "science", label: "Science", icon: FlaskConical },
];

export const categoryLabel = (category) =>
  CATEGORIES.find((item) => item.id === category)?.label || "Latest";
