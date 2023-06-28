import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { CityType } from "../types";

interface CitiesContextType {
  currentCity: CityType;
  cities: CityType[];
  isLoading: boolean;
  getCity: (id: string) => Promise<void>;
  createCity: (newCity: CityType) => Promise<void>;
  deleteCity: (id: number) => Promise<void>;
}

const CitiesContext = createContext<CitiesContextType>({} as CitiesContextType);

// type StateType = {
//   cities: CityType[];
//   isLoading: boolean;
//   error: string;
// };

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

enum ActionKind {
  LOADING = "LOADING",
  REJECTED = "REJECTED",
  CITY_LOADED = "CITY_LOADED",
  CITY_CREATED = "CITY_CREATED",
  CITY_DELETED = "CITY_DELETED",
  CITIES_LOADED = "CITIES_LOADED",
}

type ActionType =
  | {
      type: ActionKind.LOADING;
    }
  | {
      type: ActionKind.REJECTED;
      payload: string;
    }
  | {
      type: ActionKind.CITY_LOADED;
      payload: CityType[];
    }
  | {
      type: ActionKind.CITIES_LOADED;
      payload: CityType[];
    }
  | {
      type: ActionKind.CITY_CREATED;
      payload: CityType;
    }
  | {
      type: ActionKind.CITY_DELETED;
      payload: number;
    };

function reducer(state, action: ActionType) {
  switch (action.type) {
    case ActionKind.LOADING:
      return { ...state, isLoading: true };
    case ActionKind.REJECTED:
      return { ...state, isLoading: false, error: action.payload };
    case ActionKind.CITY_LOADED:
      return { ...state, isLoading: false, currentCity: action.payload };
    case ActionKind.CITIES_LOADED:
      return { ...state, isLoading: false, cities: action.payload };
    case ActionKind.CITY_CREATED:
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case ActionKind.CITY_DELETED:
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter(
          (city: CityType) => city.id !== action.payload
        ),
        currentCity: {},
      };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [{ currentCity, cities, isLoading }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const getCities = async () => {
      dispatch({ type: ActionKind.LOADING });

      try {
        const res = await fetch("http://localhost:4000/cities");
        const data = await res.json();

        dispatch({ type: ActionKind.CITIES_LOADED, payload: data });
      } catch (err) {
        console.error((err as Error).message);
        dispatch({
          type: ActionKind.REJECTED,
          payload: (err as Error).message,
        });
      }
    };
    getCities();
  }, []);

  const getCity = useCallback(async (id: string) => {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: ActionKind.LOADING });

    try {
      const res = await fetch(`http://localhost:4000/cities/${id}`);
      const data = await res.json();

      dispatch({
        type: ActionKind.CITY_LOADED,
        payload: data,
      });
    } catch (err) {
      console.error((err as Error).message);
      dispatch({
        type: ActionKind.REJECTED,
        payload: (err as Error).message,
      });
    }
  }, []);

  const createCity = useCallback(async (newCity: CityType) => {
    dispatch({ type: ActionKind.LOADING });

    try {
      const res = await fetch(`http://localhost:4000/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      dispatch({
        type: ActionKind.CITY_CREATED,
        payload: data,
      });
    } catch (err) {
      console.error((err as Error).message);
      dispatch({
        type: ActionKind.REJECTED,
        payload: (err as Error).message,
      });
    }
  }, []);

  const deleteCity = useCallback(async (id: number) => {
    dispatch({ type: ActionKind.LOADING });

    try {
      await fetch(`http://localhost:4000/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({
        type: ActionKind.CITY_DELETED,
        payload: id,
      });
    } catch (err) {
      console.error((err as Error).message);
      dispatch({
        type: ActionKind.REJECTED,
        payload: (err as Error).message,
      });
    }
  }, []);

  return (
    <CitiesContext.Provider
      value={{
        currentCity,
        cities,
        isLoading,
        getCity,
        createCity,
        deleteCity,
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
