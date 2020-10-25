import React, { useState} from "react";
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from "react-native-maps";
import mapMarker from "../images/map-marker.png";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import {Feather} from "@expo/vector-icons";
import {useFonts} from "expo-font";
import {Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold} from "@expo-google-fonts/nunito";
import {useNavigation, useFocusEffect } from '@react-navigation/native';
import {RectButton} from "react-native-gesture-handler";
import api from "../services/api";

interface OrphanageItem {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
}

export default function OrphanagesMap() {
    const navigation = useNavigation();
    const [orphanages, setOrphanages] = useState<OrphanageItem[]>([])

    useFocusEffect(() => {
        api.get('orphanages').then(response => {
            setOrphanages(response.data)
        });
    });

    function handleNavigateToOrphanageDetails(id: number) {
        navigation.navigate('OrphanageDetails', { id });
    }

    function handleNavigateToCreateOrphanage() {
        navigation.navigate('SelectMapPosition');
    }

    const [fontsLoaded] = useFonts({
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 51.509865,
                    longitude: -0.118092,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.008
                }}
                provider={PROVIDER_GOOGLE}
            >
                {orphanages.map(orphanage => {
                    return (
                        <Marker
                            key={orphanage.id}
                            calloutAnchor={{
                                x: 4.7,
                                y: 1.3
                            }}
                            icon={mapMarker}
                            coordinate={{
                                latitude: orphanage.latitude,
                                longitude: orphanage.longitude,
                            }}>
                            <Callout tooltip onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}>
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutText}>{orphanage.name}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    )
                })}
            </MapView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>
                <RectButton style={styles.createOrphanageButton} onPress={() => {
                    handleNavigateToCreateOrphanage()
                }}>
                    <Feather name="plus" size={20} color="#FFF"/>
                </RectButton>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    calloutContainer: {
        width: 160,
        height: 46,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center'
    },
    calloutText: {
        color: '#0089a5',
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
    },

    footer: {
        position: "absolute",
        left: 24,
        right: 24,
        bottom: 32,

        backgroundColor: "#FFF",
        borderRadius: 20,
        height: 56,
        paddingLeft: 24,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        elevation: 3,

        shadowColor: '#000000',
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },

    footerText: {
        color: '#8fa7b3',
        fontFamily: 'Nunito_700Bold',
    },

    createOrphanageButton: {
        width: 56,
        height: 56,
        backgroundColor: '#15c3d6',
        borderRadius: 20,

        justifyContent: 'center',
        alignItems: 'center'
    },

});
