import { configureStore } from '@reduxjs/toolkit';
import shoppingListReducer from './shoppingListSlice';
import screenReducer from './screenSlice';

const store = configureStore({
    reducer: {
        shoppingList: shoppingListReducer,
        // This way we can keep track of which screen we are on.
        screen: screenReducer,
    },
});

export default store;