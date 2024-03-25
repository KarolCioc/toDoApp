import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import HeaderForDrawer from './headerForDrawer';

export default function GroupChats({ navigation }) {
    const [chats, setChats] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            const loadUserChats = async () => {
                const currentUserUid = auth.currentUser.uid;
                const userRef = doc(db, 'users', currentUserUid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    const groupIds = userData.groupChatList || [];

                    // Pobieranie identyfikatorów czatów z dokumentów grup na podstawie identyfikatorów grup
                    const chatIdsPromises = groupIds.map(async (groupId) => {
                        const groupRef = doc(db, 'groups', groupId);
                        const groupSnap = await getDoc(groupRef);
                        if (groupSnap.exists() && groupSnap.data().chatId) {
                            return groupSnap.data().chatId;
                        } else {
                            return null;
                        }
                    });

                    const chatIds = (await Promise.all(chatIdsPromises)).filter(id => id !== null);

                    // Pobieranie szczegółów czatu
                    const chatDetailsPromises = chatIds.map(async (chatId) => {
                        const chatRef = doc(db, 'chats', chatId);
                        const chatSnap = await getDoc(chatRef);
                        if (chatSnap.exists()) {
                            const chatData = chatSnap.data();
                            return { id: chatSnap.id, ...chatData };
                        } else {
                            return null;
                        }
                    });

                    const chatDetails = await Promise.all(chatDetailsPromises);
                    // Zachowanie tylko istniejących czatów
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
                            onPress={() => navigation.navigate('SpecGroup', { chatId: item.id, chatName: item.name })}
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
