import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import HeaderForDrawer from './headerForDrawer';
import { Dimensions } from 'react-native';
import { styles } from './style';
import { Pressable } from 'native-base';
import { doc, updateDoc, arrayUnion, getDocs, collection, query, where, serverTimestamp, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { getAuth } from 'firebase/auth';

const window = Dimensions.get('window');

export default function AddUser({ navigation }) {
    const [newFriendName, setNewFriendName] = React.useState('');

    const addNewFriend = async (friendName) => {
        if (!friendName) {
            console.error('Friend name is empty');
            return;
        }

        try {
            // Pobierz ID zalogowanego użytkownika z Firebase Auth
            const userAuth = getAuth();
            const userId = userAuth.currentUser ? userAuth.currentUser.uid : null;

            if (!userId) {
                console.error('No authenticated user found');
                return;
            }

            // Wyszukaj użytkownika (znajomego) po nazwie
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('displayName', '==', friendName));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.error('No user found with the given name');
                return;
            }

            // Załóżmy, że nazwy użytkowników są unikalne
            const friendDoc = querySnapshot.docs[0];
            const friendId = friendDoc.id;

            // Dodaj znajomego do listy znajomych zalogowanego użytkownika
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, {
                friendList: arrayUnion(friendId)
            });

            const friendDocRef = doc(db, 'users', friendId);

            await updateDoc(friendDocRef, {
                friendList: arrayUnion(userId)
            });

            const chatName = `Czat pomiędzy ${[userAuth.currentUser.displayName, friendName].sort().join(', a ')}`;

            const chatData = {
                participants: [userId, friendId],
                createdAt: serverTimestamp(),
                lastMessage: "",
                name: chatName,
            };

            const chatDocRef = await addDoc(collection(db, 'chats'), chatData);


            const updateUserChatList = async (userId, chatId) => {
                const userChatRef = doc(db, 'users', userId);
                await updateDoc(userChatRef, {
                    chatList: arrayUnion(chatId)
                });
            };

            await updateUserChatList(userId, chatDocRef.id);
            await updateUserChatList(friendId, chatDocRef.id);

            console.log('Friend added successfully');
        } catch (error) {
            console.error('Error adding new friend', error);
        }
    };

    const handleAddFriend = () => {
        addNewFriend(newFriendName).then(() => {
            setNewFriendName('');
            navigation.navigate('MainList');
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <HeaderForDrawer navigation={navigation}/>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#F1F1F1' }}
            >
                <View style={styles.containerInputsAdd}>
                    <Text style={styles.textAddFriend}>Add new friend</Text>
                    <View style={styles.containerInputAddFriend}>
                        <TextInput
                            style={styles.textNameFriend}
                            placeholder='Enter name of new friend'
                            value={newFriendName}
                            onChangeText={setNewFriendName}
                        />
                    </View>
                </View>
                <View style={styles.containerAddButtons}>
                    <Pressable style={styles.buttonsAddUser} onPress={()=> navigation.goBack()}>
                        <Text style={styles.textButtonsAdd}>Cancel</Text>
                    </Pressable>
                    <Pressable style={styles.buttonsAddUser} onPress={handleAddFriend}>
                        <Text style={styles.textButtonsAdd}>Enter</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}