import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "@/components/Header";
import {globalStyles} from "@/styles/globalStyles";
import {Colors} from '@/styles/Colors';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from "@/components/Footer";

interface User {
  id: number;
  name: string;
}

const mockUsers: User[] = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Alice Johnson' },
  // Add more mock users as needed
];

const SocialPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [addedUsers, setAddedUsers] = useState<User[]>([]);
  
  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
    setDropdownVisible(true); // Show dropdown when typing
  };

  const handleAddUser = (user: User) => {
    if (!addedUsers.find(u => u.id === user.id)) {
      setAddedUsers([...addedUsers, user]);
    }
    setDropdownVisible(false); // Hide dropdown after adding a user
  };

  const filteredUsers = searchTerm
    ? mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Close dropdown when touching outside
  const handleOutsidePress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
      Keyboard.dismiss(); // Hide the keyboard if visible
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          <Header header="Social" backButton={false} backLink={"profile"} noProfile={true} />
          <View style={styles.searchContainer}>
            <View style={globalStyles.searchBar}>
              <Icon
                name="search-outline"
                size={20}
                color={Colors.light.primaryColor}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor={Colors.light.secondaryText}
                value={searchTerm}
                onChangeText={handleSearchChange}
                onFocus={() => setDropdownVisible(true)}
              />
            </View>
            {dropdownVisible && filteredUsers.length > 0 && (
              <View style={styles.dropdown}>
                <FlatList
                  data={filteredUsers}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleAddUser(item)}
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
          <FlatList
            data={addedUsers}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listItemTitle}>{item.name}</Text>
              </View>
            )}
          />
        </SafeAreaView>
        <Footer/>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SocialPage;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    width: 300, // Set your desired width
    left: '50%',
    transform: [{ translateX: -150 }], // Negative half of the width
    backgroundColor: 'white',
    borderColor: Colors.light.primaryColor,
    borderWidth: 1,
    borderRadius: 4,
    maxHeight: 150,
    zIndex: 2,
  },
  searchContainer: {
    position: 'relative',
    zIndex: 2, // Ensure the search container has a higher zIndex
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.primaryColor,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  userItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addedUserItem: {
    paddingVertical: 12,
  },
  addedFriendsContainer: {
    zIndex: 1, // Set lower zIndex to ensure it's beneath the dropdown
  },
  searchIcon: {
    marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.light.primaryText,
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        height: 70,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.secondaryText,
        position: 'relative',
    },
    listItemLeft: {
        flexDirection: 'column',
    },
    listItemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.primaryText,
    },
    listItemDate: {
        fontSize: 14,
        color: Colors.light.secondaryText,
    },
});