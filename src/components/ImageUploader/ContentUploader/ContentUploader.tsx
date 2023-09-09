import { FC, memo, useState } from "react";
import styles from "./ContentUploader.module.css";
import Save from "../Save";
import { useAppDispatch } from "src/hooks/redux.hook";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import { monthStr } from "src/constants/date";
import { dataURLToBlob, dataURLToFile, readAsUrl } from "src/utils/file";
import { v4 } from "uuid";
import imageUploadingAction from "src/store/actions/ImageUploadingAction";
import { IImageUploadingModel } from "src/models/IImageUploadingModel";

export interface IContentUploaderProps {
  file: File;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContentUploader: FC<IContentUploaderProps> = ({ file, setOpen }) => {
  const dispatch = useAppDispatch();

  const [label, setLabel] = useState("");

  const onChange = (e: any) => {
    setLabel(e.target.value);
  };

  const handleSave = async() => {
    /*if(label.length === 0) {
        dispatch(messageQueueAction.addMessage(null, "error", "Ошибка: необходимо ввести название метки"));
        return;
    }*/

    // TODO: add in queue for uploading in server

    let inputLabel = label;
    if(label.length === 0){
        const date = new Date();

        // @ts-ignore
        inputLabel = date.getDate() + " " + monthStr[date.getMonth()];
    }

    const uuid = v4();
    const spl = file.name.split('.');
    const ext = spl[spl.length - 1];

    const filedata: IImageUploadingModel = {
        uuid: uuid,
        data_url: await readAsUrl(file),
        filename: `${uuid}.${ext}`,
        label: inputLabel,
        is_upload: false
    };

    dispatch(imageUploadingAction.addImage(filedata, () => {
        setOpen(false);
    }));
  };

  return (
    <>
      <div className={styles.container}>
        <p className={styles.title}>Set custom label</p>
        <img className={styles.image} src={URL.createObjectURL(file)} alt="image" />
        <textarea
          maxLength={100}
          placeholder="Enter custom label"
          className={styles.textInput}
          onChange={onChange}
        />
        <p className={styles.maxText}>100 chars max</p>
        <Save click={handleSave} />
      </div>
    </>
  );
};

export default memo(ContentUploader);
