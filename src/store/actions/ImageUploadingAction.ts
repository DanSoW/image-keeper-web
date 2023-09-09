/* Библиотеки */
import { v4 as uuidv4 } from "uuid";

/* Контекст */
import { messageQueueSlice } from "../reducers/MessageQueueSlice";
import { imageUploadingSlice } from "../reducers/ImageUploadingSlice";
import { imageSlice } from "../reducers/ImageSlice";

/* DTO */
import ApiResponseDto from "src/dtos/api.response-dto";
import { empty } from "src/types/empty";
import { IImageUploadingModel } from "src/models/IImageUploadingModel";
import messageQueueAction from "./MessageQueueAction";
import imageAction from "./ImageAction";

const addImage = (data: IImageUploadingModel, cb: () => void) => async (dispatch: any) => {
  try {
    dispatch(imageUploadingSlice.actions.addImageUploading(data));
    dispatch(
      messageQueueAction.addMessage(
        null,
        // @ts-ignore
        "success",
        "Новое изображение добавлено в очередь на сохранение!"
      )
    );
    cb();
  } catch (e: any) {
    const errors = e.response.data.errors;
    if (errors && errors.length > 0) {
      dispatch(
        messageQueueAction.addMessage(
          null,
          "error",
          errors[errors.length - 1].msg
        )
      );
    } else {
      dispatch(messageQueueAction.errorMessage(e));
    }
  }
};

const removeImage = (uuid: string) => async (dispatch: any) => {
  dispatch(imageUploadingSlice.actions.removeImageUploading(uuid));
  dispatch(imageAction.getImages());
};

const imageUploadingAction = {
  addImage,
  removeImage,
};

export default imageUploadingAction;
