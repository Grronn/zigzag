import { useState } from 'react';
import { Questionnaire } from './components/Questionnaire';
import { MainPage } from './components/MainPage';
import { MapIcon, List, Loader2 } from 'lucide-react';

export interface TravelPreferences {
  city: string;
  name_of_route: string;
  pace?: string;
  quantity_of_days: number;
  times: string[];
  wishes: string[];
  format_of_movement: string;
}

export interface RoutePoint {
  id: number;
  route_id: number;
  day_number: number;
  order: number;
  name: string;
  description: string;
  coordinates: string;
  address: string;
  time: string;
}

export interface RouteDay {
  day_number: number;
  working_time: string;
  places: RoutePoint[];
}

export interface RouteData {
  id: number;
  name: string;
  city: string;
  pace: string;
  format_of_movement: string;
  days: RouteDay[];
}

type ViewState = 'main' | 'questionnaire';

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

    // Simulate sending data to server
    // This simulates the API call: POST /server/create-route
    // In a real implementation, this would be:
    // const response = await fetch('/server/create-route', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     city: prefs.city,
    //     name_of_route: prefs.name_of_route,
    //     pace: prefs.pace,
    //     quantity_of_days: prefs.quantity_of_days,
    //     times: prefs.times,
    //     wishes: prefs.wishes,
    //     format_of_movement: prefs.format_of_movement
    //   })
    // });
    // const serverResponse = await response.json();

    console.log('Sending to server:', {
      city: prefs.city,
      name_of_route: prefs.name_of_route,
      pace: prefs.pace,
      quantity_of_days: prefs.quantity_of_days,
      times: prefs.times,
      wishes: prefs.wishes,
      format_of_movement: prefs.format_of_movement
    });

    // Simulate server processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate server response with success flag and route ID
    // The real server would return { success: true, routeId: number }
    const mockServerResponse = {
      success: true,
      routeId: 1 // Using ID 1 for our new mock route
    };

    if (mockServerResponse.success) {
      setIsSubmitting(false);
      // Redirect to route page with the generated ID
      window.location.href = `/route/${mockServerResponse.routeId}`;
    } else {
      setIsSubmitting(false);
      // In a real implementation, we would show an error message
      console.error('Failed to create route on server');
    }
  };

  const generateRoute = (prefs: TravelPreferences): RouteData => {
    // Simplified to use only one mock route as per requirements
    // This simulates what we would receive from the backend API

    // Single mock route - "Гастро-тур и история" (Kazan)
    return {
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
    };
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
          <span>Анкета</span>
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

      {/* Left Panel - Questionnaire */}
      <div className={`w-full md:w-1/2 bg-white overflow-y-auto ${activeTab === 'content' ? 'block' : 'hidden md:block'
        }`}>
        <Questionnaire city={city} routeName={routeName} onComplete={handleQuestionnaireComplete} />
      </div>

      {/* Right Panel - Map (empty for now, will show map when route is generated) */}
      <div className={`w-full md:w-1/2 bg-gray-100 ${activeTab === 'map' ? 'block' : 'hidden md:block'
        } h-[calc(100vh-57px)] md:h-screen`}>
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Map will appear after route creation</p>
        </div>
      </div>
    </div>
  );
}
