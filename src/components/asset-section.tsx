import { useState, useEffect } from "react";
import { AssetDroppable } from "./asset-droppable";
import { AssetDropzone } from "./asset-dropzone";
import { AssetCardDraggable } from "./asset-card-draggable";
import { Asset } from "../types/asset";

interface FilterOption<FilterValue extends string> {
  value: FilterValue;
  label: string;
}

interface Props<FilterValue extends string> {
  sectionId: string;
  title: string;
  assets: Asset[];
  onDelete: (id: string) => void;
  hasDropzone: boolean;
  onDrop: (files: File[]) => void;
  filters: FilterOption<FilterValue>[];
  getFilteredAssets: (filterType: FilterValue, assets: Asset[]) => Asset[];
}

export const AssetSection = <FilterValue extends string>({
  sectionId,
  title,
  assets,
  onDelete,
  hasDropzone,
  onDrop,
  filters,
  getFilteredAssets,
}: Props<FilterValue>) => {
  const [filterType, setFilterType] = useState<FilterValue>(
    filters[0]?.value || ("" as FilterValue)
  );

  useEffect(() => {
    if (filters.length > 0 && !filters.some((f) => f.value === filterType)) {
      setFilterType(filters[0].value);
    }
  }, [filters, filterType]);

  const filteredAssets = getFilteredAssets(filterType, assets);

  return (
    <div className="p-4 bg-gray-900 rounded-3xl">
      <AssetDroppable id={sectionId} className="p-4">
        <div className="text-white flex items-center justify-between mb-5">
          <h2 className="text-2xl mb-4">{title}</h2>
          <select
            name="filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterValue)}
            className="text-white border-none rounded p-1"
          >
            {filters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
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
