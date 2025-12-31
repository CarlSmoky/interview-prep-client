export interface Mural {
  id: string;
  name: string;
  artist: string;
  address: string;
  coordinates: [number, number];
  imageUrl?: string;
  description?: string;
}

export const mockMurals: Mural[] = [
  {
    id: "1",
    name: "Leonard Cohen Mural",
    artist: "Kevin Ledo & Gene Pendon",
    address: "Crescent St & Sherbrooke St W, Montreal",
    coordinates: [-73.577, 45.5048],
    description: "A tribute to Montreal legend Leonard Cohen",
  },
  {
    id: "2",
    name: "Greetings from Montreal",
    artist: "Kevin Ledo",
    address: "Boulevard Saint-Laurent, Montreal",
    coordinates: [-73.5698, 45.5155],
    description: "Iconic postcard-style mural",
  },
  {
    id: "3",
    name: "The Angel",
    artist: "Roadsworth",
    address: "Plateau Mont-Royal, Montreal",
    coordinates: [-73.582, 45.52],
    description: "Beautiful angel street art",
  },
];

// Convert to GeoJSON format
export const muralsGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Point> = {
  type: "FeatureCollection",
  features: mockMurals.map((mural) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: mural.coordinates,
    },
    properties: {
      id: mural.id,
      name: mural.name,
      artist: mural.artist,
      address: mural.address,
      description: mural.description,
      imageUrl: mural.imageUrl,
    },
  })),
};
