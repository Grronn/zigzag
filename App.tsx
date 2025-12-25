import { useState } from 'react';
import { Questionnaire } from './components/Questionnaire';
import { RouteInfo } from './components/RouteInfo';
import { TravelMap } from './components/TravelMap';
import { MainPage } from './components/MainPage';
import { MapIcon, List, Loader2 } from 'lucide-react';

export interface TravelPreferences {
  city: string;
  name_of_route: string;
  pace_of_route?: string;
  quantity_of_days: number;
  times: string[];
  interests: string[];
  format_of_movement: string;
}

export interface RoutePoint {
  id: string;
  number_day: number;
  route_id: number;
  order: number;
  coordinates: string;
  name: string;
  description: string;
  time: string;
  address: string;
}

export interface RouteData {
  id: number;
  name: string;
  city: string;
  places: RoutePoint[];
}

type ViewState = 'main' | 'questionnaire' | 'result';

export default function App() {
  const [view, setView] = useState<ViewState>('main');
  const [city, setCity] = useState('');
  const [routeName, setRouteName] = useState('');
  const [preferences, setPreferences] = useState<TravelPreferences | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'map'>('content');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = (selectedCity: string, routeName: string) => {
    setCity(selectedCity);
    setRouteName(routeName);
    setView('questionnaire');
  };

  const handleQuestionnaireComplete = async (prefs: TravelPreferences) => {
    setIsSubmitting(true);

    // Mock backend submission
    // Sending { city, ...prefs } to backend...
    await new Promise(resolve => setTimeout(resolve, 1500));

    setPreferences(prefs);

    // Mock receiving success and ID, then generating route
    const generatedRoute = generateRoute(prefs);
    setRouteData(generatedRoute);

    setIsSubmitting(false);
    setView('result');
  };

  const generateRoute = (prefs: TravelPreferences): RouteData => {
    // Mock server response data in the exact format from the backend
    // This simulates what we would receive from the backend API

    // Determine route type based on city and interests
    const isMoscow = prefs.city.toLowerCase().includes('moscow');
    const isPetersburg = prefs.city.toLowerCase().includes('peterburg');
    const hasCulture = prefs.interests.includes('history') || prefs.interests.includes('architecture') || prefs.interests.includes('museums');

    // Mock route data in the exact format from the backend
    const mockRoutes: Record<string, RouteData> = {
      'mystic-petersburg': {
        id: 2,
        name: "Мистический Питер",
        city: "Санкт-Петербург",
        places: [
          {
            id: '1',
            number_day: 1,
            route_id: 2,
            order: 1,
            coordinates: '59.944365, 30.347517',
            name: 'Дом Бака (Дворы)',
            description: 'Величественный дом-колодец с открытыми галереями и стеклянным переходом, погружающий в атмосферу старого Петербурга. Идеальное начало мистического маршрута, где можно почувствовать дух доходных домов.',
            time: '10:00 - 10:45',
            address: 'Россия, Санкт-Питербург, Памятник коту Елисею и кошке Василисе, Дом Бака (Дворы)'
          },
          {
            id: '2',
            number_day: 1,
            route_id: 2,
            order: 2,
            coordinates: '59.936647, 30.339665',
            name: 'Памятник коту Елисею и кошке Василисе',
            description: 'Забавные и милые памятники котам на карнизах домов, связанные с городскими легендами. Считается, что если бросить монетку и попасть, желание исполнится. Рядом можно найти уютное кафе для кофе-паузы.',
            time: '11:15 - 12:00',
            address: 'Россия, Санкт-Питербург, Памятник коту Елисею и кошке Василисе'
          },
          {
            id: '3',
            number_day: 1,
            route_id: 2,
            order: 3,
            coordinates: '59.934283, 30.332266',
            name: 'Книжный магазин "Все свободны"',
            description: 'Уютный книжный магазин с атмосферой старого Петербурга. Здесь можно найти редкие издания и книги о городе. Идеальное место для любителей чтения и истории.',
            time: '12:30 - 13:15',
            address: 'Россия, Санкт-Питербург, Книжный магазин "Все свободны"'
          },
          {
            id: '4',
            number_day: 2,
            route_id: 2,
            order: 1,
            coordinates: '59.945568, 30.337845',
            name: 'Кафе "Бродячая собака"',
            description: 'Легендарное кафе, где собирались поэты и художники Серебряного века. Сохранилась атмосфера начала 20 века. Отличное место для обеда и знакомства с культурой Петербурга.',
            time: '11:00 - 12:30',
            address: 'Россия, Санкт-Питербург, Кафе "Бродячая собака"'
          }
        ]
      },
      'moscow-cultural': {
        id: 1,
        name: "Культурная Москва",
        city: "Москва",
        places: [
          {
            id: '1',
            number_day: 1,
            route_id: 1,
            order: 1,
            coordinates: '55.753931, 37.620795',
            name: 'Красная площадь',
            description: 'Сердце Москвы и главная достопримечательность России. Здесь вы увидите Кремль, собор Василия Блаженного и Мавзолей Ленина. Идеальное место для начала знакомства с городом.',
            time: '10:00 - 12:00',
            address: 'Россия, Москва, Красная площадь'
          },
          {
            id: '2',
            number_day: 1,
            route_id: 1,
            order: 2,
            coordinates: '55.752121, 37.617635',
            name: 'ГУМ',
            description: 'Исторический универсальный магазин с роскошной архитектурой и лучшими бутиками. Здесь можно сделать покупки и попробовать традиционные русские деликатесы.',
            time: '12:30 - 14:00',
            address: 'Россия, Москва, ГУМ'
          },
          {
            id: '3',
            number_day: 2,
            route_id: 1,
            order: 1,
            coordinates: '55.744511, 37.610989',
            name: 'Третьяковская галерея',
            description: 'Один из крупнейших музеев русского изобразительного искусства. Здесь вы найдете шедевры от икон до авангарда. Обязательное место для посещения любителями искусства.',
            time: '11:00 - 14:00',
            address: 'Россия, Москва, Третьяковская галерея'
          }
        ]
      },
      'adventure-mountains': {
        id: 3,
        name: "Альпийское приключение",
        city: "Швейцария",
        places: [
          {
            id: '1',
            number_day: 1,
            route_id: 3,
            order: 1,
            coordinates: '46.8182, 8.2275',
            name: 'Базовый лагерь в горах',
            description: 'Отправная точка для горных приключений. Здесь вы получите необходимое снаряжение и инструктаж перед восхождением.',
            time: '09:00 - 10:00',
            address: 'Швейцария, Альпы, Базовый лагерь'
          },
          {
            id: '2',
            number_day: 1,
            route_id: 3,
            order: 2,
            coordinates: '46.5197, 8.7892',
            name: 'Альпийская тропа',
            description: 'Сложный пеший маршрут с потрясающими видами на альпийские вершины. Требует хорошей физической подготовки.',
            time: '10:30 - 16:00',
            address: 'Швейцария, Альпы, Альпийская тропа'
          }
        ]
      }
    };

    // Select route based on city and interests
    if (isPetersburg && hasCulture) {
      return mockRoutes['mystic-petersburg'];
    } else if (isMoscow && hasCulture) {
      return mockRoutes['moscow-cultural'];
    } else {
      return mockRoutes['adventure-mountains'];
    }
  };

  if (view === 'main') {
    return <MainPage onStart={handleStart} />;
  }

  if (isSubmitting) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Creating your route...</h2>
        <p className="text-gray-500">Please wait while we analyze your preferences</p>
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
          <span>{view === 'questionnaire' ? 'Анкета' : 'Маршрут'}</span>
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

      {/* Left Panel - Questionnaire or Route Info */}
      <div className={`w-full md:w-1/2 bg-white overflow-y-auto ${activeTab === 'content' ? 'block' : 'hidden md:block'
        }`}>
        {view === 'questionnaire' ? (
          <Questionnaire city={city} routeName={routeName} onComplete={handleQuestionnaireComplete} />
        ) : (
          preferences && routeData && <RouteInfo preferences={preferences} routeData={routeData} />
        )}
      </div>

      {/* Right Panel - Map */}
      <div className={`w-full md:w-1/2 bg-gray-100 ${activeTab === 'map' ? 'block' : 'hidden md:block'
        } h-[calc(100vh-57px)] md:h-screen`}>
        <TravelMap routePoints={routeData?.places || []} />
      </div>
    </div>
  );
}
