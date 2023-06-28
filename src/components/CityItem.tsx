import { Link } from "react-router-dom";
import { CityType } from "../types";
import { formatDate } from "../utils/formatDate";
import styles from "./CityItem.module.css";
import { useCities } from "../context/CitiesContext";

interface CityItemProps {
  city: CityType;
}

function CityItem({ city }: CityItemProps) {
  const { currentCity, deleteCity } = useCities();
  const {
    cityName,
    emoji,
    date,
    id,
    position: { lat, lng },
  } = city;

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await deleteCity(id!);
  }

  return (
    <li>
      <Link
        to={`${id}?lat=${lat}&lng=${lng}`}
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleDelete}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
