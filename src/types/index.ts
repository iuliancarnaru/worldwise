export interface CityType {
  cityName: string;
  country: string;
  emoji: string;
  date: string;
  notes: string;
  position: Position;
  id: number;
}
export interface Position {
  lat: number;
  lng: number;
}
