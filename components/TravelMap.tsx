import { useEffect, useRef, useState } from 'react';
import { RoutePoint, RouteDay } from '../App';
import { MapPin } from 'lucide-react';

// Declare Yandex Maps types globally
declare global {
  interface Window {
    ymaps: any;
  }
}

interface TravelMapProps {
  routePoints: RoutePoint[];
  routeDays?: RouteDay[]; // Optional for backward compatibility
}

export function TravelMap({ routePoints }: TravelMapProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
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

      // Define colors for each day
      const dayColors = [
        '#3b82f6', // Blue
        '#10b981', // Green
        '#f59e0b', // Amber
        '#ef4444', // Red
        '#8b5cf6', // Purple
        '#06b6d4', // Cyan
      ];

      // Group points by day
      const pointsByDay: Record<number, RoutePoint[]> = {};
      routePoints.forEach(point => {
        if (!pointsByDay[point.day_number]) {
          pointsByDay[point.day_number] = [];
        }
        pointsByDay[point.day_number].push(point);
      });

      // Create placemarks for each point
      routePoints.forEach((point, index) => {
        const [lat, lng] = point.coordinates.split(',').map(Number);
        const dayColor = dayColors[(point.day_number - 1) % dayColors.length];

        const placemark = new window.ymaps.Placemark(
          [lat, lng],
          {
            iconContent: point.order.toString(),
            hintContent: `День ${point.day_number}: ${point.name}`,
            balloonContentHeader: `<b>${point.name}</b>`,
            balloonContentBody: `
              <p>${point.description}</p>
              <p><b>Время:</b> ${point.time}</p>
              <p><b>День:</b> ${point.day_number}</p>
              <p><b>Адрес:</b> ${point.address}</p>
            `,
            balloonContentFooter: 'Нажмите, чтобы закрыть'
          },
          {
            preset: 'islands#circleStretchyIcon',
            iconColor: dayColor,
            hideIconOnBalloonOpen: false,
            balloonOffset: [0, -40]
          }
        );

        // Add click event to open balloon
        placemark.events.add('click', () => {
          if (mapInstance.current) {
            // Close all other balloons first
            mapInstance.current.geoObjects.each((geoObject: any) => {
              if (geoObject instanceof window.ymaps.Placemark) {
                geoObject.balloon.close();
              }
            });

            // Open this placemark's balloon
            placemark.balloon.open();
          }
        });

        mapInstance.current.geoObjects.add(placemark);
        routeObjects.current.push(placemark);
      });

      // Create route lines for each day with different colors
      Object.keys(pointsByDay).forEach(dayNumberStr => {
        const dayNumber = parseInt(dayNumberStr);
        const dayPoints = pointsByDay[dayNumber];
        const dayColor = dayColors[(dayNumber - 1) % dayColors.length];

        if (dayPoints.length > 1) {
          const routeCoordinates = dayPoints.map(point => {
            const [lat, lng] = point.coordinates.split(',').map(Number);
            return [lat, lng];
          });

          const routeLine = new window.ymaps.Polyline(
            routeCoordinates,
            {},
            {
              strokeColor: dayColor,
              strokeWidth: 4,
              strokeOpacity: 0.8
            }
          );

          mapInstance.current.geoObjects.add(routeLine);
          routeObjects.current.push(routeLine);
        }
      });

      // Fit map to show all points
      if (routePoints.length > 0) {
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

      {/* State variables kept for potential future use */}

      {/* Legend */}
      {routePoints.length > 0 && (
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white rounded-lg shadow-lg p-3 md:p-4 z-20">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-600 border-2 border-white flex items-center justify-center">
                <span className="text-white" style={{ fontSize: '8px' }}>1</span>
              </div>
              <p className="text-gray-600 text-sm">Остановки маршрута</p>
            </div>

            {/* Day routes legend */}
            {Array.from(new Set(routePoints.map(p => p.day_number))).map((dayNumber, index) => {
              const dayColors = [
                '#3b82f6', // Blue
                '#10b981', // Green
                '#f59e0b', // Amber
                '#ef4444', // Red
                '#8b5cf6', // Purple
                '#06b6d4', // Cyan
              ];
              const color = dayColors[(dayNumber - 1) % dayColors.length];

              return (
                <div key={`day-${dayNumber}`} className="flex items-center gap-2">
                  <div className="w-8 h-0.5" style={{
                    backgroundColor: color,
                    backgroundImage: `repeating-linear-gradient(to right, ${color} 0, ${color} 4px, transparent 4px, transparent 8px)`
                  }} />
                  <p className="text-gray-600 text-sm">День {dayNumber} маршрут</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
