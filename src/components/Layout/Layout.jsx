import { NavLink } from "react-router-dom";
import { useLocation, useMatch } from "react-router-dom";
import { ReactComponent as IconMap } from './map.svg';
import { ReactComponent as IconMapActive } from './mapActive.svg';
import { ReactComponent as IconLike } from './like.svg';
import { ReactComponent as IconLikeActive } from './likeActive.svg';
import { ReactComponent as IconAddMob } from './addActiveMob.svg';
import { ReactComponent as IconAddDesctop } from './addActiveDesctop.svg';
import { ReactComponent as IconComment } from './comment.svg';
import { ReactComponent as IconCommentActive } from './commentActive.svg';
import { ReactComponent as IconAcount } from './acount.svg';
import { ReactComponent as IconAcountActive } from './acountActive.svg';
import { MODES } from '../../components/Map/Map';
import { useMediaQuery } from "../../hook/useMediaQuery";
import { MapPage } from "../../page/MapPage";
import { ListPage } from "../../page/ListPage";
import { BorschPage} from "../../page/BorschPage";
import {EvaluationsPage} from "../../page/EvaluationsPage";
import { Filters } from '../../components/Filters/Filters';
import style from "./Layout.module.scss";

export const Layout = ({ children }) => {
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const location = useLocation();
  const matchBorsch = useMatch("/borsch/:borschId");  
  const matchBorschEvaluations = useMatch("/borsch/:borschId/evaluations");  
  
  return (
    <div className={style.container}>
      <main className={style.main}>
        {isDesktop ? (
          <>
            {location.pathname === "/" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "20px"
                }}
              >
                <ListPage />
                <MapPage />
              </div>
            )}

            {matchBorsch && !matchBorschEvaluations && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "20px"
                }}
              >
                <BorschPage borschId={matchBorsch.params.borschId} />
                <MapPage />
              </div>
            )}

            {matchBorschEvaluations && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "20px"
                }}
              >
                <EvaluationsPage borschId={matchBorschEvaluations.params.borschId} />
                <MapPage />
              </div>
            )}

            {/* 🔹 По умолчанию — показываем children, чтобы работали все другие маршруты */}
            {!(
              location.pathname === "/" ||
              matchBorsch ||
              matchBorschEvaluations
            ) && children}
          </>
        ) : (
          children
        )}
      </main>

      <header className={style.header}>        
          {isDesktop && <Filters/>  }             
        <nav>
          <ul className={style.navContainer}>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${style.link} ${isActive ? style.active : ""}`
                }
                onClick={() => localStorage.setItem('mode', MODES.MOVE)}
              >
                <IconMap className={`${style.icon} ${style.iconDefault}`} />
                <IconMapActive className={`${style.icon} ${style.iconHover}`} />
                <span className={style.text}>Мапа</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/favorite"
                className={({ isActive }) =>
                  `${style.link} ${isActive ? style.active : ""}`
                }
              >
                <IconLike className={`${style.icon} ${style.iconDefault}`} />
                <IconLikeActive className={`${style.icon} ${style.iconHover}`} />
                <span className={style.text}>Обране</span>
              </NavLink>
            </li>

            <li>
              {!isDesktop && <NavLink
                to="/add-borsch"
                className={style.addBorsch}
                onClick={() => localStorage.setItem('mode', MODES.SET_MARKER)}
              >
                <IconAddMob/>                
              </NavLink>}
              {isDesktop && <NavLink
                to="/add-borsch"
                className={({ isActive }) =>
                  `${style.link} ${isActive ? style.active : ""}`
                }
                onClick={() => localStorage.setItem('mode', MODES.SET_MARKER)}
              >              
                <IconAddDesctop className={`${style.icon} ${style.iconDefault}`}/>
                <IconAddMob className={`${style.icon} ${style.iconHover}`} />               
                <span className={style.text}>Додати борщ</span>
                </NavLink>}
            </li>
            <li>
              <NavLink
                to="/reviews"
                className={({ isActive }) =>
                  `${style.link} ${isActive ? style.active : ""}`
                }
              >
                <IconComment className={`${style.icon} ${style.iconDefault}`} />
                <IconCommentActive
                  className={`${style.icon} ${style.iconHover}`}
                />
                <span className={style.text}>Відгуки</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${style.link} ${isActive ? style.active : ""}`
                }
              >
                <IconAcount className={`${style.icon} ${style.iconDefault}`} />
                <IconAcountActive
                  className={`${style.icon} ${style.iconHover}`}
                />
                <span className={style.text}>Ви</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};
