import { useEffect, useRef, useState } from 'react';
import { RoutePoint } from '../App';
import { MapPin } from 'lucide-react';

// Declare Yandex Maps types globally
declare global {
  interface Window {
    ymaps: any;
  }
}

interface TravelMapProps {
  routePoints: RoutePoint[];
}

export function TravelMap({ routePoints }: TravelMapProps) {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<ymaps.Map | null>(null);
  const routeObjects = useRef<ymaps.GeoObject[]>([]);

  useEffect(() => {
    // Load Yandex Maps API script
    const loadYandexMaps = () => {
      if (window.ymaps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=8dd7f097-6399-475c-bb7f-1139673cf402&lang=ru_RU';
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.ymaps) return;

      // Initialize Yandex Map
      window.ymaps.ready(() => {
        // Clear previous map instance if exists
        if (mapInstance.current) {
          mapInstance.current.destroy();
        }

        // Create new map centered on the first point or default location
        const center = routePoints.length > 0
          ? routePoints[0].coordinates.split(',').map(Number) as [number, number]
          : [55.751244, 37.618423]; // Default to Moscow

        mapInstance.current = new window.ymaps.Map(mapRef.current, {
          center: center,
          zoom: routePoints.length > 0 ? 10 : 12,
          controls: ['zoomControl']
        });

        // Add route points to map
        updateRoutePoints();
      });
    };

    const updateRoutePoints = () => {
      if (!mapInstance.current || !window.ymaps) return;

      // Clear previous route objects
      routeObjects.current.forEach(obj => {
        mapInstance.current.geoObjects.remove(obj);
      });
      routeObjects.current = [];

      if (routePoints.length === 0) return;

      // Create placemarks for each point
      routePoints.forEach((point, index) => {
        const [lat, lng] = point.coordinates.split(',').map(Number);
        const placemark = new window.ymaps.Placemark(
          [lat, lng],
          {
            iconContent: (index + 1).toString(),
            hintContent: point.name
          },
          {
            preset: 'islands#blueStretchyIcon',
            iconColor: '#2563eb'
          }
        );

        // Add click and hover events
        placemark.events.add('click', () => {
          setSelectedPoint(selectedPoint === point.id ? null : point.id);
        });

        placemark.events.add('mouseenter', () => {
          setHoveredPoint(point.id);
        });

        placemark.events.add('mouseleave', () => {
          setHoveredPoint(null);
        });

        mapInstance.current.geoObjects.add(placemark);
        routeObjects.current.push(placemark);
      });

      // Create route line if there are multiple points
      if (routePoints.length > 1) {
        const routeCoordinates = routePoints.map(point => {
          const [lat, lng] = point.coordinates.split(',').map(Number);
          return [lat, lng];
        });

        const routeLine = new window.ymaps.Polyline(
          routeCoordinates,
          {},
          {
            strokeColor: '#3b82f6',
            strokeWidth: 4,
            strokeOpacity: 0.8
          }
        );

        mapInstance.current.geoObjects.add(routeLine);
        routeObjects.current.push(routeLine);

        // Fit map to show all points
        mapInstance.current.setBounds(
          mapInstance.current.geoObjects.getBounds(),
          { checkZoomRange: true }
        );
      }
    };

    loadYandexMaps();

    return () => {
      // Cleanup
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, [routePoints]);

  return (
    <div className="relative w-full h-full">
      {routePoints.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">Complete the questionnaire to see your route</p>
          </div>
        </div>
      ) : (
        <div ref={mapRef} className="w-full h-full" />
      )}

      {/* Info cards for points */}
      {routePoints.map((point) => {
        if (!mapInstance.current) return null;

        const isVisible = hoveredPoint === point.id || selectedPoint === point.id;
        if (!isVisible) return null;

      // Get pixel coordinates for the point
        const [lat, lng] = point.coordinates.split(',').map(Number);
        const pixelCoords = mapInstance.current?.options.get('projection').toGlobalPixels(
          [lat, lng],
          mapInstance.current?.getZoom()
        ) || [0, 0];

        // Calculate position to prevent overflow
        const cardWidth = 250;
        const cardHeight = 150;
        const mapContainer = mapRef.current?.getBoundingClientRect();

        let left = pixelCoords[0];
        let top = pixelCoords[1] - cardHeight - 20; // Position above the point

        // Adjust position to stay within map bounds
        if (mapContainer) {
          left = Math.max(10, Math.min(left, mapContainer.width - cardWidth - 10));
          top = Math.max(10, Math.min(top, mapContainer.height - cardHeight - 10));
        }

        return (
          <div
            key={`info-${point.id}`}
            className="absolute bg-white rounded-lg shadow-xl p-4 pointer-events-none z-10 overflow-hidden"
            style={{
              left: `${left}px`,
              top: `${top}px`,
              minWidth: '200px',
              maxWidth: '250px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}
          >
            <div className="mb-2 font-medium">{point.name}</div>
            <p className="text-gray-600 mb-2 text-sm">{point.description}</p>
            <p className="text-gray-500 text-xs">Время: {point.time}</p>
            <div
              className="absolute w-3 h-3 bg-white transform rotate-45"
              style={{
                left: '50%',
                bottom: '-6px',
                marginLeft: '-6px'
              }}
            />
          </div>
        );
      })}

      {/* Legend */}
      {routePoints.length > 0 && (
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white rounded-lg shadow-lg p-3 md:p-4 z-20">
          <div className="mb-2 md:mb-3">Обзор маршрута</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                <span className="text-white" style={{ fontSize: '8px' }}>1</span>
              </div>
              <p className="text-gray-600">Остановки маршрута</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-blue-600" style={{ backgroundImage: 'repeating-linear-gradient(to right, #3b82f6 0, #3b82f6 4px, transparent 4px, transparent 8px)' }} />
              <p className="text-gray-600">Путь следования</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
