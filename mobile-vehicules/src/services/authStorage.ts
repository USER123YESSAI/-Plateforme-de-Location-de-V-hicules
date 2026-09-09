import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'toumai_auth_token';
const USER_KEY = 'toumai_auth_user';

// Mémoire locale de secours pour le web ou si SecureStore n'est pas disponible
let memoryStorage: Record<string, string> = {};

export async function saveAuthToken(token: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        memoryStorage[TOKEN_KEY] = token;
      }
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  } catch (error) {
    console.warn('Erreur lors de la sauvegarde du token:', error);
    memoryStorage[TOKEN_KEY] = token;
  }
}

export async function getAuthToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
      }
      return memoryStorage[TOKEN_KEY] || null;
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.warn('Erreur lors de la lecture du token:', error);
    return memoryStorage[TOKEN_KEY] || null;
  }
}

export async function removeAuthToken(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
      }
      delete memoryStorage[TOKEN_KEY];
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.warn('Erreur lors de la suppression du token:', error);
    delete memoryStorage[TOKEN_KEY];
  }
}

export async function saveUserData(userData: object): Promise<void> {
  const json = JSON.stringify(userData);
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, json);
      } else {
        memoryStorage[USER_KEY] = json;
      }
    } else {
      await SecureStore.setItemAsync(USER_KEY, json);
    }
  } catch (error) {
    memoryStorage[USER_KEY] = json;
  }
}

export async function getUserData<T>(): Promise<T | null> {
  try {
    let json: string | null = null;
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        json = localStorage.getItem(USER_KEY);
      } else {
        json = memoryStorage[USER_KEY] || null;
      }
    } else {
      json = await SecureStore.getItemAsync(USER_KEY);
    }
    return json ? JSON.parse(json) : null;
  } catch (error) {
    return null;
  }
}

export async function clearAllAuth(): Promise<void> {
  await removeAuthToken();
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(USER_KEY);
      }
      delete memoryStorage[USER_KEY];
    } else {
      await SecureStore.deleteItemAsync(USER_KEY);
    }
  } catch (error) {
    delete memoryStorage[USER_KEY];
  }
}
