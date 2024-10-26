import { configureStore } from '@reduxjs/toolkit';
import shoppingListReducer from './shoppingListSlice';

const store = configureStore({
    reducer: {
        shoppingList: shoppingListReducer,
    },
});

export default store;