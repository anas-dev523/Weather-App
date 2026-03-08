import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { fetchCurrentWeather, getWeatherIconUrl, getBackgroundColors } from '../services/weatherService';

export default function WeatherResultScreen({ route, navigation }) {
  const { cityName } = route.params;
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWeather();
  }, [cityName]);

  async function loadWeather() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCurrentWeather(cityName);
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const bgColors = weather ? getBackgroundColors(weather.weatherId) : ['#1e1e2e', '#0f0f1a'];

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: bgColors[0] }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement de la météo…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: '#0f0f1a' }]}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadWeather}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: bgColors[0] }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.locationRow}>
        <Text style={styles.cityName}>{weather.city}</Text>
        <Text style={styles.countryName}>{weather.country}</Text>
      </View>

      <Image
        source={{ uri: getWeatherIconUrl(weather.iconCode) }}
        style={styles.weatherIcon}
      />

      <Text style={styles.temperature}>{weather.temperature}°C</Text>
      <Text style={styles.description}>{weather.description}</Text>
      <Text style={styles.feelsLike}>Ressenti {weather.feelsLike}°C</Text>

      <View style={styles.detailsCard}>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>💧</Text>
          <Text style={styles.detailValue}>{weather.humidity}%</Text>
          <Text style={styles.detailLabel}>Humidité</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>💨</Text>
          <Text style={styles.detailValue}>{weather.windSpeed} km/h</Text>
          <Text style={styles.detailLabel}>Vent</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.forecastButton}
        onPress={() => navigation.navigate('Forecast', { cityName: weather.city })}
      >
        <Text style={styles.forecastButtonText}>Prévisions 5 jours →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  centered: {
    flex: 1,
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
    marginBottom: 12,
  },
  retryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 10,
  },
  backText: {
    color: '#aaa',
    fontSize: 15,
  },
  locationRow: {
    alignItems: 'center',
    marginBottom: 8,
  },
  cityName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  countryName: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  weatherIcon: {
    width: 120,
    height: 120,
    marginVertical: 8,
  },
  temperature: {
    fontSize: 72,
    fontWeight: '300',
    color: '#fff',
    lineHeight: 80,
  },
  description: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  feelsLike: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
    marginBottom: 32,
  },
  detailsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 32,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  detailValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  detailLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  separator: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 16,
  },
  forecastButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: '100%',
    alignItems: 'center',
  },
  forecastButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
