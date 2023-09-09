import { FC, useEffect, useState } from "react";
import styles from "./UploadButton.module.css";
import cloud from "src/resources/images/cloud.svg";
import Skeleton from "@mui/material/Skeleton";
import { useAppSelector } from "src/hooks/redux.hook";

export interface IUploadButtonProps {
  click: () => void;
}

const UploadButton: FC<any> = ({ click }) => {
  const imageSelector = useAppSelector((s) => s.imageSlice);

  return (
    <>
      {!imageSelector.isLoading && (
        <div className={styles.container} onClick={click}>
          <img src={cloud} alt="cloud"></img>
          <p>Upload Image</p>
        </div>
      )}
      {imageSelector.isLoading && (
        <Skeleton
          variant="rounded"
          width={"162px"}
          height={"52px"}
          style={{
            borderRadius: "10px",
          }}
        />
      )}
    </>
  );
};

export default UploadButton;
