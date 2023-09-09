import { FC, memo, useState } from "react";
import styles from "./ContentUploader.module.css";
import Save from "../Save";
import { useAppDispatch } from "src/hooks/redux.hook";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import { monthStr } from "src/constants/date";
import { dataURLToBlob, dataURLToFile, readAsUrl } from "src/utils/file";
import { v4 } from "uuid";
import imageUploadingAction from "src/store/actions/ImageUploadingAction";
import { IImage, IImageUploadingModel } from "src/models/IImageUploadingModel";
import imageAction from "src/store/actions/ImageAction";

export interface IContentUploaderProps {
  image: IImage;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContentUploader: FC<IContentUploaderProps> = ({ image, setOpen }) => {
  const dispatch = useAppDispatch();

  const [label, setLabel] = useState(image.label);

  const onChange = (e: any) => {
    setLabel(e.target.value);
  };

  const handleEdit = async() => {
    let inputLabel = label;
    if(label.length === 0){
        const date = new Date();

        // @ts-ignore
        inputLabel = date.getDate() + " " + monthStr[date.getMonth()];
    }


    dispatch(imageAction.edit({
      id: image.id,
      label: inputLabel
    }, () => {
        setOpen(false);
        dispatch(messageQueueAction.addMessage(null, "success", "Успешное изменение метки!"));
    }));
  };

  return (
    <>
      <div className={styles.container}>
        <p className={styles.title}>Set custom label</p>
        <img className={styles.image} src={image.filepath} alt="image" />
        <textarea
          maxLength={100}
          placeholder="Enter custom label"
          className={styles.textInput}
          onChange={onChange}
          defaultValue={label}
        />
        <p className={styles.maxText}>100 chars max</p>
        <Save click={handleEdit} />
      </div>
    </>
  );
};

export default memo(ContentUploader);
