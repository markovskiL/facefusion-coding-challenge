import { useState } from "react";
import { getAssetIcon } from "../lib/get-asset-icon";
import { Asset } from "../types/asset";
import { cn } from "../lib/utils";
import { useDraggable } from "@dnd-kit/core";
import DeleteIcon from "@material-symbols/svg-400/outlined/delete.svg?react";

interface Props {
  asset: Asset;
  id: string;
  onDelete: (id: string) => void;
}

export const AssetCardDraggable = ({ asset, id, onDelete }: Props) => {
  const [selected, setSelected] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
      data: {
        asset,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleDelete = () => {
    setIsDeleting(true);
    const timer = setTimeout(() => {
      onDelete(id);
      setIsDeleting(false);
    }, 300);
    return () => clearTimeout(timer);
  };

  return (
    <div
      className={cn(
        "relative group",
        "bg-gray-950 p-1.5 rounded-xl border-2 h-30 w-22",
        selected ? "border-blue-500" : "border-transparent",
        isDragging ? "cursor-move" : "cursor-pointer",
        isDeleting
          ? "opacity-0 scale-95 pointer-events-none transition-all duration-300 ease-in-out"
          : "opacity-100 scale-100"
      )}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => setSelected((prev) => !prev)}
    >
      {/* Delete Button */}
      <button
        aria-label="Delete asset"
        className={cn(
          "absolute top-1 right-1 bg-red-400 text-white p-1 rounded-full",
          isDragging ? "hidden" : "hidden group-hover:block",
          isDeleting && "hidden" // Hide during animation
        )}
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
      >
        <DeleteIcon className="w-4 h-4" />
      </button>

      {/* Asset Content */}
      {asset.type === "image" && (
        <img
          src={asset.url}
          alt={asset.name}
          className="w-full h-18 object-cover rounded-lg"
          width={100}
          height={100}
        />
      )}
      {asset.type === "video" && (
        <video src={asset.url} controls className="w-full" />
      )}
      {asset.type === "audio" && (
        <audio src={asset.url} controls className="w-full" />
      )}
      <div className="text-gray-400 flex items-center gap-2 mt-2">
        {getAssetIcon(asset.type, "fill-gray-400")}
        <span>{asset.format}</span>
      </div>
    </div>
  );
};
