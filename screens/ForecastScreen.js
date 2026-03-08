import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { fetchForecast, getWeatherIconUrl } from '../services/weatherService';

export default function ForecastScreen({ route, navigation }) {
  const { cityName } = route.params;
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadForecast();
  }, [cityName]);

  async function loadForecast() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchForecast(cityName);
      setForecast(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement des prévisions…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadForecast}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prévisions — {cityName}</Text>
      <Text style={styles.subtitle}>5 prochains jours</Text>

      <FlatList
        data={forecast}
        keyExtractor={(item) => item.day}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <View style={[styles.card, index === 0 && styles.cardFirst]}>
            <Text style={styles.dayLabel}>{item.day}</Text>
            <Image
              source={{ uri: getWeatherIconUrl(item.iconCode) }}
              style={styles.icon}
            />
            <Text style={styles.description} numberOfLines={1}>{item.description}</Text>
            <View style={styles.tempRow}>
              <Text style={styles.tempMax}>{item.tempMax}°</Text>
              <Text style={styles.tempMin}>{item.tempMin}°</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  centered: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#aaa',
    marginTop: 16,
    fontSize: 16,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    color: '#f87171',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  list: {
    gap: 12,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#1e1e2e',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  cardFirst: {
    borderColor: '#3b82f6',
    backgroundColor: '#1a2640',
  },
  dayLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    width: 110,
    textTransform: 'capitalize',
  },
  icon: {
    width: 44,
    height: 44,
  },
  description: {
    flex: 1,
    color: '#aaa',
    fontSize: 13,
    textTransform: 'capitalize',
    marginLeft: 8,
  },
  tempRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  tempMax: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  tempMin: {
    color: '#555',
    fontSize: 16,
    fontWeight: '500',
  },
});
