import { useState } from 'react';
import { MapPin } from 'lucide-react';

interface MainPageProps {
    onStart: (city: string, routeName: string) => void;
}

export function MainPage({ onStart }: MainPageProps) {
    const [selectedCity, setSelectedCity] = useState('Moscow');
    const [routeName, setRouteName] = useState('');

    const handleStart = () => {
        onStart(selectedCity, routeName);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        ZigZag
                    </h1>
                    <p className="text-xl text-gray-600">
                        Спланируйте свое идеальное путешествие за считанные секунды
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2 text-left">
                            <label htmlFor="route-name" className="text-sm font-medium text-gray-700 block">
                                Название маршрута
                            </label>
                            <input
                                id="route-name"
                                type="text"
                                value={routeName}
                                onChange={(e) => setRouteName(e.target.value)}
                                placeholder="Мой летний отпуск"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2 text-left">
                            <label htmlFor="city-select" className="text-sm font-medium text-gray-700 block">
                                Выберите город
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    id="city-select"
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="Moscow">Moscow</option>
                                    <option value="Saint Petersburg">Saint Petersburg</option>
                                    <option value="Kazan">Kazan</option>
                                    <option value="Sochi">Sochi</option>
                                    <option value="Novosibirsk">Novosibirsk</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/20"
                    >
                        Let's travel
                    </button>
                </div>
            </div>
        </div>
    );
}
