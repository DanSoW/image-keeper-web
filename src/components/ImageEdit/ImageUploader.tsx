import { FC, useState, memo, useRef } from "react";
import styles from "./ImageUploader.module.css";
import upload from "src/resources/images/upload.svg";
import uploadFile from "src/resources/images/upload_file.svg";
import ContentUploader from "./ContentUploader";
import CloseEditor from "./CloseEditor";
import { IImage } from "src/models/IImageUploadingModel";

export interface IImageUploaderProps {
  image: IImage;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageUploader: FC<IImageUploaderProps> = ({ image, setOpen }) => {
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
      <ContentUploader image={image} setOpen={setOpen} />
      <CloseEditor
        click={() => {
          setOpen(false);
        }}
      />
    </div>
  );
};

export default memo(ImageUploader);
