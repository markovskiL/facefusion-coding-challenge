import { useState, useEffect } from "react";
import { AssetDroppable } from "@/components/asset-droppable";
import { AssetDropzone } from "@/components/asset-dropzone";
import { AssetCardDraggable } from "@/components/asset-card-draggable";
import { Asset } from "@/types/asset";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import KeyboardArrowDown from "@material-symbols/svg-400/outlined/keyboard_arrow_down.svg?react";

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
  maxFileSize: number;
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
  maxFileSize,
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
  const currentFilter = filters.find((f) => f.value === filterType);

  return (
    <div className="p-4 bg-gray-900 rounded-3xl">
      <AssetDroppable id={sectionId} className="p-4">
        <div className="text-white flex items-center justify-between mb-5">
          <h2 className="text-2xl">{title}</h2>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-lg">
              {currentFilter?.label || "Filter"}
              <KeyboardArrowDown className="fill-white h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              {filters.map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onSelect={() => setFilterType(filter.value)}
                  className={
                    filter.value === filterType ? "font-semibold" : undefined
                  }
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-4">
          {hasDropzone && (
            <AssetDropzone onSourceDrop={onDrop} maxFileSize={maxFileSize} />
          )}
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
