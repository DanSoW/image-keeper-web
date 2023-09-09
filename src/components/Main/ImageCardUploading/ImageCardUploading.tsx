import { FC, useState, useEffect } from "react";
import styles from "./ImageCardUploading.module.css";
import { IImageUploadingModel } from "src/models/IImageUploadingModel";
import { dataURLToFile } from "src/utils/file";
import Api from "src/constants/api";
import apiMainServer from "src/http/http";
import axios from "axios";
import imageUploadingAction from "src/store/actions/ImageUploadingAction";
import { useAppDispatch } from "src/hooks/redux.hook";
import imageAction from "src/store/actions/ImageAction";

export interface IImageCardUploadingProps {
  image: IImageUploadingModel;
}

const chunkSize = 10 * 1024;

const ImageCardUploading: FC<IImageCardUploadingProps> = ({ image }) => {
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<Array<File>>([
    dataURLToFile(image.data_url, image.filename) as File,
  ]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
  const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState<
    number | null
  >(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number | null>(
    null
  );

  function readAndUploadCurrentChunk() {
    const reader = new FileReader();
    // @ts-ignore
    const file = files[currentFileIndex];
    if (!file) {
      return;
    }
    const from = !currentChunkIndex ? 0 : currentChunkIndex * chunkSize;
    const to = from + chunkSize;
    const blob = file.slice(from, to);
    reader.onload = (e) => uploadChunk(e);
    reader.readAsDataURL(blob);
  }

  function uploadChunk(readerEvent: any) {
    // @ts-ignore
    const file = files[currentFileIndex];
    const data = readerEvent.target.result;
    const params = new URLSearchParams();
    params.set("name", file.name);
    params.set("label", image.label);
    // @ts-ignore
    params.set("size", file.size);
    // @ts-ignore
    params.set("currentChunkIndex", currentChunkIndex);
    // @ts-ignore
    params.set("totalChunks", Math.ceil(file.size / chunkSize));
    const headers = { "Content-Type": "application/octet-stream" };
    const url = `${Api.upload}?` + params.toString();
    apiMainServer.post(url, data, { headers }).then((response) => {
      // @ts-ignore
      const file = files[currentFileIndex];
      // @ts-ignore
      const filesize = files[currentFileIndex].size;
      const chunks = Math.ceil(filesize / chunkSize) - 1;
      const isLastChunk = currentChunkIndex === chunks;
      if (isLastChunk) {
        // @ts-ignore
        file.finalFilename = response.data.filename;
        setLastUploadedFileIndex(currentFileIndex);
        setCurrentChunkIndex(null);

        dispatch(imageUploadingAction.removeImage(image.uuid));
      } else {
        // @ts-ignore
        setCurrentChunkIndex(currentChunkIndex + 1);
      }
    });
  }

  useEffect(() => {
    if (lastUploadedFileIndex === null) {
      return;
    }
    const isLastFile = lastUploadedFileIndex === files.length - 1;
    // @ts-ignore
    const nextFileIndex = isLastFile ? null : currentFileIndex + 1;
    setCurrentFileIndex(nextFileIndex);
  }, [lastUploadedFileIndex]);

  useEffect(() => {
    if (files.length > 0) {
      if (currentFileIndex === null) {
        setCurrentFileIndex(
          lastUploadedFileIndex === null ? 0 : lastUploadedFileIndex + 1
        );
      }
    }
  }, [files.length]);

  useEffect(() => {
    if (currentFileIndex !== null) {
      setCurrentChunkIndex(0);
    }
  }, [currentFileIndex]);

  useEffect(() => {
    if (currentChunkIndex !== null) {
      readAndUploadCurrentChunk();
    }
  }, [currentChunkIndex]);

  function formatFileSize(fileSize: number) {
    if (fileSize < 1024) {
      return fileSize + " bytes";
    } else if (fileSize >= 1024 && fileSize < 1024 * 1024) {
      return (fileSize / 1024).toFixed(2) + " kb";
    } else if (fileSize >= 1024 * 1024 && fileSize < 1024 * 1024 * 1024) {
      return (fileSize / (1024 * 1024)).toFixed(2) + " mb";
    } else {
      return (fileSize / (1024 * 1024 * 1024)).toFixed(2) + " gb";
    }
  }

  return (
    <>
      <div className={styles.container}>
        {files.map((file, fileIndex) => {
          let progress = 0;
          let progressUpload = "0 bytes";

          let fullSize = formatFileSize(file.size);

          // @ts-ignore
          if (file.finalFilename) {
            progress = 100;
            progressUpload = fullSize;
          } else {
            const uploading = fileIndex === currentFileIndex;
            let localSize = file.size / chunkSize;
            const chunks = Math.ceil(localSize);

            if (uploading) {
              // @ts-ignore
              progress = Math.round((currentChunkIndex / chunks) * 100);
              localSize = localSize * progress * 100;
              progressUpload = formatFileSize(localSize);
            } else {
              progress = 0;
            }
          }

          return (
            <div>
              <div className={styles.uploading}>
                <p className={styles.uploadTitle}>Uploading</p>
                <p className={styles.uploadProgress}>
                  {progressUpload} of {fullSize}
                </p>
              </div>
              <div
                className={styles.progress}
                style={{ width: progress + "%" }}
              ></div>
            </div>
          );
        })}
        <img src={image.data_url} alt={image.filename} />
        <div className={styles.label}>
          <p>{image.label}</p>
        </div>
      </div>
    </>
  );
};

export default ImageCardUploading;
