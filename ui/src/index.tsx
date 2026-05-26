import type { Dispose } from "@tokimo/sdk";
import { defineApp } from "@tokimo/sdk";
import { ConfigProvider, enUS as uiEnUS, zhCN as uiZhCN } from "@tokimo/ui";
import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import CalculatorPage from "./pages";
import "./index.css";

export default defineApp({
  id: "calculator",
  manifest: {
    id: "calculator",
    appName: "Calculator",
    icon: "Calculator",
    color: "#6e6e73",
    windowType: "calculator",
    defaultSize: { width: 400, height: 600 },
    category: "app",
  },
  mount(container, ctx): Dispose {
    const locale = ctx.locale.startsWith("zh") ? uiZhCN : uiEnUS;
    const root: Root = createRoot(container);

    root.render(
      <StrictMode>
        <ConfigProvider locale={locale}>
          <CalculatorPage />
        </ConfigProvider>
      </StrictMode>,
    );
    return () => root.unmount();
  },
});
