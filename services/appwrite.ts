import { Movie, TrendingMovie } from "@/interfaces/interfaces";
import { Client, Databases, ID, Query, TablesDB } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
// ! --> defines we have this variable definetly

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const tablesDB = new TablesDB(client);

// Tracks the searches made by a user
export const updateSearchCount = async (query: string, movie: Movie) => {
  // Call the appwrite API to check if the record of that search has laready been stores

  console.log(movie);

  const result = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: COLLECTION_ID,
    // Check with searchTerm for equality
    queries: [Query.equal("searchTerm", query)],
  });

  console.log(result); // Output format {"rows": [], "total": 0}
  // If document found, increment the searchCount field
  if (result.rows.length > 0) {
    const existingMovie = result.rows[0];
    console.log(existingMovie);
    try {
      const update = await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: existingMovie.$id,
        data: {
          count: existingMovie.count + 1,
        },
      });

      console.log("Success in Creation: ", update);
    } catch (error) {
      console.log("Error in Updaing: ", error);
    }
  } else {
    // If not found, create a new document with count as 1
    try {
      // Poster_url must be a valid url
      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image"; // fallback

      const create = await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: ID.unique(),
        data: {
          searchTerm: query,
          count: 1,
          movie_id: movie.id,
          poster_url: posterUrl,
          title: movie.title,
        },
      });
      console.log("Success in Creation: ", create);
    } catch (error) {
      console.log("Error in Creating: ", error);
    }
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID,
      // Show top 5 movies, descending order by count
      queries: [Query.limit(5), Query.orderDesc("count")],
    });

    console.log(result);

    // Extract only the `data` part of each row
    // Extract the actual row data
    return result.rows.map((row) => ({
      count: row.count,
      movie_id: row.movie_id,
      poster_url: row.poster_url,
      searchTerm: row.searchTerm,
      title: row.title,
    }));
  } catch (error) {
    console.log("Error in getting movies: ", error);
    return [];
  }
};
