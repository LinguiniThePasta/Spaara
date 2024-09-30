import { StyleSheet, View, Pressable, Text } from 'react-native';

export default function Button({ label, theme }) {
    if (theme === "primary") {
        return (
            <View style={primaryStyles.buttonContainer}>
                <Pressable style={primaryStyles.button} onPress={() => alert('You pressed a button.')}>
                    <Text style={primaryStyles.buttonLabel}>{label}</Text>
                </Pressable>
            </View>
        )
    }
    else if (theme === "secondary") {
        return (
            <View style={secondaryStyles.buttonContainer}>
                <Pressable style={secondaryStyles.button} onPress={() => alert('You pressed a button.')}>
                    <Text style={secondaryStyles.buttonLabel}>{label}</Text>
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

const secondaryStyles = StyleSheet.create({
    buttonContainer: {
        width: 300,
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
})