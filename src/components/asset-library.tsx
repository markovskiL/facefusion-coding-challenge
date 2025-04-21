import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import ImageIcon from "@material-symbols/svg-400/outlined/image.svg?react";
import { Button } from "./ui/button";
import { AssetDroppable } from "./asset-droppable";
import { AssetDropzone } from "./asset-dropzone";
import { useState } from "react";
import { Asset } from "../types/asset";
import { AssetCardDraggable } from "./asset-card-draggable";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

export const AssetLibrary = () => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const [error, setError] = useState<string | null>(null);

  const [assets, setAssets] = useState<Asset[]>([]);

  const onSourceDrop = (acceptedFiles: File[]) => {
    setError(null);

    acceptedFiles.forEach((file) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setError(
          `File "${file.name}" exceeds the 3MB size limit and was not added.`
        );
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const newAsset: Asset = {
          id: `source-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type.split("/")[0],
          format: file.name.split(".").pop() || "",
          url: reader.result as string,
          size: file.size,
          createdAt: new Date().toISOString(),
        };

        setAssets((prevAssets) => [...prevAssets, newAsset]);
        console.log(assets);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (id: string) => {
    setAssets((prevAssets) => prevAssets.filter((asset) => asset.id !== id));
  };
  return (
    <DndContext sensors={sensors}>
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

        <div className="p-4 bg-gray-900 rounded-3xl">
          <AssetDroppable id="asset-source" className="p-4">
            <div className="text-white flex items-center justify-between mb-5">
              <h2 className="text-2xl mb-4">Source</h2>
              <select name="filter" id="">
                <option value="all">All</option>
                <option value="images">Images</option>
                <option value="videos">Videos</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-4">
              <AssetDropzone onSourceDrop={onSourceDrop} />
              {assets.map((asset) => (
                <AssetCardDraggable
                  asset={asset}
                  id={asset.id}
                  onDelete={handleDelete}
                  key={asset.id}
                />
              ))}
            </div>
          </AssetDroppable>
        </div>
      </div>
    </DndContext>
  );
};
