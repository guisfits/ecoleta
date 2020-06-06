import React from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import Constants from 'expo-constants'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'

const Points = () => {
  const navigation = useNavigation();

  function handlerNavigateBack() {
    navigation.goBack();
  }

  function handlerNavigateToDetail() {
    navigation.navigate("Detail");
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlerNavigateBack}>
        <Icon name="arrow-left" size={20} color="#34cd09" ></Icon>
      </TouchableOpacity>

      <Text style={styles.title}>Bem vindo.</Text>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -23.3463357,
            longitude: -47.8691143,
            latitudeDelta: 0.014,
            longitudeDelta: 0.014
          }}
        >
          <Marker
            style={styles.mapMarker}
            onPress={handlerNavigateToDetail}
            coordinate={{
              latitude: -23.3463357,
              longitude: -47.8691143,
            }}
          >
            <View style={styles.mapMarkerContainer}>
              <Image style={styles.mapMarkerImage} source={{ uri: "https://i.picsum.photos/id/805/300/200.jpg" }} />
              <Text style={styles.mapMarkerContainer}>Mercado</Text>
            </View>
          </Marker>
        </MapView>
      </View>

      <View style={styles.itemsContainer} >
        <ScrollView
          horizontal
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          <TouchableOpacity style={styles.item} onPress={() => { }}>
            <SvgUri width={42} height={42} uri="http://192.168.0.10:3333/public/lampadas.svg"></SvgUri>
            <Text style={styles.itemTitle}>Lâmpadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => { }}>
            <SvgUri width={42} height={42} uri="http://192.168.0.10:3333/public/lampadas.svg"></SvgUri>
            <Text style={styles.itemTitle}>Lâmpadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => { }}>
            <SvgUri width={42} height={42} uri="http://192.168.0.10:3333/public/lampadas.svg"></SvgUri>
            <Text style={styles.itemTitle}>Lâmpadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => { }}>
            <SvgUri width={42} height={42} uri="http://192.168.0.10:3333/public/lampadas.svg"></SvgUri>
            <Text style={styles.itemTitle}>Lâmpadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => { }}>
            <SvgUri width={42} height={42} uri="http://192.168.0.10:3333/public/lampadas.svg"></SvgUri>
            <Text style={styles.itemTitle}>Lâmpadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => { }}>
            <SvgUri width={42} height={42} uri="http://192.168.0.10:3333/public/lampadas.svg"></SvgUri>
            <Text style={styles.itemTitle}>Lâmpadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => { }}>
            <SvgUri width={42} height={42} uri="http://192.168.0.10:3333/public/lampadas.svg"></SvgUri>
            <Text style={styles.itemTitle}>Lâmpadas</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  )
}

export default Points;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});
