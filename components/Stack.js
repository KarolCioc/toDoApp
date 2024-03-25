import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FormLogin from './Login';
import WelcomeScreen from './WelcomePage';
import MyDrawer from './Drawer';
import Register from './Register'
import AddTask from './AddTask';
import AddUser from './AddUser';
import AddGroup from './AddGroup';
import Profile from './Profile';
import Settings from './Settings'
import Informations from './Informations';
import Theme from './Theme';
import IndividualChats from "./IndividualChats";
import GroupChats from './GroupChats';
import SpecIndividual from "./SpecIndividual";
import SpecGroup from './SpecGroup';
import Map from './Map';
import Camera from './Camera';
const Stack = createNativeStackNavigator();

const screenOptions ={
    headerShown:false
};

export default function StackNav() {
    return(
        <Stack.Navigator>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={screenOptions}/>
            <Stack.Screen name="Login" component={FormLogin} options={screenOptions}/>
            <Stack.Screen name="MyDrawer" component={MyDrawer} options={screenOptions}/>
            <Stack.Screen name="Register" component={Register} options={screenOptions}/>
            <Stack.Screen name="AddTask" component={AddTask} options={screenOptions}/>
            <Stack.Screen name="AddUser" component={AddUser} options={screenOptions}/>
            <Stack.Screen name="AddGroup" component={AddGroup} options={screenOptions}/>
            <Stack.Screen name="Profile" component={Profile} options={screenOptions}/>
            <Stack.Screen name="Settings" component={Settings} options={screenOptions}/>
            <Stack.Screen name="Informations" component={Informations} options={screenOptions}/>
            <Stack.Screen name="Theme" component={Theme} options={screenOptions}/>
            <Stack.Screen name="IndividualChats" component={IndividualChats} options={screenOptions}/>
            <Stack.Screen name="GroupChats" component={GroupChats} options={screenOptions}/>
            <Stack.Screen name="SpecIndividual" component={SpecIndividual} options={screenOptions}/>
            <Stack.Screen name="SpecGroup" component={SpecGroup} options={screenOptions}/>
            <Stack.Screen name="Map" component={Map} options={screenOptions}/>
            <Stack.Screen name="Camera" component={Camera} options={screenOptions}/>
        </Stack.Navigator>
    );
}