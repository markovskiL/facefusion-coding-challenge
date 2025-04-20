import { getAssetIcon } from "../lib/get-asset-icon";
import { Asset } from "../types/asset";

interface Props {
  asset: Asset;
}

export const AssetPreviewCard = ({ asset }: Props) => {
  return (
    <div
      key={asset.id}
      className="bg-gray-950 p-2 rounded-xl border-2 border-blue-500 h-30 w-22"
    >
      {asset.type === "image" && (
        <img
          src={asset.url}
          alt={asset.name}
          className="w-full h-18 object-cover rounded-lg"
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
