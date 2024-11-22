import React, { useState, useRef, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, FlatList, TouchableOpacity  } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from '@/components/Header';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import DraggableItem from '@/components/DraggableItem';
//import {Colors} from '@/styles/Colors';
import {Host} from 'react-native-portalize';
import DraggableGroup from '@/components/DraggableGroup';
import { v4 as uuidv4 } from 'uuid';
import * as SecureStore from 'expo-secure-store';
import {useRouter, useLocalSearchParams} from 'expo-router';
import axios from 'axios';
import {API_BASE_URL} from '@/scripts/config';
import Footer from '@/components/Footer';
import { useSelector } from 'react-redux';

// Item data
type Item = {
    id: string;
    label: string;
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
      });

    // Create input item, which is appended to the end of every group to allow for expansion
    const inputItem: Item = {
        id: 'input',
        label: 'Add Item',
        description: 'Add Item',
        store: 'Add Store',
        isInput: true,
        quantity: 1,
        units: 1,
        favorited: false,
        order: 0,
    };
    const [shoppingListName, setShoppingListName] = useState("Placeholder Name");
    const local = useLocalSearchParams();

    useEffect(() => {
        fetchShoppingList();
    }, []);

    // Flatlist data
    const [items, setItems] = useState<Item[]>([
      {id: '1', label: 'Milk', description: 'Whole Milk', store: 'Walmart', quantity: 1, units: 1, favorited: false, order: 0, group: 'B'},
      {id: '2', label: 'Eggs', description: 'Large Eggs', store: 'Walmart', quantity: 1, units: 1, favorited: false, order: 1, group: 'B'},
      {id: '3', label: 'Bread', description: 'Whole Wheat Bread', store: 'Walmart', quantity: 1, units: 1, favorited: false, order: 2, group: 'A'},
      {id: '4', label: 'Butter', description: 'Unsalted Butter', store: 'Walmart', quantity: 1, units: 1, favorited: false, order: 3},
      {id: '5', label: 'Cheese', description: 'Cheddar Cheese', store: 'Walmart', quantity: 1, units: 1, favorited: false, order: 4, group: 'A'},
      {id: '6', label: 'Apples', description: 'Red Apples', store: 'Walmart', quantity: 1, units: 1, favorited: false, order: 5, group: 'A'},
      {id: '7', label: 'Bananas', description: 'Yellow Bananas', store: 'Walmart', quantity: 1, units: 1, favorited: false, order: 6},
      {id: '8', label: 'Oranges', description: 'Navel Oranges', store: 'Walmart', quantity: 1, units: 1, favorited: false, order: 7, group: 'A'},
    ]);

    const [groups, setGroups] = useState<Group[]>([
        { id: 'A', label: 'Group A', items: items.filter(item => item.group === 'A') },
        { id: 'B', label: 'Group B', items: items.filter(item => item.group === 'B') },
        { id: 'Ungrouped', label: 'Ungrouped', items: items.filter(item => item.group == null) },
    ]);

    //const [baseItems, setBaseItems] = useState([]);
    /*
    const fetchShoppingList = async () => {
        try {
            const jwtToken = await SecureStore.getItemAsync('jwtToken');
            const listId = local.id;

            const response = await axios.get(`${API_BASE_URL}/api/grocery/${listId}/`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            // Get the subheadings array
            const {name, subheadings} = response.data;
            setShoppingListName(name);

            // Parse subheadings into ItemGroups
            const parsedItemGroups = subheadings.map((subheading) => ({
                id: subheading.id,
                label: subheading.name,
                items: [
                    ...subheading.items.map((item) => ({
                        id: item.id,
                        label: item.name,
                        description: item.description,
                        store: item.store,
                        quantity: item.quantity,
                        units: item.units,
                        favorited: item.favorited,
                        order: item.order,
                    })),
                    // Add 'Add Item' only if the subheading name is 'Default'
                    ...(subheading.name === 'Default'
                        ? [{
                            id: -1,
                            label: 'Add Item',
                            favorited: false,
                            quantity: 0,
                        },
                        {
                            id: -2,
                            label: '',
                            favorited: false,
                            quantity: 0,
                        },
                        {
                            id: -3,
                            label: '',
                            favorited: false,
                            quantity: 0,
                        },]
                        : []),
                ],
            }));

            //Format list of default items
            var defaultItems = [];
            parsedItemGroups.forEach((group) => {
                if (group.label === 'Default') {
                    defaultItems = group.items.map((item) => ({
                        id: item.id,
                        label: item.label,
                        description: item.description,
                        store: item.store,
                        quantity: item.quantity,
                        units: item.units,
                        favorited: item.favorited,
                        order: item.order,
                    }));
                }
            });
            defaultItems.sort((a, b) => a.order - b.order);
            const finalItemList = [...parsedItemGroups, ...defaultItems];
            console.log("Parsed item groups:", parsedItemGroups);

            // Update state with parsed ItemGroups
            setItemGroups(finalItemList);
            
            // Flatten items if you need a flat list for any other purpose
            const allItems = parsedItemGroups.reduce((acc, group) => [...acc, ...group.items], []);
            setShoppingItems(allItems);

        } catch (error) {
            console.error('Error fetching shopping items:', error);
        }
    };
    */

    const fetchShoppingList = async () => {
        try {
          const jwtToken = await SecureStore.getItemAsync('jwtToken');
          const listId = local.id;
      
          const response = await axios.get(`${API_BASE_URL}/api/grocery/${listId}/`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
      
          // Extract data from the response
          const { name, subheadings } = response.data;
          setShoppingListName(name);
      
          // Parse subheadings into groups
          const parsedItemGroups = subheadings.map((subheading) => ({
            id: `${subheading.id}`, // Ensure ID is a string
            label: subheading.name,
            items: subheading.items.map((item) => ({
              id: `${item.id}`, // Ensure ID is a string
              label: item.name,
              description: item.description || '',
              store: item.store || '',
              quantity: item.quantity || 1,
              units: item.units || 1,
              favorited: item.favorited || false,
              order: item.order || 0,
              group: subheading.name, // Assign group name
              isInput: false, // Mark as a regular item
            })),
          }));
      
          // Add an input item to each group for expansion
          parsedItemGroups.forEach((group) => {
            group.items.push({
              id: `${group.id}-input`, // Unique ID for the input item
              label: 'Add Item',
              description: '',
              store: '',
              quantity: 0,
              units: 1,
              favorited: false,
              order: group.items.length + 1, // Place it at the end
              group: group.label,
              isInput: true, // Mark as input item
            });
          });
      
          // Handle ungrouped items
          const ungroupedItems = parsedItemGroups
            .find((group) => group.label === 'Ungrouped')
            ?.items.filter((item) => !item.isInput) // Exclude input items
            .map((item) => ({
              id: item.id,
              label: item.label,
              description: item.description,
              store: item.store,
              quantity: item.quantity,
              units: item.units,
              favorited: item.favorited,
              order: item.order,
            }))
            .sort((a, b) => a.order - b.order) || [];
      
          // Final combined item list
          const finalItemList = [...parsedItemGroups, { id: 'Ungrouped', label: 'Ungrouped', items: ungroupedItems }];
      
          console.log('Parsed item groups:', parsedItemGroups);
      
          // Update state
          setGroups(finalItemList); // Update grouped items
    
        } catch (error) {
          console.error('Error fetching shopping items:', error);
        }
      };

    const renderGroup = ({ group }: { group: Group }) => {
        return (
            <DraggableGroup key={group.id} header={group.label} items={[...group.items, inputItem]} groupId = {group.id} onRegisterItems={registerItems} onDrop={(position, groupId, index)=>handleDrop(position, groupId, index)} onAdd={(newItem, groupId)=>handleAdd(newItem, groupId)}/>
        );
    };

    const addGroup = () => {
        setGroups([ 
          {
            id: `group-${Date.now()}`,
            label: `New Group`,
            items: [],
          },
          ...groups,
        ]);
      };

    const allItemRefs = useRef([]);

    const registerItems = (groupId, refs) => {
        allItemRefs.current[groupId] = refs; // Store refs by group ID
      };


    const handleAdd = (newItem) => {
        setGroups((prevGroups) => {
            const updatedGroups = [...prevGroups];
            const targetGroup = updatedGroups.find((g) => g.id === newItem.group);

            if (targetGroup) {
                // Generate a unique id for the new item
                const uniqueId = `item-${Date.now()}`;
                const newItemWithId = { ...newItem, id: uniqueId };

                // Add the new item before the input item
                targetGroup.items.splice(targetGroup.items.length - 1, 0, newItemWithId);
            }

                return updatedGroups;
            });
    };

    const handleDrop = (position, groupId, index) => {
      const refsInAllGroups = allItemRefs.current;
    
      // Variables to track the closest overlapping item
      let closestItem = null;
      let closestGroupId = null;
      let minDistance = Infinity;
    
      // Iterate through all groups and their items
      Object.entries(refsInAllGroups).forEach(([group, refs]) => {
        refs.forEach((ref, idx) => {
          if (ref) {
            ref.measure((x, y, width, height, pageX, pageY) => {
              const centerX = pageX + width / 2;
              const centerY = pageY + height / 2;
              const distance = Math.sqrt(
                Math.pow(position.x - centerX, 2) + Math.pow(position.y - centerY, 2)
              );
    
              if (distance < minDistance) {
                minDistance = distance;
                closestItem = { group, idx };
                closestGroupId = group;
              }
            });
          }
        });
      });
    
      if (closestItem && closestGroupId !== null) {
        setGroups((prevGroups) => {
          const updatedGroups = [...prevGroups];
    
          // Find the source and target groups
          const sourceGroup = updatedGroups.find((g) => g.id === groupId);
          const targetGroup = updatedGroups.find((g) => g.id === closestGroupId);
    
          if (sourceGroup && targetGroup) {
            // Remove the dragged item from the source group
            const [draggedItem] = sourceGroup.items.splice(index, 1);
    
            targetGroup.items.splice(closestItem.idx, 0, draggedItem);
          }
    
          return updatedGroups;
        });
    
        console.log(`Switched items between group ${groupId} and group ${closestGroupId}`);
      } else {
        console.log("No overlapping item found");
      }
    };
    

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
            <View style={styles.container}>
                <SafeAreaView style={styles.container}>
                    <Header header={shoppingListName} backButton={true} backLink = "/shopping" noProfile={false}  />
                    <FlatList
                        data={groups}
                        renderItem={({ item }) => renderGroup({ group: item })}
                        keyExtractor={group => group.id}
                        style={styles.groupListContainer}
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
    </GestureHandlerRootView>
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