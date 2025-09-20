import { Stack } from "expo-router";
import "./global.css";
import { StatusBar } from "react-native";
import { useEffect } from "react";
import { useSavedMovieStore } from "@/store/savedStore";

export default function RootLayout() {
  const { fetchMoviesFromLocal } = useSavedMovieStore();

  useEffect(() => {
    console.log("Calling Local Storage");
    fetchMoviesFromLocal();
  }, []);
  // This is your root layout for navigation.
  // <Stack>: Defines a stack navigator.
  // <Stack.Screen>: Registers individual screens in the stack.
  return (
    <>
      {/* To hide the Status Bar */}
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* name defines the route */}
        {/* headerShown: false hides the default Navigation Header for the Screen */}
        <Stack.Screen
          name="movies/[movieId]/index"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
}
