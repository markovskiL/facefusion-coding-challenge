import AddCircle from "@material-symbols/svg-400/outlined/add_circle.svg?react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  onSourceDrop: (acceptedFiles: File[]) => void;
  maxFileSize: number;
}
export const AssetDropzone = ({ onSourceDrop, maxFileSize }: Props) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop: (acceptedFiles) => {
        onSourceDrop(acceptedFiles);
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onDropRejected: (fileRejections) => {
        if (fileRejections.length > 0) {
          fileRejections.forEach((rejection) => {
            rejection.errors.forEach((error) => {
              toast.error(error.message);
            });
          });
        }
      },
      accept: {
        "image/*": [],
        "audio/*": [],
        "video/*": [],
      },
      maxSize: maxFileSize,
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
