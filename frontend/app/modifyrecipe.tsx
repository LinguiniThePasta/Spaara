import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    FlatList,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Button,
    TouchableWithoutFeedback,
} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {API_BASE_URL} from '@/scripts/config';
import {GestureDetector, Gesture, GestureHandlerRootView} from 'react-native-gesture-handler';

//import {Colors} from '@/styles/Colors';
import Footer from "@/components/Footer";
import {globalStyles} from "@/styles/globalStyles";
import Header from "@/components/Header";
import {useDispatch, useSelector} from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import {ItemGroup} from '@/components/ItemGroup';
import {CheckItem, FavoriteItem, InputItem, SpacerItem, RecipeItem} from '@/components/Item';
import Recipe from './recipe';
import {getQualifiedRouteComponent} from 'expo-router/build/useScreens';
import DraggableGroup from "@/components/DraggableGroup";
import DraggableItem from "@/components/DraggableItem";
import DraggableFlatList from "react-native-draggable-flatlist/src/components/DraggableFlatList";
import {RenderItemParams} from "react-native-draggable-flatlist";
//import { setSearchQuery } from '../store/shoppingListSlice';


type Item = {
    id: string;
    name: string;
    description: string,
    store: string,
    quantity: number,
    units: number,
    favorited: boolean,
    order: number,
    optimized: boolean,
    isInput?: boolean;
};


export default function RecipeScreen() {

    const Colors = useSelector((state) => state.colorScheme);
    const styles = StyleSheet.create({
        gestureContainer: {
            flex: 1,
        },
        container: {
            flex: 1,
            backgroundColor: Colors.light.background,
            padding: 10,
        },
        groupListContainer: {
            flex: 1,
        },
        groupContainer: {
            marginBottom: 20,
            paddingLeft: 20,
            paddingRight: 10,
            backgroundColor: Colors.light.background,
            borderRadius: 10,
        },
        starButton: {
            position: 'absolute',
            bottom: 30,
            right: 30,
            backgroundColor: Colors.light.primaryColor, // Tomato color
            borderRadius: 50,
            padding: 15,
            flexDirection: 'row',
            alignItems: 'center',
        },
        folderButton: {
            position: 'absolute',
            bottom: 30,
            left: "50%",
            transform: [{translateX: -30}],
            backgroundColor: Colors.light.primaryColor, // Tomato color
            borderRadius: 50,
            padding: 15,
            flexDirection: 'row',
            alignItems: 'center',
        },
        optimizeButton: {
            position: 'absolute',
            bottom: 30,
            left: 30,
            backgroundColor: Colors.light.primaryColor, // Tomato color
            borderRadius: 50,
            padding: 15,
            flexDirection: 'row',
            alignItems: 'center',
        },
        box: {
            width: 100,
            height: 100,
            //backgroundColor: '#b58df1',
            backgroundColor: Colors.light.background,
            borderRadius: 20,
        },
        groupHeader: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            //color: '#333',
            color: Colors.light.primaryText,
        },
        itemGroupContainer: {
            marginBottom: 20,
        },
        itemGrouplabel: {
            backgroundColor: Colors.light.background,
            color: Colors.light.primaryText,
            fontSize: 24,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            backgroundColor: 'white',
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            minHeight: '50%',
        },
        modalTitle: {
            fontSize: 24,
            top: 5,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center',
        },
        closeButton: {
            position: 'absolute',
            top: 0,
            left: 0,
            padding: 20, // Increased padding for larger clickable area
            color: 'black',
        },
        closeButtonText: {
            fontSize: 40,
            fontWeight: 'bold',
            color: 'black',
        },
        modalButton: {
            backgroundColor: '#FF6347',
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 10,
        },
        modalButtonText: {
            color: 'white',
            fontWeight: 'bold',
        },
        favoriteRecipeContainer: {
            flexDirection: 'row',
            width: "100%",
            alignItems: 'stretch',
        },
        favoriteRecipeButton: {
            flex: 1,
            borderRadius: 50,
            padding: 10,
            alignItems: 'center',
            marginRight: 20,
            marginLeft: 10,
            marginTop: 20,
        },
        selectedButton: {
            backgroundColor: Colors.light.primaryColor,
            padding: 10
        },
        unselectedButton: {
            backgroundColor: Colors.light.background,
            borderColor: Colors.light.primaryColor,
            borderWidth: 2,
            padding: 8
        },
        selectedText: {
            fontSize: 16,
            color: Colors.light.primaryText,
        },
        favoriteHeaderText: {
            fontSize: 28,
            color: Colors.light.primaryText,
            marginLeft: 10,
            marginTop: 15,
        },
        itemContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: Colors.light.secondaryText,
        },
        itemTitle: {
            fontSize: 18,
        },
        flatList: {
            marginLeft: 10,
        },
    });

    const inputItem: Item = {
        id: `input-${Date.now()}`,
        name: 'Add Ingredient',
        description: '',
        store: '',
        isInput: true,
        quantity: 1,
        units: 1,
        favorited: false,
        optimized: false,
        order: 0,
    };

    const [recipeName, setRecipeName] = useState("Placeholder Recipe");
    const [items, setItems] = useState<Item[]>([]);
    const local = useLocalSearchParams();

    useEffect(() => {
        fetchRecipe();
    }, []);


    // Fetch recipe data
    const fetchRecipeData = async (recipeId, jwtToken) => {
        const response = await axios.get(`${API_BASE_URL}/api/recipe/${recipeId}/`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        return response.data;
    };

    const parseItems = (items) => {
        return items.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            store: item.store || '',
            quantity: item.quantity || 1,
            units: item.units || 1,
            favorited: !!item.favorited,
            order: item.order || 0,
            optimized: !!item.optimized,
        }));
    };

    const fetchRecipe = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const recipeId = local.id;

            const {name, items} = await fetchRecipeData(recipeId, jwtToken);
            console.log(items)

            setRecipeName(name);

            const parsedItems = [...parseItems(items), inputItem];
            console.log(parsedItems);
            setItems(parsedItems);
        } catch (error) {
            console.error('Error fetching recipe items:', error);
        }
    };

    const handleAdd = async (newItem) => {
        const tempId = `temp-${Date.now()}`;
        const optimisticItem = {...newItem, id: tempId};

        // Optimistically add the new item
        setItems((prevItems) => {
            const updatedItems = [...prevItems];
            updatedItems.splice(updatedItems.length - 1, 0, optimisticItem); // Add before input item
            return updatedItems;
        });

        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.post(
                `${API_BASE_URL}/api/recipe_items/`,
                {
                    recipe: local.id,
                    name: newItem.name,
                    quantity: newItem.quantity,
                    units: newItem.units,
                    store: newItem.store,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );

            // Replace the temp item with the actual item returned from the server
            setItems((prevItems) => {
                const updatedItems = [...prevItems];
                const tempIndex = updatedItems.findIndex((item) => item.id === tempId);
                if (tempIndex !== -1) {
                    updatedItems[tempIndex] = {...response.data};
                }
                return updatedItems;
            });
        } catch (error) {
            console.error('Failed to add item. Rolling back changes:', error);

            // Rollback optimistic update
            setItems((prevItems) => prevItems.filter((item) => item.id !== tempId));
        }
    };

    const handleRemoveItem = async (deletedItem) => {
        const originalItems = [...items];

        // Optimistic update: Remove the item from the list
        setItems((prevItems) => prevItems.filter((item) => item.id !== deletedItem.id));

        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            await axios.delete(`${API_BASE_URL}/api/recipe_items/${deletedItem.id}/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
        } catch (error) {
            console.error('Failed to delete item. Rolling back changes:', error);
            setItems(originalItems); // Restore the original items
        }
    };

    // const renderItem = ({item}: { item: Item }) => {
    //     <DraggableItem
    //         item={item}
    //         ref={(el) => (itemRefs.current[index] = el)} // Store ref
    //         indent={false}
    //         onStateChange={(isDragging) => handleItemStateChange(item.id, isDragging)}
    //         onDrop={(position) => handleDrop(position, index)}
    //         handleRemoveItem={() => handleRemoveItem(item)}
    //         callingFrom={callingFrom}
    //     />
    // };

    const renderItem = ({
                            item,
                            drag,
                            isActive,
                        }: RenderItemParams<Item & { group: string }>) => {
        if (item.isInput) {
            return (
                <View
                    style={{
                        borderLeftWidth: 2,
                        borderColor: Colors.light.primaryColor,
                        marginVertical: 5,
                    }}
                >
                    <InputItem
                        initialText="Add Item"
                        handleAddItem={(text) => handleAdd({...item, name: text})}
                    />
                </View>
            );
        }

        return (
            <TouchableOpacity
                onLongPress={drag}
                style={[
                    styles.itemContainer,
                    isActive && {backgroundColor: Colors.light.primaryColor},
                ]}
            >
                <CheckItem
                    item={item}
                    handleRemoveItem={() => handleRemoveItem(item)}
                    callingFrom={"recipe_items"}
                />
            </TouchableOpacity>
        );
    };

    const handleItemDragEnd = ({ data }: { data: Item[] }) => {
        setItems(data);
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <Header header={recipeName} backButton={true} backLink="/recipe" noProfile={false}/>
                {/*<FlatList*/}
                {/*    data={items}*/}
                {/*    renderItem={renderItem}*/}
                {/*    keyExtractor={(item) => item.id}*/}
                {/*    style={styles.groupListContainer}*/}
                {/*/>*/}
                <DraggableFlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    onDragEnd={handleItemDragEnd}
                />
            </SafeAreaView>
            <Footer/>
        </View>
    );
}