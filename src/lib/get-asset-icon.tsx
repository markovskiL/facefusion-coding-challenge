import ImageIcon from "@material-symbols/svg-400/outlined/image.svg?react";
import AudioFileIcon from "@material-symbols/svg-400/outlined/audio_file.svg?react";
import VideoFileIcon from "@material-symbols/svg-400/outlined/video_file.svg?react";
import UploadFileIcon from "@material-symbols/svg-400/outlined/upload_file.svg?react";
import { cn } from "./utils";

export const getAssetIcon = (type: string, className?: string) => {
  const classNameCombined = cn("w-5 h-5", className);

  switch (type) {
    case "image":
      return <ImageIcon className={classNameCombined} />;
    case "audio":
      return <AudioFileIcon className={classNameCombined} />;
    case "video":
      return <VideoFileIcon className={classNameCombined} />;
    default:
      return <UploadFileIcon className={classNameCombined} />;
  }
};
