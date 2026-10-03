export type SupportedLanguage = 'english' | 'gujarati' | 'hindi';

export interface TranslationDictionary {
  // Brand & Header
  appTitle: string;
  appSubtitle: string;
  searchPlaceholder: string;
  searchButton: string;
  useMyLocation: string;
  detecting: string;
  locationDetected: string;
  locationDenied: string;
  signIn: string;
  signUp: string;
  logout: string;
  settings: string;
  guestUser: string;
  userAccount: string;

  // Navigation
  dashboard: string;
  forecast: string;
  weatherMap: string;
  radar: string;
  aiAdvisor: string;
  activities: string;
  travel: string;
  travelPlanner: string;
  compare: string;
  cityComparison: string;
  intelligenceTools: string;
  telemetryFeed: string;
  online: string;

  // Dashboard & Current Weather
  currentWeather: string;
  liveTelemetry: string;
  observedStation: string;
  gpsTelemetry: string;
  feelsLike: string;
  atmosphericState: string;
  humidity: string;
  wind: string;
  windSpeed: string;
  pressure: string;
  visibility: string;
  hourlyProgression: string;
  next24Hours: string;
  todaysOverview: string;
  environmentalTelemetry: string;
  uvIndex: string;
  solarCycle: string;
  sunrise: string;
  sunset: string;
  outdoorActivityIndex: string;
  telemetryRating: string;
  weatherSummary: string;
  meteorologicalObservations: string;

  // Forecast & Graphs
  extendedForecast: string;
  dailyProjection: string;
  weatherTrends: string;
  airQualityIndex: string;
  airQuality: string;
  usAqiStandard: string;
  good: string;
  moderate: string;
  poor: string;
  hazardous: string;
  tempMetric: string;
  temperature: string;
  rainMetric: string;
  rainProbability: string;
  windMetric: string;
  refreshTelemetry: string;
  retry: string;

  // Map & Radar
  meteorologicalMap: string;
  precipitationDopplerRadar: string;
  activeLegends: string;
  layers: string;
  temperatureLayer: string;
  rainLayer: string;
  cloudsLayer: string;
  windLayer: string;
  pressureLayer: string;
  opacity: string;
  resetView: string;
  fullscreen: string;
  radarReflectivity: string;
  lightRain: string;
  moderateRain: string;
  heavyRain: string;
  severe: string;
  play: string;
  pause: string;
  now: string;
  radarFeed: string;
  activeFeed: string;
  standardMode: string;

  // AI Advisor Module
  advisoryIntelligence: string;
  aiAdvisorSubtitle: string;
  advisoryStation: string;
  station: string;
  queries: string;
  queryFootball: string;
  queryRunning: string;
  queryRainTonight: string;
  queryWeatherTomorrow: string;
  queryHot3PM: string;
  queryCycling7AM: string;
  queryAbout8PM: string;
  queryWeatherNow: string;
  askAdvisor: string;
  submit: string;
  telemetryReferenced: string;
  analyzingTelemetry: string;
  unableToAnalyze: string;
  rainLabel: string;
  welcomeAdvisorPrefix: string;
  welcomeAdvisorSuffix: string;

  // Activities Module
  activitiesTitle: string;
  activitiesSubtitle: string;
  suitabilityTelemetryEngine: string;
  evaluateCityPlaceholder: string;
  goButton: string;
  severeConditionsPresent: string;
  severeConditionsMessage: string;
  selectActivityPlan: string;
  supportedModules: string;
  actRunning: string;
  actFootball: string;
  actWalking: string;
  actCycling: string;
  actCricket: string;
  actHiking: string;
  actOutdoorWorkout: string;
  actPicnic: string;
  timeSlot: string;
  slotNow: string;
  slotToday: string;
  slotTomorrow: string;
  suitabilityIndex: string;
  catExcellent: string;
  catGood: string;
  catModerate: string;
  catPoor: string;
  catVeryPoor: string;
  evaluatedFor: string;
  inCity: string;
  conditionVariables: string;
  rainProbMetric: string;
  favorableFactors: string;
  weatherAdvisories: string;
  noPositiveFactors: string;
  noAdverseWarnings: string;
  meteorologicalEvaluationSynthesis: string;

  // Travel Planner Module
  travelPlannerTitle?: string;
  travelPlannerSubtitle: string;
  itineraryAssessment: string;
  destination: string;
  departure: string;
  returnDate: string;
  analyze: string;
  forecastHorizonNotice: string;
  evaluatingItinerary: string;
  synthesizingForecasts: string;
  destinationSummary: string;
  daysObserved: string;
  zoneLabel: string;
  averageTempLabel: string;
  rainRiskLabel: string;
  riskPossible: string;
  riskLow: string;
  gearLabel: string;
  gearUmbrella: string;
  gearStandard: string;
  travelAdvisorySynthesis: string;
  dailyTravelForecast: string;
  beyondHorizon: string;
  precipitationRisk: string;
  highestRiskWindow: string;
  lowestRiskWindow: string;
  umbrellaRecommendedDays: string;
  noHeavyRainExpected: string;
  thermalProfile: string;
  warmestWindow: string;
  coolestWindow: string;
  meanTemperature: string;
  packingChecklist: string;
  recommendedItems: string;
  itemUmbrella: string;
  itemLightJacket: string;
  itemSunglasses: string;
  itemWaterBottle: string;

  // City Comparison Module
  cityComparisonTitle?: string;
  cityComparisonSubtitle: string;
  comparativeAnalysisEngine: string;
  targetLocations: string;
  addLocation: string;
  activityCriterion: string;
  analysisTimeframe: string;
  timeframeCurrent: string;
  timeframeToday: string;
  timeframeTomorrow: string;
  executeComparison: string;
  processingMatrices: string;
  aggregatingVariables: string;
  comparativeAnalysisSynthesis: string;
  parameterMatrix: string;
  parameterLabel: string;
  barometricPressure: string;
  suitabilityLabel: string;

  // Settings Panel & Modal
  language: string;
  theme: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  cancel: string;
  confirm: string;
  logoutConfirmTitle: string;
  logoutConfirmMsg: string;
  close: string;

  // Alerts & Widgets
  smartUmbrella: string;
  umbrellaRecommended: string;
  umbrellaPossible: string;
  noUmbrellaNeeded: string;
  enableAlerts: string;
  alertsActive: string;

  // Favorite Cities
  favorites: string;
  favoriteCities: string;
  addFavoriteCity: string;
  removeFavoriteCity: string;
  noFavoriteCities: string;
  noFavoritesDescription: string;
  maxFavoritesReached: string;
  favoriteCityAdded: string;
  favoriteCityRemoved: string;
  weatherUnavailable: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  english: {
    appTitle: 'Weather Intelligence',
    appSubtitle: 'Meteorological Platform',
    searchPlaceholder: 'Search city...',
    searchButton: 'Search',
    useMyLocation: 'Use My Location',
    detecting: 'Detecting...',
    locationDetected: 'Location detected',
    locationDenied: 'Location permission was denied.',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    logout: 'Logout',
    settings: 'Settings',
    guestUser: 'Guest User',
    userAccount: 'User Account',

    dashboard: 'Dashboard',
    forecast: 'Forecast',
    weatherMap: 'Weather Map',
    radar: 'Radar',
    aiAdvisor: 'AI Weather Advisor',
    activities: 'Activities',
    travel: 'Travel Planner',
    travelPlanner: 'Travel Planner',
    compare: 'City Comparison',
    cityComparison: 'City Comparison',
    intelligenceTools: 'Intelligence & Tools',
    telemetryFeed: 'Telemetry Feed',
    online: 'ONLINE',

    currentWeather: 'Current Weather',
    liveTelemetry: 'LIVE TELEMETRY',
    observedStation: 'Observed Station',
    gpsTelemetry: 'GPS Telemetry',
    feelsLike: 'Feels like',
    atmosphericState: 'Atmospheric State',
    humidity: 'Humidity',
    wind: 'Wind',
    windSpeed: 'Wind Speed',
    pressure: 'Pressure',
    visibility: 'Visibility',
    hourlyProgression: 'Hourly Progression',
    next24Hours: 'Next 24 Hours',
    todaysOverview: "Today's Environmental Telemetry",
    environmentalTelemetry: 'Atmospheric conditions and solar metrics',
    uvIndex: 'UV Index',
    solarCycle: 'Solar Cycle',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    outdoorActivityIndex: 'Outdoor Activity Index',
    telemetryRating: 'Telemetry Rating',
    weatherSummary: 'Weather Summary',
    meteorologicalObservations: 'Key Meteorological Observations',

    extendedForecast: 'Extended Forecast Timeline',
    dailyProjection: 'Daily Projection',
    weatherTrends: 'Weather Trends',
    airQualityIndex: 'Air Quality Index',
    airQuality: 'Air Quality',
    usAqiStandard: 'US AQI Standard',
    good: 'Good',
    moderate: 'Moderate',
    poor: 'Poor',
    hazardous: 'Hazardous',
    tempMetric: 'Temp',
    temperature: 'Temperature',
    rainMetric: 'Rain',
    rainProbability: 'Rain Probability',
    windMetric: 'Wind',
    refreshTelemetry: 'Refresh Telemetry',
    retry: 'Retry',

    meteorologicalMap: 'Atmospheric Spatial Telemetry',
    precipitationDopplerRadar: 'Precipitation Doppler Radar',
    activeLegends: 'Active Legends',
    layers: 'Layers',
    temperatureLayer: 'Temperature',
    rainLayer: 'Rain',
    cloudsLayer: 'Clouds',
    windLayer: 'Wind',
    pressureLayer: 'Pressure',
    opacity: 'Opacity',
    resetView: 'Reset',
    fullscreen: 'Full',
    radarReflectivity: 'Radar Reflectivity',
    lightRain: 'Light Rain',
    moderateRain: 'Moderate Rain',
    heavyRain: 'Heavy Rain',
    severe: 'Severe',
    play: 'Play',
    pause: 'Pause',
    now: 'NOW',
    radarFeed: 'Radar Feed',
    activeFeed: 'Active',
    standardMode: 'Standard Mode',

    // AI Advisor Module
    advisoryIntelligence: 'AI Weather Advisor',
    aiAdvisorSubtitle: 'Contextual advisory engine for activity scheduling and weather risk analysis',
    advisoryStation: 'Advisory Intelligence Station',
    station: 'Station:',
    queries: 'Queries:',
    queryFootball: 'Can I play football at 6 PM?',
    queryRunning: 'Can I go running tomorrow morning?',
    queryRainTonight: 'Will it rain tonight?',
    queryWeatherTomorrow: 'What will the weather be tomorrow?',
    queryHot3PM: 'Will it be hot at 3 PM?',
    queryCycling7AM: 'Can I go cycling at 7 AM?',
    queryAbout8PM: 'What about 8 PM?',
    queryWeatherNow: 'How is the weather now?',
    askAdvisor: 'Ask regarding weather conditions, timing, or outdoor plans...',
    submit: 'Submit',
    telemetryReferenced: 'Telemetry Referenced:',
    analyzingTelemetry: 'Analyzing atmospheric telemetry...',
    unableToAnalyze: 'Unable to analyze weather data at this time. Please retry.',
    rainLabel: 'rain',
    welcomeAdvisorPrefix: 'Meteorological Advisor online for',
    welcomeAdvisorSuffix: 'Inquire regarding outdoor scheduling, precipitation timing, thermal projections, or multi-city planning.',

    // Activities Module
    activitiesTitle: 'Activity Weather Intelligence',
    activitiesSubtitle: 'Quantitative outdoor plan suitability computed from atmospheric variables',
    suitabilityTelemetryEngine: 'Suitability Telemetry Engine',
    evaluateCityPlaceholder: 'Evaluate city...',
    goButton: 'Go',
    severeConditionsPresent: 'Severe conditions present:',
    severeConditionsMessage: 'Extreme temperature, heavy precipitation, or strong gusts. Outdoor activity is not recommended.',
    selectActivityPlan: 'Select Activity Plan',
    supportedModules: '8 Supported Modules',
    actRunning: 'Running',
    actFootball: 'Football',
    actWalking: 'Walking',
    actCycling: 'Cycling',
    actCricket: 'Cricket',
    actHiking: 'Hiking',
    actOutdoorWorkout: 'Outdoor Workout',
    actPicnic: 'Picnic',
    timeSlot: 'Time Slot',
    slotNow: 'Now',
    slotToday: 'Today',
    slotTomorrow: 'Tomorrow',
    suitabilityIndex: 'Suitability Index',
    catExcellent: 'Excellent',
    catGood: 'Good',
    catModerate: 'Moderate',
    catPoor: 'Poor',
    catVeryPoor: 'Very Poor',
    evaluatedFor: 'Evaluated for',
    inCity: 'in',
    conditionVariables: 'Condition Variables',
    rainProbMetric: 'Rain Prob',
    favorableFactors: 'Favorable Factors',
    weatherAdvisories: 'Weather Advisories',
    noPositiveFactors: 'No strong positive weather factors present.',
    noAdverseWarnings: 'No adverse weather warnings observed for this window.',
    meteorologicalEvaluationSynthesis: 'Meteorological Evaluation Synthesis:',

    // Travel Planner Module
    travelPlannerTitle: 'Smart Travel Weather Planner',
    travelPlannerSubtitle: 'Multi-day destination forecasts and luggage packing advisories',
    itineraryAssessment: 'Itinerary Atmospheric Assessment',
    destination: 'Destination',
    departure: 'Departure',
    returnDate: 'Return',
    analyze: 'Analyze',
    forecastHorizonNotice: 'Detailed weather forecast telemetry is available for up to 5 days ahead. Dates beyond provider availability will be marked accordingly.',
    evaluatingItinerary: 'Evaluating itinerary weather profile...',
    synthesizingForecasts: 'Synthesizing multi-day forecasts and packing requirements.',
    destinationSummary: 'Destination Summary',
    daysObserved: 'Days Observed',
    zoneLabel: 'Zone:',
    averageTempLabel: 'Average',
    rainRiskLabel: 'Rain Risk',
    riskPossible: 'Possible',
    riskLow: 'Low',
    gearLabel: 'Gear',
    gearUmbrella: 'Umbrella',
    gearStandard: 'Standard',
    travelAdvisorySynthesis: 'Travel Advisory Synthesis',
    dailyTravelForecast: 'Daily Travel Forecast',
    beyondHorizon: 'Projection beyond horizon.',
    precipitationRisk: 'Precipitation Risk',
    highestRiskWindow: 'Highest Risk Window:',
    lowestRiskWindow: 'Lowest Risk Window:',
    umbrellaRecommendedDays: 'Umbrella Recommended Days:',
    noHeavyRainExpected: 'No heavy rain days expected',
    thermalProfile: 'Thermal Profile',
    warmestWindow: 'Warmest Available Window:',
    coolestWindow: 'Coolest Available Window:',
    meanTemperature: 'Mean Temperature:',
    packingChecklist: 'Packing Checklist',
    recommendedItems: 'Recommended Items',
    itemUmbrella: 'Umbrella',
    itemLightJacket: 'Light Jacket',
    itemSunglasses: 'Sunglasses',
    itemWaterBottle: 'Water Bottle',

    // City Comparison Module
    cityComparisonTitle: 'City Weather Comparison',
    cityComparisonSubtitle: 'Side-by-side meteorological metrics and activity suitability evaluation',
    comparativeAnalysisEngine: 'Comparative Analysis Engine',
    targetLocations: 'Target Locations (2 to 4 Cities)',
    addLocation: 'Add Location',
    activityCriterion: 'Activity Criterion',
    analysisTimeframe: 'Analysis Timeframe',
    timeframeCurrent: 'Current Telemetry',
    timeframeToday: "Today's Aggregation",
    timeframeTomorrow: "Tomorrow's Projection",
    executeComparison: 'Execute Comparison',
    processingMatrices: 'Processing telemetry matrices...',
    aggregatingVariables: 'Aggregating atmospheric variables and normalizing comparative scales.',
    comparativeAnalysisSynthesis: 'Comparative Analysis Synthesis',
    parameterMatrix: 'Parameter Comparison Matrix',
    parameterLabel: 'Parameter',
    barometricPressure: 'Barometric Pressure',
    suitabilityLabel: 'Suitability',

    language: 'Language',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    cancel: 'Cancel',
    confirm: 'Logout',
    logoutConfirmTitle: 'Log out?',
    logoutConfirmMsg: 'Are you sure you want to log out?',
    close: 'Close',

    smartUmbrella: 'Smart Umbrella',
    umbrellaRecommended: 'Umbrella recommended',
    umbrellaPossible: 'Umbrella possible',
    noUmbrellaNeeded: 'No umbrella needed',
    enableAlerts: 'Enable Alerts',
    alertsActive: 'Rain Alerts Active',

    favorites: 'Favorites',
    favoriteCities: 'Favorite Cities',
    addFavoriteCity: 'Add Favorite City',
    removeFavoriteCity: 'Remove Favorite City',
    noFavoriteCities: 'No favorite cities yet',
    noFavoritesDescription: 'Search for a city and click the bookmark icon to save it.',
    maxFavoritesReached: 'You can save up to 8 favorite cities.',
    favoriteCityAdded: 'Favorite city added',
    favoriteCityRemoved: 'Favorite city removed',
    weatherUnavailable: 'Weather unavailable',
  },

  gujarati: {
    appTitle: 'વેધર ઇન્ટેલિજન્સ',
    appSubtitle: 'હવામાન પ્લેટફોર્મ',
    searchPlaceholder: 'શહેર શોધો...',
    searchButton: 'શોધો',
    useMyLocation: 'મારું સ્થાન',
    detecting: 'શોધી રહ્યું છે...',
    locationDetected: 'સ્થાન મળી ગયું',
    locationDenied: 'સ્થાન માટેની પરવાનગી નકારી દેવામાં આવી છે.',
    signIn: 'સાઇન ઇન',
    signUp: 'સાઇન અપ',
    logout: 'લોગઆઉટ',
    settings: 'સેટિંગ્સ',
    guestUser: 'મહેમાન વપરાશકર્તા',
    userAccount: 'વપરાશકર્તા એકાઉન્ટ',

    dashboard: 'ડેશબોર્ડ',
    forecast: 'હવામાન આગાહી',
    weatherMap: 'હવામાન નકશો',
    radar: 'રડાર',
    aiAdvisor: 'એઆઈ હવામાન સલાહકાર',
    activities: 'પ્રવૃત્તિઓ',
    travel: 'મુસાફરી યોજના',
    travelPlanner: 'મુસાફરી યોજના',
    compare: 'શહેર સરખામણી',
    cityComparison: 'શહેર સરખામણી',
    intelligenceTools: 'ઇન્ટેલિજન્સ અને ટૂલ્સ',
    telemetryFeed: 'ટેલિમેટ્રી ફીડ',
    online: 'ઓનલાઇન',

    currentWeather: 'હાલનું હવામાન',
    liveTelemetry: 'લાઈવ ટેલિમેટ્રી',
    observedStation: 'હવામાન કેન્દ્ર',
    gpsTelemetry: 'જીપીએસ ટેલિમેટ્રી',
    feelsLike: 'અનુભવાતો પારો',
    atmosphericState: 'વાતાવરણની સ્થિતિ',
    humidity: 'ભેજનું પ્રમાણ',
    wind: 'પવન',
    windSpeed: 'પવનની ગતિ',
    pressure: 'વાતાવરણીય દબાણ',
    visibility: 'દૃશ્યતા',
    hourlyProgression: 'કલાકદીઠ સ્થિતિ',
    next24Hours: 'આગામી ૨૪ કલાક',
    todaysOverview: "આજના પર્યાવરણીય ડેટા",
    environmentalTelemetry: 'વાતાવરણ અને સૂર્ય ચક્રના આંકડા',
    uvIndex: 'યુવી ઇન્ડેક્સ',
    solarCycle: 'સૂર્ય ચક્ર',
    sunrise: 'સૂર્યોદય',
    sunset: 'સૂર્યાસ્ત',
    outdoorActivityIndex: 'આઉટડોર પ્રવૃત્તિ સૂચકાંક',
    telemetryRating: 'ટેલિમેટ્રી રેટિંગ',
    weatherSummary: 'હવામાન સારાંશ',
    meteorologicalObservations: 'મુખ્ય હવામાન નોંધો',

    extendedForecast: 'વિગતવાર આગાહી ટાઈમલાઇન',
    dailyProjection: 'દૈનિક અનુમાન',
    weatherTrends: 'હવામાન પ્રવાહો',
    airQualityIndex: 'હવાની ગુણવત્તા સૂચકાંક (AQI)',
    airQuality: 'હવાની ગુણવત્તા',
    usAqiStandard: 'યુએસ એક્યુઆઈ ધોરણ',
    good: 'સારી',
    moderate: 'મધ્યમ',
    poor: 'નબળી',
    hazardous: 'જોખમી',
    tempMetric: 'તાપમાન',
    temperature: 'તાપમાન',
    rainMetric: 'વરસાદ',
    rainProbability: 'વરસાદની શક્યતા',
    windMetric: 'પવન',
    refreshTelemetry: 'રિફ્રેશ કરો',
    retry: 'ફરી પ્રયાસ કરો',

    meteorologicalMap: 'વાતાવરણીય નકશો',
    precipitationDopplerRadar: 'વરસાદ ડોપ્લર રડાર',
    activeLegends: 'સક્રિય લેજન્ડ્સ',
    layers: 'સ્તરો',
    temperatureLayer: 'તાપમાન',
    rainLayer: 'વરસાદ',
    cloudsLayer: 'વાદળો',
    windLayer: 'પવન',
    pressureLayer: 'દબાણ',
    opacity: 'પારદર્શિતા',
    resetView: 'રીસેટ',
    fullscreen: 'પૂર્ણ સ્ક્રીન',
    radarReflectivity: 'રડાર રિફ્લેક્ટિવિટી',
    lightRain: 'હળવો વરસાદ',
    moderateRain: 'મધ્યમ વરસાદ',
    heavyRain: 'ભારે વરસાદ',
    severe: 'અતિ ભારે',
    play: 'પ્લે',
    pause: 'પોઝ',
    now: 'હમણાં (NOW)',
    radarFeed: 'રડાર ફીડ',
    activeFeed: 'સક્રિય',
    standardMode: 'સામાન્ય મોડ',

    // AI Advisor Module
    advisoryIntelligence: 'એઆઈ હવામાન સલાહકાર',
    aiAdvisorSubtitle: 'પ્રવૃત્તિ સમય-નિર્ધારણ અને હવામાન જોખમ વિશ્લેષણ માટેનું માર્ગદર્શક પ્લેટફોર્મ',
    advisoryStation: 'સલાહકાર ઇન્ટેલિજન્સ સ્ટેશન',
    station: 'સ્ટેશન:',
    queries: 'પ્રશ્નો:',
    queryFootball: 'શું હું સાંજે 6 વાગ્યે ફૂટબોલ રમી શકું?',
    queryRunning: 'શું હું આવતીકાલે સવારે દોડવા જઈ શકું?',
    queryRainTonight: 'શું આજે રાત્રે વરસાદ પડશે?',
    queryWeatherTomorrow: 'આવતીકાલે હવામાન કેવું રહેશે?',
    queryHot3PM: 'શું બપોરે 3 વાગ્યે ગરમી હશે?',
    queryCycling7AM: 'શું હું સવારે 7 વાગ્યે સાયકલિંગ માટે જઈ શકું?',
    queryAbout8PM: 'રાત્રે 8 વાગ્યા વિશે શું?',
    queryWeatherNow: 'હમણાં હવામાન કેવું છે?',
    askAdvisor: 'હવામાન, સમય અથવા આઉટડોર યોજનાઓ વિશે પૂછો...',
    submit: 'મોકલો',
    telemetryReferenced: 'સંદર્ભિત ટેલિમેટ્રી:',
    analyzingTelemetry: 'વાતાવરણની ટેલિમેટ્રીનું વિશ્લેષણ થઈ રહ્યું છે...',
    unableToAnalyze: 'આ સમયે હવામાન વિશ્લેષણ કરવામાં અસમર્થ. કૃપા કરીને ફરી પ્રયાસ કરો.',
    rainLabel: 'વરસાદ',
    welcomeAdvisorPrefix: 'હવામાન સલાહકાર ઓનલાઇન છે:',
    welcomeAdvisorSuffix: 'આઉટડોર આયોજન, વરસાદનો સમય, તાપમાન અને પ્રવાસ આયોજન અંગે પૂછો.',

    // Activities Module
    activitiesTitle: 'પ્રવૃત્તિ હવામાન ઇન્ટેલિજન્સ',
    activitiesSubtitle: 'વાતાવરણના પરિબળોના આધારે આઉટડોર યોજનાઓની યોગ્યતાનું મૂલ્યાંકન',
    suitabilityTelemetryEngine: 'યોગ્યતા ટેલિમેટ્રી એન્જિન',
    evaluateCityPlaceholder: 'શહેરનું મૂલ્યાંકન કરો...',
    goButton: 'શોધો',
    severeConditionsPresent: 'ગંભીર હવામાન પરિસ્થિતિઓ હાજર છે:',
    severeConditionsMessage: 'અતિશય તાપમાન, ભારે વરસાદ અથવા તેજ પવન. આઉટડોર પ્રવૃત્તિની ભલામણ કરવામાં આવતી નથી.',
    selectActivityPlan: 'પ્રવૃત્તિ યોજના પસંદ કરો',
    supportedModules: '8 સમર્થિત મોડ્યુલ્સ',
    actRunning: 'દોડવું',
    actFootball: 'ફૂટબોલ',
    actWalking: 'ચાલવું',
    actCycling: 'સાયકલિંગ',
    actCricket: 'ક્રિકેટ',
    actHiking: 'હાઇકિંગ',
    actOutdoorWorkout: 'આઉટડોર કસરત',
    actPicnic: 'પિકનિક',
    timeSlot: 'સમયગાળો',
    slotNow: 'હમણાં',
    slotToday: 'આજે',
    slotTomorrow: 'આવતીકાલે',
    suitabilityIndex: 'અનુકૂળતા સૂચકાંક',
    catExcellent: 'ઉત્કૃષ્ટ',
    catGood: 'સારું',
    catModerate: 'મધ્યમ',
    catPoor: 'નબળું',
    catVeryPoor: 'ખૂબ નબળું',
    evaluatedFor: 'મૂલ્યાંકન:',
    inCity: 'સ્થળ:',
    conditionVariables: 'સ્થિતિ પરિબળો',
    rainProbMetric: 'વરસાદની શક્યતા',
    favorableFactors: 'અનુકૂળ પરિબળો',
    weatherAdvisories: 'હવામાન ચેતવણીઓ',
    noPositiveFactors: 'કોઈ મજબૂત અનુકૂળ હવામાન પરિબળો હાજર નથી.',
    noAdverseWarnings: 'આ સમયગાળા માટે કોઈ પ્રતિકૂળ હવામાન ચેતવણી નથી.',
    meteorologicalEvaluationSynthesis: 'હવામાન મૂલ્યાંકન સારાંશ:',

    // Travel Planner Module
    travelPlannerTitle: 'સ્માર્ટ પ્રવાસ હવામાન આયોજક',
    travelPlannerSubtitle: 'બહુ-દિવસીય સ્થળ હવામાન આગાહી અને પેકિંગ સલાહ',
    itineraryAssessment: 'પ્રવાસ વાતાવરણ મૂલ્યાંકન',
    destination: 'ગંતવ્ય સ્થળ',
    departure: 'પ્રસ્થાન',
    returnDate: 'પરત',
    analyze: 'વિશ્લેષણ કરો',
    forecastHorizonNotice: 'વિગતવાર હવામાન આગાહી ટેલિમેટ્રી 5 દિવસ સુધી ઉપલબ્ધ છે. તે પછીની તારીખો નોંધવામાં આવશે.',
    evaluatingItinerary: 'મુસાફરી હવામાન પ્રોફાઇલનું મૂલ્યાંકન થઈ રહ્યું છે...',
    synthesizingForecasts: 'બહુ-દિવસીય આગાહી અને પેકિંગ આવશ્યકતાઓ તૈયાર થઈ રહી છે.',
    destinationSummary: 'ગંતવ્ય સારાંશ',
    daysObserved: 'દિવસોનું અવલોકન',
    zoneLabel: 'ઝોન:',
    averageTempLabel: 'સરેરાશ',
    rainRiskLabel: 'વરસાદનું જોખમ',
    riskPossible: 'શક્ય',
    riskLow: 'ઓછું',
    gearLabel: 'સામગ્રી',
    gearUmbrella: 'છત્રી',
    gearStandard: 'સામાન્ય',
    travelAdvisorySynthesis: 'પ્રવાસ સલાહ સારાંશ',
    dailyTravelForecast: 'દૈનિક મુસાફરી આગાહી',
    beyondHorizon: 'અનુમાન મર્યાદાથી આગળ.',
    precipitationRisk: 'વરસાદનું જોખમ',
    highestRiskWindow: 'સૌથી વધુ જોખમ સમય:',
    lowestRiskWindow: 'સૌથી ઓછું જોખમ સમય:',
    umbrellaRecommendedDays: 'છત્રીની ભલામણ કરેલ દિવસો:',
    noHeavyRainExpected: 'ભારે વરસાદના કોઈ દિવસની અપેક્ષા નથી',
    thermalProfile: 'તાપમાન પ્રોફાઇલ',
    warmestWindow: 'સૌથી ગરમ સમય:',
    coolestWindow: 'સૌથી ઠંડો સમય:',
    meanTemperature: 'સરેરાશ તાપમાન:',
    packingChecklist: 'પેકિંગ યાદી',
    recommendedItems: 'ભલામણ કરેલ વસ્તુઓ',
    itemUmbrella: 'છત્રી',
    itemLightJacket: 'હળવું જેકેટ',
    itemSunglasses: 'સનગ્લાસિસ',
    itemWaterBottle: 'પાણીની બોટલ',

    // City Comparison Module
    cityComparisonTitle: 'શહેરોના હવામાનની સરખામણી',
    cityComparisonSubtitle: 'હવામાન પરિબળો અને પ્રવૃત્તિ યોગ્યતાનું તુલનાત્મક મૂલ્યાંકન',
    comparativeAnalysisEngine: 'તુલનાત્મક વિશ્લેષણ એન્જિન',
    targetLocations: 'લક્ષ્ય સ્થળો (૨ થી ૪ શહેરો)',
    addLocation: 'સ્થળ ઉમેરો',
    activityCriterion: 'પ્રવૃત્તિ માપદંડ',
    analysisTimeframe: 'વિશ્લેષણ સમયગાળો',
    timeframeCurrent: 'હાલની ટેલિમેટ્રી',
    timeframeToday: 'આજનો એકંદર ડેટા',
    timeframeTomorrow: 'આવતીકાલનો અંદાજ',
    executeComparison: 'સરખામણી ચલાવો',
    processingMatrices: 'ટેલિમેટ્રી મેટ્રિક્સ પ્રક્રિયા થઈ રહી છે...',
    aggregatingVariables: 'વાતાવરણના પરિબળોનું સંકલન અને તુલનાત્મક ધોરણોનું સામાન્યીકરણ.',
    comparativeAnalysisSynthesis: 'તુલનાત્મક વિશ્લેષણ સારાંશ',
    parameterMatrix: 'પરિમાણ સરખામણી મેટ્રિક્સ',
    parameterLabel: 'પરિમાણ',
    barometricPressure: 'વાતાવરણનું દબાણ',
    suitabilityLabel: 'યોગ્યતા',

    language: 'ભાષા',
    theme: 'થીમ',
    themeLight: 'લાઇટ',
    themeDark: 'ડાર્ક',
    themeSystem: 'સિસ્ટમ',
    cancel: 'રદ કરો',
    confirm: 'લોગઆઉટ',
    logoutConfirmTitle: 'લોગ આઉટ કરવું છે?',
    logoutConfirmMsg: 'શું તમે ખરેખર લોગઆઉટ કરવા માંગો છો?',
    close: 'બંધ કરો',

    smartUmbrella: 'સ્માર્ટ છત્રી સહાયક',
    umbrellaRecommended: 'છત્રી સાથે રાખવી જરૂરી છે',
    umbrellaPossible: 'છત્રીની જરૂર પડી શકે છે',
    noUmbrellaNeeded: 'છત્રીની જરૂર નથી',
    enableAlerts: 'સૂચના ચાલુ કરો',
    alertsActive: 'વરસાદી ચેતવણીઓ સક્રિય છે',

    favorites: 'મનપસંદ',
    favoriteCities: 'મનપસંદ શહેરો',
    addFavoriteCity: 'મનપસંદ શહેર ઉમેરો',
    removeFavoriteCity: 'મનપસંદ શહેર દૂર કરો',
    noFavoriteCities: 'હજુ સુધી કોઈ મનપસંદ શહેર નથી',
    noFavoritesDescription: 'શહેર શોધો અને તેને સાચવવા માટે બુકમાર્ક આઇકોન પર ક્લિક કરો.',
    maxFavoritesReached: 'તમે મહત્તમ 8 મનપસંદ શહેરો સાચવી શકો છો.',
    favoriteCityAdded: 'મનપસંદ શહેર ઉમેરાયું',
    favoriteCityRemoved: 'મનપસંદ શહેર દૂર કરાયું',
    weatherUnavailable: 'હવામાન ઉપલબ્ધ નથી',
  },

  hindi: {
    appTitle: 'वेदर इंटेलिजेंस',
    appSubtitle: 'मौसम विज्ञान प्लेटफॉर्म',
    searchPlaceholder: 'शहर खोजें...',
    searchButton: 'खोजें',
    useMyLocation: 'मेरा स्थान',
    detecting: 'खोज रहा है...',
    locationDetected: 'स्थान मिल गया',
    locationDenied: 'स्थान अनुमति अस्वीकार कर दी गई थी।',
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    logout: 'लॉगआउट',
    settings: 'सेटिंग्स',
    guestUser: 'अतिथि उपयोगकर्ता',
    userAccount: 'उपयोगकर्ता खाता',

    dashboard: 'डैशबोर्ड',
    forecast: 'मौसम पूर्वानुमान',
    weatherMap: 'मौसम मानचित्र',
    radar: 'रडार',
    aiAdvisor: 'एआई मौसम सलाहकार',
    activities: 'गतिविधियाँ',
    travel: 'यात्रा योजना',
    travelPlanner: 'यात्रा योजना',
    compare: 'शहर तुलना',
    cityComparison: 'शहर तुलना',
    intelligenceTools: 'इंटेलिजेंस और टूल्स',
    telemetryFeed: 'टेलीमेट्री फीड',
    online: 'ऑनलाइन',

    currentWeather: 'वर्तमान मौसम',
    liveTelemetry: 'लाइव टेलीमेट्री',
    observedStation: 'मौसम केंद्र',
    gpsTelemetry: 'जीपीएस टेलीमेट्री',
    feelsLike: 'महसूस होता है',
    atmosphericState: 'वायुमंडलीय स्थिति',
    humidity: 'आर्द्रता',
    wind: 'हवा',
    windSpeed: 'हवा की गति',
    pressure: 'दबाव',
    visibility: 'दृश्यता',
    hourlyProgression: 'घंटेवार स्थिति',
    next24Hours: 'अगले 24 घंटे',
    todaysOverview: "आज का पर्यावरणीय डेटा",
    environmentalTelemetry: 'वायुमंडलीय स्थिति और सौर चक्र विवरण',
    uvIndex: 'यूवी इंडेक्स',
    solarCycle: 'सौर चक्र',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    outdoorActivityIndex: 'बाहरी गतिविधि सूचकांक',
    telemetryRating: 'टेलीमेट्री रेटिंग',
    weatherSummary: 'मौसम सारांश',
    meteorologicalObservations: 'प्रमुख मौसम विज्ञान अवलोकन',

    extendedForecast: 'विस्तृत पूर्वानुमान समयरेखा',
    dailyProjection: 'दैनिक अनुमान',
    weatherTrends: 'मौसम रुझान',
    airQualityIndex: 'वायु गुणवत्ता सूचकांक (AQI)',
    airQuality: 'वायु गुणवत्ता',
    usAqiStandard: 'अमेरिकी AQI मानक',
    good: 'अच्छा',
    moderate: 'मध्यम',
    poor: 'खराब',
    hazardous: 'खतरनाक',
    tempMetric: 'तापमान',
    temperature: 'तापमान',
    rainMetric: 'बारिश',
    rainProbability: 'बारिश की संभावना',
    windMetric: 'हवा',
    refreshTelemetry: 'रिफ्रेश करें',
    retry: 'पुनः प्रयास करें',

    meteorologicalMap: 'वायुमंडलीय स्थानिक मानचित्र',
    precipitationDopplerRadar: 'वर्षा डॉपलर रडार',
    activeLegends: 'सक्रिय लेजेंड्स',
    layers: 'परतें',
    temperatureLayer: 'तापमान',
    rainLayer: 'बारिश',
    cloudsLayer: 'बादल',
    windLayer: 'हवा',
    pressureLayer: 'दबाव',
    opacity: 'पारदर्शिता',
    resetView: 'रीसेट',
    fullscreen: 'पूर्ण स्क्रीन',
    radarReflectivity: 'रडार परावर्तनशीलता',
    lightRain: 'हल्की बारिश',
    moderateRain: 'मध्यम बारिश',
    heavyRain: 'भारी बारिश',
    severe: 'अति गंभीर',
    play: 'चलाएं',
    pause: 'रोकें',
    now: 'अभी (NOW)',
    radarFeed: 'रडार फीड',
    activeFeed: 'सक्रिय',
    standardMode: 'मानक मोड',

    // AI Advisor Module
    advisoryIntelligence: 'एआई मौसम सलाहकार',
    aiAdvisorSubtitle: 'गतिविधि समय-निर्धारण और मौसम जोखिम विश्लेषण के लिए प्रासंगिक सलाहकार प्रणाली',
    advisoryStation: 'सलाहकार इंटेलिजेंस स्टेशन',
    station: 'स्टेशन:',
    queries: 'सुझाए गए प्रश्न:',
    queryFootball: 'क्या मैं शाम 6 बजे फुटबॉल खेल सकता हूँ?',
    queryRunning: 'क्या मैं कल सुबह दौड़ने जा सकता हूँ?',
    queryRainTonight: 'क्या आज रात बारिश होगी?',
    queryWeatherTomorrow: 'कल मौसम कैसा रहेगा?',
    queryHot3PM: 'क्या दोपहर 3 बजे गर्मी होगी?',
    queryCycling7AM: 'क्या मैं सुबह 7 बजे साइकिल चलाने जा सकता हूँ?',
    queryAbout8PM: 'रात 8 बजे के बारे में क्या?',
    queryWeatherNow: 'अभी मौसम कैसा है?',
    askAdvisor: 'मौसम, समय या बाहरी योजनाओं के बारे में पूछें...',
    submit: 'भेजें',
    telemetryReferenced: 'संदर्भित टेलीमेट्री:',
    analyzingTelemetry: 'वायुमंडलीय टेलीमेट्री का विश्लेषण किया जा रहा है...',
    unableToAnalyze: 'इस समय मौसम डेटा का विश्लेषण करने में असमर्थ। कृपया पुनः प्रयास करें।',
    rainLabel: 'बारिश',
    welcomeAdvisorPrefix: 'मौसम सलाहकार ऑनलाइन है:',
    welcomeAdvisorSuffix: 'बाहरी योजनाओं, बारिश के समय, तापमान और बहु-शहर योजना के संबंध में पूछें।',

    // Activities Module
    activitiesTitle: 'गतिविधि मौसम इंटेलिजेंस',
    activitiesSubtitle: 'वायुमंडलीय मापदंडों के आधार पर बाहरी योजनाओं की उपयुक्तता का मूल्यांकन',
    suitabilityTelemetryEngine: 'उपयुक्तता टेलीमेट्री इंजन',
    evaluateCityPlaceholder: 'शहर का मूल्यांकन करें...',
    goButton: 'खोजें',
    severeConditionsPresent: 'गंभीर मौसम स्थितियाँ मौजूद हैं:',
    severeConditionsMessage: 'अत्यधिक तापमान, भारी बारिश या तेज हवाएं। बाहरी गतिविधि की अनुशंसा नहीं की जाती है।',
    selectActivityPlan: 'गतिविधि योजना चुनें',
    supportedModules: '8 समर्थित मॉड्यूल',
    actRunning: 'दौड़ना',
    actFootball: 'फुटबॉल',
    actWalking: 'टहलना',
    actCycling: 'साइकिल चलाना',
    actCricket: 'क्रिकेट',
    actHiking: 'हाइकिंग',
    actOutdoorWorkout: 'आउटडोर कसरत',
    actPicnic: 'पिकनिक',
    timeSlot: 'समय स्लॉट',
    slotNow: 'अभी',
    slotToday: 'आज',
    slotTomorrow: 'कल',
    suitabilityIndex: 'उपयुक्तता सूचकांक',
    catExcellent: 'उत्कृष्ट',
    catGood: 'अच्छा',
    catModerate: 'मध्यम',
    catPoor: 'खराब',
    catVeryPoor: 'बहुत खराब',
    evaluatedFor: 'मूल्यांकन:',
    inCity: 'स्थान:',
    conditionVariables: 'मौसम कारक',
    rainProbMetric: 'बारिश संभावना',
    favorableFactors: 'अनुकूल कारक',
    weatherAdvisories: 'मौसम चेतावनियां',
    noPositiveFactors: 'कोई मजबूत अनुकूल मौसम कारक मौजूद नहीं हैं।',
    noAdverseWarnings: 'इस समय अंतराल के लिए कोई प्रतिकूल मौसम चेतावनी नहीं है।',
    meteorologicalEvaluationSynthesis: 'मौसम संबंधी मूल्यांकन निष्कर्ष:',

    // Travel Planner Module
    travelPlannerTitle: 'स्मार्ट यात्रा मौसम योजनाकार',
    travelPlannerSubtitle: 'बहु-दिवसीय गंतव्य पूर्वानुमान और सामान पैकिंग सलाह',
    itineraryAssessment: 'यात्रा वायुमंडलीय मूल्यांकन',
    destination: 'गंतव्य',
    departure: 'प्रस्थान',
    returnDate: 'वापसी',
    analyze: 'विश्लेषण करें',
    forecastHorizonNotice: 'विस्तृत मौसम पूर्वानुमान टेलीमेट्री 5 दिनों तक के लिए उपलब्ध है। इसके बाद की तारीखों पर तदनुसार नोट रहेगा।',
    evaluatingItinerary: 'यात्रा कार्यक्रम के मौसम प्रोफाइल का मूल्यांकन हो रहा है...',
    synthesizingForecasts: 'बहु-दिवसीय पूर्वानुमान और पैकिंग आवश्यकताओं का संश्लेषण किया जा रहा है।',
    destinationSummary: 'गंतव्य सारांश',
    daysObserved: 'दिन मूल्यांकित',
    zoneLabel: 'समय क्षेत्र:',
    averageTempLabel: 'औसत',
    rainRiskLabel: 'बारिश जोखिम',
    riskPossible: 'संभावित',
    riskLow: 'कम',
    gearLabel: 'सामग्री',
    gearUmbrella: 'छाता',
    gearStandard: 'सामान्य',
    travelAdvisorySynthesis: 'यात्रा सलाह सारांश',
    dailyTravelForecast: 'दैनिक यात्रा पूर्वानुमान',
    beyondHorizon: 'अनुमान सीमा से परे।',
    precipitationRisk: 'बारिश का जोखिम',
    highestRiskWindow: 'सर्वाधिक जोखिम अवधि:',
    lowestRiskWindow: 'न्यूनतम जोखिम अवधि:',
    umbrellaRecommendedDays: 'छाता अनुशंसित दिन:',
    noHeavyRainExpected: 'भारी बारिश के किसी दिन की संभावना नहीं है',
    thermalProfile: 'तापमान प्रोफाइल',
    warmestWindow: 'सर्वाधिक गर्म समय:',
    coolestWindow: 'सर्वाधिक ठंडा समय:',
    meanTemperature: 'औसत तापमान:',
    packingChecklist: 'पैकिंग सूची',
    recommendedItems: 'अनुशंसित वस्तुएं',
    itemUmbrella: 'छाता',
    itemLightJacket: 'हल्की जैकेट',
    itemSunglasses: 'धूप का चश्मा',
    itemWaterBottle: 'पानी की बोतल',

    // City Comparison Module
    cityComparisonTitle: 'शहर मौसम तुलना',
    cityComparisonSubtitle: 'मौसम मापदंडों और गतिविधि उपयुक्तता की तुलनात्मक समीक्षा',
    comparativeAnalysisEngine: 'तुलनात्मक विश्लेषण इंजन',
    targetLocations: 'लक्षित स्थान (2 से 4 शहर)',
    addLocation: 'स्थान जोड़ें',
    activityCriterion: 'गतिविधि मापदंड',
    analysisTimeframe: 'विश्लेषण समय-सीमा',
    timeframeCurrent: 'वर्तमान टेलीमेट्री',
    timeframeToday: 'आज का संचयी डेटा',
    timeframeTomorrow: 'कल का अनुमान',
    executeComparison: 'तुलना निष्पादित करें',
    processingMatrices: 'टेलीमेट्री मैट्रिक्स का प्रसंस्करण जारी है...',
    aggregatingVariables: 'वायुमंडलीय चरों का संकलन और तुलनात्मक पैमानों का सामान्यीकरण।',
    comparativeAnalysisSynthesis: 'तुलनात्मक विश्लेषण सारांश',
    parameterMatrix: 'मापदंड तुलना मैट्रिक्स',
    parameterLabel: 'मापदंड',
    barometricPressure: 'वायुमंडलीय दबाव',
    suitabilityLabel: 'उपयुक्तता',

    language: 'भाषा',
    theme: 'थीम',
    themeLight: 'लाइट',
    themeDark: 'डार्क',
    themeSystem: 'सिस्टम',
    cancel: 'रद्द करें',
    confirm: 'लॉगआउट',
    logoutConfirmTitle: 'लॉग आउट करें?',
    logoutConfirmMsg: 'क्या आप वाकई लॉग आउट करना चाहते हैं?',
    close: 'बंद करें',

    smartUmbrella: 'स्मार्ट छाता सहायक',
    umbrellaRecommended: 'छाता ले जाना अनुशंसित है',
    umbrellaPossible: 'छाते की आवश्यकता हो सकती है',
    noUmbrellaNeeded: 'छाते की आवश्यकता नहीं है',
    enableAlerts: 'अलर्ट सक्षम करें',
    alertsActive: 'बारिश अलर्ट सक्रिय हैं',

    favorites: 'पसंदीदा',
    favoriteCities: 'पसंदीदा शहर',
    addFavoriteCity: 'पसंदीदा शहर जोड़ें',
    removeFavoriteCity: 'पसंदीदा शहर हटाएं',
    noFavoriteCities: 'अभी तक कोई पसंदीदा शहर नहीं',
    noFavoritesDescription: 'शहर खोजें और सहेजने के लिए बुकमार्क आइकन पर क्लिक करें।',
    maxFavoritesReached: 'आप अधिकतम 8 पसंदीदा शहर सहेज सकते हैं।',
    favoriteCityAdded: 'पसंदीदा शहर जोड़ा गया',
    favoriteCityRemoved: 'पसंदीदा शहर हटाया गया',
    weatherUnavailable: 'मौसम अनुपलब्ध',
  },
};

// Activity Name Translation Helper
export function translateActivityName(name: string, lang: SupportedLanguage): string {
  if (lang === 'english') return name;
  const key = name.toLowerCase().replace(/\s+/g, '_');
  const dict: Record<string, Record<SupportedLanguage, string>> = {
    running: { english: 'Running', hindi: 'दौड़ना', gujarati: 'દોડવું' },
    football: { english: 'Football', hindi: 'फुटबॉल', gujarati: 'ફૂટબોલ' },
    walking: { english: 'Walking', hindi: 'टहलना', gujarati: 'ચાલવું' },
    cycling: { english: 'Cycling', hindi: 'साइकिल चलाना', gujarati: 'સાયકલિંગ' },
    cricket: { english: 'Cricket', hindi: 'क्रिकेट', gujarati: 'ક્રિકેટ' },
    hiking: { english: 'Hiking', hindi: 'हाइकिंग', gujarati: 'હાઇકિંગ' },
    outdoor_workout: { english: 'Outdoor Workout', hindi: 'आउटडोर कसरत', gujarati: 'આઉટડોર કસરત' },
    picnic: { english: 'Picnic', hindi: 'पिकनिक', gujarati: 'પિકનિક' },
  };
  return dict[key]?.[lang] || name;
}

// Category / Score Label Translation Helper
export function translateCategoryName(category: string, lang: SupportedLanguage): string {
  if (lang === 'english') return category;
  const key = category.trim().toLowerCase();
  const dict: Record<string, Record<SupportedLanguage, string>> = {
    'excellent': { english: 'Excellent', hindi: 'उत्कृष्ट', gujarati: 'ઉત્કૃષ્ટ' },
    'good': { english: 'Good', hindi: 'अच्छा', gujarati: 'સારું' },
    'moderate': { english: 'Moderate', hindi: 'मध्यम', gujarati: 'મધ્યમ' },
    'poor': { english: 'Poor', hindi: 'खराब', gujarati: 'નબળું' },
    'very poor': { english: 'Very Poor', hindi: 'बहुत खराब', gujarati: 'ખૂબ નબળું' },
  };
  return dict[key]?.[lang] || category;
}

// Day of Week Translation Helper
export function translateDayOfWeek(day: string, lang: SupportedLanguage): string {
  if (lang === 'english') return day;
  const key = day.trim().toLowerCase();
  const dict: Record<string, Record<SupportedLanguage, string>> = {
    monday: { english: 'Monday', hindi: 'सोमवार', gujarati: 'સોમવાર' },
    tuesday: { english: 'Tuesday', hindi: 'मंगलवार', gujarati: 'મંગળવાર' },
    wednesday: { english: 'Wednesday', hindi: 'बुधवार', gujarati: 'બુધવાર' },
    thursday: { english: 'Thursday', hindi: 'गुरुवार', gujarati: 'ગુરુવાર' },
    friday: { english: 'Friday', hindi: 'शुक्रवार', gujarati: 'શુક્રવાર' },
    saturday: { english: 'Saturday', hindi: 'शनिवार', gujarati: 'શનિવાર' },
    sunday: { english: 'Sunday', hindi: 'रविवार', gujarati: 'રવિવાર' },
    mon: { english: 'Mon', hindi: 'सोम', gujarati: 'સોમ' },
    tue: { english: 'Tue', hindi: 'मंगल', gujarati: 'મંગળ' },
    wed: { english: 'Wed', hindi: 'बुध', gujarati: 'બુધ' },
    thu: { english: 'Thu', hindi: 'गुरु', gujarati: 'ગુરુ' },
    fri: { english: 'Fri', hindi: 'शुक्र', gujarati: 'શુક્ર' },
    sat: { english: 'Sat', hindi: 'शनि', gujarati: 'શનિ' },
    sun: { english: 'Sun', hindi: 'रवि', gujarati: 'રવિ' },
  };
  return dict[key]?.[lang] || day;
}

// Activity Reasons & Warnings Dynamic Translation Helper
export function translateActivityReason(text: string, lang: SupportedLanguage): string {
  if (lang === 'english' || !text) return text;

  const dict: Record<string, Record<SupportedLanguage, string>> = {
    'Optimal temperature for outdoor activity': {
      english: 'Optimal temperature for outdoor activity',
      hindi: 'बाहरी गतिविधि के लिए अनुकूल तापमान',
      gujarati: 'આઉટડોર પ્રવૃત્તિ માટે શ્રેષ્ઠ તાપમાન',
    },
    'Pleasant temperature': {
      english: 'Pleasant temperature',
      hindi: 'सुखद तापमान',
      gujarati: 'આહલાદક તાપમાન',
    },
    'Low chance of rain': {
      english: 'Low chance of rain',
      hindi: 'बारिश की बहुत कम संभावना',
      gujarati: 'વરસાદની બહુ ઓછી શક્યતા',
    },
    'Gentle or calm winds': {
      english: 'Gentle or calm winds',
      hindi: 'शांत या धीमी हवाएं',
      gujarati: 'શાંત અથવા ધીમો પવન',
    },
    'Optimal outdoor humidity level': {
      english: 'Optimal outdoor humidity level',
      hindi: 'अनुकूल आर्द्रता स्तर',
      gujarati: 'શ્રેષ્ઠ ભેજનું સ્તર',
    },
    'Comfortable conditions overall': {
      english: 'Comfortable conditions overall',
      hindi: 'समग्र रूप से आरामदायक स्थितियाँ',
      gujarati: 'એકંદરે આરામદાયક પરિસ્થિતિઓ',
    },
    'High precipitation probability': {
      english: 'High precipitation probability',
      hindi: 'बारिश की उच्च संभावना',
      gujarati: 'વરસાદની ઊંચી શક્યતા',
    },
    'High humidity may cause discomfort': {
      english: 'High humidity may cause discomfort',
      hindi: 'अधिक नमी के कारण बेचैनी हो सकती है',
      gujarati: 'વધુ ભેજને કારણે અસ્વસ્થતા થઈ શકે છે',
    },
    'Moderate wind conditions': {
      english: 'Moderate wind conditions',
      hindi: 'मध्यम हवा की स्थिति',
      gujarati: 'મધ્યમ પવનની સ્થિતિ',
    },
    'Strong winds may impact outdoor activities': {
      english: 'Strong winds may impact outdoor activities',
      hindi: 'तेज हवाएं बाहरी गतिविधियों को प्रभावित कर सकती हैं',
      gujarati: 'તેજ પવન આઉટડોર પ્રવૃત્તિઓને અસર કરી શકે છે',
    },
    'High temperature: stay hydrated': {
      english: 'High temperature: stay hydrated',
      hindi: 'उच्च तापमान: पर्याप्त पानी पिएं',
      gujarati: 'ઊંચું તાપમાન: પૂરતું પાણી પીવો',
    },
    'Cold conditions: dress warmly': {
      english: 'Cold conditions: dress warmly',
      hindi: 'ठंड का मौसम: गर्म कपड़े पहनें',
      gujarati: 'ઠંડુ વાતાવરણ: ગરમ કપડાં પહેરો',
    },
  };

  return dict[text]?.[lang] || text;
}

// Travel Packing Suggestions Dynamic Translation Helper
export function translatePackingSuggestion(text: string, lang: SupportedLanguage): string {
  if (lang === 'english' || !text) return text;

  const dict: Record<string, Record<SupportedLanguage, string>> = {
    'Consider packing an umbrella or compact rain jacket.': {
      english: 'Consider packing an umbrella or compact rain jacket.',
      hindi: 'छाता या कॉम्पैक्ट रेन जैकेट साथ रखने पर विचार करें।',
      gujarati: 'છત્રી અથવા કોમ્પેક્ટ રેઇન જેકેટ પેક કરવાનું ધ્યાનમાં રાખો.',
    },
    'Light, breathable clothing and sun protection recommended.': {
      english: 'Light, breathable clothing and sun protection recommended.',
      hindi: 'हल्के, आरामदायक कपड़े और धूप से सुरक्षा की सलाह दी जाती है।',
      gujarati: 'હળવા, આરામદાયક કપડાં અને સૂર્યથી રક્ષણની ભલામણ.',
    },
    'Pack warm layers and a lightweight jacket.': {
      english: 'Pack warm layers and a lightweight jacket.',
      hindi: 'गर्म कपड़े और हल्की जैकेट साथ रखें।',
      gujarati: 'ગરમ કપડાં અને હળવું જેકેટ સાથે રાખો.',
    },
    'Consider wind-resistant outerwear for breezy days.': {
      english: 'Consider wind-resistant outerwear for breezy days.',
      hindi: 'हवादार दिनों के लिए विंड-रेसिस्टेंट जैकेट साथ रखें।',
      gujarati: 'પવનવાળા દિવસો માટે વિન્ડ-રેઝિસ્ટન્ટ જેકેટ સાથે રાખો.',
    },
    'Standard comfortable travel attire recommended.': {
      english: 'Standard comfortable travel attire recommended.',
      hindi: 'सामान्य आरामदायक यात्रा परिधान की सलाह दी जाती है।',
      gujarati: 'સામાન્ય આરામદાયક મુસાફરીના કપડાંની ભલામણ.',
    },
  };

  return dict[text]?.[lang] || text;
}
