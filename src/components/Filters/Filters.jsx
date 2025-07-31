import { useState,useCallback } from 'react';
import { ReactComponent as IconSearch } from './search.svg';
import { ReactComponent as IconFilter } from './filter.svg';
import { ReactComponent as IconGeo } from './geo_loc.svg';
import {Modal} from '../Modal/Modal';
import style from "./Filters.module.css";
import { CardFilters } from '../CardFilters/CardFilters';

export const Filters = ( )=>{
    const [isActiveFilter,setIsActiveFilter] =useState(false);    
    
    const changeIsActiveFilter = useCallback((i) => {
        setIsActiveFilter((prev) => !prev);        
    }, []); 

    return(
        <div className={style.filterWrap}>
            <div className={style.inputWrap}>
                <button type="submit" className={style.searchButton}>
                    <IconSearch  aria-label={'icon-search'} className={style.icon}/>
                </button>
                <input className={style.input} 
                    type="text" 
                    id="search"
                    placeholder='Введіть назву закладу' 
                />             
            </div>            
            <button type="button" className={style.button} onClick={changeIsActiveFilter}>
                <IconFilter aria-label={'icon-filter'} className={style.icon}/>
            </button> 
            <button type="button" className={style.button}>
                <IconGeo aria-label={'icon-geo'} className={style.icon}/>
            </button>
            {isActiveFilter&&
            <Modal onClose={changeIsActiveFilter} version={"filters"}>
                <CardFilters  onClose={changeIsActiveFilter} />
            </Modal>}      
        </div>    
    )
}