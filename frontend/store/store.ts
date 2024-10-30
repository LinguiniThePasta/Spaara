import { configureStore } from '@reduxjs/toolkit';
import shoppingListReducer from './shoppingListSlice';
import roleReducer from './roleSlice';

const store = configureStore({
    reducer: {
        shoppingList: shoppingListReducer,
        role: roleReducer,
    },
});

export default store;