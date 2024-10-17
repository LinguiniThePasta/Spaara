import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from "@/styles/Colors";

const {width, height} = Dimensions.get('window');

const globalStyles = StyleSheet.create({
    primaryText: {
        fontFamily: 'Lato-Regular',
        fontSize: 16,
        color: Colors.light.primaryText,
    },
    primaryButton: {
        backgroundColor: Colors.light.primaryColor,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        width: '100%',
        height: 0.06 * height,
        margin: 0.01 * height,
        borderRadius: 40
    },
    secondaryButton: {},
    primaryGreyButton: {
        backgroundColor: Colors.light.secondaryText,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 0.06 * height,
        margin: 0.01 * height,
        borderRadius: 40
    },
    secondaryGreyButton: {
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: Colors.light.secondaryText,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 0.06 * height,
        margin: 0.01 * height,
        borderRadius: 40
    },
    buttonText: {
        fontSize: 18,
        color: Colors.light.background,
    },
    primaryInput: {
        borderColor: Colors.light.primaryColor,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 0.03 * width,
        width: "100%",
        height: 0.06 * height,
        margin: 0.01 * height,
        borderRadius: 7
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
        paddingHorizontal: 10,
        height: 0.06 * height,
        borderWidth: 1,
        borderColor: Colors.light.primaryColor,
        borderRadius: 25,
    }
});

export {globalStyles};