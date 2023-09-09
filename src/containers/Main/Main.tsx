import React, { FC, useEffect, useState } from "react";
import styles from "./Main.module.scss";
import { empty } from "src/types/empty";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import ImageCardUploading from "src/components/Main/ImageCardUploading";
import { monthStr } from "src/constants/date";
import imageAction from "src/store/actions/ImageAction";
import ImageCard from "src/components/Main/ImageCard";
import { Skeleton } from "@mui/material";

export interface IMainProps {
  toForm: boolean | empty;
}

const Main: FC<any> = () => {
  const imageUploadingSelector = useAppSelector((s) => s.imageUploadingReducer);
  const imageSelector = useAppSelector((s) => s.imageSlice);
  const dispatch = useAppDispatch();
  const date = new Date();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timing = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timing);
  }, []);

  useEffect(() => {
    dispatch(imageAction.getImages());
  }, []);

  return (
    <>
      <div className={styles.container}>
        {imageSelector.array.length === 0 && (
          <div className={styles.images}>
            {imageUploadingSelector.images.map((item) => {
              return <ImageCardUploading image={item} />;
            })}
          </div>
        )}
        {imageSelector.array.map((item, index) => {
          console.log(item);
          const localDate = item.date.split("-");
          return (
            <>
              <div className={styles.content}>
                <div className={styles.category}>
                  {!loading && (
                    <>
                      <p className={styles.textDate}>
                        {
                          // @ts-ignore
                          monthStr[Number(localDate[1] - 1)]
                        }
                        ‘ {localDate[0].slice(2)}
                      </p>
                      <p className={styles.dayDate}>{localDate[2]}</p>
                    </>
                  )}

                  {loading && (
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "31.104px", width: "256px", height: "34px" }}
                    />
                  )}
                </div>
                {!index && (
                  <div className={styles.images}>
                    {imageUploadingSelector.images.map((item) => {
                      return <ImageCardUploading image={item} />;
                    })}
                  </div>
                )}
                <div className={styles.images}>
                  {item.images.map((item) => {
                    return <ImageCard image={item} />;
                  })}
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default React.memo(Main);
