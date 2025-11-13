import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

export default function IndexScreen() {
  const [search, setSearch] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [pressedPoint, setPressedPoint] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearestInfo, setNearestInfo] = useState<{ route: any; distance: number } | null>(null);

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
      id: 4,
      name: 'Puente del Aguila',
      coord: { latitude: 4.33917001413423, longitude: -74.36374491390329 },
    },
    {
      id: 5,
      name: 'Hospital',
      coord: { latitude: 4.333187, longitude: -74.370590},
    },
    {
      id: 6,
      name: 'Terminal',
      coord: { latitude: 4.346124, longitude: -74.377642},
    },
  ];

  // 🚍 RUTAS
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
      name: 'Ruta 3 - Puente del Aguila ↔ Universidad',
      color: 'pink',
      coordinates: [
        { latitude: 4.33917001413423, longitude: -74.36374491390329 },
        { latitude: 4.336292949703569, longitude: -74.36612825022752 },
        { latitude: 4.3340689, longitude: -74.3694715 },
      ],
    },
     {
      id: 4,
      name: 'Ruta 4 - Terminal ↔ Hospital',
      color: 'blue',
      coordinates: [
        { latitude: 4.346124, longitude: -74.377642  },
        { latitude: 4.343499,  longitude: -74.376042 },
        { latitude: 4.343340,  longitude: -74.372027},
        { latitude: 4.341463, longitude: -74.367385 },
        { latitude: 4.341117, longitude: -74.366301 },
        { latitude: 4.341580,  longitude: -74.364432 },
        { latitude:4.342285,  longitude: -74.363218  },
        { latitude: 4.340399, longitude: -74.363153 },
        { latitude:4.339952,  longitude: -74.362770 },
        { latitude:4.339952, longitude: -74.362770 },
        { latitude:4.336539, longitude: -74.365758 },
        { latitude: 4.333187, longitude: -74.370590 },

      ],
    },
  ];

  // 🔎 Filtrar rutas por búsqueda
  const filteredRoutes = routes.filter((route) =>
    route.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🎭 Animar apertura/cierre del menú
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

  // 👇 Seleccionar ruta y cerrar menú
  const handleSelectRoute = (route: any) => {
    setSelectedRoute(route);
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  // ---------- Geometría: distancia punto - segmento (aprox. metro) ----------
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  // Distancia haversine entre dos puntos (metros)
  const haversine = (a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) => {
    const R = 6371000; // m
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const h =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  // Distancia desde punto p a segmento vw en metros (usando proyección equirectangular local)
  const pointToSegmentDistance = (
    p: { latitude: number; longitude: number },
    v: { latitude: number; longitude: number },
    w: { latitude: number; longitude: number }
  ) => {
    const R = 6371000;
    const project = (a: { latitude: number; longitude: number }) => {
      return {
        x: toRad(a.longitude - p.longitude) * R * Math.cos(toRad(p.latitude)),
        y: toRad(a.latitude - p.latitude) * R,
      };
    };
    const pv = project(v);
    const pw = project(w);
    const l2 = (pw.x - pv.x) ** 2 + (pw.y - pv.y) ** 2;
    if (l2 === 0) return Math.hypot(pv.x, pv.y);
    let t = (0 - pv.x) * (pw.x - pv.x) + (0 - pv.y) * (pw.y - pv.y);
    t = t / l2;
    t = Math.max(0, Math.min(1, t));
    const projx = pv.x + t * (pw.x - pv.x);
    const projy = pv.y + t * (pw.y - pv.y);
    return Math.hypot(projx, projy);
  };

  // Calcula la ruta más cercana a un punto (devuelve la ruta y la distancia mínima en metros)
  const findNearestRoute = (point: { latitude: number; longitude: number }) => {
    let bestRoute: any = null;
    let bestDist = Number.POSITIVE_INFINITY;

    for (const route of routes) {
      const coords = route.coordinates;
      // Si la ruta tiene menos de 2 puntos, usar distancia a vértices
      if (coords.length < 2) {
        for (const c of coords) {
          const d = haversine(point, c);
          if (d < bestDist) {
            bestDist = d;
            bestRoute = route;
          }
        }
      } else {
        // recorrer segmentos
        for (let i = 0; i < coords.length - 1; i++) {
          const a = coords[i];
          const b = coords[i + 1];
          const d = pointToSegmentDistance(point, a, b);
          if (d < bestDist) {
            bestDist = d;
            bestRoute = route;
          }
        }
      }
    }

    return { route: bestRoute, distance: bestDist };
  };

  // Manejar pulsación larga en el mapa: colocar punto y calcular ruta más cercana
  // Nota: se usa e: any para evitar errores de tipos si no están las definiciones
  const handleMapLongPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const pt = { latitude, longitude };
    setPressedPoint(pt);

    const nearest = findNearestRoute(pt);
    if (nearest.route) {
      setNearestInfo({ route: nearest.route, distance: Math.round(nearest.distance) });
      setSelectedRoute(nearest.route);
    } else {
      setNearestInfo(null);
      setSelectedRoute(null);
    }
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
        onLongPress={handleMapLongPress}
      >
        {/* 📍 Paradas */}
        {stops.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={stop.coord}
            title={stop.name}
          />
        ))}

        {/* 🛣️ Rutas: dibujar todas, y resaltar seleccionada */}
        {routes.map((route) => (
          <Polyline
            key={route.id}
            coordinates={route.coordinates}
            strokeColor={selectedRoute?.id === route.id ? '#ff8c00' : route.color}
            strokeWidth={selectedRoute?.id === route.id ? 6 : 4}
          />
        ))}

        {/* 🔴 Punto marcado por pulsación larga */}
        {pressedPoint && (
          <Marker coordinate={pressedPoint} title="Punto marcado" pinColor="red" />
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

      {/* 🤍 MENÚ DESPLEGABLE */}
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

      {/* Info overlay: ruta más cercana y distancia */}
      {nearestInfo && (
        <View style={styles.infoBox}>
          <Text style={{ fontWeight: '700' }}>{nearestInfo.route.name}</Text>
          <Text style={{ marginTop: 4 }}>{nearestInfo.distance} m de distancia</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    position: 'absolute',
    left: 20,
    bottom: 40,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 12,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    maxWidth: '75%',
  },
});
