import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { StarFullIcon } from "../ui/icons";

export interface SpotCardProps {
  imgSrc: string;
  building: string;
  location: string;
  rating: string;
}

export default function SpotCardSmall ({
  imgSrc,
  building,
  location,
  rating,
}: SpotCardProps) {
  return (
    <View style={styles.baseView}>
      <Image source={imgSrc} style={styles.image} />
      <View style={[{
        top: 8,
      }, styles.innerView]}>
        <Text style={styles.buildingText}>
          {building}
        </Text>
        <Text style={styles.locationText}>
          {location}
        </Text>
      </View>
      <View style={[{
        bottom: 4,
      }, styles.innerView]}>
        <StarFullIcon />
        <Text style={styles.ratingText}>
          {rating}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  baseView: {
    width: 175,
    height: 50,
    backgroundColor: "white",
    borderRadius: 25,
    outlineStyle: "solid",
    outlineOffset: -1,
    outlineWidth: 1,
    outlineColor: "gray",
  },
  buildingText: {
    position: "absolute",
    fontWeight: "bold",
    fontSize: 12,
    color: "#bf5700",
  },
  image: {
    width: 40,
    height: 40,
    position: "absolute",
    top: 5,
    left: 5,
    borderRadius: 20,
  },
  innerView: {
    width: 105,
    height: 20,
    position: "absolute",
    left: 52,
    backgroundColor: "white",
  },
  locationText: {
    position: "absolute",
    right: 0,
    fontSize: 12,
    color: "black",
  },
  ratingText: {
    position: "absolute",
    left: 18,
    fontWeight: "bold",
    fontSize: 12,
    color: "black",
  },
});
