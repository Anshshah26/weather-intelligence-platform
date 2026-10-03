export type SupportedLanguage = 'english' | 'gujarati' | 'hindi';

export const weatherConditionTranslations: Record<SupportedLanguage, Record<string, string>> = {
  english: {
    'clear sky': 'Clear Sky',
    'clear': 'Clear Sky',
    'clouds': 'Cloudy',
    'cloudy': 'Cloudy',
    'few clouds': 'Few Clouds',
    'scattered clouds': 'Scattered Clouds',
    'broken clouds': 'Broken Clouds',
    'overcast clouds': 'Overcast Clouds',
    'partly cloudy': 'Partly Cloudy',
    'rain': 'Rain',
    'light rain': 'Light Rain',
    'moderate rain': 'Moderate Rain',
    'heavy rain': 'Heavy Rain',
    'heavy intensity rain': 'Heavy Rain',
    'drizzle': 'Drizzle',
    'light intensity drizzle': 'Light Drizzle',
    'thunderstorm': 'Thunderstorm',
    'thunderstorm with rain': 'Thunderstorm with Rain',
    'snow': 'Snow',
    'light snow': 'Light Snow',
    'heavy snow': 'Heavy Snow',
    'mist': 'Mist',
    'fog': 'Fog',
    'haze': 'Haze',
    'smoke': 'Smoke',
    'dust': 'Dust',
    'sand': 'Sand',
    'ash': 'Volcanic Ash',
    'squall': 'Squall',
    'tornado': 'Tornado',
  },
  gujarati: {
    'clear sky': 'સ્વચ્છ આકાશ',
    'clear': 'સ્વચ્છ આકાશ',
    'clouds': 'વાદળછાયું',
    'cloudy': 'વાદળછાયું',
    'few clouds': 'હળવા વાદળો',
    'scattered clouds': 'છૂટાછવાયા વાદળો',
    'broken clouds': 'વાદળછાયું વાતાવરણ',
    'overcast clouds': 'ઘેરાયેલા વાદળો',
    'partly cloudy': 'અંશતઃ વાદળછાયું',
    'rain': 'વરસાદ',
    'light rain': 'હળવો વરસાદ',
    'moderate rain': 'મધ્યમ વરસાદ',
    'heavy rain': 'ભારે વરસાદ',
    'heavy intensity rain': 'અતિભારે વરસાદ',
    'drizzle': 'ઝરમર વરસાદ',
    'light intensity drizzle': 'ઝીણો વરસાદ',
    'thunderstorm': 'વાવાઝોડું અને વીજળી',
    'thunderstorm with rain': 'વીજળી સાથે વરસાદ',
    'snow': 'બરફવર્ષા',
    'light snow': 'હળવી બરફવર્ષા',
    'heavy snow': 'ભારે હિમવર્ષા',
    'mist': 'ધુમ્મસ',
    'fog': 'ગાઢ ધુમ્મસ',
    'haze': 'ધૂંધ',
    'smoke': 'ધૂમાડો',
    'dust': 'ધૂળની ડમરી',
    'sand': 'રેતીનું તોફાન',
    'ash': 'રાખ',
    'squall': 'ઝંઝાવાત',
    'tornado': 'ચક્રવાત',
  },
  hindi: {
    'clear sky': 'साफ आसमान',
    'clear': 'साफ आसमान',
    'clouds': 'बादल छाए हुए',
    'cloudy': 'बादल छाए हुए',
    'few clouds': 'हल्के बादल',
    'scattered clouds': 'बिखरे हुए बादल',
    'broken clouds': 'घने बादल',
    'overcast clouds': 'बादलों से घिरा आसमान',
    'partly cloudy': 'आंशिक रूप से बादल',
    'rain': 'बारिश',
    'light rain': 'हल्की बारिश',
    'moderate rain': 'मध्यम बारिश',
    'heavy rain': 'भारी बारिश',
    'heavy intensity rain': 'मूसलाधार बारिश',
    'drizzle': 'बूंदाबांदी',
    'light intensity drizzle': 'हल्की बूंदाबांदी',
    'thunderstorm': 'आंधी-तूफान',
    'thunderstorm with rain': 'तूफान और बारिश',
    'snow': 'बर्फबारी',
    'light snow': 'हल्की बर्फबारी',
    'heavy snow': 'भारी बर्फबारी',
    'mist': 'धुंध',
    'fog': 'कोहरा',
    'haze': 'धुंधलापन',
    'smoke': 'धुआं',
    'dust': 'धूल भरी हवा',
    'sand': 'रेत की आंधी',
    'ash': 'राख',
    'squall': 'झक्कड़',
    'tornado': 'बवंडर',
  },
};

export function translateWeatherCondition(
  rawCondition: string | undefined | null,
  lang: SupportedLanguage
): string {
  if (!rawCondition) return '';
  const key = rawCondition.toLowerCase().trim();
  const langDict = weatherConditionTranslations[lang] || weatherConditionTranslations.english;

  // Direct match
  if (langDict[key]) {
    return langDict[key];
  }

  // Substring matching
  if (key.includes('thunder') || key.includes('storm')) {
    return langDict['thunderstorm'] || rawCondition;
  }
  if (key.includes('drizzle')) {
    return langDict['drizzle'] || rawCondition;
  }
  if (key.includes('rain')) {
    return langDict['rain'] || rawCondition;
  }
  if (key.includes('snow')) {
    return langDict['snow'] || rawCondition;
  }
  if (key.includes('fog')) {
    return langDict['fog'] || rawCondition;
  }
  if (key.includes('mist')) {
    return langDict['mist'] || rawCondition;
  }
  if (key.includes('haze')) {
    return langDict['haze'] || rawCondition;
  }
  if (key.includes('cloud')) {
    return langDict['clouds'] || rawCondition;
  }
  if (key.includes('clear') || key.includes('sun')) {
    return langDict['clear sky'] || rawCondition;
  }

  return rawCondition;
}
