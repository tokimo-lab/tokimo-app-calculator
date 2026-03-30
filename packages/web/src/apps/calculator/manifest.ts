import { Calculator } from "lucide-react";
import type { AppManifest } from "../_framework/types";

export const manifest: AppManifest = {
  id: "calculator",
  name: "Calculator",
  category: "system",
  defaultSize: { width: 332, height: 520 },
  singleton: true,
  icon: Calculator,
  color: "#6e6e73",
  labelKey: "calculator",
  order: 95,
  component: () => import("./pages"),
};
