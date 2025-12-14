import { useState } from 'react';
import { TravelPreferences } from '../App';
import { Compass, DollarSign, Calendar, Heart } from 'lucide-react';

interface QuestionnaireProps {
  onComplete: (preferences: TravelPreferences) => void;
}

export function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [travelStyle, setTravelStyle] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  const questions = [
    {
      id: 'interests',
      title: 'Каковы ваши интересы?',
      icon: Heart,
      multiple: true,
      options: [
        { value: 'food', label: 'Еда и кухня', description: 'Местные рестораны, кулинарные мастер-классы' },
        { value: 'nature', label: 'Природа и дикая природа', description: 'Парки, пешие прогулки, наблюдение за животными' },
        { value: 'history', label: 'История и архитектура', description: 'Исторические места, памятники' },
        { value: 'shopping', label: 'Шопинг и рынки', description: 'Местные рынки, бутики' },
        { value: 'nightlife', label: 'Ночная жизнь и развлечения', description: 'Бары, клубы, шоу' },
        { value: 'photography', label: 'Фотография', description: 'Живописные виды, фотовозможности' }
      ]
    },
    {
      id: 'travelStyle',
      title: 'Какой у вас стиль путешествия?',
      icon: Compass,
      options: [
        { value: 'adventure', label: 'Приключения и исследования', description: 'Походы, активный отдых, экстрим' },
        { value: 'relaxation', label: 'Отдых и велнес', description: 'Пляжи, спа, спокойный отдых' },
        { value: 'cultural', label: 'Культура и история', description: 'Музеи, достопримечательности, местная культура' }
      ]
    },
    {
      id: 'budget',
      title: 'Какой у вас бюджет?',
      icon: DollarSign,
      options: [
        { value: 'budget', label: 'Эконом', description: 'До $1,000' },
        { value: 'moderate', label: 'Средний', description: '$1,000 - $3,000' },
        { value: 'luxury', label: 'Премиум', description: 'От $3,000' }
      ]
    },
    {
      id: 'duration',
      title: 'Как долго длится ваша поездка?',
      icon: Calendar,
      options: [
        { value: 'short', label: 'Выходные', description: '2-3 дня' },
        { value: 'week', label: 'Одна неделя', description: '5-7 дней' },
        { value: 'extended', label: 'Длительная поездка', description: '10+ дней' }
      ]
    }
  ];

  const currentQuestion = questions[currentStep];

  const handleOptionSelect = (value: string) => {
    if (currentQuestion.multiple) {
      setInterests(prev => 
        prev.includes(value) 
          ? prev.filter(i => i !== value)
          : [...prev, value]
      );
    } else {
      switch (currentQuestion.id) {
        case 'travelStyle':
          setTravelStyle(value);
          break;
        case 'budget':
          setBudget(value);
          break;
        case 'duration':
          setDuration(value);
          break;
      }
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({ travelStyle, budget, duration, interests });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentQuestion.id) {
      case 'travelStyle':
        return travelStyle !== '';
      case 'budget':
        return budget !== '';
      case 'duration':
        return duration !== '';
      case 'interests':
        return interests.length > 0;
      default:
        return false;
    }
  };

  const Icon = currentQuestion.icon;

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-12">
      <div className="mb-8 md:mb-12">
        <h1 className="mb-2">Спланируйте идеальное путешествие</h1>
        <p className="text-gray-600">Расскажите нам о ваших предпочтениях, и мы создадим персональный маршрут для вас</p>
      </div>

      {/* Progress */}
      <div className="mb-8 md:mb-12">
        <div className="flex gap-2 mb-4">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
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

        <div className="space-y-3 md:space-y-4">
          {currentQuestion.options.map((option) => {
            const isSelected = currentQuestion.multiple
              ? interests.includes(option.value)
              : (currentQuestion.id === 'travelStyle' && travelStyle === option.value) ||
                (currentQuestion.id === 'budget' && budget === option.value) ||
                (currentQuestion.id === 'duration' && duration === option.value);

            return (
              <button
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className={`w-full p-4 md:p-6 rounded-xl border-2 transition-all text-left ${
                  isSelected
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