import { create } from "zustand";
import { storeData, getData } from "../services/storeLocally";

interface SavedMovie {
  movie_id: string | undefined;
  movie_title: string | undefined;
  url: string | undefined | null;
}

interface SavedMovieStore {
  savedMovies: SavedMovie[];
  fetchMoviesFromLocal: () => void;
  addMovie: (movie: SavedMovie) => void;
  removeMovie: (id: string) => void;
}

// Check if we have movies saved locally

export const useSavedMovieStore = create<SavedMovieStore>((set) => ({
  savedMovies: [],
  // Zustand requires you to return an object
  fetchMoviesFromLocal: () => {
    try {
      // const locallySavedMovies;
      getData("savedMovies").then((res: string) => {
        if (res === "") {
          set({ savedMovies: [] });
        } else {
          const newArray = JSON.parse(res);
          console.log(newArray);
          set({ savedMovies: [...newArray] });
        }
      });
    } catch (error) {
      console.log("Error in fetching local storage: ", error);
    }
  },
  addMovie: async (movie) => {
    let newArray: SavedMovie[] = [];
    set((state) => {
      const exists = state.savedMovies.find(
        (m) => m.movie_id === movie.movie_id
      );
      newArray = exists
        ? [...state.savedMovies]
        : [...state.savedMovies, movie];

      return { savedMovies: newArray };
    });

    storeData("savedMovies", JSON.stringify(newArray))
      .then(() => console.log("Saved to Local"))
      .catch((e) => console.log("Error while saving locally: ", e));
  },

  removeMovie: (id) =>
    set((state) => ({
      savedMovies: state.savedMovies.filter((movie) => movie.movie_id !== id),
    })),
}));
