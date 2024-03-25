import React from 'react';
import { View, Text, Image} from 'react-native';
import {styles} from './style.js'
import { Pressable } from "native-base";

export default function Register({ navigation }) {
return (

<View style={styles.loginContainer}>
    <View style={styles.loginSection}>
        <Text style={styles.textLogin}>Sign Up</Text>
        <View style={styles.containerGoogle}>
            <Pressable style={{flexDirection:'row'}} onPress={()=>{navigation.navigate("MyDrawer")}}>
                <Image alt="google_img" source={require('../assets/images/google.png')}/>
                <Text style={styles.googleText} >Sign Up with Google</Text>
            </Pressable>
        </View>
        <Image
          source={require('../assets/images/logo.png')} 
          style={styles.bigLogo}
        />
    </View>
  </View>
  );
}