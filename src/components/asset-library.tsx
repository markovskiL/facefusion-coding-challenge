import ImageIcon from "@material-symbols/svg-400/outlined/image.svg?react";
import { Button } from "./ui/button";

export const AssetLibrary = () => {
  return (
    <div className="w-xl flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="text-gray-100 fill-amber-50" />
          <h1 className="text-xl font-bold text-white">Assets</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="tertiary">Cancel</Button>
          <Button>Save</Button>
        </div>
      </div>
      <div className="p-4 bg-gray-900 rounded-lg">
        <div className="text-white flex items-center justify-between">
          <h2>Source</h2>
          <select name="filter" id="">
            <option value="all">All</option>
            <option value="images">Images</option>
            <option value="videos">Videos</option>
          </select>
        </div>
      </div>
    </div>
  );
};
