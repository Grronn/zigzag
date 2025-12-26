import { TravelPreferences, RoutePoint, RouteData, RouteDay } from '../App';
import { MapPin, Clock, DollarSign, Compass, Calendar } from 'lucide-react';

interface RouteInfoProps {
  preferences: TravelPreferences;
  routeData: RouteData;
}

export function RouteInfo({ preferences, routeData }: RouteInfoProps) {
  const getTotalDuration = () => {
    // Count days from route days
    return routeData.days.length;
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
        <div className="flex items-center justify-between mb-2">
          <h1 className="mr-4">Ваш маршрут: {routeData.name}</h1>
          <button
            onClick={() => window.location.href = '/'}
            className="w-8 h-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center flex-shrink-0"
            title="Вернуться к созданию маршрута"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600">Мы создали персональный маршрут на основе ваших предпочтений</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-12">
        <div className="p-4 md:p-6 rounded-xl bg-blue-50 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <Compass className="w-5 h-5 text-blue-600" />
            <p className="text-blue-900">Темп маршрута</p>
          </div>
          <p className="text-blue-900">{getPaceLabel(preferences.pace || '')}</p>
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

      {/* Route Points by Day */}
      <div className="mb-8">
        <h1 className="mb-4 md:mb-6 text-lg md:text-xl font-semibold">Ваш маршрут</h1>
        <div className="space-y-6">
          {routeData.days.map((day, dayIndex) => (
            <div key={`day-${day.day_number}`} className="space-y-4">
              {/* Day Header */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900">День {day.day_number}</h3>
                <p className="text-blue-700">Время: {day.working_time}</p>
              </div>

              {/* Places for this day */}
              <div className="space-y-4">
                {day.places.map((point, pointIndex) => {
                  const isLastPointInDay = pointIndex === day.places.length - 1;
                  const isLastPointOverall = dayIndex === routeData.days.length - 1 && isLastPointInDay;

                  return (
                    <div key={point.id} className="relative">
                      {/* Connector Line - only within the same day */}
                      {!isLastPointInDay && (
                        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200" style={{ height: 'calc(100% + 1rem)' }} />
                      )}

                      <div className="flex gap-4">
                        <div className="relative z-10 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                          {point.order}
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
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interests */}
      {preferences.wishes.length > 0 && (
        <div>
          <h2 className="mb-4">Ваши интересы</h2>
          <div className="flex flex-wrap gap-2">
            {preferences.wishes.map((wish) => (
              <span
                key={wish}
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700"
              >
                {getInterestLabel(wish)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
