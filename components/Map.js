import React, { useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import colors from '../assets/colors/colors';
import { useUserContext } from './UserContext';

const window = Dimensions.get('window');

export default function Map({ navigation, route }) {
    const { handleLocationSelect } = useUserContext();
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [mapRegion, setMapRegion] = useState({
        latitude: 50.879212,
        longitude: 20.639339,
        latitudeDelta: 0.0222,
        longitudeDelta: 0.0121,
    });
    const { location } = route.params || {};

    useEffect(() => {
        setMapRegion({
            latitude: location?.latitude || 50.879212,
            longitude: location?.longitude || 20.639339,
            latitudeDelta: 0.0222,
            longitudeDelta: 0.0121,
        });
    }, [location]);

    const renderMarkers = () => tasks.filter(task => task.location).map(task => (
        <Marker
            key={task.id}
            coordinate={task.location}
            title={task.name}
        />
    ));

    return (
        <View style={styles.window}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={mapRegion}
                onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
            >
                {renderMarkers()}
                {selectedLocation && (
                    <Marker
                        coordinate={selectedLocation}
                        title={"Wybrana lokalizacja"}
                    />
                )}
                {location && (
                    <Marker
                        coordinate={location}
                        title={location.name || "Przekazana lokalizacja"}
                        pinColor="blue"
                    />
                )}
            </MapView>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    if (selectedLocation) {
                        handleLocationSelect(selectedLocation.latitude, selectedLocation.longitude, "Wybrana lokalizacja");
                        navigation.goBack();
                    }
                }}
            >
                <Text style={styles.addText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    window: {
        flex:1,
    },
    header: {
        flex:25,
        backgroundColor: colors.mainGreen,
    },
    container: {
        flex: 975,
    },
    map: {
        flex: 1,
    },
    containerSearch: {
        zIndex:2,
        position:'absolute',
        left:window.width*0.15,
        top:window.height*0.1,
        width:window.width*0.7,
        height:window.height*0.08,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 30,
        paddingHorizontal: 15,
        paddingVertical: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        flex: 1,
        marginRight: 10,
        fontSize: window.height*0.02,
        color: '#000000',
    },
    searchIcon: {
        alignItems:'center',
        justifyContent:'center',
        resizeMode:'stretch',
        width: window.height*0.03,
        height: window.height*0.03,
    },
    addButton: {
        zIndex:2,
        position:'absolute',
        left:window.width*0.057692,
        bottom:window.height*0.106,
        backgroundColor: '#E12828',
        borderRadius: window.width*0.0512,
        width: window.width*0.8846,
        height: window.height*0.064,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    addText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
});