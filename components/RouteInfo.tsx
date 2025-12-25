import { TravelPreferences, RoutePoint, RouteData } from '../App';
import { MapPin, Clock, DollarSign, Compass, Calendar } from 'lucide-react';

interface RouteInfoProps {
  preferences: TravelPreferences;
  routeData: RouteData;
}

export function RouteInfo({ preferences, routeData }: RouteInfoProps) {
  const getTotalDuration = () => {
    // Count unique days from route points
    const uniqueDays = new Set(routeData.places.map(point => point.number_day));
    return uniqueDays.size;
  };

  const getPaceLabel = (pace: string) => {
    const labels: Record<string, string> = {
      moderate: 'Умеренный',
      intensive: 'Интенсивный'
    };
    return labels[pace] || pace;
  };

  const getMovementLabel = (movement: string) => {
    const labels: Record<string, string> = {
      walking: 'Пешком',
      taxi: 'Такси',
      mixed: 'Смешанный'
    };
    return labels[movement] || movement;
  };

  const getInterestLabel = (interest: string) => {
    const labels: Record<string, string> = {
      'nature': 'Природные достопримечательности',
      'hiking': 'Пешие прогулки',
      'adventure': 'Экстремальные виды спорта',
      'parks': 'Парки и сады',
      'beaches': 'Пляжи',
      'mountains': 'Горы',
      'history': 'Исторические места',
      'architecture': 'Архитектура',
      'museums': 'Музеи',
      'art': 'Искусство и галереи',
      'religious': 'Религиозные места',
      'cultural': 'Культурные мероприятия',
      'food': 'Местная кухня',
      'restaurants': 'Рестораны',
      'cafes': 'Кафе',
      'nightlife': 'Ночная жизнь',
      'shopping': 'Шопинг',
      'markets': 'Местные рынки',
      'relaxation': 'Спа и велнес',
      'spa': 'Спа-процедуры',
      'yoga': 'Йога и медитация',
      'luxury': 'Роскошный отдых',
      'hotels': 'Отели',
      'resorts': 'Курорты'
    };
    return labels[interest] || interest;
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="mb-8 md:mb-12">
        <h1 className="mb-2">Ваш маршрут: {routeData.name}</h1>
        <p className="text-gray-600">Мы создали персональный маршрут на основе ваших предпочтений</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-12">
        <div className="p-4 md:p-6 rounded-xl bg-blue-50 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <Compass className="w-5 h-5 text-blue-600" />
            <p className="text-blue-900">Темп маршрута</p>
          </div>
          <p className="text-blue-900">{getPaceLabel(preferences.pace_of_route || '')}</p>
        </div>

        <div className="p-4 md:p-6 rounded-xl bg-green-50 border-2 border-green-100">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <p className="text-green-900">Количество дней</p>
          </div>
          <p className="text-green-900">{preferences.quantity_of_days} дней</p>
        </div>

        <div className="p-4 md:p-6 rounded-xl bg-purple-50 border-2 border-purple-100">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <p className="text-purple-900">Время экскурсий</p>
          </div>
          <p className="text-purple-900">{preferences.times.length} дня</p>
        </div>

        <div className="p-4 md:p-6 rounded-xl bg-orange-50 border-2 border-orange-100">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <p className="text-orange-900">Способ передвижения</p>
          </div>
          <p className="text-orange-900">{getMovementLabel(preferences.format_of_movement)}</p>
        </div>
      </div>

      {/* Route Points */}
      <div className="mb-8">
        <h2 className="mb-4 md:mb-6">Ваш маршрут</h2>
        <div className="space-y-4">
          {routeData.places.map((point, index) => (
            <div key={point.id} className="relative">
              {/* Connector Line */}
              {index < routeData.places.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200" style={{ height: 'calc(100% + 1rem)' }} />
              )}

              <div className="flex gap-4">
                <div className="relative z-10 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 pb-8">
                  <div className="mb-2">{point.name}</div>
                  <p className="text-gray-600 mb-3">{point.description}</p>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <p>{point.time}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interests */}
      {preferences.interests.length > 0 && (
        <div>
          <h2 className="mb-4">Ваши интересы</h2>
          <div className="flex flex-wrap gap-2">
            {preferences.interests.map((interest) => (
              <span
                key={interest}
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700"
              >
                {getInterestLabel(interest)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Time Slots */}
      <div className="mt-8">
        <h2 className="mb-4">Временные слоты</h2>
        <div className="space-y-3">
          {preferences.times.map((time, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">День {index + 1}:</span>
              <span>{time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
