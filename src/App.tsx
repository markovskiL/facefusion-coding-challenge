import { Toaster } from "sonner";
import { AssetLibrary } from "./components/asset-library";

function App() {
  return (
    <>
      <div className="h-screen w-screen bg-gray-800 flex items-center justify-center">
        <AssetLibrary />
      </div>
      <Toaster richColors />
    </>
  );
}

export default App;
