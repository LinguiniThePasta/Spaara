import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { globalStyles } from '@/styles/globalStyles';
import { Colors } from '@/styles/Colors';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import Footer from '@/components/Footer';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/scripts/config';

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
  // Search term for what friend user is looking for
  const [searchTerm, setSearchTerm] = useState('');
  // Dropdown visibility state
  const [dropdownVisible, setDropdownVisible] = useState(false);
  // Outgoing requests list
  const [outgoingRequests, setOutgoingRequests] = useState<User[]>([]);
  // Incoming requests list
  const [incomingRequests, setIncomingRequests] = useState<User[]>([]);
  // Friends list
  const [friends, setFriends] = useState<User[]>([]);
  // Friend request count
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [modalVisible, setModalVisible] = useState(false);

  //API CALLS
  // TODO: Make fetching smart based on search term
  const fetchOtherUsers = async () => {
    try {
      const jwtToken = await SecureStore.getItemAsync('jwtToken');

      const response = await axios.get(`${API_BASE_URL}/api/other_users`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const users = response.data.map((item) => ({
        id: item.id.toString(),
        name: item.username,
      }));

      setUsers(users);
      console.log('Correctly fetched other users!');
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  // Get a user's friends
  const fetchFriends = async () => {
    try {
      const jwtToken = await SecureStore.getItemAsync('jwtToken');

      const response = await axios.get(`${API_BASE_URL}/api/user/friends`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const users = response.data.map((item) => ({
        id: item.id.toString(),
        name: item.username,
      }));

      setFriends(users);
      console.log('Correctly fetched friends!');
    } catch (error) {
      console.error('Error fetching friends:', error.message);
    }
  };

  // Fetch friend requests count
  const fetchRequestCount = async () => {
    try {
      const jwtToken = await SecureStore.getItemAsync('jwtToken');

      const response = await axios.get(`${API_BASE_URL}/api/friend_requests/count/`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setFriendRequestCount(response.data.count);
      console.log('Correctly fetched friend requests!');
    } catch (error) {
      console.error('Error fetching friend requests:', error.message);
    }
  };

  // Fetch incoming friend requests
  const fetchIncomingRequests = async () => {
    try {
      const jwtToken = await SecureStore.getItemAsync('jwtToken');

      const response = await axios.get(`${API_BASE_URL}/api/friend_requests/incoming/`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const users = response.data.map((item) => ({
        id: item.from_user.id.toString(),
        name: item.from_user.username,
      }));

      setIncomingRequests(users);
    } catch (error) {
      console.error('Error fetching friend requests:', error.message);
    }
  };

  // Fetch outgoing friend requests
  const fetchOutgoingRequests = async () => {
    try {
      const jwtToken = await SecureStore.getItemAsync('jwtToken');

      const response = await axios.get(`${API_BASE_URL}/api/friend_requests/outgoing/`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const users = response.data.map((item) => ({
        id: item.to_user.id.toString(),
        name: item.to_user.username, 
      }));

      setOutgoingRequests(users);

      console.log('Correctly fetched friend requests!');
    } catch (error) {
      console.error('Error fetching friend requests:', error.message);
    }
  };

  useEffect(() => {
    fetchOtherUsers();
    fetchFriends();
    fetchRequestCount();
    fetchOutgoingRequests();
    fetchIncomingRequests();
  }, []);

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
    setDropdownVisible(true); // Show dropdown when typing
  };

  /* Send out a friend request */
  const sendFriendRequest = async (username) => {
    try {
      const jwtToken = await SecureStore.getItemAsync('jwtToken');

      const response = await axios.post(
        `${API_BASE_URL}/api/friend_requests/send/`,
        {
          username: username,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      fetchOutgoingRequests(); // Refresh outgoing requests
      console.log('Correctly sent friend request!');
    } catch (error) {
      console.error('Error sending friend request:', error.message);
    }
  };

  /* Approve a friend request */
  const approveFriendRequest = async (username) => {
    try {
      const jwtToken = await SecureStore.getItemAsync('jwtToken');

      const response = await axios.post(
        `${API_BASE_URL}/api/friend_requests/approve/`,
        {
          username: username,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      console.log('Friend request approved!');

      // Update state
      setIncomingRequests((prevRequests) => prevRequests.filter((req) => req.name !== username));
      setFriendRequestCount((prevCount) => prevCount - 1);
      fetchFriends(); // Refresh friends list
    } catch (error) {
      console.error('Error approving friend request:', error.message);
    }
  };

  /* Reject a friend request */
  const rejectFriendRequest = async (username) => {
    try {
      const jwtToken = await SecureStore.getItemAsync('jwtToken');

      const response = await axios.post(
        `${API_BASE_URL}/api/friend_requests/reject/`,
        {
          username: username,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      console.log('Friend request rejected!');

      // Update state
      setIncomingRequests((prevRequests) => prevRequests.filter((req) => req.name !== username));
      setFriendRequestCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error('Error rejecting friend request:', error.message);
    }
  };

  const filteredUsers = searchTerm
    ? users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <View style={styles.headerContainer}>
            {/* Header Component */}
            <Header header="Social" backButton={false} backLink={'profile'} noProfile={true} />
            {/* Bell Icon Button aligned to the far right */}
            <TouchableOpacity
              style={styles.bellIconButton}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <Icon name="notifications-outline" size={36} color={Colors.light.primaryColor} />
              {friendRequestCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{friendRequestCount > 99 ? '99+' : friendRequestCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

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
                placeholder="Find Friends..."
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
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => sendFriendRequest(item.name)}
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
          <View>
            <FlatList
              data={outgoingRequests}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text style={styles.listItemTitle}>{item.name}</Text>
                  <MatIcon style={styles.listItemIcon} name="outgoing-mail"/>
                </View>
              )}
            />
            <FlatList
              data={friends}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text style={styles.listItemTitle}>{item.name}</Text>
                </View>
              )}
            />
          </View>
        </SafeAreaView>
        <Footer />

        {/* Modal for Friend Requests */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Friend Requests</Text>
              {incomingRequests.length > 0 ? (
                <FlatList
                  data={incomingRequests}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.friendRequestItem}>
                      <Text style={styles.friendRequestName}>{item.name}</Text>
                      <View style={styles.friendRequestButtons}>
                        <TouchableOpacity
                          onPress={() => approveFriendRequest(item.name)}
                        >
                          <Icon style={styles.buttonText} name="checkmark"/>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => rejectFriendRequest(item.name)}
                        >
                         <Icon style={styles.buttonText} name="close-outline"/>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />
              ) : (
                <Text>No friend requests</Text>
              )}
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Aligns Header to the left and Bell Icon Button to the right
    paddingRight: 35,
  },
  bellIconButton: {
    position: 'relative',
    marginLeft: 15,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    position: 'relative',
    zIndex: 2,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    width: 300,
    left: '50%',
    transform: [{ translateX: -150 }],
    backgroundColor: 'white',
    borderColor: Colors.light.primaryColor,
    borderWidth: 1,
    borderRadius: 4,
    maxHeight: 150,
    zIndex: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.primaryText,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.primaryColor,
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
  listItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primaryText,
  },
  listItemMessage: {
    justifyContent: 'flex-end',
    fontSize: 12,
    paddingRight: 20,
    fontWeight: 'bold',
    color: Colors.light.secondaryText,
  },
  listItemIcon: {
    justifyContent: 'flex-end',
    fontSize: 35,
    paddingRight: 20,
    fontWeight: 'bold',
    color: Colors.light.primaryColor,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 3,
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.light.primaryText,
    textAlign: 'center',
  },
  friendRequestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  friendRequestName: {
    fontSize: 16,
    color: Colors.light.primaryText,
  },
  friendRequestButtons: {
    flexDirection: 'row',
  },
  approveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 40,
    paddingHorizontal: 10,
    color: Colors.light.primaryColor,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.light.primaryColor,
  },
});
