import { createSlice } from '@reduxjs/toolkit';

const shoppingListSlice = createSlice({
    name: "shoppingList",
    initialState: {
        lastAccessedList: null,
        lists: [],
        searchQuery: ""
    },
    reducers: {
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

export const { setLastAccessedList, setShoppingLists, setSearchQuery } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;