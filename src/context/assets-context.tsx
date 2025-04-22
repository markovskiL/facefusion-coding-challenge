import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { Asset } from "@/types/asset";
import { toast } from "sonner";

interface AssetMap {
  source: Asset[];
  target: Asset[];
}

interface AssetContextType {
  assetsMap: AssetMap;
  setAssetsMap: React.Dispatch<React.SetStateAction<AssetMap>>;
}

const LOCAL_STORAGE_KEY = "assetLibraryState";

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider = ({ children }: { children: ReactNode }) => {
  const [assetsMap, setAssetsMap] = useState<AssetMap>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (error) {
      console.error("Failed to load asset state:", error);
    }
    return { source: [], target: [] };
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(assetsMap));
    } catch (err: unknown) {
      if (
        err instanceof DOMException &&
        (err.name === "QuotaExceededError" || err.code === 22)
      ) {
        toast.warning("Local storage is full. Some changes may not persist.");
      } else {
        toast.error("Failed to save asset state: " + err);
        console.error("Failed to save asset state:", err);
      }
    }
  }, [assetsMap]);

  return (
    <AssetContext.Provider value={{ assetsMap, setAssetsMap }}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAssetContext = () => {
  const context = useContext(AssetContext);
  if (!context)
    throw new Error("useAssetContext must be used within an AssetProvider");
  return context;
};
