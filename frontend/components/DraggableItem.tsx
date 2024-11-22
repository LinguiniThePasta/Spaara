import React, { useState, useRef, forwardRef } from "react";
import { StyleSheet, Animated } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Colors } from "@/styles/Colors";
import { CheckItem } from "@/components/Item";
import { useSelector } from "react-redux";

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

const HOLD_THRESHOLD = 100; // 1 second

const DraggableItem = forwardRef<Animated.View, DraggableItemProps>(
  ({ item, indent, onStateChange, onDrop }, ref) => {

    const Colors = useSelector((state) => state.colorScheme);
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

    const [translateY] = useState(new Animated.Value(0)); // Track Y-axis
    const [isDragging, setIsDragging] = useState(false);
    const holdTimeout = useRef<NodeJS.Timeout | null>(null); // UseRef for timeout tracking

    const handleFavorite = (item: any) => {
      console.log("Favorite item", item);
    };

    const handleRemove = (item: any) => {
      console.log("Remove item", item);
    };

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
      const { state, absoluteX, absoluteY } = event.nativeEvent;

      if (state === State.BEGAN) {
        // Start the hold timeout
        holdTimeout.current = setTimeout(() => {
          setIsDragging(true); // Activate dragging style after the threshold
          if (onStateChange) onStateChange(true);
        }, HOLD_THRESHOLD);
      } else if (
        state === State.END ||
        state === State.CANCELLED ||
        state === State.FAILED
      ) {
        // Clear the hold timeout
        if (holdTimeout.current) {
          clearTimeout(holdTimeout.current);
          holdTimeout.current = null;
        }

        if (onDrop) {
          // Handle the drop regardless of dragging style
          onDrop({ x: absoluteX, y: absoluteY });
        }

        if (isDragging) {
          // Reset dragging state if it was active
          setIsDragging(false);
          if (onStateChange) onStateChange(false);
        }

        // Reset position after gesture ends
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
          <CheckItem item={item} handleFavoriteItem={handleFavorite} handleRemoveItem={handleRemove}/>
        </Animated.View>
      </PanGestureHandler>
    );
  }
);

/*
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
*/

export default DraggableItem;
