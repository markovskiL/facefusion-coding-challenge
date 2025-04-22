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
      const dataUrl = reader.result as string;
      const timestamp = Date.now();
      const id = `${section}-${timestamp}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      resolve({
        id,
        name: file.name,
        type: file.type.split("/")[0],
        format: file.name.split(".").pop() || "",
        url: dataUrl,
        size: file.size,
        createdAt: new Date().toISOString(),
      });
    };

    reader.onerror = () => {
      reject(new Error(`Failed to read file "${file.name}".`));
    };

    reader.readAsDataURL(file);
  });
};
