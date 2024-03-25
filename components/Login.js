import React, { useEffect, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { View, Image } from 'react-native';
import { styles } from './style.js';
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useUserContext } from './UserContext';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from "../firebase";

export default function FormLogin({ navigation }) {
    const [error, setError] = useState();
    const { userInfo, setUserInfo } = useUserContext();

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "643427365202-krkh6gq39gh7d6s8lfgp84mbf5ddavu3.apps.googleusercontent.com",
        });
    }, []);

    const saveUserToFirestore = async (user) => {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
        });
    };

    const signin = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const { idToken } = await GoogleSignin.signIn();
            const googleCredential = GoogleAuthProvider.credential(idToken);
            const authResult = await signInWithCredential(auth, googleCredential);

            if (authResult.additionalUserInfo?.isNewUser) {
                console.log("Nowy użytkownik został pomyślnie zarejestrowany");
                await saveUserToFirestore(authResult.user);
            } else {
                console.log("Użytkownik zalogował się ponownie");

            }

            setUserInfo(authResult.user);
            setError(null);
            navigation.navigate("MyDrawer");
        } catch (e) {
            setError(e);
            console.error(e);
        }
    };

    return (
        <View style={styles.loginContainer}>
            <View style={styles.loginSection}>
                <GoogleSigninButton
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={signin}
                />
                <StatusBar style="auto" />

                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.bigLogo}
                />
            </View>
        </View>
    );
}