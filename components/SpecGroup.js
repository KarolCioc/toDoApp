import React, { useEffect, useCallback, useState, useLayoutEffect} from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import {Composer, GiftedChat, MessageImage} from 'react-native-gifted-chat';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome5';
import HeaderForDrawer from './headerForDrawer';
import {useFocusEffect} from "@react-navigation/native";
const window = Dimensions.get('window');
import RNFS from 'react-native-fs';
import base64 from 'react-native-base64';
import storage from '@react-native-firebase/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useUserContext } from './UserContext';
import { Camera } from 'expo-camera';

const SpecIndividual = ({ navigation, route }) => {
    const { chatId } = route.params;
    const [messages, setMessages] = useState([]);
    const [chatTitle, setChatTitle] = useState('');
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const { selectedLocation, setSelectedLocation } = useUserContext();

    {/*const [pictureStyle, setPictureStyle] = useState(false);
    const [photoUri, setLastPhotoUri] = useState(null);*/}

    const sendLocation = async () => {
        if (selectedLocation && selectedLocation.latitude && selectedLocation.longitude) {
            const newMessage = {
                _id: uuidv4(),
                text: '',
                createdAt: new Date(),
                user: {
                    _id: auth?.currentUser?.email,
                    name: auth?.currentUser?.displayName,
                    avatar: auth?.currentUser?.photoURL,
                },
                location: {
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                    name: selectedLocation.name,
                },
            };

            setSelectedLocation(null);
            await onSend([newMessage]);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                await sendLocation();
            } catch (error) {
                console.error("Failed to send location:", error);
            }
        })();
    }, [selectedLocation]);


    {/*useFocusEffect(
        useCallback(() => {
            const sendLocationMessage = async () => {
                const { selectedLocation } = useContext(UserContext);

                if (selectedLocation && selectedLocation.latitude && selectedLocation.longitude) {
                    console.log(`Wysyłam lokalizację: ${selectedLocation.latitude}, ${selectedLocation.longitude}`);
                    const newMessage = {
                        _id: uuidv4(),
                        createdAt: new Date(),
                        user: {
                            _id: auth?.currentUser?.email,
                            name: auth?.currentUser?.displayName,
                            avatar: auth?.currentUser?.photoURL,
                        },
                        location: {
                            latitude: selectedLocation.latitude,
                            longitude: selectedLocation.longitude,
                        },
                    };

                    await onSend([newMessage]);
                }
            };

            sendLocationMessage().catch(console.error);
        }, [useContext(UserContext).selectedLocation])
    );*/}



    useFocusEffect(
        useCallback(() => {
            const sendPhotoMessage = async () => {
                const lastPhotoUri = await AsyncStorage.getItem('lastPhoto');
                if (lastPhotoUri) {
                    console.log(lastPhotoUri);
                    const newMessage = {
                        _id: uuidv4(),
                        text: '',
                        createdAt: new Date(),
                        user: {
                            _id: auth?.currentUser?.email,
                            name: auth?.currentUser?.displayName,
                            avatar: auth?.currentUser?.photoURL,
                        },
                        image: lastPhotoUri,
                    };

                    await onSend([newMessage]);

                    await AsyncStorage.removeItem('lastPhoto');
                }
            };

            sendPhotoMessage().catch(console.error);
        }, [])
    );




    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
                </View>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        const q = query(collection(db, `chats/${chatId}/messages`), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const firebaseMessagesPromises = snapshot.docs.map(async (doc) => {
                const data = doc.data();
                let imageUrl = null;

                if (data.image) {
                    try {
                        imageUrl = await storage().ref(data.image).getDownloadURL();
                    } catch (error) {
                        imageUrl = "Error while downloading photo";
                    }
                }

                return {
                    _id: doc.id,
                    text: data.text,
                    createdAt: data.createdAt.toDate(),
                    user: data.user,
                    image: imageUrl,
                    location: data.location,
                };
            });

            const firebaseMessages = await Promise.all(firebaseMessagesPromises);
            setMessages(firebaseMessages);
        });

        return () => unsubscribe();

    }, [chatId]);


    useEffect(()=>{
        const fetchChatDetails = async () => {
            const chatRef = doc(db, 'chats', chatId);
            const chatSnap = await getDoc(chatRef);

            if (chatSnap.exists()) {
                const chatData = chatSnap.data();

                setChatTitle(chatData.name);

            }else {
                console.log("No such document!");
                setChatTitle("Nieznany Czat");
            }
        };

        fetchChatDetails().then(() => {
            console.log('Chat details fetched successfully');
        }).catch(error => {
            console.error('Error fetching chat details:', error);
        });
    }, [chatId, navigation]);

    const base64ToUint8Array = (base64String) => {
        const binaryString = base64.decode(base64String);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };


    const uploadPhoto = async (photoUri) => {
        try {
            const fileContent = await RNFS.readFile(photoUri, 'base64');
            const byteArray = base64ToUint8Array(fileContent);

            const segments = photoUri.split('/');
            const fileName = segments.pop();
            console.log("filename: ", fileName);


            const storageRef = ref(storage, fileName);


            const result = await uploadBytes(storageRef, byteArray);


            const downloadURL = await getDownloadURL(result.ref);
            return downloadURL;
        } catch (error) {
            console.error('Upload failed', error);
        }
    };

    const onSend = useCallback(async (messages = []) => {
        let { _id, createdAt, text, user, location } = messages[0];


        let messageData = { _id, createdAt, text, user };

        const photoUri = await AsyncStorage.getItem('lastPhoto');
        console.log("SPEC photo uri", photoUri);
        if (photoUri) {
            {/*const result = await uploadPhoto(photoUri);
            if (result) {
                messageData.image = result;
            } else {
                console.log("Przesyłanie zdjęcia nie powiodło się.", result);
            }
            await AsyncStorage.removeItem('lastPhoto');
            setPictureStyle(false);
            setLastPhotoUri("");*/}

            const segments = photoUri.split('/');
            const fileName = segments.pop();
            const reference = storage().ref(fileName);

            console.log("filename: ", fileName);
            try {
                await new Promise((resolve, reject) => {
                    const task = reference.putFile(photoUri);
                    task.then(() => {
                        console.log('Image uploaded to the bucket!');
                        messageData.image = fileName;
                        resolve();
                    }).catch((error) => {
                        console.error('Upload failed', error);
                        reject(error);
                    });
                });


            } catch (error) {
                console.error('Error during file upload:', error);
            }
            finally{
                await AsyncStorage.removeItem('lastPhoto');
            }

        }
        if (location) {
            messageData.location = location;
        }
        console.log("Po wyslaniu");

        try {
            await addDoc(collection(db, `chats/${chatId}/messages`), messageData);

            const chatRef = doc(db, 'chats', chatId);
            await updateDoc(chatRef, {
                lastMessage: text,
                lastMessageCreatedAt: createdAt,
            });
        } catch (error) {
            console.error('Error sending message or updating chat:', error);
        }
    }, [chatId]);

    const handleNavigateToCamera = async () => {
        if (!permission || !permission.granted) {
            const { status } = await requestPermission();
            if (status !== 'granted') {
                alert('We need camera permissions to proceed');
                return;
            }
        }
        navigation.navigate('Camera');
    };

    const handleLocationSending = async (latitude, longitude, name) => {
        console.log("latitude: ", latitude);
        console.log("longitude: ", longitude);
        console.log("name: ", name);
    };

    const renderActions = () => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
            <TouchableOpacity
                style={{ marginRight: 5, padding: 2.5 }}
                onPress={handleNavigateToCamera}>
                <Icon name="camera" size={36} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
                style={{ marginRight: 5, padding: 2.5 }}
                onPress={() => navigation.navigate('Map')}>
                <Icon name="map-marker-alt" size={36} color="#000" />
            </TouchableOpacity>
            {/* {pictureStyle && photoUri && (
                <Image
                    source={{ uri: photoUri }}
                    style={{ width: 40, height: 40, marginHorizontal: 4 }}
                />
            )} */}

        </View>
    );

    const renderMessage = (props) => {
        if (props.currentMessage && props.currentMessage.location) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Map', {
                            location: {
                                latitude: props.currentMessage.location.latitude,
                                longitude: props.currentMessage.location.longitude,
                                name: props.currentMessage.location.name,
                            },
                        });
                    }}
                    style={{ padding: 5, alignItems: 'center' }}
                >
                    <Icon name="map-marker-alt" size={32} color="red" />
                </TouchableOpacity>
            );
        }
    };


    return (
        <View style={{ flex: 1, backgroundColor: '#F1F1F1' }}>
            <HeaderForDrawer navigation={navigation} />
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                <View style={{ paddingTop: 5, paddingBottom: 5, backgroundColor: 'gray', alignItems: 'center' }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{chatTitle}</Text>
                </View>
                <GiftedChat
                    messages={messages}
                    //photoStyle={pictureStyle}
                    onSend={newMessage => onSend(newMessage)}
                    user={{
                        _id: auth?.currentUser?.email,
                        name: auth?.currentUser?.displayName,
                        avatar: auth?.currentUser?.photoURL,
                    }}
                    renderActions={renderActions}
                    renderComposer={(props) => {
                        return (
                            <Composer
                                {...props}
                                textInputStyle={{
                                    color: 'black',
                                    backgroundColor: '#F4F4F4',
                                    borderRadius: 15,
                                    padding: 10,
                                    margin:10,
                                    marginBottom:5,
                                    marginTop:5,
                                }}
                            />
                        );
                    }}
                    renderMessageImage={(props) => {
                        if (props.currentMessage.image === 'Error while downloading photo') {
                            return (
                                <View style={{ padding: 10, backgroundColor: '#ffcccc', borderRadius: 10 }}>
                                    <Text style={{ color: 'red' }}>Error while downloading photo</Text>
                                </View>
                            );
                        }

                        return <MessageImage {...props} />;
                    }}
                    renderCustomView={renderMessage}
                />
            </View>
        </View>
    );
};

export default SpecIndividual;