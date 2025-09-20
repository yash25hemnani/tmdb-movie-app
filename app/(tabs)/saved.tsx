import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";
import { useSavedMovieStore } from "@/store/savedStore";
import { icons } from "@/constants/icons";
import { Link } from "expo-router";

interface MovieCard {
  movie_id: string;
  movie_title: string;
  url: string;
}

const SavedMovieCard = ({ movie_id, movie_title, url }: MovieCard) => {
  const { savedMovies, addMovie, removeMovie } = useSavedMovieStore();
  return (
    <View className="w-[30%]">
      <Link href={`/movies/${movie_id}`} asChild>
        <TouchableOpacity >
          <Image
            source={{
              uri: url
                ? `https://image.tmdb.org/t/p/w500${url}`
                : "https://placeholder.co/600x400/1a1a1a/ffffff.png",
            }}
            className="w-full h-52 rounded-lg"
            resizeMode="cover"
          />
        </TouchableOpacity>
      </Link>
      <View className="flex flex-row justify-between">
        <Text className="text-white font-bold text-sm w-3/4" numberOfLines={1}>{movie_title}</Text>
        <TouchableOpacity onPress={() => removeMovie(String(movie_id))}>
          <Image source={icons.saved} className="size-4" tintColor="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const saved = () => {
  const { savedMovies } = useSavedMovieStore();

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Background image - absolutely positioned so it covers the whole screen */}
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={savedMovies}
        keyExtractor={(item) => item.movie_id?.toString() ?? ""}
        renderItem={({ item }) => (
          <SavedMovieCard
            movie_id={item.movie_id ?? ""}
            movie_title={item.movie_title ?? ""}
            url={item.url ?? ""}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 35,
        }}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          paddingRight: 5,
          marginBottom: 10,
        }}
        ListHeaderComponent={
          <View>
            {/* App logo */}
            <Image
              source={icons.logo}
              className="w-12 h-10 mt-20 mb-5 mx-auto"
            />
            <Text className="font-bold text-white text-xl pb-2">
              Saved Movies
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default saved;
