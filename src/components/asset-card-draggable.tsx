import { useEffect, useState } from "react";
import { getAssetIcon } from "@/lib/get-asset-icon";
import { Asset } from "@/types/asset";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import MoreIcon from "@material-symbols/svg-400/outlined/more_vert.svg?react";
import DeleteIcon from "@material-symbols/svg-400/outlined/delete.svg?react";
import PreviewIcon from "@material-symbols/svg-400/outlined/preview.svg?react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { base64ToBlob } from "@/lib/base64-to-blob";

interface Props {
  asset: Asset;
  id: string;
  onDelete: (id: string) => void;
}

export const AssetCardDraggable = ({ asset, id, onDelete }: Props) => {
  const [selected, setSelected] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: { asset },
    });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const handleDelete = () => {
    setIsDeleting(true);
    const timer = setTimeout(() => {
      onDelete(id);
      setIsDeleting(false);
    }, 300);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    if (asset.type === "video" || asset.type === "audio") {
      const blob = base64ToBlob(asset.url);
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);

      return () => {
        URL.revokeObjectURL(url);
        setBlobUrl(null);
      };
    }
  }, [asset.url, asset.type]);

  return (
    <>
      <div
        className={cn(
          "relative group",
          "bg-gray-950 p-1.5 rounded-xl border-2 h-30 w-22",
          selected ? "border-blue-500" : "border-transparent",
          isDragging ? "cursor-grabbing" : "cursor-pointer",
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
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                "border border-gray-300  absolute z-10 top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100",
                isDragging && "hidden",
                isDropdownOpen && "opacity-100"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreIcon className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuItem onClick={() => setIsPreviewOpen(true)}>
              <PreviewIcon className="w-4 h-4 mr-2" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <DeleteIcon className="w-4 h-4 mr-2 fill-red-500" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {asset.type === "image" && (
          <img
            src={asset.url}
            alt={asset.name}
            className="w-full h-20 object-cover rounded-lg"
            width={100}
            height={100}
          />
        )}
        {asset.type === "video" && (
          <div className="relative w-full h-20 bg-black rounded-lg overflow-hidden">
            <video src={blobUrl || ""} className="w-full h-full object-cover" />
            <div className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-1 rounded">
              Video
            </div>
          </div>
        )}
        {asset.type === "audio" && (
          <div className="w-full h-20 bg-gray-800 rounded-lg flex flex-col items-center justify-center">
            <audio src={blobUrl || ""} className="w-full px-2" />
            <div className="text-white text-xs mt-1">Audio</div>
          </div>
        )}
        <div className="text-gray-400 flex items-center gap-2 mt-1 text-xs">
          {getAssetIcon(asset.type, "fill-gray-400 w-4 h-4")}
          <span className="truncate">{asset.format.toUpperCase()}</span>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="bg-gray-900 border-gray-700 p-4 max-w-lg w-full text-white"
        >
          <DialogHeader>
            <DialogTitle>{asset.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            {asset.type === "image" && (
              <img
                src={asset.url}
                alt={asset.name}
                className="w-full max-h-[70vh] object-contain rounded"
              />
            )}
            {asset.type === "video" && (
              <video
                src={blobUrl || ""}
                controls
                className="w-full max-h-[70vh] rounded"
                autoPlay
              />
            )}
            {asset.type === "audio" && (
              <div className="flex flex-col items-center gap-4">
                <audio src={blobUrl || ""} controls className="w-full" />
                <p className="text-white text-sm">{asset.name}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" onClick={() => setIsPreviewOpen(false)}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
