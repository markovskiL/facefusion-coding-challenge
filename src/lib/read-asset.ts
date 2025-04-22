import { Asset } from "../types/asset";

interface Props {
  file: File;
  section: string;
  maxFileSize: number;
}
export const readAsset = ({
  file,
  section,
  maxFileSize,
}: Props): Promise<Asset> => {
  return new Promise((resolve, reject) => {
    if (file.size > maxFileSize) {
      const msg = `File "${file.name}" exceeds the ${
        maxFileSize / (1024 * 1024)
      }MB size limit.`;
      return reject(new Error(msg));
    }

    const reader = new FileReader();

    reader.onload = () => {
      const blob = new Blob([file], { type: file.type });
      const url = URL.createObjectURL(blob);
      const timestamp = Date.now();
      const id = `${section}-${timestamp}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      resolve({
        id,
        name: file.name,
        type: file.type.split("/")[0],
        format: file.name.split(".").pop() || "",
        url,
        size: file.size,
        createdAt: new Date().toISOString(),
      });
    };
    reader.onerror = () => {
      const msg = `Failed to read file "${file.name}".`;
      reject(new Error(msg));
    };

    reader.readAsDataURL(file);
  });
};
