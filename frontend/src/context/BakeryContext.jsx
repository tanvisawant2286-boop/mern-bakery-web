import { createContext, useContext, useEffect, useMemo, useState } from "react";
import sampleProducts from "../data/products.json";
import { getHealth, getProducts } from "../services/api.js";

const BakeryContext = createContext(null);

function readCart() {
  try {
    const value = JSON.parse(localStorage.getItem("qualityBakeryCart") || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function BakeryProvider({ children }) {
  const [products, setProducts] = useState(sampleProducts);
  const [databaseReady, setDatabaseReady] = useState(false);
  const [cart, setCart] = useState(readCart);
  const [theme, setTheme] = useState(() => localStorage.getItem("qualityBakeryTheme") || "light");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    document.body.classList.toggle("dark-mode", theme === "dark");
    localStorage.setItem("qualityBakeryTheme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("qualityBakeryCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    let cancelled = false;
    getHealth()
      .then(async health => {
        if (cancelled) return;
        if (health.database !== "connected") return;
        const items = await getProducts();
        if (cancelled) return;
        setProducts(items);
        setDatabaseReady(true);
        setCart(current => current.flatMap(item => {
          const product = items.find(candidate => candidate.id === item.id || candidate.legacyId === Number(item.id));
          return product ? [{ ...product, quantity: item.quantity }] : [];
        }));
      })
      .catch(error => {
        if (!cancelled) console.error("Could not initialize the bakery storefront:", error);
      });
    return () => { cancelled = true; };
  }, []);

  const value = useMemo(() => ({
    products, databaseReady, cart, setCart, theme, setTheme, notice, setNotice
  }), [products, databaseReady, cart, theme, notice]);

  return <BakeryContext.Provider value={value}>{children}</BakeryContext.Provider>;
}

export function useBakery() {
  const context = useContext(BakeryContext);
  if (!context) throw new Error("useBakery must be used inside BakeryProvider.");
  return context;
}
