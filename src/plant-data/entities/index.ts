export interface Trend {
  humidity: number;
  temperature: number;
  light: number;
  nutrientLevel: number;
  count: number;
}

export interface TrendResult {
  timestamp: string;
  avgHumidity: number;
  avgTemperature: number;
  avgLight: number;
  avgNutrientLevel: number;
}
