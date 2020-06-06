import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import api from '../../services/api'
import MailComposer from 'expo-mail-composer'

interface Params {
  point_id: number;
}

interface Point {
  id: number;
  image: string;
  name: string;
  email: string;
  whatsapp: string;
  latitude: string;
  longitude: string;
  city: string;
  uf: string;
  items: {
    title: string;
    image: string;
  }[]
}

const Defail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [point, setData] = useState<Point>({} as Point)

  const routeParams = route.params as Params

  useEffect(() => {
    api.get<Point>(`points/${routeParams.point_id}`).then(response => {
      setData(response.data);
    })
  }, []);

  function handlerNavigateBack() {
    navigation.goBack();
  }

  function handlerComposeMail() {
    MailComposer.composeAsync({
      subject: "Interesse na coleta de residuos",
      recipients: [point.email],
    })
  }

  function handlerWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${point.whatsapp}&text=Tenho interesse sobre coleta de residuos`);
  }

  if (!point) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handlerNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cd09" ></Icon>
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{ uri: "https://i.picsum.photos/id/805/300/200.jpg" }}
        ></Image>

        <Text style={styles.pointName}>{point.name}</Text>
        <Text style={styles.pointItems}>{point.items?.map(x => x.title).join(', ')}</Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{point.city}, {point.uf}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handlerWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handlerComposeMail}>
          <Icon name="mail" size={20} color="#FFF" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  )
}

export default Defail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});
