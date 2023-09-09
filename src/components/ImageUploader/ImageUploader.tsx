import { FC, useState, memo, useRef } from "react";
import styles from "./ImageUploader.module.css";
import upload from "src/resources/images/upload.svg";
import uploadFile from "src/resources/images/upload_file.svg";
import ContentUploader from "./ContentUploader";
import CloseEditor from "./CloseEditor";

export interface IImageUploaderProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageUploader: FC<IImageUploaderProps> = ({ setOpen }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    // @ts-ignore
    fileInputRef.current.click();
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);
    const imageFile = e.dataTransfer.files[0];
    if (imageFile && imageFile.type.includes("image")) {
      setFile(imageFile);
    }
  };

  const handleFileSelect = (e: any) => {
    const file = e.target.files[0];
    setFile(file);
  };

  return (
    <div
      className={styles.imageUploader}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {file ? (
        <>
          <ContentUploader file={file} setOpen={setOpen} />
          <CloseEditor
            click={() => {
              setOpen(false);
            }}
          />
        </>
      ) : (
        <div className={styles.formUpload}>
          <div className={styles.btn} onClick={handleClick}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
            <img
              className={styles.uploadFile}
              src={uploadFile}
              alt="upload_file"
            />
            <img className={styles.upload} src={upload} alt="upload" />
          </div>
          <p className={styles.uploadTitle}>Upload file</p>
          <p className={styles.uploadDescription}>
            Drop your file here to start uploading
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(ImageUploader);
