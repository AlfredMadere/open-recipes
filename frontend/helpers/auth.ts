import * as SecureStore from "expo-secure-store";
export async function getValueFor(key: string) {
  const result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    throw new Error(`No values stored under ${key}.`);
  }
}
