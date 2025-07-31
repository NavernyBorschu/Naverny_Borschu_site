import { useState} from 'react';
// import { useNavigate } from 'react-router-dom';
import { ReactComponent as IconDelete } from './close.svg';
import typePlace from '../../data/typePlaces.json';
import style from "./CardFilters.module.css";

const meatOptions = ['Без м\'яса', 'Курка', 'Свинина', 'Телятина', 'Качка'];

export const CardFilters=({onClose})=>{    
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedMeat, setSelectedMeat] = useState('');
    const [minPrice, setMinPrice] = useState(50);
    const [maxPrice, setMaxPrice] = useState(5000);  
    const [appliedFilters, setAppliedFilters] = useState(null);
    // const navigate = useNavigate();
    const handleTypeToggle = (type) => {
        setSelectedTypes((prev) =>
            prev.includes(type)
            ? prev.filter((t) => t !== type)  
            : [...prev, type]                
        );
    };


    const handleApplyFilters = (e) => {
        // e.preventDefault();
        setAppliedFilters({
        type: selectedTypes,
        meat: selectedMeat,
        priceFrom: minPrice,
        priceTo: maxPrice,
        }); 
         console.log(appliedFilters);        
        onClose();
        // navigate('');        
    };
   
  const handleReset = (e) => {
    e.preventDefault();
    setSelectedTypes('');
    setSelectedMeat('');
    setMinPrice(50)
    setMaxPrice(5000);
    setAppliedFilters(null);    
  };


    const handleMinChange = (e) => {
        const value = Math.min(Number(e.target.value), maxPrice - 50);
        setMinPrice(value);
    };

    const handleMaxChange = (e) => {
        const value = Math.max(Number(e.target.value), minPrice + 50);
        setMaxPrice(value);
    };

    

    const handleMeatSelect = (meat) => {
        setSelectedMeat(meat);
    };
    const getPercent = (value) => ((value - 50) / (5000 - 50)) * 100;

    const rangeTrackStyle = {
    background: `linear-gradient(
        to right,
        var(--color-text-main) ${getPercent(minPrice)}%,
        var(--color-text-active) ${getPercent(minPrice)}%,
        var(--color-text-active) ${getPercent(maxPrice)}%,
        var(--color-text-main) ${getPercent(maxPrice)}%
    )`
    };

    return(
        <div className={style.cardFilters}>
            <button type="button" onClick={onClose} className={style.btnClose} >                               
                <IconDelete   aria-label={'close'} id='close'/>
            </button>
            <h2 className={style.title}>Фільтри</h2>
            <div className={style.boxForm}>                
                <form >
                    <div>
                       <h3 className={style.typeTitle}>Тип закладу</h3>
                       <div className={style.radioBox}>
                        {typePlace.map((i) => (
                            <label className={style.radioItem} >
                                <input
                                    key={i}
                                    type="checkbox"
                                    value={i.type}
                                    checked={selectedTypes.includes(i.type)}
                                    onChange={() => handleTypeToggle(i.type)}/>
                                
                                {i.type}
                            </label>
                        ))} 
                       </div>                        
                    </div>
                    <div className={style.boxType}>
                        <h3 className={style.typeTitle}>Тип мʼяса</h3>
                        <div className={style.meatOptions}>
                            {meatOptions.map((meat) => (
                                <button
                                    key={meat}
                                    type="button"
                                    className={`${style.meatButton} ${
                                        selectedMeat === meat ? style.activeMeatButton : ''
                                    }`}
                                    onClick={() => handleMeatSelect(meat)}
                                >
                                    {meat}
                                </button>
                            ))}
                        </div>
                    </div> 
                    <div className={style.boxType}>
                        <h3 className={style.typeTitle}>Ціновий діапазон</h3>
                        <div className={style.priceFields}>
                            <div className={style.priceField}>
                                <span>{minPrice} ₴</span>
                            </div>
                            <div className={style.priceField}>
                                <span>{maxPrice} ₴</span>
                            </div>
                        </div>
                        <div className={style.sliderWrapper}>
                            <input
                                type="range"
                                min="50"
                                max="5000"
                                value={minPrice}
                                onChange={handleMinChange}
                                className={style.rangeInput}
                                style={rangeTrackStyle}
                            />

                            <input
                                type="range"
                                min="50"
                                max="5000"
                                value={maxPrice}
                                onChange={handleMaxChange}
                                className={style.rangeInput}
                            />
                        </div>
                    </div>
                    <div className={style.boxBtnSubmit}>
                        <button onClick={handleApplyFilters}                        className={style.btnSubmit}
                        >
                        Застосувати
                        </button>
                        <button
                        onClick={handleReset}
                        className={style.btnSubmitInl}
                        >
                        Скинути фільтри
                        </button>
                    </div>                                 
                </form>
            </div>                      
        </div>
    )
};