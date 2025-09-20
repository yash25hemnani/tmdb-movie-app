import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails } from "@/services/api";
import { icons } from "@/constants/icons";
import { useSavedMovieStore } from "@/store/savedStore";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

// Create header and text component
const MovieInfo = ({ label, value }: MovieInfoProps) => {
  return (
    <View className="flex-col items-start justify-center mt-5">
      <Text className="text-light-200 font-normal text-sm">{label}</Text>
      <Text className="text-light-100 font-bold text-sm mt-2 ">
        {value || "N/A"}
      </Text>
    </View>
  );
};

const index = () => {
  const { movieId } = useLocalSearchParams();
  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(movieId as string)
  );

  const { savedMovies, addMovie, removeMovie } = useSavedMovieStore();

  

  return (
    <View className="bg-primary flex-1">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        <View>
          <Image
            source={{
              uri: movie?.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image",
            }}
            className="w-full"
            style={{ height: 550 }}
            resizeMode="cover"
          />
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <View className="flex flex-row w-full justify-between">
            <Text className="text-white font-bold text-xl w-[90%]">{movie?.title}</Text>
            {savedMovies.some((m) => m.movie_id === String(movie?.id)) ? (
              <TouchableOpacity
                onPress={() =>
                  removeMovie(String(movie?.id))
                }
              >
                <Image source={icons.saved} className="size-7" tintColor="white"/>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
              
                onPress={() =>
                  addMovie({
                    movie_id: String(movie?.id ?? ""),
                    movie_title: movie?.title ?? "Untitled",
                    url: movie?.poster_path ?? "",
                  })
                }
              >
                <Image source={icons.save} className="size-7" />
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]}
            </Text>

            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-200 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres.map((g) => g.name).join(" - ")}
          />

          <View className="flex flex-row justify-between w-[55%]">
            <MovieInfo
              label="Budget"
              // @ts-ignore
              value={`$${movie?.budget / 1_000_000} millions`}
            />
            <MovieInfo
              label="Revenue"
              value={`${
                // @ts-ignore
                Math.round(movie?.revenue) / 1_000_000
              } millions`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies.map((c) => c.name).join(" - ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#FFF"
        />
        <Text className="text-base font-semibold text-white">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default index;
