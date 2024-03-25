import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import HeaderForDrawer from './headerForDrawer';

export default function IndividualChats({ navigation }) {
    const [chats, setChats] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            const loadUserChats = async () => {
                const currentUserUid = auth.currentUser.uid;
                const userRef = doc(db, 'users', currentUserUid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    const chatIds = userData.chatList || [];

                    const chatDetailsPromises = chatIds.map(async (chatId) => {
                        const chatRef = doc(db, 'chats', chatId);
                        const chatSnap = await getDoc(chatRef);
                        if (chatSnap.exists()) {
                            const chatData = chatSnap.data();
                            const otherUserId = chatData.participants.find(id => id !== currentUserUid);
                            const otherUserRef = doc(db, 'users', otherUserId);
                            const otherUserSnap = await getDoc(otherUserRef);
                            let photoURL = "";
                            if (otherUserSnap.exists()) {
                                photoURL = otherUserSnap.data().photoURL;
                            }
                            return { id: chatSnap.id, ...chatData, photoURL };
                        } else {
                            return null;
                        }
                    });

                    const chatDetails = await Promise.all(chatDetailsPromises);
                    setChats(chatDetails.filter(chat => chat !== null));
                } else {
                    console.log("No such document!");
                }
            };

            loadUserChats();
        }, [])
    );


    return (
        <View style={{ flex: 1, backgroundColor: '#F1F1F1' }}>
            <HeaderForDrawer navigation={navigation} />
            <View style={{ flex: 1 }}>
                <FlatList
                    data={chats}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={{ flexDirection: 'row', padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc', alignItems: 'center' }}
                            onPress={() => navigation.navigate('SpecIndividual', { chatId: item.id, chatName: item.name })}
                        >
                            <Image
                                source={{ uri: item.photoURL || 'https://via.placeholder.com/150' }}
                                style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
                            />
                            <View>
                                <Text style={{ fontWeight: 'bold' }}>{item.name || "Unnamed Chat"}</Text>
                                <Text style={{ marginLeft: 20 }}>{item.lastMessage || ""}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />

            </View>
        </View>
    );
}
