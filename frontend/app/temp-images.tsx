import { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

type StudySpot = {
  id: number;
  pictures?: string[];
};

const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8000/api';

export default function TempImagesScreen() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    const loadImages = async () => {
      try {
        const response = await fetch(`${API_BASE}/study_spots`);
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as StudySpot[];
        if (!active || !Array.isArray(data)) {
          return;
        }

        const urls = data.flatMap((spot) =>
          Array.isArray(spot.pictures)
            ? spot.pictures.filter((picture): picture is string => typeof picture === 'string')
            : []
        );

        setImages(urls);
      } catch {
        // Intentionally silent: page should only display images.
      }
    };

    loadImages();

    return () => {
      active = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {images.map((url, index) => (
          <Image key={`${url}-${index}`} source={{ uri: url }} style={styles.image} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 8,
    gap: 8,
  },
  image: {
    width: '100%',
    height: 240,
  },
});
