// UnifiedIcon.js
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// Import other icon libraries as needed

const UnifiedIcon = ({ type, name, size, style }) => {
  switch (type) {
    case 'ionicon':
      return <Ionicons name={name} size={size} style={style}/>;
    case 'fontawesome':
      return <FontAwesome name={name} size={size} style={style} />;
    // Add more cases here for other icon libraries
    default:
      return null;
  }
};

export default UnifiedIcon;