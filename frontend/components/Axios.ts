import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from "@/scripts/config";

// Function to refresh the access token
const refreshAccessToken = async () => {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!refreshToken) {
        console.error('No refresh token found');
        return null;
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/api/user/refresh`, {
            refresh: refreshToken,
        });

        // Save the new access token
        await SecureStore.setItemAsync('jwtToken', response.data.access);
        return response.data.access;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
};

// Set up the axios interceptor
// axios.interceptors.response.use(
//     response => response,
//     async (error) => {
//         const originalRequest = error.config;
//         if (error.response && error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             const newToken = await refreshAccessToken();
//             if (newToken) {
//                 axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
//                 originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
//                 return axios(originalRequest);
//             }
//         }
//         return Promise.reject(error);
//     }
// );
//
// export default axios;


export const isAuthenticated = async () => {
  try {
    const token = await SecureStore.getItemAsync('jwtToken');
    return token !== null; // Returns true if the token exists, false otherwise
  } catch (error) {
    console.log('Error checking authentication:', error);
    return false;
  }
};