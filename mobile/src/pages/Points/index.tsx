import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import Constants from 'expo-constants'
import * as Location from "expo-location"
import React, { useEffect, useState } from 'react'
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'

import { Item, Point } from '../../models/api-responses'
import api from '../../services/api'

interface Params {
  uf: string;
  city: string;
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPostion, setInitialPosition] = useState<[number, number]>([0, 0])

  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as Params;

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('oooops', 'Precisamos de sua permissao para obter a localizacao')
      }

      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;

      setInitialPosition([latitude, longitude]);
    }
    loadPosition();
  }, [])

  useEffect(() => {
    api.get("items").then(response => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    api.get<Point[]>('points', {
      params: {
        city: params.city,
        uf: params.uf,
        items: selectedItems
      }
    }).then(response => { setPoints(response.data); })
  }, [selectedItems])

  function handlerNavigateBack() {
    navigation.goBack();
  }

  function handlerNavigateToDetail(id: number) {
    navigation.navigate("Detail", { point_id: id });
  }

  function handlerSelectItem(item: Item) {
    const alreadySelected = selectedItems.findIndex(id => id === item.id) >= 0;

    if (alreadySelected) {
      setSelectedItems(selectedItems.filter(id => id !== item.id));
    }
    else {
      const set = new Set<number>();
      selectedItems.forEach(item => set.add(item));
      set.add(item.id);

      setSelectedItems(Array.from(set.values()));
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlerNavigateBack}>
        <Icon name="arrow-left" size={20} color="#34cd09" ></Icon>
      </TouchableOpacity>

      <Text style={styles.title}>Bem vindo.</Text>

      <View style={styles.mapContainer}>
        {initialPostion[0] !== 0 && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: initialPostion[0],
              longitude: initialPostion[1],
              latitudeDelta: 0.014,
              longitudeDelta: 0.014
            }}
          >
            {points.map(point => (
              <Marker
                key={point.id}
                style={styles.mapMarker}
                onPress={() => handlerNavigateToDetail(point.id)}
                coordinate={{
                  latitude: +point.latitude,
                  longitude: +point.longitude,
                }}
              >
                <View style={styles.mapMarkerContainer}>
                  <Image style={styles.mapMarkerImage} source={{ uri: point.image }} />
                  <Text style={styles.mapMarkerContainer}>{point.name}</Text>
                </View>
              </Marker>
            ))}
          </MapView>
        )}
      </View>

      <View style={styles.itemsContainer} >
        <ScrollView
          horizontal
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {items.map(item => (
            <TouchableOpacity
              key={String(item.id)}
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {}
              ]}
              onPress={() => handlerSelectItem(item)}
              activeOpacity={0.6}
            >
              <SvgUri width={42} height={42} uri={item.image_url}></SvgUri>
              <Text style={styles.itemTitle}>{item.name}</Text>
            </TouchableOpacity>
          ))}
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
