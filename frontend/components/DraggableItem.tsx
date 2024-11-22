import React, { useState, forwardRef } from "react";
import { StyleSheet, Animated, Text } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Colors } from "@/styles/Colors";
import { CheckItem } from "@/components/Item";

interface DraggableItemProps {
  item: {
    id: string | number;
    label: string;
    isDummy?: boolean;
  };
  indent: boolean;
  onStateChange: (isDragging: boolean) => void;
  onDrop: (position: { x: number; y: number }) => void;
}

const DraggableItem = forwardRef<Animated.View, DraggableItemProps>(
  ({ item, indent, onStateChange, onDrop }, ref) => {
    const [translateY] = useState(new Animated.Value(0)); // Track Y-axis
    const [isDragging, setIsDragging] = useState(false);

    const onGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationY: translateY,
          },
        },
      ],
      { useNativeDriver: true }
    );

    const onHandlerStateChange = (event: any) => {
      if (event.nativeEvent.state === State.BEGAN) {
        setIsDragging(true); // Set dragging to true when gesture begins
        if (onStateChange) onStateChange(true);
      } else if (
        event.nativeEvent.state === State.END ||
        event.nativeEvent.state === State.CANCELLED ||
        event.nativeEvent.state === State.FAILED
      ) {
        setIsDragging(false); // Reset dragging state when gesture ends
        if (onDrop) onDrop({ x: event.nativeEvent.absoluteX, y: event.nativeEvent.absoluteY });
        if (onStateChange) onStateChange(false);

        // Optional: Reset position after gesture ends
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    };

    return (
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          ref={ref}
          style={[
            styles.itemContainer,
            {
              transform: [{ translateY }],
              zIndex: isDragging ? 1 : 0,
              elevation: isDragging ? 10 : 2,
            },
            isDragging && {
              backgroundColor: Colors.light.primaryColor,
            },
            indent && {
              paddingLeft: 20,
            },
          ]}
        >
            <CheckItem item={item} />
        </Animated.View>
      </PanGestureHandler>
    );
  }
);

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderLeftWidth: 2,
    borderColor: Colors.light.primaryColor,
  },
  itemlabel: {
    paddingLeft: 10,
    fontSize: 18,
  },
  dummylabel: {
    paddingLeft: 10,
    fontSize: 18,
    fontStyle: "italic",
    color: "gray",
  },
});

export default DraggableItem;
