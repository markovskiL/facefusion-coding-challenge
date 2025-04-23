import { Toaster } from "sonner";
import { AssetLibrary } from "@/components/asset-library";
import { AssetProvider } from "@/context/assets-context";

function App() {
  return (
    <AssetProvider>
      <div className="h-screen w-screen bg-gray-800 flex items-center justify-center">
        <AssetLibrary />
      </div>
      <Toaster richColors closeButton />
      <div className="absolute bottom-5 right-5 text-md italic font-mono">
        <p>Made by: Leonardo Markovski</p>
      </div>
    </AssetProvider>
  );
}

export default App;
