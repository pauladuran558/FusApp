import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

export default function IndexScreen() {
  const [search, setSearch] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  // 📍 PARADAS
  const stops = [
    {
      id: 1,
      name: 'Universidad de Cundinamarca',
      coord: { latitude: 4.3340689, longitude: -74.3694715 },
    },
    {
      id: 2,
      name: 'Barrio El Tejar',
      coord: { latitude: 4.3403456, longitude: -74.3589222 },
    },
    {
      id: 3,
      name: 'Barrio Fusacatán',
      coord: { latitude: 4.327645, longitude: -74.3655325 },
    },
    {
      id: 3,
      name: 'Puente del Aguila',
      coord: { latitude: 4.33917001413423 , longitude: -74.36374491390329 },
    },
  ];

  // 🚌 RUTAS
  const routes = [
    {
      id: 1,
      name: 'Ruta 1 - Universidad ↔ El Tejar',
      color: 'blue',
      coordinates: [
        { latitude: 4.3340689, longitude: -74.3694715 },
        { latitude: 4.3370, longitude: -74.3650 },
        { latitude: 4.3390, longitude: -74.3620 },
        { latitude: 4.3403456, longitude: -74.3589222 },
      ],
    },
    {
      id: 2,
      name: 'Ruta 2 - Universidad ↔ Fusacatán',
      color: 'green',
      coordinates: [
        { latitude: 4.3340689, longitude: -74.3694715 },
        { latitude: 4.3300, longitude: -74.3670 },
        { latitude: 4.327645, longitude: -74.3655325 },
      ],
    },
    {
      id: 3,
      name: 'Ruta 2 - Puente del Aguila ↔ Universidad',
      color: 'pink',
      coordinates: [
        { latitude: 4.33917001413423, longitude: -74.36374491390329 },
        { latitude: 4.336292949703569,  longitude: -74.36612825022752 },
        { latitude:4.3340689, longitude: -74.3694715 },
      ],
    },
  ];

  // 🔍 Filtrar rutas por búsqueda
  const filteredRoutes = routes.filter((route) =>
    route.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🎛 Animar apertura/cierre del menú
  const toggleMenu = () => {
    Animated.timing(animation, {
      toValue: menuVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setMenuVisible(!menuVisible);
  };

  const menuTranslate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  // 👆 Seleccionar ruta y cerrar menú
  const handleSelectRoute = (route: any) => {
    setSelectedRoute(route);
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 🗺️ MAPA PRINCIPAL */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 4.3340689,
          longitude: -74.3655,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
      >
        {/* 📍 Paradas */}
        {stops.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={stop.coord}
            title={stop.name}
          />
        ))}

        {/* 🚍 Ruta seleccionada */}
        {selectedRoute && (
          <>
            {selectedRoute.coordinates.map((coord: any, index: number) => (
              <Marker
                key={index}
                coordinate={coord}
                title={`${selectedRoute.name} - Parada ${index + 1}`}
              />
            ))}
            <Polyline
              coordinates={selectedRoute.coordinates}
              strokeColor={selectedRoute.color}
              strokeWidth={5}
            />
          </>
        )}
      </MapView>

      {/* ☰ BOTÓN DEL MENÚ */}
      <TouchableOpacity
        onPress={toggleMenu}
        style={{
          position: 'absolute',
          top: 40,
          right: 20,
          backgroundColor: '#fff',
          padding: 10,
          borderRadius: 50,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 4,
        }}
      >
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>

      {/* 🧭 MENÚ DESPLEGABLE */}
      <Animated.View
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 300,
          backgroundColor: 'white',
          padding: 20,
          transform: [{ translateX: menuTranslate }],
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 6,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Buscar Ruta
        </Text>

        {/* 🔎 CAMPO DE BÚSQUEDA */}
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            padding: 10,
            marginBottom: 15,
          }}
          placeholder="Ejemplo: El Tejar..."
          value={search}
          onChangeText={setSearch}
        />

        {/* 📋 LISTA DE RUTAS */}
        <FlatList
          data={filteredRoutes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: 12,
                backgroundColor:
                  selectedRoute?.id === item.id ? '#e0e0ff' : '#f9f9f9',
                borderRadius: 8,
                marginBottom: 8,
              }}
              onPress={() => handleSelectRoute(item)}
            >
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        {/* 🔵 BOTÓN VER RUTA */}
        <TouchableOpacity
          onPress={() => {
            if (selectedRoute) {
              setSelectedRoute(selectedRoute);
              setMenuVisible(false);
            }
          }}
          style={{
            backgroundColor: '#007AFF',
            padding: 14,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            Ver Ruta Seleccionada
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
