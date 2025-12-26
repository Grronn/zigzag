import { useState } from 'react';
import { TravelPreferences } from '../App';
import { Compass, DollarSign, Calendar, Heart, MapPin, Clock, Footprints, Car, Plus, Minus } from 'lucide-react';

interface QuestionnaireProps {
  city: string;
  routeName: string;
  onComplete: (preferences: TravelPreferences) => void;
}

export function Questionnaire({ city, routeName, onComplete }: QuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [pace, setPace] = useState('');
  const [days, setDays] = useState(1);
  const [times, setTimes] = useState<string[]>(['10:00 - 18:00']);
  const [interests, setInterests] = useState<string[]>([]);
  const [movementFormat, setMovementFormat] = useState('');

  // Expanded interests options organized in categories
  const interestCategories = [
    {
      category: 'Природа и активный отдых',
      options: [
        { value: 'nature', label: 'Природные достопримечательности' },
        { value: 'hiking', label: 'Пешие прогулки' },
        { value: 'adventure', label: 'Экстремальные виды спорта' },
        { value: 'parks', label: 'Парки и сады' },
        { value: 'beaches', label: 'Пляжи' },
        { value: 'mountains', label: 'Горы' }
      ]
    },
    {
      category: 'Культура и история',
      options: [
        { value: 'history', label: 'Исторические места' },
        { value: 'architecture', label: 'Архитектура' },
        { value: 'museums', label: 'Музеи' },
        { value: 'art', label: 'Искусство и галереи' },
        { value: 'religious', label: 'Религиозные места' },
        { value: 'cultural', label: 'Культурные мероприятия' }
      ]
    },
    {
      category: 'Еда и развлечения',
      options: [
        { value: 'food', label: 'Местная кухня' },
        { value: 'restaurants', label: 'Рестораны' },
        { value: 'cafes', label: 'Кафе' },
        { value: 'nightlife', label: 'Ночная жизнь' },
        { value: 'shopping', label: 'Шопинг' },
        { value: 'markets', label: 'Местные рынки' }
      ]
    },
    {
      category: 'Отдых и велнес',
      options: [
        { value: 'relaxation', label: 'Спа и велнес' },
        { value: 'spa', label: 'Спа-процедуры' },
        { value: 'yoga', label: 'Йога и медитация' },
        { value: 'luxury', label: 'Роскошный отдых' },
        { value: 'hotels', label: 'Отели' },
        { value: 'resorts', label: 'Курорты' }
      ]
    }
  ];

  const questions = [
    {
      id: 'pace',
      title: 'Выберите темп вашего маршрута',
      icon: Compass,
      options: [
        { value: 'moderate', label: 'Умеренный', description: 'Спокойный темп с временем на отдых' },
        { value: 'intensive', label: 'Интенсивный', description: 'Максимум достопримечательностей за день' }
      ]
    },
    {
      id: 'times',
      title: 'Выберите время для экскурсий',
      icon: Clock,
      type: 'time-slots'
    },
    {
      id: 'interests',
      title: 'Каковы ваши интересы?',
      icon: Heart,
      type: 'multi-column',
      multiple: true
    },
    {
      id: 'movement',
      title: 'Как вы планируете передвигаться?',
      icon: Footprints,
      options: [
        { value: 'walking', label: 'Пешком', description: 'Пешие прогулки между достопримечательностями' },
        { value: 'taxi', label: 'Такси', description: 'Быстрое передвижение на такси' },
        { value: 'mixed', label: 'Смешанный', description: 'Комбинация пеших прогулок и транспорта' }
      ]
    }
  ];

  const currentQuestion = questions[currentStep];

  const handleOptionSelect = (value: string) => {
    switch (currentQuestion.id) {
      case 'pace':
        setPace(value);
        break;
      case 'movement':
        setMovementFormat(value);
        break;
    }
  };

  const handleInterestSelect = (value: string) => {
    setInterests(prev =>
      prev.includes(value)
        ? prev.filter(i => i !== value)
        : [...prev, value]
    );
  };

  const handleAddTimeSlot = () => {
    setTimes([...times, '10:00 - 18:00']);
  };

  const handleRemoveTimeSlot = (index: number) => {
    if (times.length > 1) {
      const newTimes = [...times];
      newTimes.splice(index, 1);
      setTimes(newTimes);
    }
  };

  const handleTimeChange = (index: number, field: 'start' | 'end', value: string) => {
    const newTimes = [...times];
    const [start, end] = newTimes[index].split(' - ');
    newTimes[index] = field === 'start' ? `${value} - ${end}` : `${start} - ${value}`;
    setTimes(newTimes);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Prepare the final preferences object
      const finalPreferences: TravelPreferences = {
        city,
        name_of_route: routeName || 'Мой маршрут', // Use routeName from MainPage
        pace: pace,
        quantity_of_days: times.length, // Set based on time slots
        times,
        wishes: interests,
        format_of_movement: movementFormat
      };
      onComplete(finalPreferences);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentQuestion.id) {
      case 'pace':
        return pace !== '';
      case 'days':
        return days > 0;
      case 'times':
        return times.length > 0 && times.every(time => time.includes(' - '));
      case 'interests':
        return interests.length > 0;
      case 'movement':
        return movementFormat !== '';
      default:
        return false;
    }
  };

  const Icon = currentQuestion.icon;

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-12">
      <div className="mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
          <MapPin className="w-4 h-4" />
          {city}
        </div>
        <h1 className="mb-2">Спланируйте идеальное путешествие</h1>
        <p className="text-gray-600">Расскажите нам о ваших предпочтениях, и мы создадим персональный маршрут для вас</p>
      </div>

      {/* Progress */}
      <div className="mb-8 md:mb-12">
        <div className="flex gap-2 mb-4">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
            />
          ))}
        </div>
        <p className="text-gray-500">Шаг {currentStep + 1} из {questions.length}</p>
      </div>

      {/* Question */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <h2>{currentQuestion.title}</h2>
        </div>

        {/* Different question types */}
        {currentQuestion.id === 'days' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDays(Math.max(1, days - 1))}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-2xl font-semibold">{days}</span>
              <button
                onClick={() => setDays(days + 1)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600">Выберите количество дней вашего путешествия</p>
          </div>
        )}

        {currentQuestion.id === 'times' && (
          <div className="space-y-4">
            {times.map((time, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="font-medium">День {index + 1}:</div>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={time.split(' - ')[0]}
                    onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg"
                  />
                  <span>-</span>
                  <input
                    type="time"
                    value={time.split(' - ')[1]}
                    onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                {times.length > 1 && (
                  <button
                    onClick={() => handleRemoveTimeSlot(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddTimeSlot}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-5 h-5" />
              Добавить день
            </button>
          </div>
        )}

        {currentQuestion.id === 'interests' && (
          <div className="space-y-6">
            {interestCategories.map((category, catIndex) => (
              <div key={catIndex}>
                <h3 className="font-medium mb-3 text-gray-800">{category.category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {category.options.map((option) => {
                    const isSelected = interests.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleInterestSelect(option.value)}
                        className={`p-3 rounded-lg border transition-all text-sm ${isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-800'
                          : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                          }`}
                      >
                        {option.label}
                        {isSelected && (
                          <span className="ml-1">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {['pace', 'movement'].includes(currentQuestion.id) && (
          <div className="space-y-3 md:space-y-4">
            {currentQuestion.options?.map((option) => {
              const isSelected =
                (currentQuestion.id === 'pace' && pace === option.value) ||
                (currentQuestion.id === 'movement' && movementFormat === option.value);

              return (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`w-full p-4 md:p-6 rounded-xl border-2 transition-all text-left ${isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-1">{option.label}</div>
                      <p className="text-gray-600">{option.description}</p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 md:gap-4 mt-8 md:mt-12">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-6 py-3 rounded-lg border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Назад
        </button>
        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
        >
          {currentStep === questions.length - 1 ? 'Создать маршрут' : 'Продолжить'}
        </button>
      </div>
    </div>
  );
}
