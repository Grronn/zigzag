import { useState } from 'react';
import { Questionnaire } from './components/Questionnaire';
import { RouteInfo } from './components/RouteInfo';
import { TravelMap } from './components/TravelMap';
import { MapIcon, List } from 'lucide-react';

export interface TravelPreferences {
  travelStyle: string;
  budget: string;
  duration: string;
  interests: string[];
}

export interface RoutePoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  duration: string;
}

export default function App() {
  const [preferences, setPreferences] = useState<TravelPreferences | null>(null);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'map'>('content');

  const handleQuestionnaireComplete = (prefs: TravelPreferences) => {
    setPreferences(prefs);
    
    // Generate route based on preferences
    const generatedRoute = generateRoute(prefs);
    setRoutePoints(generatedRoute);
  };

  const generateRoute = (prefs: TravelPreferences): RoutePoint[] => {
    // Mock route generation based on preferences
    const routes: Record<string, RoutePoint[]> = {
      adventure: [
        { id: '1', name: 'Базовый лагерь в горах', lat: 46.8182, lng: 8.2275, description: 'Отправная точка для горных приключений', duration: '2 дня' },
        { id: '2', name: 'Альпийская тропа', lat: 46.5197, lng: 8.7892, description: 'Сложный пеший маршрут', duration: '3 дня' },
        { id: '3', name: 'Вершина', lat: 46.0207, lng: 8.9511, description: 'Финальная точка с панорамными видами', duration: '2 дня' }
      ],
      relaxation: [
        { id: '1', name: 'Прибрежный курорт', lat: 43.7384, lng: 7.4246, description: 'Роскошный курорт на берегу моря', duration: '3 дня' },
        { id: '2', name: 'СПА-центр', lat: 43.6048, lng: 7.0717, description: 'Центр здоровья и релаксации', duration: '2 дня' },
        { id: '3', name: 'Винодельческое поместье', lat: 43.4831, lng: 6.8377, description: 'Дегустация вин и сельская местность', duration: '2 дня' }
      ],
      cultural: [
        { id: '1', name: 'Исторический центр города', lat: 48.8566, lng: 2.3522, description: 'Музеи и исторические достопримечательности', duration: '2 дня' },
        { id: '2', name: 'Художественный квартал', lat: 48.8606, lng: 2.3376, description: 'Галереи и культурные места', duration: '2 дня' },
        { id: '3', name: 'Древние достопримечательности', lat: 48.8529, lng: 2.3499, description: 'Тур по архитектурному наследию', duration: '3 дня' }
      ]
    };

    return routes[prefs.travelStyle] || routes.cultural;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 transition-colors ${
            activeTab === 'content'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
          }`}
        >
          <List className="w-5 h-5" />
          <span>{!preferences ? 'Анкета' : 'Маршрут'}</span>
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 transition-colors ${
            activeTab === 'map'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
          }`}
        >
          <MapIcon className="w-5 h-5" />
          <span>Карта</span>
        </button>
      </div>

      {/* Left Panel - Questionnaire or Route Info */}
      <div className={`w-full md:w-1/2 bg-white overflow-y-auto ${
        activeTab === 'content' ? 'block' : 'hidden md:block'
      }`}>
        {!preferences ? (
          <Questionnaire onComplete={handleQuestionnaireComplete} />
        ) : (
          <RouteInfo preferences={preferences} routePoints={routePoints} />
        )}
      </div>

      {/* Right Panel - Map */}
      <div className={`w-full md:w-1/2 bg-gray-100 ${
        activeTab === 'map' ? 'block' : 'hidden md:block'
      } h-[calc(100vh-57px)] md:h-screen`}>
        <TravelMap routePoints={routePoints} />
      </div>
    </div>
  );
}