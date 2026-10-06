/**
 * Custom hook para gestionar datos de OSIRIS
 * Maneja carga, caché, actualización automática y cambios de conexión
 */
import { useState, useEffect } from 'react';
import { OsirisData } from '../services/osirisTypes';
import osirisOfflineService from '../services/osirisOfflineService';

export function useOsirisData(autoRefresh: boolean = true, refreshInterval: number = 10 * 60 * 1000) {
  const [data, setData] = useState<OsirisData>({
    earthquakes: [],
    weather: [],
    airQuality: null,
    conflicts: [],
    fires: [],
    news: [],
    lastUpdate: new Date().toISOString(),
    isOnline: navigator.onLine
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Inicializar caché si es la primera vez
      await osirisOfflineService.initializeIfNeeded();

      const cachedData = await osirisOfflineService.getCachedData();
      setData(cachedData);

      // Si está online, intentar actualizar
      if (navigator.onLine && autoRefresh) {
        await osirisOfflineService.refreshAllData();
        const updatedData = await osirisOfflineService.getCachedData();
        setData(updatedData);
      }
    } catch (err) {
      setError('Error al cargar datos de seguridad');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    if (!navigator.onLine) {
      setError('Sin conexión - no se puede actualizar');
      return;
    }
    await loadData();
  };

  useEffect(() => {
    loadData();

    // Actualizar periódicamente si está online
    if (autoRefresh) {
      const interval = setInterval(() => {
        if (navigator.onLine) {
          osirisOfflineService.refreshAllData().then(() => {
            osirisOfflineService.getCachedData().then(setData);
          });
        }
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // Escuchar cambios de conexión
  useEffect(() => {
    const handleOnline = () => {
      setData(prev => ({ ...prev, isOnline: true }));
      if (autoRefresh) {
        osirisOfflineService.refreshAllData().then(() => {
          osirisOfflineService.getCachedData().then(setData);
        });
      }
    };

    const handleOffline = () => {
      setData(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoRefresh]);

  return {
    data,
    loading,
    error,
    refresh,
    isOnline: data.isOnline,
    lastUpdate: osirisOfflineService.getLastUpdateFormatted()
  };
}
