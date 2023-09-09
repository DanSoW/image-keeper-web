/* Библиотеки */
import { v4 as uuidv4 } from "uuid";

/* Контекст */
import { messageQueueSlice } from "../reducers/MessageQueueSlice";
import { imageSlice } from "../reducers/ImageSlice";

/* DTO */
import messageQueueAction from "./MessageQueueAction";
import apiMainServer from "src/http/http";
import Api from "src/constants/api";

const getImages = () => async (dispatch: any) => {
  dispatch(imageSlice.actions.loadingStart());
  try {
    const response = await apiMainServer.get(Api.images);

    if (response.status !== 200 && response.status !== 201) {
      dispatch(messageQueueAction.addMessage(response, "error"));
      return;
    }

    dispatch(imageSlice.actions.setContent(response.data));
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
  } finally {
    dispatch(imageSlice.actions.loadingEnd());
  }
};

const deleteImage = (id: number, cb: () => void) => async (dispatch: any) => {
  dispatch(imageSlice.actions.loadingStart());
  try {
    const response = await apiMainServer.post(
      Api.delete,
      JSON.stringify({
        id: id,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      dispatch(messageQueueAction.addMessage(response, "error"));
      return;
    }

    dispatch(getImages());
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
  } finally {
    dispatch(imageSlice.actions.loadingEnd());
  }
};

const edit = (data: any, cb: () => void) => async (dispatch: any) => {
    dispatch(imageSlice.actions.loadingStart());
    try {
      const response = await apiMainServer.post(
        Api.edit,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status !== 200 && response.status !== 201) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }
  
      dispatch(getImages());
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
    } finally {
      dispatch(imageSlice.actions.loadingEnd());
    }
  };

const imageAction = {
  getImages,
  deleteImage,
  edit
};

export default imageAction;
