import { createSlice } from '@reduxjs/toolkit';

const roleSlice = createSlice({
    name: "role",
    initialState: {
        role: "Visitor"
        //Three roles for now, Visitor for unregistered person, Guest for guest user, and User for registered user
    },
    reducers: {
        setRole: (state, action) => {
            state.role = action.payload;
        },
    },
})

export const { setRole } = roleSlice.actions;
export default roleSlice.reducer;