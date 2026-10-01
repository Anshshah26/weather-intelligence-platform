import {
  CurrentWeatherData,
  HourlyForecastItem,
  ActivityScoreItem,
  RainAlertData,
  WeatherSummaryData,
} from '../types/weather';

export const mockCurrentWeather: CurrentWeatherData = {
  location: 'Mumbai',
  country: 'India',
  temperature: 29,
  condition: 'Partly Cloudy',
  feelsLike: 31,
  humidity: 72,
  windSpeed: 14,
  windDirection: 'SW',
  pressure: 1012,
  visibility: 8,
  uvIndex: 6,
  uvDescription: 'High',
  highTemp: 32,
  lowTemp: 26,
  updatedAt: 'Just now',
};

export const mockHourlyForecast: HourlyForecastItem[] = [
  { time: '12 PM', temp: 29, condition: 'partly-cloudy', rainProbability: 15, iconName: 'SunCloud' },
  { time: '1 PM', temp: 30, condition: 'sunny', rainProbability: 10, iconName: 'Sun' },
  { time: '2 PM', temp: 31, condition: 'sunny', rainProbability: 10, iconName: 'Sun' },
  { time: '3 PM', temp: 30, condition: 'partly-cloudy', rainProbability: 25, iconName: 'SunCloud' },
  { time: '4 PM', temp: 29, condition: 'cloudy', rainProbability: 40, iconName: 'Cloud' },
  { time: '5 PM', temp: 28, condition: 'cloudy', rainProbability: 60, iconName: 'Cloud' },
  { time: '6 PM', temp: 27, condition: 'rain', rainProbability: 75, iconName: 'CloudRain' },
  { time: '7 PM', temp: 26, condition: 'rain', rainProbability: 70, iconName: 'CloudRain' },
];

export const mockActivityScores: ActivityScoreItem[] = [
  { id: 'running', name: 'Running', score: 82, status: 'Excellent', icon: 'Footprints' },
  { id: 'walking', name: 'Walking', score: 91, status: 'Excellent', icon: 'UserCheck' },
  { id: 'cycling', name: 'Cycling', score: 76, status: 'Good', icon: 'Bike' },
  { id: 'football', name: 'Football', score: 68, status: 'Good', icon: 'Trophy' },
];

export const mockRainAlert: RainAlertData = {
  title: 'Rain & Precipitation Warning',
  message: 'Rain is possible later today.',
  probabilityIncreaseTime: 'Rain probability may increase around 6 PM.',
  recommendation: 'Consider carrying an umbrella.',
  severity: 'medium',
};

export const mockWeatherSummary: WeatherSummaryData = {
  title: 'Current Weather Digest',
  headline: 'Warm & humid atmospheric conditions with afternoon cloud accumulation.',
  description:
    'Mumbai is currently experiencing warm maritime weather at 29°C with a humidity level of 72%. Onshore breezes from the southwest at 14 km/h are maintaining moderate visibility. A cloud front is expected to build past 4 PM, leading to localized rainfall around 6 PM.',
  highlights: [
    'Moderate UV index requiring light sun protection until 4 PM.',
    'Southwest wind at 14 km/h supporting favorable walking conditions.',
    'Precipitation likely during evening commute hours.',
  ],
};

export const mockOverviewData = {
  humidity: { value: 72, unit: '%', text: 'High Humidity', status: 'Slightly muggy' },
  wind: { value: 14, unit: 'km/h', direction: 'SW', text: 'Gentle breeze' },
  pressure: { value: 1012, unit: 'hPa', text: 'Normal', status: 'Stable' },
  visibility: { value: 8, unit: 'km', text: 'Clear', status: 'Good range' },
  uvIndex: { value: 6, text: 'High', recommendation: 'Wear sunscreen' },
  sunCycle: { sunrise: '06:24 AM', sunset: '06:48 PM', daylight: '12h 24m' },
};
