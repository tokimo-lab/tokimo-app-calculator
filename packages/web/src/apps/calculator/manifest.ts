import { Calculator } from "lucide-react";
import type { AppManifest } from "../_framework/types";

export const manifest: AppManifest = {
  id: "calculator",
  category: "system",
  defaultSize: { width: 332, height: 520 },
  singleton: true,
  icon: Calculator,
  color: "#6e6e73",
  appName: "dashboard.menu.calculator",
  order: 95,
  component: () => import("./pages"),
};
