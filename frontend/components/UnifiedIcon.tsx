// UnifiedIcon.js
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Material from 'react-native-vector-icons/MaterialIcons';
// Import other icon libraries as needed

const UnifiedIcon = ({ type, name, size, style, color }) => {
  switch (type) {
    case 'ionicon':
      return <Ionicons name={name} size={size} style={style} color={color}/>;
    case 'fontawesome':
      return <FontAwesome name={name} size={size} style={style} color={color}/>;
      case 'materialicon':
        return <Material name={name} size={size} style={style} color={color}/>;
    default:
      return null;
  }
};

export default UnifiedIcon;