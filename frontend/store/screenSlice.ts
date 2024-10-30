import { createSlice } from '@reduxjs/toolkit';

const screenSlice = createSlice({
    name: "shoppingList",
    initialState: {
        currentScreen: "/index"
    },
    reducers: {
        setScreen: (state, action) => {
            state.currentScreen = action.payload;
        }
    },
})

export const { setScreen} = screenSlice.actions;
export default screenSlice.reducer;