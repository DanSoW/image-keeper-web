import { FC, useState, useEffect } from "react";
import styles from "./ImageCard.module.css";
import {
  IImage,
  IImageModel,
  IImageUploadingModel,
} from "src/models/IImageUploadingModel";
import download from "src/resources/images/download.svg";
import deleteImage from "src/resources/images/delete.svg";
import editImage from "src/resources/images/edit.svg";
import apiMainServer from "src/http/http";
import Api from "src/constants/api";
import { useAppDispatch } from "src/hooks/redux.hook";
import imageAction from "src/store/actions/ImageAction";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import ImageEdit from "src/components/ImageEdit";
import Skeleton from "@mui/material/Skeleton";

export interface IImageCardProps {
  image: IImage;
}

const ImageCard: FC<IImageCardProps> = ({ image }) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timing = setTimeout(() => {
      setLoading(false);
    }, 500); 
    return () => clearTimeout(timing);
  }, []);

  const onDelete = (id: number) => {
    dispatch(
      imageAction.deleteImage(id, () => {
        dispatch(
          messageQueueAction.addMessage(null, "dark", "Изображение удалено")
        );
      })
    );
  };

  const onEdit = () => {
    setOpen(true);
  };

  return (
    <>
      {!loading && (
        <div className={styles.container}>
          <img src={image.filepath} alt={image.filename} />
          <div className={styles.label}>
            <p>{image.label}</p>
          </div>

          <div className={styles.controls}>
            <div className={styles.control}>
              <img src={download} alt="download" />
              <a href={`${Api.mainServer}${Api.download}/?id=${image.id}`}>
                Download
              </a>
            </div>
            <div className={styles.control} onClick={onEdit}>
              <img src={editImage} alt="edit" />
              <p>Edit label</p>
            </div>
            <div
              className={styles.control}
              onClick={() => {
                onDelete(image.id);
              }}
            >
              <img src={deleteImage} alt="delete" />
              <p>Delete</p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <Skeleton
          variant="rounded"
          width={"325px"}
          height={"213px"}
          style={{
            borderRadius: "10px",
          }}
        />
      )}

      {open && <ImageEdit image={image} setOpen={setOpen} />}
    </>
  );
};

export default ImageCard;
