import { createDrawerNavigator } from '@react-navigation/drawer';
import MainList from './MainList';
import GroupTasks from './GroupTasks';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
  } from '@react-navigation/drawer';
import { styles } from './style';
import HeaderForDrawer from './headerForDrawer';
const Drawer = createDrawerNavigator();


export default function MyDrawer({navigation}) {
    function CustomDrawerContent(props) {
        return (
          <DrawerContentScrollView {...props} style={{backgroundColor: '#CDD016'}}>
            <DrawerItemList {...props} />
            <DrawerItem label="" icon = {()=> <Icon name="user-plus" size={30} color="black" />} onPress={() => navigation.navigate("AddUser")} />
            <DrawerItem label="" icon = {()=> <Icon name="users" size={30} color="black" />} onPress={() => navigation.navigate("AddGroup")} />
            <DrawerItem label="" icon = {()=> <Icon name="comment-dots" size={30} color="black" />} onPress={() => navigation.navigate("IndividualChats")} />
            <DrawerItem label="" icon = {()=> <Icon name="comments" size={30} color="black" />} onPress={() => navigation.navigate("GroupChats")} />
            <DrawerItem label="" icon = {()=> <Icon name="map-marked-alt" size={30} color="black" />} onPress={() => navigation.navigate("Map")} />
          </DrawerContentScrollView>
        );
      }

     return (
    <View style={{flex: 1, flexDirection: 'column'}}>
        <HeaderForDrawer navigation={navigation}/>
        <Drawer.Navigator 
            drawerStyle={styles.drawerStyle}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
              contentContainerStyle: styles.drawerContentContainer,
              headerTintColor: '#000000', 
              headerTitleStyle: {
              fontWeight: 'bold',
              color: 'white'
            },
            }}>
          <Drawer.Screen name="Individual Tasks" component={MainList} />
          <Drawer.Screen name="Group Tasks" component={GroupTasks} />
        </Drawer.Navigator>
    </View>
  );
}