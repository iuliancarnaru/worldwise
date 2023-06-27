import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CityType } from "../types";

interface CitiesContextType {
  currentCity: CityType;
  cities: CityType[];
  isLoading: boolean;
  getCity: (id: string) => void;
}

const CitiesContext = createContext<CitiesContextType>({} as CitiesContextType);

function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [cities, setCities] = useState<CityType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentCity, setCurrentCity] = useState<CityType>({} as CityType);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:4000/cities")
      .then((res) => res.json())
      .then((data: CityType[]) => {
        setCities(data);
        setIsLoading(false);
      })
      .catch((err: Error) => console.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const getCity = useCallback((id: string) => {
    setIsLoading(true);
    fetch(`http://localhost:4000/cities/${id}`)
      .then((res) => res.json())
      .then((data: CityType) => {
        setCurrentCity(data);
        setIsLoading(false);
      })
      .catch((err: Error) => console.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <CitiesContext.Provider
      value={{
        currentCity,
        cities,
        isLoading,
        getCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("useCities must be used inside of CitiesProvider");
  }

  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCities };
