import AddCircle from "@material-symbols/svg-400/outlined/add_circle.svg?react";
import { useDropzone } from "react-dropzone";
import { cn } from "../lib/utils";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

interface Props {
  onSourceDrop: (acceptedFiles: File[]) => void;
  maxSize?: number;
}
export const AssetDropzone = ({
  onSourceDrop,
  maxSize = MAX_FILE_SIZE,
}: Props) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop: onSourceDrop,
      accept: {
        "image/*": [],
        "audio/*": [],
        "video/*": [],
      },
      maxSize,
      noClick: false,
    });

  return (
    <div
      className={cn(
        "h-30 w-22 flex items-center justify-center bg-gray-950 dashed-border rounded-xl cursor-pointer",
        isDragActive && "bg-blue-500/20",
        isDragReject && "bg-red-500/20"
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <AddCircle className="h-6 w-6 fill-white" />
    </div>
  );
};
