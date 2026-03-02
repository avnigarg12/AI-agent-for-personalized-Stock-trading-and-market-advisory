import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { AIAdvisor } from "./components/AIAdvisor";
import { Portfolio } from "./components/Portfolio";
import { MarketAnalysis } from "./components/MarketAnalysis";
import { Settings } from "./components/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "advisor", Component: AIAdvisor },
      { path: "portfolio", Component: Portfolio },
      { path: "market", Component: MarketAnalysis },
      { path: "settings", Component: Settings },
    ],
  },
]);
