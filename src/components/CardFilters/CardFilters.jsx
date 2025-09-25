import { useRef, useState, useCallback, useEffect } from 'react';
import { ReactComponent as IconDelete } from './close.svg';
import typePlace from '../../data/typePlaces.json';
import style from "./CardFilters.module.scss";
import { useFilters } from '../../context/FiltersContext';

const meatOptions = ['Без м\'яса', 'Курка', 'Свинина', 'Яловичина','Інше'];

export const CardFilters=({onClose})=>{    
    const { 
        filters,        
        togglePlaceType, 
        updateMeatType, 
        updatePriceRange, 
        resetAllFilters,
    } = useFilters();
   
    const [selectedTypes, setSelectedTypes] = useState(filters.selectedTypes);
    const [selectedMeat, setSelectedMeat] = useState(filters.selectedMeat);
    const [minPrice, setMinPrice] = useState(filters.minPrice);
    const [maxPrice, setMaxPrice] = useState(filters.maxPrice);  
    const [draggingThumb, setDraggingThumb] = useState(null);

    const rangeMin = 50;
    const rangeMax = 5000;
    const minGap = 50;
    const total = rangeMax - rangeMin;
    const wrapperRef = useRef(null);

    const valueFromClientX = useCallback((clientX) => {
        const el = wrapperRef.current;
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
        const percent = x / rect.width;
        const value = Math.round(rangeMin + percent * total);
        return Math.min(Math.max(value, rangeMin), rangeMax);
    }, [total]);

    const chooseNearestThumb = useCallback((clientX) => {
        const v = valueFromClientX(clientX);
        if (v === null) return null;
        const dMin = Math.abs(v - minPrice);
        const dMax = Math.abs(v - maxPrice);
        return dMin <= dMax ? 'min' : 'max';
    }, [minPrice, maxPrice, valueFromClientX]);

    const updateValueForThumb = useCallback((thumb, clientX) => {
        const v = valueFromClientX(clientX);
        if (v === null) return;
        if (thumb === 'min') {
            const next = Math.min(v, maxPrice - minGap);
            setMinPrice(Math.max(next, rangeMin));
        } else if (thumb === 'max') {
            const next = Math.max(v, minPrice + minGap);
            setMaxPrice(Math.min(next, rangeMax));
        }
    }, [minPrice, maxPrice, rangeMin, rangeMax, minGap, valueFromClientX]);

    useEffect(() => {
        if (!draggingThumb) return;
        const handleMove = (e) => {
            if (e.touches && e.touches.length > 0) {
                updateValueForThumb(draggingThumb, e.touches[0].clientX);
            } else {
                updateValueForThumb(draggingThumb, e.clientX);
            }
        };
        const handleUp = () => setDraggingThumb(null);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('touchend', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [draggingThumb, updateValueForThumb]);
    const [appliedFilters, setAppliedFilters] = useState(null);    
    console.log(appliedFilters,);
    
    const handleTypeToggle = (type) => {
        setSelectedTypes((prev) => {
            const newTypes = prev.includes(type)
                ? prev.filter((t) => t !== type)  
                : [...prev, type];
            return newTypes;
        });
    };


    const handleApplyFilters = (e) => {
        // Обновляем контекст фильтров
        updatePriceRange(minPrice, maxPrice);
        
        // Обновляем типы заведений
        selectedTypes.forEach(type => {
            if (!filters.selectedTypes.includes(type)) {
                togglePlaceType(type);
            }
        });
        
        // Удаляем невыбранные типы
        filters.selectedTypes.forEach(type => {
            if (!selectedTypes.includes(type)) {
                togglePlaceType(type);
            }
        });
        
        // Обновляем тип мяса
        if (selectedMeat !== filters.selectedMeat) {
            updateMeatType(selectedMeat);
        }
        
        setAppliedFilters({
            type: selectedTypes,
            meat: selectedMeat,
            priceFrom: minPrice,
            priceTo: maxPrice,
        }); 
        
        console.log('Применены фильтры:', appliedFilters);  
        onClose();
    };

   
  const handleReset = (e) => {
    e.preventDefault();
    setSelectedTypes([]);
    setSelectedMeat('');
    setMinPrice(50);
    setMaxPrice(5000);
    setAppliedFilters(null);
    
    // Сбрасываем фильтры в контексте
   resetAllFilters();
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
    
    // Синхронизируем локальное состояние с контекстом при изменении
    useEffect(() => {
        setSelectedTypes(filters.selectedTypes);
        setSelectedMeat(filters.selectedMeat);
        setMinPrice(filters.minPrice);
        setMaxPrice(filters.maxPrice);
    }, [filters]);
    

    return(
        <div className={style.cardFilters}>
            <button type="button" onClick={onClose} className={style.btnClose} >                               
                <IconDelete   aria-label={'close'} id='close'/>
            </button>
            <h2 className={style.title}>Фільтри</h2>
            <div className={style.boxForm}>                
                <form action="" onSubmit={ handleApplyFilters}>
                    <div>
                       <h3 className={style.typeTitle}>Тип закладу</h3>
                       <div className={style.radioBox}>
                        {typePlace.map((i) => (
                            <label className={style.radioItem}  key={i.id || i.type}>
                                <input                                    
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
                        <div
                          className={style.sliderWrapper}
                          ref={wrapperRef}
                          onMouseDown={(e) => {
                            const chosen = chooseNearestThumb(e.clientX);
                            if (!chosen) return;
                            setDraggingThumb(chosen);
                            updateValueForThumb(chosen, e.clientX);
                          }}
                          onTouchStart={(e) => {
                            if (!e.touches || e.touches.length === 0) return;
                            const chosen = chooseNearestThumb(e.touches[0].clientX);
                            if (!chosen) return;
                            setDraggingThumb(chosen);
                            updateValueForThumb(chosen, e.touches[0].clientX);
                          }}
                        >
                            <div className={style.track}>
                                <div
                                className={style.trackActive}
                                style={{
                                    left: `${((minPrice - 50) / (5000 - 50)) * 100}%`,
                                    width: `${((maxPrice - minPrice) / (5000 - 50)) * 100}%`
                                }}
                                />
                            </div>                           
                            <div className={style.rangeWrapper}>
                                <input
                                type="range"
                                min="50"
                                max="5000"
                                value={minPrice}
                                onChange={handleMinChange}
                                className={style.range}
                                style={{ pointerEvents: 'none' }}
                                />
                            </div> 
                            <div className={style.rangeWrapper}>
                                <input
                                type="range"
                                min="50"
                                max="5000"
                                value={maxPrice}
                                onChange={handleMaxChange}
                                className={style.range}
                                style={{ pointerEvents: 'none' }}
                                />
                            </div>
                        </div>
                    </div>                    
                    <div className={style.boxBtnSubmit}>
                        <button  type="submit" className={style.btnSubmit}
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