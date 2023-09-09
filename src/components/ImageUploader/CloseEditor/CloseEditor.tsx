import { FC, memo } from "react";
import styles from "./CloseEditor.module.scss";
import close from "src/resources/images/close.svg";

export interface ICloseEditorProps {
    click: () => void;
}

const CloseEditor: FC<ICloseEditorProps> = ({ click }) => {
  return (
    <>
        <div className={styles.container} onClick={click}>
            <img src={close} alt="close" />
            <p>Close editor</p>
        </div>
    </>
  );
};

export default memo(CloseEditor);
