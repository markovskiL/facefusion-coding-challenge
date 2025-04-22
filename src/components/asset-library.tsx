import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import ImageIcon from "@material-symbols/svg-400/outlined/image.svg?react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Asset } from "../types/asset";
import { AssetSection } from "./asset-section";
import { readAsset } from "../lib/read-asset";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type Section = "source" | "target";

type FilterType = "all" | "image" | "video" | "audio";

const filters: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "image", label: "Images" },
  { value: "video", label: "Videos" },
  { value: "audio", label: "Audios" },
];

const getFilteredAssets = (
  filterType: FilterType,
  assets: Asset[]
): Asset[] => {
  switch (filterType) {
    case "all":
      return assets;
    case "image":
      return assets.filter((a) => a.type === "image");
    case "video":
      return assets.filter((a) => a.type === "video");
    case "audio":
      return assets.filter((a) => a.type === "audio");
    default:
      return assets;
  }
};

export const AssetLibrary = () => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // const [error, setError] = useState<string | null>(null);

  const [assetsMap, setAssetsMap] = useState<{
    source: Asset[];
    target: Asset[];
  }>({
    source: [],
    target: [],
  });

  const handleDrop = (section: Section) => async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        const newAsset = await readAsset({
          file,
          section,
          maxFileSize: MAX_FILE_SIZE,
        });
        setAssetsMap((prev) => ({
          ...prev,
          [section]: [...prev[section], newAsset],
        }));
      } catch (err: unknown) {
        toast.error(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    }
  };

  const handleDelete = (section: Section) => (id: string) => {
    setAssetsMap((prev) => ({
      ...prev,
      [section]: prev[section].filter((asset) => asset.id !== id),
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overSection = over.id as Section;

    setAssetsMap((prev) => {
      const { source, target } = prev;
      const inSource = source.find((item) => item.id === activeId);
      const inTarget = target.find((item) => item.id === activeId);

      if (inSource && overSection === "target") {
        return {
          source: source.filter((item) => item.id !== activeId),
          target: [...target, inSource],
        };
      }
      if (inTarget && overSection === "source") {
        return {
          source: [...source, inTarget],
          target: target.filter((item) => item.id !== activeId),
        };
      }
      return prev;
    });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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

        <AssetSection<FilterType>
          sectionId="source"
          title="Source"
          assets={assetsMap.source}
          onDelete={handleDelete("source")}
          hasDropzone
          onDrop={handleDrop("source")}
          getFilteredAssets={getFilteredAssets}
          filters={filters}
          maxFileSize={MAX_FILE_SIZE}
        />

        <AssetSection<FilterType>
          sectionId="target"
          title="Target"
          assets={assetsMap.target}
          onDelete={handleDelete("target")}
          hasDropzone
          onDrop={handleDrop("target")}
          getFilteredAssets={getFilteredAssets}
          filters={filters}
          maxFileSize={MAX_FILE_SIZE}
        />
      </div>
    </DndContext>
  );
};
