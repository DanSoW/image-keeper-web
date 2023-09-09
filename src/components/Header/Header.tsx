import React, { FC, useEffect, useState } from "react";
import styles from "./Header.module.scss";
import logo from "src/resources/images/logo.svg";
import Skeleton from "@mui/material/Skeleton";
import UploadButton from "./UploadButton";
import ImageUploader from "../ImageUploader";
import { useAppSelector } from "src/hooks/redux.hook";

const Header: FC<any> = () => {
  const imageSelector = useAppSelector((s) => s.imageSlice);
  const imageUploadingSelector = useAppSelector((s) => s.imageUploadingReducer);

  const [open, setOpen] = useState(false);
  return (
    <>
      {(imageSelector.count_images > 0 || imageSelector.isLoading || imageUploadingSelector.images.length > 0) && (
        <div className={styles.container}>
          <div className={styles.logoTitle}>
            <img src={logo} alt="Logo" />
            {!imageSelector.isLoading && (
              <p>{imageSelector.count_images || 0} images stored in keeper</p>
            )}
            {imageSelector.isLoading && (
              <Skeleton
                variant="text"
                sx={{ fontSize: "12.5px", height: "13px" }}
              />
            )}
          </div>
          <div>
            <UploadButton
              click={() => {
                setOpen(true);
              }}
            />
          </div>
        </div>
      )}
      {!imageSelector.count_images && !imageSelector.isLoading && imageUploadingSelector.images.length === 0 && (
        <div className={styles.containerNotImages}>
          <div className={styles.content}>
            <div className={styles.logoTitle}>
              <img src={logo} alt="Logo" />
              <p className={styles.first}>No images uploaded yet</p>
              <p>
                Upload your first image by drag and dropping the file on the
                screen or click the button below
              </p>
            </div>
            <div>
              <UploadButton
                click={() => {
                  setOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      )}
      {open && <ImageUploader setOpen={setOpen} />}
    </>
  );
};

export default React.memo(Header);