import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [userLocation, setUserLocation] = useState<[number, number]>([-73.5673, 45.5017]);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: userLocation,
        zoom: 12.5
      });

      return () => {
        mapRef.current?.remove();
        mapRef.current = null;
      }

    } catch (error) {
      console.error('Error creating map:', error);
    }

    return () => {
      mapRef.current?.remove();
    }
  }, [userLocation])

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div style={{ width: '25%', padding: '1rem', backgroundColor: '#e0ffe0' }}>
        <h2>Stores nearby:</h2>
      </div>
      <div style={{ width: '75%', height: '100%' }} ref={mapContainerRef} />
    </div>
  )
}

export default Map;