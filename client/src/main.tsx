import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { GlobalStateProvider } from "./lib/GlobalState";
import { updateComponentStock } from "./lib/componentData";

// Expose component functions globally for server access
// This allows injected scripts to update component inventory
declare global {
  interface Window {
    updateComponentStock: (componentId: string, quantity: number) => boolean;
  }
}

// Make the function globally available
window.updateComponentStock = updateComponentStock;

// Log that the function is available
console.log("Stock management functions initialized globally");

// Wrap the App with GlobalStateProvider to enable shared state and automatic refreshes
createRoot(document.getElementById("root")!).render(
  <GlobalStateProvider>
    <App />
  </GlobalStateProvider>
);
