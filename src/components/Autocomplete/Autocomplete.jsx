import { useEffect } from "react";
import usePlacesAutocomplete, {getGeocode,getLatLng} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import style from './Autocomplete.module.css';

export const Autocomplete =({isLoaded,onSelect})=>{
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        init,
        clearSuggestions,
      } = usePlacesAutocomplete({
        initOnMount:false,
        debounce: 300,
      });
      const ref = useOnclickOutside(() => {        
        clearSuggestions();
      });
    
      const handleInput = (e) => {        
        setValue(e.target.value);
      };
    
      const handleSelect =
        ({ description }) =>
        () => {          
          setValue(description, false);
          clearSuggestions();         
          getGeocode({ address: description }).then((results) => {
            const { lat, lng } = getLatLng(results[0]);
            console.log("📍 Coordinates: ", { lat, lng });
            onSelect({lat, lng})
          });
        };
    
      const renderSuggestions = () =>
        data.map((suggestion) => {
          const {
            place_id,
            structured_formatting: { main_text, secondary_text },
          } = suggestion;
    
          return (
            <li  key={place_id} onClick={handleSelect(suggestion)}>
              <strong>{main_text}</strong> <small>{secondary_text}</small>
            </li>
          );
        });
        useEffect(()=>{
            if(isLoaded){
                init()
            }
        },[isLoaded,init])
    
    return(
        <div className={style.container} ref={ref}>
            <input type='text' className={style.input}
            value={value}
            onChange={handleInput}
            disabled={!ready}
            placeholder="В якому місті бажаеш навернути борщу?"
            />
            {status === "OK" && <ul className={style.select}>{renderSuggestions()}</ul>}
        </div>
    )
}