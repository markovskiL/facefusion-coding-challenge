import { AssetDroppable } from "./asset-droppable";
import { AssetDropzone } from "./asset-dropzone";
import { useState } from "react";
import { AssetCardDraggable } from "./asset-card-draggable";
import { Asset } from "../types/asset";

interface Props {
  sectionId: string;
  title: string;
  assets: Asset[];
  onDelete: (id: string) => void;
  hasDropzone: boolean;
  onDrop: (files: File[]) => void;
}

export const AssetSection = ({
  sectionId,
  title,
  assets,
  onDelete,
  hasDropzone,
  onDrop,
}: Props) => {
  const [filterType, setFilterType] = useState<string>("all");

  const filteredAssets =
    filterType === "all"
      ? assets
      : assets.filter((asset) => asset.type === filterType);

  return (
    <div className="p-4 bg-gray-900 rounded-3xl">
      <AssetDroppable id={sectionId} className="p-4">
        <div className="text-white flex items-center justify-between mb-5">
          <h2 className="text-2xl mb-4">{title}</h2>
          <select
            name="filter"
            id=""
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-800 text-white border-none rounded p-1"
          >
            <option value="all">All</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-4">
          {hasDropzone && <AssetDropzone onSourceDrop={onDrop} />}
          {filteredAssets.map((asset) => (
            <AssetCardDraggable
              asset={asset}
              id={asset.id}
              onDelete={() => onDelete(asset.id)}
              key={asset.id}
            />
          ))}
        </div>
      </AssetDroppable>
    </div>
  );
};
