import { FC, memo } from "react";
import styles from "./Save.module.scss";
import save from "src/resources/images/save.svg";

export interface ISaveEditorProps {
    click: () => void;
}

const Save: FC<ISaveEditorProps> = ({ click }) => {
  return (
    <>
        <div className={styles.container} onClick={click}>
            <img src={save} alt="save" />
            <p>Save</p>
        </div>
    </>
  );
};

export default memo(Save);
