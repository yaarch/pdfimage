import { useState, useEffect, useCallback } from 'react';

export function useFavoritesAndRecents() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nuvio_favorites');
      return saved ? JSON.parse(saved) : ['pdf-organizer', 'compress-pdf', 'image-compressor'];
    } catch {
      return ['pdf-organizer', 'compress-pdf', 'image-compressor'];
    }
  });

  const [recents, setRecents] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nuvio_recents');
      return saved ? JSON.parse(saved) : ['pdf-organizer', 'merge-pdf', 'image-compressor'];
    } catch {
      return ['pdf-organizer', 'merge-pdf', 'image-compressor'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nuvio_favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('nuvio_recents', JSON.stringify(recents));
    } catch {
      // ignore
    }
  }, [recents]);

  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  }, []);

  const isFavorite = useCallback((toolId: string) => favorites.includes(toolId), [favorites]);

  const addRecent = useCallback((toolId: string) => {
    setRecents((prev) => {
      if (prev[0] === toolId) return prev;
      const filtered = prev.filter((id) => id !== toolId);
      return [toolId, ...filtered].slice(0, 8);
    });
  }, []);

  const clearRecents = useCallback(() => {
    setRecents([]);
  }, []);

  return {
    favorites,
    recents,
    toggleFavorite,
    isFavorite,
    addRecent,
    clearRecents,
  };
}
