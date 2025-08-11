import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { ButtonVertion } from "../../components/ButtonVersion";
import { ReactComponent as IconClose } from "./close.svg";
// import typography from '../../styles/typography.module.css';
import style from './AddBorsch.module.css';

const COUNTRY_HINTS = [
  "ukraine","україна","uk","usa","united states","poland","france","germany","spain","italy","russia"
];
const POSTAL_RE = /^\d{2,}(-\d+)?$/;
const HOUSE_RE = /^\d[\dA-Za-zА-Яа-я\\-]*$/; 
const STREET_TOKEN_RE = /\b(street|st\.?|ave|avenue|blvd|boulevard|road|rd\.?|lane|ln\.?|square|sq\.?|prospekt|проспект|vul|vulytsia|вул|maidan|майдан|gate|gates|plaza|place|str|drive|dr)\b/i;

export const parseAddress=(address)=>{
  if (!address || typeof address !== "string") return { place: "", street: "", city: "" };  
  const parts0 = address.split(",").map(s => s.trim()).filter(Boolean);
  const parts = [...parts0];  
  while (parts.length > 0) {
    const last = parts[parts.length - 1].toLowerCase();
    if (POSTAL_RE.test(last) || COUNTRY_HINTS.includes(last)) {
      parts.pop();
    } else break;
  }

  if (parts.length === 0) return { place: "", street: "", city: "" };
 
  const city = parts.pop() || "";
  
  const before = parts; 

  if (before.length === 0) return { place: "", street: "", city };
  
  const houseIndex = before.findIndex(p => HOUSE_RE.test(p));

  if (houseIndex > 0) {    
    const street = before.slice(houseIndex - 1).join(", ");
    const place = before.slice(0, houseIndex - 1).join(", ");
    return { place: place || "", street: street || "", city: city || "" };
  }

  const streetTokenIndex = before.findIndex(p => STREET_TOKEN_RE.test(p));
  if (streetTokenIndex >= 0) {
    const street = before.slice(streetTokenIndex).join(", ");
    const place = before.slice(0, streetTokenIndex).join(", ");
    return { place: place || "", street: street || "", city: city || "" };
  }

  if (before.length === 1) {    
    return { place: "", street: before[0], city };
  }

  return {
    place: before[0] || "",
    street: before.slice(1).join(", ") || "",
    city
  };
}
export const AddBorsch = ({onClick, onClose, address}) => {
    const [place, setPlace] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
// В цьому компоненты додати логыку выдправки нового борщу на сервер
    useEffect(() => {
        const parsed = parseAddress(address || "");
        setPlace(parsed.place);
        setStreet(parsed.street);
        setCity(parsed.city);
    }, [address]);

    return (
        <div className={style.container}>
            <div className={style.card}>
                <div className={style.boxClose}>
                    <ButtonVertion type="button" onClick={onClose} icon={IconClose} />
                </div>
                <div className={style.boxContext}>
                    <div className={style.boxAddress}>
                        <p><b>Place:</b> {place}</p>
                        <p><b>Street:</b> {street}</p>
                        <p><b>City:</b> {city}</p>
                    </div>
                    <Button
                        type="button"
                        name="Вибрати заклад"
                        onClick={onClick}
                    />
                </div>                
            </div>                       
        </div>
    );
};