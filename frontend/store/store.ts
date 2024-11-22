import { configureStore } from '@reduxjs/toolkit';
import shoppingListReducer from './shoppingListSlice';
import roleReducer from './roleSlice';
import screenReducer from './screenSlice';
import colorSchemeReducer from './colorScheme';

const store = configureStore({
    reducer: {
        shoppingList: shoppingListReducer,
        role: roleReducer,
        // This way we can keep track of which screen we are on.
        screen: screenReducer,
        colorScheme: colorSchemeReducer,
    },
});

export default store;