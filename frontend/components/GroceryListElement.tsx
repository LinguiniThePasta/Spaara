import { StyleSheet, View, Pressable, Image, Text } from 'react-native';
import NavigationButton from '@/components/NavigationButton';

const googleIcon = require("@/assets/images/GoogleIcon.png");

type props = {
    label: string;
}

export default function ListElement({ label }: props) {
    return (
        <View style={listElementStyles.listElementContainer}>
            <Text style={listElementStyles.label}>{label}</Text>
            <View style={listElementStyles.buttonContainer}>
                <NavigationButton label="open" type="tab" destination={"/savedLists"}/>
                <NavigationButton label="delete" type="tab" destination={"/savedLists"}/>
            </View>
            {/*<NavigationButton label="open" type="tab" destination={"/savedLists"}/>
            <NavigationButton label="delete" type="tab" destination={"/savedLists"}/>*/}
        </View>

    )

        {/*<View style={primaryWideStyles.buttonContainer}>
            <Pressable style={primaryWideStyles.button} onPress={onPress}>
                <Text style={primaryWideStyles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>*/}
    
}

const listElementStyles = StyleSheet.create({
    listElementContainer: {
        flexDirection: 'row',
        backgroundColor: '#F6AA1C',
        borderRadius: 10,
        width: 325,
        height: 45,
        marginHorizontal: 20,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 3,
    },

    label: {
        //width: 290,
        //marginTop: 50,
        //marginBottom: 10,
        marginHorizontal: 10,
        color: '#232528',
        fontSize: 20,
        textAlign: 'left',
    },

    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});