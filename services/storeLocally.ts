import AsyncStorage from '@react-native-async-storage/async-storage';

// Read Data
export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error("Failed to save data", e);
  }
};

// Get data
export const getData = async (key: string): Promise<string > => {
  try {
    const value = await AsyncStorage.getItem(key) || "";
    return value
  } catch (e) {
    console.error("Failed to fetch data", e);
    throw e
  }
};
