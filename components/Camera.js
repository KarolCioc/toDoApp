import { StyleSheet, Text, View, TouchableOpacity, Button, Dimensions } from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { Camera, CameraType } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
const window = Dimensions.get('window');

export default function Cam({navigation}){
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const cameraRef = useRef(null);
    const [cameraKey, setCameraKey] = useState(0);
   
    useFocusEffect(
        useCallback(() => {
            setCameraKey(prevKey => prevKey+1);
            setType(CameraType.back);
            return () => {
            };
        }, [])
    );

    if(!permission){
        return <View><Text>Loading camera permission</Text></View>
    }
    
    if(!permission.granted){
        return (
            <View>
                <Text>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission"/>
            </View>
        );
    }

    async function takePicture() {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                const fileName = photo.uri.split('/').pop();
                const newPath = FileSystem.documentDirectory + fileName;
                await FileSystem.moveAsync({
                    from: photo.uri,
                    to: newPath
                });
                await AsyncStorage.setItem('lastPhoto', newPath);

                console.log("Photo saved at:", newPath);
                navigation.goBack();
            } catch (e) {
                console.error("Error taking picture:", e);
            }
        }
    }


    function toggleCameraType(){
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back))
    }
    return(
        <View style={styles.container}>
            <Camera key={cameraKey} style={styles.camera} type={type} ref={cameraRef} >
                <TouchableOpacity onPress={()=> navigation.navigate('IndividualChats')} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>x</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={takePicture} style={styles.buttonContainer2}>
                    <View style={styles.innerCircle} />
                </TouchableOpacity>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    buttonContainer: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: 'transparent',
        zIndex: 10,
    },
    buttonContainer2: {
        borderWidth: 2,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 70,
        backgroundColor: 'transparent',
        borderRadius: 35,
        position: 'absolute',
        bottom: 50,
        left: window.width*0.42
    },
    innerCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 25,  
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },
  });
