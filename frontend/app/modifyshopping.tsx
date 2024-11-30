import React, {useState, useRef, useEffect} from 'react';
import {Text, View, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, Modal, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {GestureDetector, Gesture, GestureHandlerRootView} from 'react-native-gesture-handler';
import Header from '@/components/Header';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';
import DraggableItem from '@/components/DraggableItem';
//import {Colors} from '@/styles/Colors';
import {Host} from 'react-native-portalize';
import DraggableGroup from '@/components/DraggableGroup';
import {v4 as uuidv4} from 'uuid';
import * as SecureStore from 'expo-secure-store';
import {useRouter, useLocalSearchParams} from 'expo-router';
import axios from 'axios';
import {API_BASE_URL} from '@/scripts/config';
import Footer from '@/components/Footer';
import {useSelector} from 'react-redux';
import {stringify} from "node:querystring";
import DraggableFlatList from "react-native-draggable-flatlist/src/components/DraggableFlatList";
import {RenderItemParams} from "react-native-draggable-flatlist";
import {CheckItem, InputItem} from "@/components/Item";
import GroceryModal from "@/components/GroceryModal";

// Item data
type Item = {
    id: string;
    name: string;
    description: string,
    store: string,
    quantity: number,
    units: number,
    favorited: boolean,
    order: number,
    group?: string;
    isInput?: boolean;
};

type Group = {
    id: string;
    label: string;
    items?: Item[];
    expanded: boolean;
};

export default function ModifyShopping() {

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
            fontWeight: 'bold',
            marginBottom: 10,
            color: Colors.light.primaryText,
            flexDirection: "row",
            alignItems: "center"
        },
        groupHeaderText: {
            color: Colors.light.primaryText,
            fontSize: 24,
            fontWeight: "bold",
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

    // Create input item, which is appended to the end of every group to allow for expansion
    const inputItem: Item = {
        id: 'input',
        name: 'Add Item',
        description: 'Add Item',
        store: 'Add Store',
        isInput: true,
        quantity: 1,
        units: 1,
        favorited: false,
        order: 0,
    };
    const [shoppingListName, setShoppingListName] = useState("Placeholder Name");
    const [modalVisible, setModalVisible] = useState(false);
    const local = useLocalSearchParams();

    useEffect(() => {
        fetchShoppingList();
    }, []);


    // Flatlist data
    const [items, setItems] = useState<Item[]>([]);

    const [groups, setGroups] = useState<Group[]>([
        // {id: 'A', label: 'Group A', items: items.filter(item => item.group === 'A')},
        // {id: 'B', label: 'Group B', items: items.filter(item => item.group === 'B')},
        // {id: 'Ungrouped', label: 'Ungrouped', items: items.filter(item => item.group == null)},
    ]);

// Helper to fetch the shopping list data from the server
    const fetchShoppingListData = async (listId, jwtToken) => {
        const response = await axios.get(`${API_BASE_URL}/api/grocery/${listId}/`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        return response.data;
    };

    const parseSubheadingsToGroups = (subheadings) => {
        return subheadings.map((subheading) => ({
            id: `${subheading.id}`,
            label: subheading.name,
            expanded: true,
            items: subheading.items.map((item) => ({
                id: `${item.id}`,
                name: item.name,
                description: item.description || '',
                store: item.store || '',
                quantity: item.quantity || 1,
                units: item.units || 1,
                favorited: item.favorited || false,
                order: item.order || 0,
                checked: item.checked || false,
                group: subheading.id,

            })),
        }));
    };

    const appendInputItemsToGroups = (groups) => {
        return groups.map((group) => ({
            ...group,
            items: [
                ...group.items,
                {
                    id: `input-${group.id}-${Date.now()}`,
                    name: 'Add Item',
                    description: '',
                    store: '',
                    quantity: 0,
                    units: 1,
                    favorited: false,
                    order: group.items.length + 1,
                    group: group.id,
                    isInput: true,
                },
            ],
        }));
    };

    const fetchShoppingList = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const listId = local.id;

            const {name, subheadings} = await fetchShoppingListData(listId, jwtToken);

            setShoppingListName(name);

            let groups = parseSubheadingsToGroups(subheadings);
            groups = appendInputItemsToGroups(groups);

            setGroups(groups);
        } catch (error) {
            console.error('Error fetching shopping items:', error);
        }
    };
    const handleItemDragEnd = (groupId: string, updatedItems: Item[]) => {
        setGroups((prevGroups) =>
            prevGroups.map((group) =>
                group.id === groupId ? {...group, items: updatedItems} : group
            )
        );
    };

    // Handle group reordering
    const handleGroupDragEnd = ({data}: { data: Group[] }) => {
        setGroups(data);
    };

    const toggleGroup = (groupId: string) => {
        setGroups((prevGroups) =>
            prevGroups.map((group) =>
                group.id === groupId ? {...group, expanded: !group.expanded} : group
            )
        );
    };

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
                    callingFrom={"grocery_items"}
                />
            </TouchableOpacity>
        );
    };

    const renderGroup = ({
                             item: group,
                             drag,
                             isActive,
                         }: RenderItemParams<Group>) => (
        <View
            style={[
                styles.groupContainer,
                isActive && {backgroundColor: Colors.light.secondaryColor},
            ]}
        >
            {/* Group Header */}
            <TouchableOpacity
                onLongPress={drag} // Allow dragging groups by long pressing on the header
                onPress={() => toggleGroup(group.id)}
                style={styles.groupHeader}
            >
                <Text style={styles.groupHeaderText}>{group.label}</Text>
                <Icon
                    name={group.expanded ? "chevron-down" : "chevron-forward"}
                    size={18}
                    color={Colors.light.primaryText}
                />
            </TouchableOpacity>

            {/* Draggable Items (shown only if the group is expanded) */}
            {group.expanded && (
                <DraggableFlatList
                    data={group.items}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    onDragEnd={({data}) => handleItemDragEnd(group.id, data)}
                />
            )}
        </View>
    );

    const addGroup = () => {
        setGroups([
            {
                id: `group-${Date.now()}`,
                label: `New Group`,
                items: [],
                expanded: true
            },
            ...groups,
        ]);
    };

    const allItemRefs = useRef([]);
    const registerItems = (groupId, refs) => {
        allItemRefs.current[groupId] = refs; // Store refs by group ID
    };
    const handleAdd = async (newItem) => {
        const tempId = `temp-${Date.now()}`;
        const optimisticItem = {...newItem, id: tempId, isInput: false, quantity: 1};

        setGroups((prevGroups) => {
            const updatedGroups = prevGroups.map((group) => {
                if (group.id === newItem.group) {
                    return {
                        ...group,
                        items: [
                            ...group.items.slice(0, -1), // Exclude the input item
                            optimisticItem,
                            group.items[group.items.length - 1], // Re-append the input item
                        ],
                    };
                }
                return group;
            });
            return updatedGroups;
        });

        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.post(
                `${API_BASE_URL}/api/grocery_items/`,
                {
                    list: local.id,
                    name: newItem.name,
                    quantity: newItem.quantity,
                    units: newItem.units,
                    store: newItem.store,
                    subheading: newItem.group,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );
            // Once you have the group, set the old item to the new item

            setGroups((prevGroups) =>
                prevGroups.map((group) => {
                    if (group.id === newItem.group) {
                        return {
                            ...group,
                            items: group.items.map((item) => {
                                if (item.id === tempId) {
                                    return {
                                        id: response.data.id,
                                        name: response.data.name,
                                        description: response.data.description || '',
                                        store: response.data.store || '',
                                        quantity: response.data.quantity || 1,
                                        units: response.data.units || 1,
                                        favorited: response.data.favorited || false,
                                        order: response.data.order || 0,
                                        group: response.data.subheading || newItem.group,
                                        isInput: false, // Ensure it's not marked as input
                                    };
                                }
                                return item;
                            }),
                        };
                    }
                    return group;
                })
            );
        } catch (error) {
            console.log(`Could not add item to list! Error: ${error}`);
            // If there's an error, rollback the changes
            // TODO: Add an alert to the user
            setGroups((prevGroups) =>
                prevGroups.map((group) => {
                    if (group.id === newItem.group) {
                        return {
                            ...group,
                            items: group.items.filter((item) => item.id !== tempId),
                        };
                    }
                    return group;
                })
            );
        }
    };

    const handleRemoveItem = async (deletedItem) => {
        const originalGroups = [...groups];
        // Optimistic update
        const updatedGroups = groups.map((group) => ({
            ...group,
            items: group.items.filter((item) => item.id !== deletedItem.id),
        }));
        const filteredGroups = updatedGroups.filter((group) => group.items.length > 0);
        setGroups(filteredGroups);
        console.log("Calling remove item");

        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const response = await axios.delete(
                `${API_BASE_URL}/api/grocery_items/${deletedItem.id}/`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );
        } catch (error) {
            console.error('Failed to delete item. Rolling back changes:', error);

            // Rollback: Restore the removed item and group if necessary
            setGroups(originalGroups);
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <Header header={shoppingListName} backButton={true} backLink="/shopping" noProfile={false}/>
                <DraggableFlatList
                    data={groups}
                    keyExtractor={(item) => item.id}
                    renderItem={renderGroup}
                    onDragEnd={handleGroupDragEnd}
                />
                {/*ADD FAVORITES*/}
                <TouchableOpacity style={styles.starButton} onPress={() => setModalVisible(true)}>
                    <Icon name="star-outline" size={24} color={Colors.light.background}/>
                </TouchableOpacity>


                {/*OPTIMIZE*/}
                <TouchableOpacity style={styles.optimizeButton}>
                    <Icon
                        name="hammer-outline"
                        size={24}
                        color={Colors.light.background}
                    />
                </TouchableOpacity>
                <GroceryModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    fetchShoppingList={fetchShoppingList}
                    local={local}
                />
                {/*ADD FOLDER*/}
                <TouchableOpacity style={styles.folderButton} onPress={() => addGroup()}>
                    <Icon
                        name="folder-outline"
                        size={24}
                        color={Colors.light.background}
                    />
                </TouchableOpacity>
            </SafeAreaView>
            <Footer/>
        </View>
    );
}

/*
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
    backgroundColor: '#b58df1',
    borderRadius: 20,
  },
  groupHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  itemGroupContainer: {
    marginBottom: 20,
  },
  itemGrouplabel: {
    backgroundColor: Colors.light.background,
    color: Colors.light.primaryText,
    fontSize: 24,
   },
});
*/