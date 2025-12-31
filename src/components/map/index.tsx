import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockMurals, muralsGeoJSON } from '../../data/murals';

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

      mapRef.current.on('load', () => {
        if (!mapRef.current) return;

        // Add user location marker (red)
        new mapboxgl.Marker({ color: 'red' })
          .setLngLat(userLocation)
          .setPopup(new mapboxgl.Popup().setHTML('<h3>You are here</h3>'))
          .addTo(mapRef.current);

        // Add GeoJSON source for murals
        mapRef.current.addSource('murals', {
          type: 'geojson',
          data: muralsGeoJSON,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        });

        // Add cluster markers (changed from circles to symbols)
        mapRef.current.addLayer({
          id: 'clusters',
          type: 'symbol',
          source: 'murals',
          filter: ['has', 'point_count'],
          layout: {
            'icon-image': 'marker-15',
            'icon-size': [
              'step',
              ['get', 'point_count'],
              1.5, 20,
              2, 50,
              2.5
            ],
            'icon-allow-overlap': true
          },
          paint: {
            'icon-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6', 20,
              '#f1f075', 50,
              '#f28cb1'
            ]
          }
        });

        // Add cluster count labels
        mapRef.current.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'murals',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
            'text-offset': [0, 0.1]
          },
          paint: {
            'text-color': '#ffffff'
          }
        });

        // Add individual mural points as pins
        mapRef.current.addLayer({
          id: 'unclustered-point',
          type: 'symbol',
          source: 'murals',
          filter: ['!', ['has', 'point_count']],
          layout: {
            'icon-image': 'marker-15',
            'icon-size': 1.5,
            'icon-allow-overlap': true
          },
          paint: {
            'icon-color': '#4264fb'
          }
        });

        // Click on cluster to zoom in
        mapRef.current.on('click', 'clusters', (e) => {
          if (!mapRef.current) return;
          const features = mapRef.current.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          });
          const clusterId = features[0].properties?.cluster_id;
          const source = mapRef.current.getSource('murals') as mapboxgl.GeoJSONSource;

          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err || !mapRef.current) return;

            mapRef.current.easeTo({
              center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
              zoom: zoom
            });
          });
        });

        // Click on individual mural to show popup
        mapRef.current.on('click', 'unclustered-point', (e) => {
          if (!e.features || !e.features[0]) return;

          const coordinates = (e.features[0].geometry as GeoJSON.Point).coordinates.slice() as [number, number];
          const properties = e.features[0].properties;

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
              <div style="padding: 10px;">
                <h3 style="margin: 0 0 5px 0;">${properties?.name}</h3>
                <p style="margin: 5px 0;"><strong>Artist:</strong> ${properties?.artist}</p>
                <p style="margin: 5px 0;">${properties?.description}</p>
                <p style="margin: 5px 0; font-size: 12px; color: #666;">${properties?.address}</p>
              </div>
            `)
            .addTo(mapRef.current!);
        });

        // Change cursor on hover
        mapRef.current.on('mouseenter', 'clusters', () => {
          if (mapRef.current) mapRef.current.getCanvas().style.cursor = 'pointer';
        });
        mapRef.current.on('mouseleave', 'clusters', () => {
          if (mapRef.current) mapRef.current.getCanvas().style.cursor = '';
        });
        mapRef.current.on('mouseenter', 'unclustered-point', () => {
          if (mapRef.current) mapRef.current.getCanvas().style.cursor = 'pointer';
        });
        mapRef.current.on('mouseleave', 'unclustered-point', () => {
          if (mapRef.current) mapRef.current.getCanvas().style.cursor = '';
        });
      });

      return () => {
        mapRef.current?.remove();
        mapRef.current = null;
      }

    } catch (error) {
      console.error('Error creating map:', error);
    }

  }, [userLocation])

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div style={{ width: '25%', padding: '1rem', backgroundColor: '#e0ffe0' }}>
        <h2>Murals nearby:</h2>
        <div>
          {mockMurals.map((mural) => (
            <div key={mural.id} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
              <h3>{mural.name}</h3>
              <p>{mural.artist}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: '75%', height: '100%' }} ref={mapContainerRef} />
    </div>
  )
}

export default Map;