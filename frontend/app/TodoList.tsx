import React, {useState} from "react";
import {StyleSheet, TextInput, View} from "react-native";
import {
    ListItem,
    Input,
    Stack,
    Box,
    Text,
    Header, CheckBox,
} from "react-native-design-system";
import DraggableFlatList, {
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import {v4 as uuidv4} from "uuid";

function TodoList() {
    const [data, setData] = useState([]);
    const [text, setText] = useState("");
    const handleTextInput = (input) => {
        setText(input);
    };

    const handleAddTodo = () => {
        const todo = text.trim();
        if (!todo) return;
        const key = uuidv4();
        setData((prevData) => {
            const newItem = {
                key,
                todo,
                isCompleted: false,
            };
            return [newItem, ...prevData];
        });
        setText("");
    };

    const handleMarkAsCompleted = (key) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === key ? {...item, isCompleted: !item.isCompleted} : item
            )
        );
    };

    const handleDeleteTodo = (key) => {
        setData((prevData) => prevData.filter((item) => item.key !== key));
    };
    const handleQuantityChange = (key, newQuantity) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === key ? {...item, quantity: newQuantity} : item
            )
        );
    };
    const handleEditToggle = (key) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === key ? {...item, isEditing: !item.isEditing} : item
            )
        );
    };
    const renderItem = ({item, drag, isActive}) => {
        return (
            <ScaleDecorator>
                <ListItem
                    size="lg"
                    onLongPress={drag}
                    disabled={isActive}
                    background={isActive ? "gray300" : "white"}
                    rightIcon={
                        <View style={styles.quantityContainer}>
                            <Text style={styles.quantityLabel}>Qty:</Text>
                            <TextInput
                                style={styles.quantityInput}
                                keyboardType="numeric"
                                value={String(item.quantity)}
                                onChangeText={(value) => handleQuantityChange(item.key, parseInt(value) || 1)}
                            />
                        </View>
                    }
                >
                    <View style={styles.listItemContent}>
                        {/* Checkbox to mark as completed */}
                        <CheckBox
                            value={item.isCompleted || 0}  // Reflects the isCompleted state
                            onValueChange={() => handleMarkAsCompleted(item.key)}
                        />
                        {/* Text or TextInput based on edit mode */}
                        {item.isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={item.todo}
                                onChangeText={(newText) =>
                                    setData((prevData) =>
                                        prevData.map((todo) =>
                                            todo.key === item.key ? {...todo, todo: newText | ""} : todo
                                        )
                                    )
                                }
                                onBlur={() => handleEditToggle(item.key)} // Turn off editing on blur
                            />
                        ) : (
                            <Text
                                style={[
                                    styles.todoText,
                                    item.isCompleted ? styles.completed : null,
                                ]}
                                onPress={() => handleEditToggle(item.key)}
                            >
                                {item.todo}
                            </Text>
                        )}
                        <Text
                            style={styles.clearButton}
                            onPress={() => handleDeleteTodo(item.key)}
                        >
                            Clear
                        </Text>
                    </View>
                </ListItem>
            </ScaleDecorator>
        );
    };

    return (
        <>
            <Header>Sortable Todo</Header>
            <Stack horizontalSpace="md">
                <Input
                    value={text}
                    outline
                    placeholder="Add todos"
                    onChangeText={handleTextInput}
                    onSubmitEditing={handleAddTodo}
                />
            </Stack>
            {data && data.length === 0 && (
                <Box space="6xl">
                    <Text>Start typing to add todos...</Text>
                </Box>
            )}
            <DraggableFlatList
                data={data || []}
                onDragEnd={({data}) => setData(data)}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
            />
        </>
    );
}

const styles = StyleSheet.create({
    listItemContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        flex: 1,
        borderColor: "gray",
        borderWidth: 1,
        marginRight: 10,
        padding: 5,
    },
    todoText: {
        flex: 1,
        marginLeft: 10,
    },
    completed: {
        textDecorationLine: "line-through",
    },
    clearButton: {
        color: "red",
        marginLeft: 10,
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    quantityLabel: {
        marginRight: 5,
    },
    quantityInput: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 5,
        width: 50,
        textAlign: "center",
    },
});


export {TodoList};