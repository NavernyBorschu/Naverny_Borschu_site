import {Link} from "react-router-dom";
import Icon from '@mdi/react';
import { mdiMapOutline } from '@mdi/js';
import { mdilHeart } from '@mdi/light-js';
import { mdiPlus } from '@mdi/js';
import { mdiChatOutline } from '@mdi/js';
import { mdiAccountOutline } from '@mdi/js';
import { MODES } from '../../components/Map/Map';
import style from "./Layout.module.css";

export const Layout = ({ children }) => {
    
    return ( 
        <div className={style.container}>
            <main>{ children }</main>
            <header className={style.header}>
                <nav >
                    <ul className={style.navContainer}>                        
                        <li>                                                       
                            <Link to="/" className={style.link} onClick={()=>localStorage.setItem('mode', MODES.MOVE)}>
                            <Icon path={mdiMapOutline} size={2} />
                            Мапа</Link>
                        </li>
                        <li>
                            <Link to="/favorite" className={style.link}>
                            <Icon path={mdilHeart} size={2} />
                            Обране</Link>
                        </li>
                         <li>                        
                            <Link to="/add-borsch" className={style.addBorsch} onClick={()=>localStorage.setItem('mode', MODES.SET_MARKER)}>
                            <Icon path={mdiPlus} size={2} />
                           </Link>
                        </li>                                               
                        <li>
                            <Link to="/reviews" className={style.link}>
                            <Icon path={mdiChatOutline} size={2} />
                            Відгуки</Link>
                        </li> 
                        <li>
                            <Link to="/profile" className={style.link}>
                            <Icon path={mdiAccountOutline} size={2} />
                            Ви</Link>
                        </li>                                  
                    </ul>
                </nav>
            </header>        
            
        </div>        
    )
}