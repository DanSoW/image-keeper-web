import { createSlice } from "@reduxjs/toolkit";
import { IImageArray } from "src/models/IImageUploadingModel";

export interface IImageSlice {
    array: IImageArray[];
    count_images: number;
    isLoading: boolean;
}

/* Экземпляр объекта очереди сообщений */
const initialState: IImageSlice = {
    array: [],
    count_images: 0,
    isLoading: false
};

/* Создание нового слайса для очереди сообщений */
export const imageSlice = createSlice({
    name: "image_slice",
    initialState,
    reducers: {
        loadingStart(state) {
            state.isLoading = true;
        },

        loadingEnd(state) {
            state.isLoading = false;
        },

        clear(state) {
            state.isLoading = false;
        },

        setContent(state, action) {
            state.isLoading = false;
            state.array = [];
            state.count_images = action.payload.count_images;
            
            if (action.payload && action.payload.result) {
                state.array = state.array.concat(action.payload.result);
            }
        }
    },
});

export default imageSlice.reducer;