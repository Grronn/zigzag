import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TravelPreferences, RouteData, RoutePoint, RouteDay } from '../App';
import { RouteInfo } from './RouteInfo';
import { TravelMap } from './TravelMap';
import { MapIcon, List, Loader2 } from 'lucide-react';

export function RoutePage() {
  const { id } = useParams<{ id: string }>();
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [preferences, setPreferences] = useState<TravelPreferences | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'map'>('content');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API call to fetch route data by ID
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate API call to fetch route data by ID
        // This simulates the API call: GET /server/route/{id}
        // In a real implementation, this would be:
        // const response = await fetch(`/server/route/${id}`);
        // const serverData = await response.json();

        // Mock server response - simulate receiving route data with preferences
        // The real server would return both the route data and the original preferences
        const mockServerResponse = {
          route: {
            id: 1,
            name: "Гастро-тур и история",
            city: "Казань",
            pace: "интенсивный",
            format_of_movement: "такси",
            days: [
              {
                day_number: 1,
                working_time: "10:00 - 20:00",
                places: [
                  {
                    id: 1,
                    route_id: 1,
                    day_number: 1,
                    order: 1,
                    name: "Казанский Кремль",
                    description: "Историческое сердце Казани, объект Всемирного наследия ЮНЕСКО. Посещение мечети Кул-Шариф, Благовещенского собора, башни Сююмбике и прогулка по территории.",
                    coordinates: "55.7997, 49.1118",
                    address: "Кремль, Казань",
                    time: "10:00 - 13:00"
                  },
                  {
                    id: 2,
                    route_id: 1,
                    day_number: 1,
                    order: 2,
                    name: "Обед в кафе \"Тюбетей\"",
                    description: "Первое гастрономическое знакомство с татарской кухней. Обязательно попробовать эчпочмаки и другие традиционные пирожки.",
                    coordinates: "55.7891, 49.1215",
                    address: "ул. Баумана, 29/11, Казань",
                    time: "13:00 - 14:00"
                  },
                  {
                    id: 3,
                    route_id: 1,
                    day_number: 1,
                    order: 3,
                    name: "Прогулка по улице Баумана",
                    description: "Главная пешеходная улица Казани. Исторические здания, фонтаны, сувенирные магазины и памятники (например, Коту Казанскому).",
                    coordinates: "55.7895, 49.1245",
                    address: "Улица Баумана, Казань",
                    time: "14:00 - 15:30"
                  }
                ]
              },
              {
                day_number: 2,
                working_time: "09:00 - 15:00",
                places: [
                  {
                    id: 4,
                    route_id: 1,
                    day_number: 2,
                    order: 1,
                    name: "Старо-Татарская слобода",
                    description: "Исторический район с деревянными домами, мечетями и атмосферой старой Казани. Посещение мечети Марджани.",
                    coordinates: "55.7850, 49.1200",
                    address: "ул. Каюма Насыри, 17, Казань (Мечеть Марджани)",
                    time: "09:00 - 10:30"
                  },
                  {
                    id: 5,
                    route_id: 1,
                    day_number: 2,
                    order: 2,
                    name: "Набережная озера Нижний Кабан",
                    description: "Прогулка по благоустроенной набережной одного из крупнейших озер Казани, наслаждаясь видами и городской атмосферой.",
                    coordinates: "55.7820, 49.1220",
                    address: "Набережная озера Нижний Кабан, Казань",
                    time: "10:30 - 11:30"
                  }
                ]
              }
            ]
          },
          preferences: {
            city: "Казань",
            name_of_route: "Гастро-тур и история",
            pace: "интенсивный",
            quantity_of_days: 2,
            times: ["10:00 - 20:00", "09:00 - 15:00"],
            wishes: ["Архитектура", "Рестораны", "Спа-процедуры"],
            format_of_movement: "такси"
          }
        };

        // Extract route data and preferences from server response
        const mockRouteData: RouteData = mockServerResponse.route;
        const mockPreferences: TravelPreferences = mockServerResponse.preferences;

        setRouteData(mockRouteData);
        setPreferences(mockPreferences);

      } catch (err) {
        setError('Failed to fetch route data. Please try again.');
        console.error('Error fetching route data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRouteData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Loading your route...</h2>
        <p className="text-gray-500">Please wait while we fetch your travel plan</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!routeData || !preferences) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-xl font-semibold text-gray-900">Route not found</h2>
        <p className="text-gray-500">The requested route does not exist</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 transition-colors ${activeTab === 'content'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
            }`}
        >
          <List className="w-5 h-5" />
          <span>Маршрут</span>
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 transition-colors ${activeTab === 'map'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
            }`}
        >
          <MapIcon className="w-5 h-5" />
          <span>Карта</span>
        </button>
      </div>

      {/* Left Panel - Route Info */}
      <div className={`w-full md:w-1/2 bg-white overflow-y-auto ${activeTab === 'content' ? 'block' : 'hidden md:block'
        }`}>
        <RouteInfo preferences={preferences} routeData={routeData} />
      </div>

        {/* Right Panel - Map */}
        <div className={`w-full md:w-1/2 bg-gray-100 ${activeTab === 'map' ? 'block' : 'hidden md:block'
          } h-[calc(100vh-57px)] md:h-screen`}>
          <TravelMap routePoints={routeData.days.flatMap(day => day.places)} />
        </div>
    </div>
  );
}
