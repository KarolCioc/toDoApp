import { Text, View, Image, Pressable} from 'react-native';
import { styles } from './style';
import { useUserContext } from './UserContext';

export default function HeaderForDrawer({navigation}){
  const { userInfo } = useUserContext();

    return(
        <View style={styles.containerHeader}>
            <View style={styles.container2}>
                <Image style={styles.headerLogo2} source={require('../assets/images/logo.png')}/>
                <Text style={styles.textHeader}>Whale Notes</Text>
                {userInfo?.photoURL ? (
                    <Pressable onPress={()=> navigation.navigate('Profile')}>
                        <Image style={styles.userPhoto} source={{ uri: userInfo.photoURL }}/>
                    </Pressable>
                ) : null}
            </View>
        </View>
    );
}
