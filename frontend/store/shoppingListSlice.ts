import { createSlice } from '@reduxjs/toolkit';

const shoppingListSlice = createSlice({
    name: "shoppingList",
    initialState: {
        lastAccessedList: null,
        currentListJson: null,
        lists: [],
        searchQuery: ""
    },
    reducers: {
        setCurrentListJson: (state, action) => {
            state.currentListJson = action.payload;
        },
        setLastAccessedList: (state, action) => {
            state.lastAccessedList = action.payload;
        },
        setShoppingLists: (state, action) => {
            state.lists = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        }
    },
})

export const { setCurrentListJson, setLastAccessedList, setShoppingLists, setSearchQuery } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;