import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveData<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Save error", e);
  }
}

export async function getData<T>(key: string): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    return json ? (JSON.parse(json) as T) : null;
  } catch (e) {
    console.error("Read error", e);
    return null;
  }
}
