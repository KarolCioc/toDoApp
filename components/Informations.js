import React from 'react';
import { View, Text } from 'react-native';
import { Dimensions } from 'react-native';
import { Pressable } from 'native-base';
import { useUserContext } from './UserContext';
const window = Dimensions.get('window');

export default function Settings({navigation}) {
  const { userInfo } = useUserContext();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#CDD016', height: window.height * 0.04, width: window.width * 1 }}></View>
      <View style={{ flex: 0.1, alignItems: 'center', backgroundColor: '#F1F1F1', margin:10}}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ marginLeft:window.width*0.35, fontSize:18, fontWeight:'500', color:'black' }}>Ustawienia</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Pressable onPress={()=> navigation.goBack()}><Text style={{fontSize:18, fontWeight:'500', color:'#E12828'}}>OK</Text></Pressable>
          </View>
        </View>
      </View>
      <View style={{ flex: 0.15,justifyContent:'space-evenly',alignItems:'center',backgroundColor: '#F1F1F1' }}>
        <Pressable style={{backgroundColor:'white', borderRadius:20, width:window.width*0.9, height:window.height*0.1}}>
            <Text style={{margin: 7,fontSize:18}}>Authors: <Text>Karol Cioć</Text></Text>
            <Text style={{marginLeft:79,fontSize:18}}>Filip Szemraj</Text>
        </Pressable>
      </View>
      <View style={{flex: 0.7, backgroundColor:'#F1F1F1', justifyContent:'flex-end'}}>
        <View style={{alignItems:'center'}}>
          <Text style={{color:'#838383', fontSize:14}}>Zalogowano jako {userInfo.email}</Text>
        </View>
      </View>
    </View>
  );
}