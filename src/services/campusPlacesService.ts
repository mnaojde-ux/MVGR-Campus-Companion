import { CAMPUS_PLACES, CampusPlace, CampusCategory } from '../data/campusPlaces';

export const campusPlacesService = {
  async getAllPlaces(): Promise<CampusPlace[]> {
    return [...CAMPUS_PLACES];
  },

  async getPlaceById(id: string): Promise<CampusPlace | undefined> {
    return CAMPUS_PLACES.find((p) => p.id === id);
  },

  async searchPlaces(query: string, category: CampusCategory = 'All'): Promise<CampusPlace[]> {
    const q = query.toLowerCase().trim();
    return CAMPUS_PLACES.filter((place) => {
      const matchCat = category === 'All' || place.category === category;
      if (!matchCat) return false;
      if (!q) return true;

      return (
        place.name.toLowerCase().includes(q) ||
        place.description.toLowerCase().includes(q) ||
        Boolean(place.building?.toLowerCase().includes(q)) ||
        Boolean(place.room?.toLowerCase().includes(q)) ||
        Boolean(place.keywords?.some((k) => k.toLowerCase().includes(q)))
      );
    });
  },
};
