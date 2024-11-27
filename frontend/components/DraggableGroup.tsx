import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import DraggableItem from "@/components/DraggableItem";
//import { Colors } from "@/styles/Colors";
import { InputItem } from "@/components/Item";
import { useSelector } from "react-redux";

const DraggableGroup = ({ header, items, groupId, onRegisterItems, onDrop, onAdd, handleRemoveItem, callingFrom}) => {

  const Colors = useSelector((state) => state.colorScheme);
  const styles = StyleSheet.create({
    itemGrouplabel: {
      backgroundColor: Colors.light.background,
      color: Colors.light.primaryText,
      fontSize: 24,
      paddingVertical: 5,
    },
    dropZone: {
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      borderColor: Colors.light.primaryColor,
      borderWidth: 1,
      borderStyle: "dashed",
      marginVertical: 5,
    },
    dropText: {
      color: Colors.light.primaryText,
      fontSize: 14,
    },
  });

  const [activeItem, setActiveItem] = useState(null);
  const itemRefs = useRef([]); // To store references to items
  const [newItemName, setNewItemName] = useState("");

  const handleItemStateChange = (itemId, isDragging) => {
    if (isDragging) {
      setActiveItem(itemId); // Set the active item when dragging starts
    } else if (activeItem === itemId) {
      setActiveItem(null); // Reset active item when dragging stops
    }
  };

  useEffect(() => {
    // Register this group's items when they change
    if (onRegisterItems) {
      onRegisterItems(groupId, itemRefs.current);
    }
  }, [items, groupId, onRegisterItems]);

  const handleDrop = (position, index) => {
    onDrop(position, groupId, index); // Notify parent of drop
  };

  const handleAddItem = (item) => {
    const newItem =  {id: items.length + 1, name: item, quantity: 1, units: "cnt", favorited: false, index: items.length, group: groupId};
    onAdd(newItem);
  };

  return (
    <View style={{ paddingLeft: 10, paddingRight: 10, paddingTop: header == "Ungrouped" ? 20 : 0, zIndex: activeItem ? 1 : 0 }}>
      {header !== "Ungrouped" && <Text style={styles.itemGrouplabel}>{header}</Text>}
      {items.map((item, index) => (
        <View key={item.id}>
          {/* Draggable Item unless isInput, in which case it is an input item with no drag capability*/}
          {item.isInput ? (
            <View ref={(el) => (itemRefs.current[index] = el)} style={{borderLeftWidth: 2, borderColor: Colors.light.primaryColor}}>
              <InputItem initialText="Add Item" handleAddItem={handleAddItem}/>
            </View>
          ) : (
          <DraggableItem
            item={item}
            ref = {(el) => (itemRefs.current[index] = el)} // Store ref
            indent={header !== "Ungrouped"}
            onStateChange={(isDragging) => handleItemStateChange(item.id, isDragging)}
            onDrop={(position) => handleDrop(position, index)}
            handleRemoveItem={() => handleRemoveItem(item)}
            callingFrom={callingFrom}
          />
          )}
        </View>
      ))}
    </View>
  );
};

/*
const styles = StyleSheet.create({
  itemGrouplabel: {
    backgroundColor: Colors.light.background,
    color: Colors.light.primaryText,
    fontSize: 24,
    paddingVertical: 5,
  },
  dropZone: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.light.primaryColor,
    borderWidth: 1,
    borderStyle: "dashed",
    marginVertical: 5,
  },
  dropText: {
    color: Colors.light.primaryText,
    fontSize: 14,
  },
});
*/

export default DraggableGroup;
