import { createSlice } from '@reduxjs/toolkit';
import { ColorThemes } from '@/styles/Colors';
import { act } from 'react';

const colorSchemeSlice = createSlice({
    name: "colorScheme",
    initialState: {
        //background: "lightMode",
        //primaryColor: "lightMode",
        //Three roles for now, Visitor for unregistered person, Guest for guest user, and User for registered user
        light: {
            //background: '#F2F4F3',
            //primaryText: '#232528',
            //secondaryText: '#959595',
            //primaryColor: '#F6AA1C',
            //secondColor: '#A0A0A0',
            background: ColorThemes["darkMode"].background,
            primaryText: ColorThemes["darkMode"].primaryText,
            secondaryText: ColorThemes["darkMode"].secondaryText,
            primaryColor: ColorThemes["darkMode"].primaryColor,
            secondColor: ColorThemes["darkMode"].secondColor,
            tint: '#0a7ea4',
          },
    },
    reducers: {
        setColorScheme: (state, action) => {
            state.light.background = ColorThemes[action.payload].background;
            state.light.primaryText = ColorThemes[action.payload].primaryText;
            state.light.secondaryText = ColorThemes[action.payload].secondaryText;
            state.light.primaryColor = ColorThemes[action.payload].primaryColor;
            state.light.secondColor = ColorThemes[action.payload].secondColor;
            state.light.tint = ColorThemes[action.payload].tint;
        },
        setBackground: (state, action) => {
            state.light.background = ColorThemes[action.payload].background;
            state.light.primaryText = ColorThemes[action.payload].primaryText;
            state.light.secondaryText = ColorThemes[action.payload].secondaryText;
        },
        setPrimaryColor: (state, action) => {
            state.light.primaryColor = ColorThemes[action.payload].primaryColor;
            state.light.secondColor = ColorThemes[action.payload].secondColor;
            state.light.tint = ColorThemes[action.payload].tint;
        }
    },
})

export const { setColorScheme, setBackground, setPrimaryColor } = colorSchemeSlice.actions;
export default colorSchemeSlice.reducer;