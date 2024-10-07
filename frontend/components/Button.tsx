import { StyleSheet, View, Pressable, Image, Text } from 'react-native';

const googleIcon = require("@/assets/images/GoogleIcon.png");

type props = {
    label: string;
    theme?: string;
    onPress?: () => void;
}

export default function Button({ label, theme, onPress = () => {} }: props) {
    if (theme === "primary") {
        return (
            <View style={primaryStyles.buttonContainer}>
                <Pressable style={primaryStyles.button} onPress={onPress}>
                    <Text style={primaryStyles.buttonLabel}>{label}</Text>
                </Pressable>
            </View>
        )
    }
    else if (theme === "primary-wide") {
        return (
            <View style={primaryWideStyles.buttonContainer}>
                <Pressable style={primaryWideStyles.button} onPress={onPress}>
                    <Text style={primaryWideStyles.buttonLabel}>{label}</Text>
                </Pressable>
            </View>
        )
    }
    else if (theme === "secondary") {
        return (
            <View style={secondaryStyles.buttonContainer}>
                <Pressable style={secondaryStyles.button} onPress={onPress}>
                    <Text style={secondaryStyles.buttonLabel}>{label}</Text>
                </Pressable>
            </View>
        )
    }
    else if (theme === "google") {
        return (
            <View style={googleStyles.buttonContainer}>
                <Pressable style={googleStyles.button} onPress={onPress}>
                    <Image style={googleStyles.buttonIcon} source={googleIcon}/>
                    <Text style={googleStyles.buttonLabel}>{label}</Text>
                </Pressable>
            </View>
        )
    }
}

const primaryStyles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: '#F6AA1C',
        borderRadius: 100,
        width: 150,
        height: 45,
        marginHorizontal: 20,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },

    button: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    buttonIcon: {
        paddingRight: 8,
    },

    buttonLabel: {
        color: "#232528",
        fontSize: 20,
    },
});

const primaryWideStyles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: '#F6AA1C',
        borderRadius: 100,
        width: 325,
        height: 45,
        marginHorizontal: 20,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },

    button: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    buttonIcon: {
        paddingRight: 8,
    },

    buttonLabel: {
        color: "#232528",
        fontSize: 20,
    },
});

const secondaryStyles = StyleSheet.create({
    buttonContainer: {
        width: 325,
        height: 45,
        marginHorizontal: 20,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },

    button: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    buttonIcon: {
        paddingRight: 8,
    },

    buttonLabel: {
        color: "#232528",
        fontSize: 20,
    },
});

const googleStyles = StyleSheet.create({
    buttonContainer: {
        borderColor: '#4285F4',
        borderWidth: 2,
        borderRadius: 100,
        width: 325,
        height: 45,
        marginHorizontal: 20,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },

    button: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    buttonIcon: {
        width: 30,
        height: 30,
        marginRight: 15,
    },

    buttonLabel: {
        color: "#4285F4",
        fontSize: 20,
    },
});