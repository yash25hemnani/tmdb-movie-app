import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import SearchBar from "../components/SearchBar";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import MovieCard from "../components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "../components/TrendingCard";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);
  console.log(
    "Index",
    trendingMovies?.map((mov) => console.log(mov.movie_id))
  );

  // Fetch movies from API using custom hook
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  // Handle loading state
  if (moviesLoading || moviesLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#0000FF" />
      </View>
    );
  }

  // Handle error state
  if (moviesError || trendingError) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Text className="text-red-500">Error: {moviesError?.message}</Text>
      </View>
    );
  }

  return (
    // On modern phones (especially iPhones with a notch, home indicator, or rounded corners), some parts of the screen are unsafe for content because they might be covered or cut off.
    <SafeAreaView className="flex-1 bg-primary">
      {/* Background image - absolutely positioned so it covers the whole screen */}
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />

      {/* FlatList is now the main scroll container
          Instead of wrapping a FlatList in a ScrollView (which caused the error),
          we use FlatList directly because it is scrollable and optimized. */}
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          // Each movie item rendered here
          <MovieCard {...item} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 35,
        }}
        // Define the number of columns of list items
        numColumns={3}
        // Define style of columns
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          paddingRight: 5,
          marginBottom: 10,
        }}
        // Use ListHeaderComponent for static content
        // This replaces the need for an outer ScrollView above the list
        ListHeaderComponent={
          <View>
            {/* App logo */}
            <Image
              source={icons.logo}
              className="w-12 h-10 mt-20 mb-5 mx-auto"
            />

            {/* Search bar that navigates to /search */}
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for a Movie"
            />

            {trendingMovies && (
              <View className="mt-4">
                <Text className="text-lg text-white font-bold">
                  Trending Movies
                </Text>

                {/* Rendering a Horizontal View */}
                <FlatList
                  data={trendingMovies}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.movie_id.toString()}
                  contentContainerStyle={{ marginHorizontal: 15, gap: 10 }}
                />
              </View>
            )}

            {/* Section heading */}
            <Text className="text-lg text-white font-bold mt-5 mb-3">
              Latest Movies
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
