import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import DraggableItem from "@/components/DraggableItem";
import { Colors } from "@/styles/Colors";

const DraggableGroup = ({ header, items, groupId, onRegisterItems, onDrop }) => {
  const [activeItem, setActiveItem] = useState(null);
  const itemRefs = useRef([]); // To store references to items

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

  return (
    <View style={{ paddingLeft: 10, paddingRight: 10, paddingTop: header == "Ungrouped" ? 20 : 0, zIndex: activeItem ? 1 : 0 }}>
      {header !== "Ungrouped" && <Text style={styles.itemGrouplabel}>{header}</Text>}
      {items.map((item, index) => (
        <View key={item.id}>
          {/* Draggable Item */}
          <DraggableItem
            item={item}
            ref = {(el) => (itemRefs.current[index] = el)} // Store ref
            indent={header !== "Ungrouped"}
            onStateChange={(isDragging) => handleItemStateChange(item.id, isDragging)}
            onDrop={(position) => handleDrop(position, index)}
          />
        </View>
      ))}
    </View>
  );
};

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

export default DraggableGroup;
