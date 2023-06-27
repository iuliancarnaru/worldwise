import { useCities } from "../context/CitiesContext";

import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";

function CountyList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  const uniqueCities = cities.reduce(
    (arr, city) => {
      if (!arr.map((el) => el.country).includes(city.country)) {
        return [
          ...arr,
          {
            id: city.id,
            country: city.country,
            emoji: city.emoji,
          },
        ];
      } else {
        return arr;
      }
    },
    [] as {
      id: number;
      country: string;
      emoji: string;
    }[]
  );

  return (
    <ul className={styles.countryList}>
      {uniqueCities?.map((city) => (
        <CountryItem key={city.id} item={city} />
      ))}
    </ul>
  );
}

export default CountyList;
