import React, { useState, useRef } from 'react';
import { Text, View, SafeAreaView, StyleSheet, Dimensions, FlatList } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from '@/components/Header';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import DraggableItem from '@/components/DraggableItem';
import {Colors} from '@/styles/Colors';
import {Host} from 'react-native-portalize';
import DraggableGroup from '@/components/DraggableGroup';

// Item data
type Item = {
    id: string;
    label: string;
    description: string,
    store: string,
    quantity: number,
    units: number,
    favorited: boolean,
    index: number,
    group?: string;
    isInput?: boolean;
};

type Group = {
    id: string;
    label: string;
    items?: Item[];
};

export default function App() {
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
        index: 0,
    };
    // Flatlist data
    const [items, setItems] = useState<Item[]>([
      {id: '1', label: 'Milk', description: 'Whole Milk', store: 'Walmart', quantity: 1, units: 1, favorited: false, index: 0, group: 'B'},
      {id: '2', label: 'Eggs', description: 'Large Eggs', store: 'Walmart', quantity: 1, units: 1, favorited: false, index: 1, group: 'B'},
      {id: '3', label: 'Bread', description: 'Whole Wheat Bread', store: 'Walmart', quantity: 1, units: 1, favorited: false, index: 2, group: 'A'},
      {id: '4', label: 'Butter', description: 'Unsalted Butter', store: 'Walmart', quantity: 1, units: 1, favorited: false, index: 3},
      {id: '5', label: 'Cheese', description: 'Cheddar Cheese', store: 'Walmart', quantity: 1, units: 1, favorited: false, index: 4, group: 'A'},
      {id: '6', label: 'Apples', description: 'Red Apples', store: 'Walmart', quantity: 1, units: 1, favorited: false, index: 5, group: 'A'},
      {id: '7', label: 'Bananas', description: 'Yellow Bananas', store: 'Walmart', quantity: 1, units: 1, favorited: false, index: 6},
      {id: '8', label: 'Oranges', description: 'Navel Oranges', store: 'Walmart', quantity: 1, units: 1, favorited: false, index: 7, group: 'A'},
    ]);

    const [groups, setGroups] = useState<Group[]>([
        { id: 'A', label: 'Group A', items: items.filter(item => item.group === 'A') },
        { id: 'B', label: 'Group B', items: items.filter(item => item.group === 'B') },
        { id: 'Ungrouped', label: 'Ungrouped', items: items.filter(item => item.group == null) },
    ]);

    const renderGroup = ({ group }: { group: Group }) => {
        return (
            <DraggableGroup key={group.id} header={group.label} items={[...group.items, inputItem]} groupId = {group.id} onRegisterItems={registerItems} onDrop={(position, groupId, index)=>handleDrop(position, groupId, index)} />
        );
    };

    
    const allItemRefs = useRef([]);

    const registerItems = (groupId, refs) => {
        allItemRefs.current[groupId] = refs; // Store refs by group ID
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
        <Host>
            <SafeAreaView style={styles.container}>
                <Header header="Draggable List" backButton={true} backLink = "/shopping" noProfile={false}  />
                <FlatList
                    data={groups}
                    renderItem={({ item }) => renderGroup({ group: item })}
                    keyExtractor={group => group.id}
                    style={styles.groupListContainer}
                />
            </SafeAreaView>
        </Host>
    </GestureHandlerRootView>
  );
}

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

