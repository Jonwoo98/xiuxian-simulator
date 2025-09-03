import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 在开发环境下屏蔽 React DevTools 横幅提示，并提供统一日志开关
if (import.meta.env.DEV) {
  const DEBUG = import.meta.env.VITE_DEBUG_LOGS === 'true';

  const originalInfo = console.info.bind(console);
  const originalLog = console.log.bind(console);
  const originalWarn = console.warn.bind(console);
  const originalGroup = console.group ? console.group.bind(console) : undefined;
  const originalGroupCollapsed = console.groupCollapsed ? console.groupCollapsed.bind(console) : undefined;
  const originalDebug = console.debug ? console.debug.bind(console) : undefined;

  const shouldSuppressBanner = (...args: unknown[]) => {
    const first = args?.[0];
    const msg = typeof first === 'string' ? first : '';
    return msg.includes('Download the React DevTools')
      || msg.includes('reactjs.org/link/react-devtools')
      || msg.includes('react-devtools');
  };

  console.info = (...args: unknown[]) => {
    if (shouldSuppressBanner(...args)) return;
    if (DEBUG) originalInfo(...args);
  };
  console.log = (...args: unknown[]) => {
    if (shouldSuppressBanner(...args)) return;
    if (DEBUG) originalLog(...args);
  };
  console.warn = (...args: unknown[]) => {
    if (DEBUG) originalWarn(...args);
  };
  if (originalGroup) {
    (console as any).group = (...args: any[]) => {
      if (DEBUG) (originalGroup as any)(...args);
    };
  }
  if (originalGroupCollapsed) {
    (console as any).groupCollapsed = (...args: any[]) => {
      if (DEBUG) (originalGroupCollapsed as any)(...args);
    };
  }
  if (originalDebug) {
    (console as any).debug = (...args: any[]) => {
      if (DEBUG) (originalDebug as any)(...args);
    };
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
