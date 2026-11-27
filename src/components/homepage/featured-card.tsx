import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { BookmarkIcon, SparkleIcon } from "../ui/icons";

export interface FeaturedCardProps {
  imgSrc: string;
  header?: string;
  building: string;
  location: string;
}

export default function FeaturedCard ({
  imgSrc,
  header = "LHD Recommends",
  building,
  location,
}: FeaturedCardProps) {
  return (
    <View>
      <Image source={imgSrc} style={styles.image} />
      <View style={styles.headerView}>
        <SparkleIcon style={styles.headerIcon} />
        <Text style={styles.headerText}>
          {header}
        </Text>
      </View>
      <View style={styles.bookmarkView}>
        <BookmarkIcon style={styles.bookmarkIcon}/>
      </View>
      <LinearGradient colors={['transparent', 'rgba(0.1, 0.13, 0.14, 0.85)']} style={styles.gradient} />
      <Text style={styles.buildingText} >
        {building} {location}
      </Text>
      <View style={styles.elipsesView}>
        <View style={[{
          top: 4,
          left: 8,
        }, styles.elipseOn]} />
        <View style={[{
          top: 4,
          left: 16,
        }, styles.elipseOff]} />
        <View style={[{
          top: 4,
          left: 24,
        }, styles.elipseOff]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bookmarkIcon: {
    width: 20,
    height: 20,
    position: "absolute",
    top: 4,
    left: 4,
  },
  bookmarkView: {
    width: 28,
    height: 28,
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "white",
    borderRadius: 14,
  },
  buildingText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
    position: "absolute",
    bottom: 28,
    left: 16,
  },
  elipseOff: {
    width: 4,
    height: 4,
    position: "absolute",
    backgroundColor: "#9ca3af",
    borderRadius: 2,
  },
  elipseOn: {
    width: 4,
    height: 4,
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 2,
  },
  elipsesView: {
    width: 36,
    height: 12,
    position: "absolute",
    bottom: 9,
    left: 163,
    backgroundColor: "#303234c7",
    borderRadius: 6,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 68,
    height: 140,
    overflow: "hidden",
    borderRadius: 20,
  },
  headerIcon: {
    width: 14,
    height: 14,
    position: "absolute",
    top: 5,
    left: 8,
    color: "#bf5700",
  },
  headerText: {
    width: 112,
    height: 14,
    position: "absolute",
    top: 5,
    left: 26,
    //backgroundColor: "white",
    //padding: 20,
    color: "#bf5700",
    fontSize: 12,
    fontWeight: "bold",
  },
  headerView: {
    width: 138,
    height: 24,
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "white",
    borderRadius: 12,
  },
  image: {
    width: 361,
    height: 208,
    position: "relative",
    top: 0,
    left: 0,
    borderRadius: 20,
  },
});
