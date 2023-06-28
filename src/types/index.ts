export interface CityType {
  cityName: string;
  country: string;
  emoji: string;
  date: Date;
  notes: string;
  position: Position;
  id?: number;
}
export interface Position {
  lat: string | null;
  lng: string | null;
}
