import { useState, useCallback } from 'react';
import { ReactComponent as IconSearch } from './search.svg';
import { ReactComponent as IconSearchGray } from './searchGray.svg';
import { ReactComponent as IconFilter } from './filter.svg';
import { ReactComponent as IconFilterActive } from './filterActive.svg';
import { GeoButton } from "../GeoButton/GeoButton";
import { Modal } from '../Modal/Modal';
import { CardFilters } from '../CardFilters/CardFilters';
import style from "./Filters.module.scss";


export const Filters = () => {
  const [isActiveFilter, setIsActiveFilter] = useState(false); 

  const changeIsActiveFilter = useCallback(() => {
    setIsActiveFilter((prev) => !prev);
  }, []);  

  return (
    <div className={style.filterWrap}>
      <div className={style.inputWrap}>
        <button
          type="submit"
          className={style.searchButton}
          aria-label="search"
        >
          <IconSearch className={`${style.icon} ${style.iconDefault}`} />
          <IconSearchGray className={`${style.icon} ${style.iconActive}`} />
        </button>
        <input
          className={style.input}
          type="text"
          id="search"
          placeholder="Введіть назву закладу"
        />
      </div>
      <button
        type="button"
        className={style.btnFilter}
        onClick={changeIsActiveFilter}
        id="filter"
      >
        <IconFilter className={`${style.iconFilter} ${style.iconFilterDefault}`} />
        <IconFilterActive className={`${style.iconFilter} ${style.iconFilterHover}`} />
      </button>
      <GeoButton />
      {isActiveFilter && (
        <Modal onClose={changeIsActiveFilter} version={"filters"}>
          <CardFilters onClose={changeIsActiveFilter} />
        </Modal>
      )}     
    </div>
  );
};
