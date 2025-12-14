import { useEffect, useRef, useState } from 'react';
import { RoutePoint } from '../App';
import { MapPin } from 'lucide-react';

interface TravelMapProps {
  routePoints: RoutePoint[];
}

export function TravelMap({ routePoints }: TravelMapProps) {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

  // Convert lat/lng to SVG coordinates
  const latLngToPoint = (lat: number, lng: number) => {
    // Simple mercator projection approximation
    // Adjust these bounds based on your typical route area
    const minLat = 42;
    const maxLat = 50;
    const minLng = 0;
    const maxLng = 12;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return { x, y };
  };

  // Calculate path for the route
  const getRoutePath = () => {
    if (routePoints.length < 2) return '';

    const points = routePoints.map(point => latLngToPoint(point.lat, point.lng));
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }

    return path;
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      {/* Grid overlay for map feel */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {routePoints.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">Complete the questionnaire to see your route</p>
          </div>
        </div>
      ) : (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {/* Route path */}
          {routePoints.length > 1 && (
            <>
              {/* Animated dashed line */}
              <path
                d={getRoutePath()}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="0.3"
                strokeDasharray="1, 1"
                strokeLinecap="round"
                opacity="0.6"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="2"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
              {/* Solid shadow line */}
              <path
                d={getRoutePath()}
                fill="none"
                stroke="#1e40af"
                strokeWidth="0.15"
                opacity="0.3"
              />
            </>
          )}

          {/* Route points */}
          {routePoints.map((point, index) => {
            const { x, y } = latLngToPoint(point.lat, point.lng);
            const isHovered = hoveredPoint === point.id;
            const isSelected = selectedPoint === point.id;

            return (
              <g
                key={point.id}
                transform={`translate(${x}, ${y})`}
                onMouseEnter={() => setHoveredPoint(point.id)}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() => setSelectedPoint(isSelected ? null : point.id)}
                className="cursor-pointer"
              >
                {/* Pulse animation for hovered point */}
                {isHovered && (
                  <circle
                    r="2.5"
                    fill="#3b82f6"
                    opacity="0.4"
                  >
                    <animate
                      attributeName="r"
                      from="1.5"
                      to="3"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Marker circle */}
                <circle
                  r="1.5"
                  fill="white"
                  stroke="#2563eb"
                  strokeWidth="0.3"
                  className="transition-all"
                  style={{
                    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                    transformOrigin: 'center'
                  }}
                />

                {/* Number */}
                <text
                  textAnchor="middle"
                  dy="0.4"
                  fontSize="1.2"
                  fontWeight="bold"
                  fill="#2563eb"
                  pointerEvents="none"
                >
                  {index + 1}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {/* Info cards for points */}
      {routePoints.map((point) => {
        const { x, y } = latLngToPoint(point.lat, point.lng);
        const isVisible = hoveredPoint === point.id || selectedPoint === point.id;

        if (!isVisible) return null;

        return (
          <div
            key={`info-${point.id}`}
            className="absolute bg-white rounded-lg shadow-xl p-4 pointer-events-none z-10 transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              marginTop: '-16px',
              minWidth: '200px',
              maxWidth: '250px'
            }}
          >
            <div className="mb-2">{point.name}</div>
            <p className="text-gray-600 mb-2">{point.description}</p>
            <p className="text-gray-500">Длительность: {point.duration}</p>
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
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white rounded-lg shadow-lg p-3 md:p-4">
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