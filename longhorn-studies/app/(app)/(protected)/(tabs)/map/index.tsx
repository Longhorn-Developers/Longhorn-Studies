import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform } from 'react-native';

export default function Home() {
  return Platform.OS === 'ios' ? (
    <AppleMaps.View
      style={{ flex: 1 }}
      cameraPosition={{ coordinates: { latitude: 30.285, longitude: -97.739 }, zoom: 14.5 }}
    />
  ) : (
    <GoogleMaps.View style={{ flex: 1 }} />
  );
}
