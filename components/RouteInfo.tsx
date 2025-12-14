import { TravelPreferences, RoutePoint } from '../App';
import { MapPin, Clock, DollarSign, Compass, Calendar } from 'lucide-react';

interface RouteInfoProps {
  preferences: TravelPreferences;
  routePoints: RoutePoint[];
}

export function RouteInfo({ preferences, routePoints }: RouteInfoProps) {
  const getTotalDuration = () => {
    return routePoints.reduce((total, point) => {
      const days = parseInt(point.duration);
      return total + days;
    }, 0);
  };

  const getTravelStyleLabel = (style: string) => {
    const labels: Record<string, string> = {
      adventure: 'Приключения и исследования',
      relaxation: 'Отдых и велнес',
      cultural: 'Культура и история'
    };
    return labels[style] || style;
  };

  const getBudgetLabel = (budget: string) => {
    const labels: Record<string, string> = {
      budget: 'Эконом',
      moderate: 'Средний',
      luxury: 'Премиум'
    };
    return labels[budget] || budget;
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="mb-8 md:mb-12">
        <h1 className="mb-2">Your Personalized Route</h1>
        <p className="text-gray-600">We've created a custom itinerary based on your preferences</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-12">
        <div className="p-4 md:p-6 rounded-xl bg-blue-50 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <Compass className="w-5 h-5 text-blue-600" />
            <p className="text-blue-900">Travel Style</p>
          </div>
          <p className="text-blue-900">{getTravelStyleLabel(preferences.travelStyle)}</p>
        </div>

        <div className="p-4 md:p-6 rounded-xl bg-green-50 border-2 border-green-100">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <p className="text-green-900">Budget</p>
          </div>
          <p className="text-green-900">{getBudgetLabel(preferences.budget)}</p>
        </div>

        <div className="p-4 md:p-6 rounded-xl bg-purple-50 border-2 border-purple-100">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <p className="text-purple-900">Total Duration</p>
          </div>
          <p className="text-purple-900">{getTotalDuration()} days</p>
        </div>

        <div className="p-4 md:p-6 rounded-xl bg-orange-50 border-2 border-orange-100">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <p className="text-orange-900">Stops</p>
          </div>
          <p className="text-orange-900">{routePoints.length} destinations</p>
        </div>
      </div>

      {/* Route Points */}
      <div className="mb-8">
        <h2 className="mb-4 md:mb-6">Your Itinerary</h2>
        <div className="space-y-4">
          {routePoints.map((point, index) => (
            <div key={point.id} className="relative">
              {/* Connector Line */}
              {index < routePoints.length - 1 && (
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
                    <p>{point.duration}</p>
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
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 capitalize"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}