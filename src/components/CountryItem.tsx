import styles from "./CountryItem.module.css";

interface CountryItemProps {
  item: {
    country: string;
    emoji: string;
  };
}

function CountryItem({ item }: CountryItemProps) {
  return (
    <li className={styles.countryItem}>
      <span>{item.emoji}</span>
      <span>{item.country}</span>
    </li>
  );
}

export default CountryItem;
