import React from 'react';
import {
    SafeAreaView,
    View,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    Button,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { CoreBridge, HistoryBridge, RichText, TaskListBridge, Toolbar, useEditorBridge } from '@10play/tentap-editor';
import NavigationButton from "@/components/NavigationButton";
import Footer from "@/components/Footer";
//import CheckBox from 'react-native-check-box'
import TabsFooter from "@/components/TabsFooter"

export default function Shopping() {
  const [items, setItems] = React.useState([
    { name: 'Item', quantity: 'x3', checked: false },
    { name: 'Item 2', quantity: 'x2', checked: false },
    { name: 'Item 3', quantity: 'x10', checked: false },
    { name: 'Item 4', quantity: 'x1', checked: false },
  ]);
  const [newItemName, setNewItemName] = React.useState('');
  const [newItemQuantity, setNewItemQuantity] = React.useState('');

  const addItem = () => {
    if (newItemName && newItemQuantity) {
      setItems([...items, { name: newItemName, quantity: `x${newItemQuantity}`, checked: false }]);
      setNewItemName('');
      setNewItemQuantity('');
    }
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const toggleCheckbox = (index) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      {/*<View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for item"
          placeholderTextColor="#666"
        />
      </View>*/}

      {/* Settings Row */}
      {/*<View style={styles.settingsRow}>
        <Text style={styles.settingsItem}>No. of stores</Text>
        <Text style={styles.settingsItem}>Max distance</Text>
        <Text style={styles.settingsItem}>Additional settings</Text>
      </View>*/}

      {/* Input for adding new items */}
      {/*<View style={styles.addItemContainer}>
        <TextInput
          style={styles.addItemInput}
          placeholder="New item name"
          value={newItemName}
          onChangeText={setNewItemName}
        />
        <TextInput
          style={styles.addItemInput}
          placeholder="Quantity"
          value={newItemQuantity}
          onChangeText={setNewItemQuantity}
          keyboardType="numeric"
        />
        <Button title="Add Item" onPress={addItem} />
      </View>*/}

        <View style={styles.headerContainer}>
          {/*<NavigationButton label="Back" type="back" destination="/welcome"/>*/}
          <View style={styles.headerSpacer}/>
          <Text style={styles.headerLabel}>My Favorite Items</Text>
          <View style={styles.headerSpacer}/>
        </View>

      {/* Scrollable List of Items */}
      <ScrollView contentContainerStyle={styles.itemListContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <TouchableOpacity style={styles.itemButton}>
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
            {/*<View style={styles.quantityButton}>
              <Text style={styles.quantityText}>{item.quantity}</Text>
            </View>
            <CheckBox
              style={styles.checkbox}
              onClick={() => toggleCheckbox(index)}
              isChecked={item.checked}
              leftText={null}
            />*/}
            <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(index)}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TabsFooter/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    //paddingHorizontal: 16,
    //paddingTop: 40,
  },

  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 100,
    backgroundColor: '#F6AA1C',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLabel: {
    width: 290,
    marginTop: 50,
    marginBottom: 10,
    color: '#232528',
    fontSize: 28,
    textAlign: 'center',
  },

  headerSpacer: {
    width: 50,
    height: 50,
    marginTop: 50,
    marginBottom: 10,
  },

  searchBarContainer: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
  },
  searchBar: {
    height: 40,
    backgroundColor: '#dcdcdc',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  settingsItem: {
    fontSize: 14,
    color: '#333',
  },
  addItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addItemInput: {
    flex: 1,
    backgroundColor: '#dcdcdc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
    height: 40,
  },
  itemListContainer: {
    //paddingBottom: 16,
    marginVertical: 30,
    marginHorizontal: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemButton: {
    flex: 1,
    backgroundColor: '#b0b0b0',
    borderRadius: 8,
    padding: 8,
  },
  itemText: {
    color: '#fff',
  },
  quantityButton: {
    backgroundColor: '#999',
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  quantityText: {
    color: '#fff',
  },
  checkbox: {
    flex: 1,
    padding: 10,
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  removeButtonText: {
    color: '#fff',
  },
});
