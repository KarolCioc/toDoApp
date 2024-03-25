import React from 'react';
import { View, Text} from 'react-native';
import HeaderForDrawer from './headerForDrawer';
import { Dimensions } from 'react-native';
import {styles} from './style';
import { useNavigation } from '@react-navigation/native';
import { Pressable, Image } from 'native-base';
import { useUserContext } from './UserContext';
const window = Dimensions.get('window');

export default function Profile() {
  const navigation = useNavigation();
  const { userInfo } = useUserContext();

  return (
    <View style={{ flex: 1 }}>
      <HeaderForDrawer navigation={navigation}/>
      <View style={{flex:1}}>
        <View style={{margin:window.height*0.03}}>
            <Text style={styles.infoTextProfile}>Name</Text>
            <Text style={styles.infoTextProfileSpecified}>{userInfo?.displayName}</Text>
            <Text style={styles.infoTextProfile}>Country</Text>
            <Text style={styles.infoTextProfileSpecified}>Poland</Text>
        </View>
        <View style={{flex:1,justifyContent:'flex-end'}}>
            <View style={{margin:10,justifyContent:'space-between',flexDirection:'row'}}>
                <Pressable onPress={()=> navigation.goBack()}><Image alt="exit_img"source={require('../assets/images/exitButton.png')}/></Pressable>
                <Pressable onPress={()=> navigation.navigate('Settings')}><Image alt="settings_img" source={require('../assets/images/settings.png')}/></Pressable>
            </View>
        </View>
      </View>
    </View>
  );
}