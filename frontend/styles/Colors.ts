/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
import React from 'react';
import { useEffect, useState, createContext, useContext } from 'react';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

const themeList = [
  {name: "lightMode", selected: true, id: '0'},
  {name: "darkMode", selected: false, id: '1'},
  {name: "angel", selected: false, id: '2'},
  {name: "berry", selected: false, id: '3'},
  {name: "cherry", selected: false, id: '4'},
  {name: "chocolate", selected: false, id: '5'},
  {name: "earth", selected: false, id: '6'},
  {name: "lavender", selected: false, id: '7'},
  {name: "pastel", selected: false, id: '8'},
  {name: "salmon", selected: false, id: '9'},
  {name: "sky", selected: false, id: '10'},
  {name: "valentine", selected: false, id: '11'},
];

//const [userBackground, setUserBackground] = useState("lightMode");
//const [userPrimaryColor, setUserPrimaryColor] = useState("lightMode");


function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}
/*
const [themeList, setThemeList] = useState([
  {name: "lightMode", selected: true, id: '0'},
  {name: "darkMode", selected: false, id: '1'},
  {name: "angel", selected: false, id: '2'},
  {name: "berry", selected: false, id: '3'},
  {name: "cherry", selected: false, id: '4'},
  {name: "chocolate", selected: false, id: '5'},
  {name: "earth", selected: false, id: '6'},
  {name: "lavender", selected: false, id: '7'},
  {name: "pastel", selected: false, id: '8'},
  {name: "salmon", selected: false, id: '9'},
  {name: "sky", selected: false, id: '10'},
  {name: "valentine", selected: false, id: '11'},
]);

useEffect(() => {
  const random = getRandomInt(0, 12);
  //setUserBackground(themeList[random].name);
  //setUserPrimaryColor(themeList[random].name);
  Colors.light.background = Colors[themeList[random].name].background;
  Colors.light.primaryColor = Colors[themeList[random].name].primaryColor;
}, []);
*/

/*export function SetColors() {
  //const random = getRandomInt(0, 12);
  const random = Colors.getRandomInt(0, 12);
  Colors.light.background = Colors[themeList[random].name].background;
  Colors.light.primaryColor = Colors[themeList[random].name].primaryColor;
  console.log("Theme: " + themeList[random].name + "   Background: " + Colors.light.background + "   Primary: " + Colors.light.primaryColor);
};
*/


export const ColorThemes = {
  lightMode: {
    background: '#F2F4F3',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#F6AA1C',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  darkMode: {
    background: '#232528',
    primaryText: '#F2F4F3',
    secondaryText: '#959595',
    primaryColor: '#F6AA1C',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  pastel: {
    background: '#FBEAEB',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#2F3C7E',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  cherry: {
    background: '#F7C5CC',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#CC313D',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  sky: {
    background: '#FFFFFF',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#8AAAE5',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  earth: {
    background: '#98BE60',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#2C5F2D',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  lavender: {
    background: '#D3C5E5',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#735DA5',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  salmon: {
    background: '#A1BE95',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#F98866',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  angel: {
    background: '#375E97',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#FFBB00',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  chocolate: {
    background: '#D09683',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#330000',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  valentine: {
    background: '#FEACC4',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#EF3167',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  berry: {
    background: '#89ABE3',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#7A2048',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
};


export const Colors = {


  /*
  getRandomInt: (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  },
  */



  /*function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }
  
  const [themeList, setThemeList] = useState([
    {name: "lightMode", selected: true, id: '0'},
    {name: "darkMode", selected: false, id: '1'},
    {name: "angel", selected: false, id: '2'},
    {name: "berry", selected: false, id: '3'},
    {name: "cherry", selected: false, id: '4'},
    {name: "chocolate", selected: false, id: '5'},
    {name: "earth", selected: false, id: '6'},
    {name: "lavender", selected: false, id: '7'},
    {name: "pastel", selected: false, id: '8'},
    {name: "salmon", selected: false, id: '9'},
    {name: "sky", selected: false, id: '10'},
    {name: "valentine", selected: false, id: '11'},
  ]);
  
  useEffect(() => {
    const random = getRandomInt(0, 12);
    //setUserBackground(themeList[random].name);
    //setUserPrimaryColor(themeList[random].name);
    Colors.light.background = Colors[themeList[random].name].background;
    Colors.light.primaryColor = Colors[themeList[random].name].primaryColor;
  }, []);
  */


  light: {
    background: '#F2F4F3',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#F6AA1C',
    secondColor: '#A0A0A0',
    //background: ColorThemes["darkMode"].background,
    //primaryText: ColorThemes["darkMode"].primaryText,
    //secondaryText: ColorThemes["darkMode"].secondaryText,
    //primaryColor: ColorThemes["darkMode"].primaryColor,
    //secondColor: ColorThemes["darkMode"].secondColor,
    tint: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  
  lightMode: {
    background: '#F2F4F3',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#F6AA1C',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  darkMode: {
    background: '#232528',
    primaryText: '#F2F4F3',
    secondaryText: '#959595',
    primaryColor: '#F6AA1C',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  pastel: {
    background: '#FBEAEB',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#2F3C7E',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  cherry: {
    background: '#F7C5CC',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#CC313D',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  sky: {
    background: '#FFFFFF',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#8AAAE5',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  earth: {
    background: '#98BE60',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#2C5F2D',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  lavender: {
    background: '#D3C5E5',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#735DA5',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  salmon: {
    background: '#A1BE95',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#F98866',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  angel: {
    background: '#375E97',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#FFBB00',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  chocolate: {
    background: '#D09683',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#330000',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  valentine: {
    background: '#FEACC4',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#EF3167',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
  berry: {
    background: '#89ABE3',
    primaryText: '#232528',
    secondaryText: '#959595',
    primaryColor: '#7A2048',
    secondColor: '#A0A0A0',
    tint: tintColorLight,
  },
};
