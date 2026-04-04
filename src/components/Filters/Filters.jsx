import { useState, useCallback, useEffect } from 'react';
import {Link} from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as IconSearch } from './search.svg';
import { ReactComponent as IconSearchGray } from './searchGray.svg';
import { ReactComponent as IconFilter } from './filter.svg';
import { ReactComponent as IconFilterActive } from './filterActive.svg';
import { GeoButton } from "../GeoButton/GeoButton";
import { Modal } from '../Modal/Modal';
import { CardFilters } from '../CardFilters/CardFilters';
import { useFilters } from '../../context/FiltersContext';
import {Logo} from '../Logo';
import style from "./Filters.module.scss";


export const Filters = () => {
  const [isActiveFilter, setIsActiveFilter] = useState(false);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('userProfile')); } catch { return null; }
  });
  const location = useLocation();
  const navigate = useNavigate();

  // Re-check auth when storage changes (after login/logout)
  useEffect(() => {
    const onStorage = () => {
      try { setUser(JSON.parse(localStorage.getItem('userProfile'))); } catch { setUser(null); }
    };
    window.addEventListener('storage', onStorage);
    // Also poll — same-tab login won't fire 'storage'
    const interval = setInterval(onStorage, 1000);
    return () => { window.removeEventListener('storage', onStorage); clearInterval(interval); };
  }, []);  
  const { 
    filters, 
    updateSearchQuery, 
    resetAllFilters,    
    activateSearch,
    hasActiveFilters 
  } = useFilters();
  const {searchQuery}=filters;
  const [searchValue, setSearchValue] = useState(searchQuery);
  
  // Синхронизация с фильтрами при изменении
  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  const changeIsActiveFilter = useCallback(() => {
    setIsActiveFilter((prev) => !prev);
  }, []);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      updateSearchQuery(searchValue.trim());
      activateSearch();
    } else {
      // Если поиск пустой, деактивируем поиск и показываем все места
      resetAllFilters();
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    resetAllFilters();    
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };  

  return (
    <div className={style.filterWrap}>
      <div className={style.desctop}><Logo/></div>      
      <div className={style.flex}>        
        <div className={style.inputWrap}>
          <button
            type="button"
            className={style.searchButton}
            onClick={handleSearch}
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
            value={searchValue}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
        {searchValue && (
          <button
            type="button"
            className={style.clearButton}
            onClick={handleClearSearch}
            aria-label="Очистити пошук"
          >
            ×
          </button>
        )}
        </div>  
        <div className={style.desctop}>
          {user ? (
            <button
              className={style.userBtn}
              onClick={() => navigate('/profile')}
              title={user.email}
            >
              <img
                src={user.picture || '/avatar.png'}
                alt={user.name}
                className={style.userAvatar}
                onError={(e) => { e.target.src = '/avatar.png'; }}
              />
              <span className={style.userName}>{user.given_name || user.name}</span>
            </button>
          ) : (
            <Link to="/register" className={style.btnReg}>Зареєструватись</Link>
          )}
        </div> 
        <GeoButton />              
      </div> 
      {location.pathname === "/" && 
      
        <button
          type="button"
          className={style.btnFilter}
          onClick={changeIsActiveFilter}
          id="filter"
          aria-label={hasActiveFilters() ? 'Активні фільтри' : 'Фільтри'}
        >
          <span className={style.btnFilterText}>Фільтри</span>
          <IconFilter className={`${style.iconFilter} ${style.iconFilterDefault}`} />
          <IconFilterActive className={`${style.iconFilter} ${style.iconFilterHover}`} />
          {hasActiveFilters() && <span className={style.activeIndicator}></span>}
        </button>}   
      {isActiveFilter && (
        <Modal onClose={changeIsActiveFilter} version={"filters"}>
          <CardFilters onClose={changeIsActiveFilter} />
        </Modal>
      )}     
    </div>
  );
};
