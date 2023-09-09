import { createSlice } from "@reduxjs/toolkit";
import { IImageUploadingModel } from "src/models/IImageUploadingModel";

export interface IImageUploadingSlice {
    images: IImageUploadingModel[];
}

/* Экземпляр объекта очереди сообщений */
const initialState: IImageUploadingSlice = {
    images: []
};

/* Создание нового слайса для очереди сообщений */
export const imageUploadingSlice = createSlice({
    name: "image_slice",
    initialState,
    reducers: {
        clear(state) {
            state.images = [];
        },

        addImageUploading(state, action) {
            if (action.payload) {
                const prev = JSON.parse(JSON.stringify(state.images));
                prev.push(action.payload);

                state.images = prev;
            }
        },
        
        removeImageUploading(state, action) {
            const data = JSON.parse(JSON.stringify(state.images));
            const index = data.findIndex((value: any) => {
                return value.uuid === action.payload
            });

            if (index >= 0) {
                data.splice(index, 1);
            }

            state.images = data;
        }
    },
});

export default imageUploadingSlice.reducer;