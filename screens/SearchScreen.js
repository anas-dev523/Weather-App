import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SEARCHES_KEY = '@weather_recent_searches';
const MAX_RECENT = 5;

export default function SearchScreen({ navigation }) {
  const [cityInput, setCityInput] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  async function loadRecentSearches() {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {
      // silently ignore storage read errors
    }
  }

  async function saveRecentSearch(city) {
    try {
      const updated = [city, ...recentSearches.filter((c) => c.toLowerCase() !== city.toLowerCase())].slice(0, MAX_RECENT);
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // silently ignore storage write errors
    }
  }

  function handleSearch(city) {
    const trimmed = (city || cityInput).trim();
    if (!trimmed) {
      Alert.alert('Champ vide', 'Veuillez entrer un nom de ville.');
      return;
    }
    setLoading(true);
    saveRecentSearch(trimmed).then(() => {
      setLoading(false);
      navigation.navigate('WeatherResult', { cityName: trimmed });
    });
  }

  async function clearHistory() {
    try {
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearches([]);
    } catch {
      // silently ignore
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>🌤️ Météo</Text>
        <Text style={styles.subtitle}>Recherchez une ville</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ex: Paris, Tokyo, Tunis..."
            placeholderTextColor="#888"
            value={cityInput}
            onChangeText={setCityInput}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
            autoCapitalize="words"
          />
          <TouchableOpacity
            style={[styles.searchButton, loading && styles.buttonDisabled]}
            onPress={() => handleSearch()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.searchButtonText}>→</Text>
            )}
          </TouchableOpacity>
        </View>

        {recentSearches.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recherches récentes</Text>
              <TouchableOpacity onPress={clearHistory}>
                <Text style={styles.clearText}>Effacer</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={recentSearches}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.recentItem} onPress={() => handleSearch(item)}>
                  <Text style={styles.recentIcon}>🕐</Text>
                  <Text style={styles.recentText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 42,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  searchButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  recentSection: {
    marginTop: 36,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  clearText: {
    color: '#3b82f6',
    fontSize: 13,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e2e',
    gap: 12,
  },
  recentIcon: {
    fontSize: 16,
  },
  recentText: {
    color: '#ddd',
    fontSize: 16,
  },
});
