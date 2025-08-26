import { NavLink } from "react-router-dom";
import { ReactComponent as IconMap } from './map.svg';
import { ReactComponent as IconMapActive } from './mapActive.svg';
import { ReactComponent as IconLike } from './like.svg';
import { ReactComponent as IconLikeActive } from './likeActive.svg';
import { ReactComponent as IconAddActive } from './addActive.svg';
import { ReactComponent as IconComment } from './comment.svg';
import { ReactComponent as IconCommentActive } from './commentActive.svg';
import { ReactComponent as IconAcount } from './acount.svg';
import { ReactComponent as IconAcountActive } from './acountActive.svg';
import { MODES } from '../../components/Map/Map';
import style from "./Layout.module.scss";

export const Layout = ({ children }) => {
  return (
    <div className={style.container}>
      <main>{children}</main>
      <header className={style.header}>
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
              <NavLink
                to="/add-borsch"
                className={style.addBorsch}
                onClick={() => localStorage.setItem('mode', MODES.SET_MARKER)}
              >
                <IconAddActive />
              </NavLink>
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
