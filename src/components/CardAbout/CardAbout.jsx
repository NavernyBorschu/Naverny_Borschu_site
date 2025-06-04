import Icon from '@mdi/react';
import { mdiShakerOutline } from '@mdi/js';
import { mdiClose } from '@mdi/js';
import { mdiFoodSteak } from '@mdi/js';
import style from './CardAbout.module.css'

const createGrade=(number)=>{
    const array=[];
    for(let i=0; i < number; i++){
        array.push(i);
    }
    return array
};

export const CardAbout=({marker})=>{           
    return(
        <div className={style.cardConteiner}>
            <div className={style.imgConteiner}>                           
                <img className={style.image} src={marker.url} alt={"Borshch"} width={'100%'} height={'100%'} loading={'lazy'}/>
            </div>
            <h1>Location: {marker.name}</h1>
            <h2>Price: {marker.price}</h2>
            <p>Dish weight: {marker.weight}</p>
            <div className={style.flex}>
                <p>Saltiness:</p> 
                {createGrade(marker.saltiness).map((pos,index)=>{                   
                return (
                    <Icon key={index} path={mdiShakerOutline} size={1} />                                                   
                    )                                
                })} 
                {createGrade(10-marker.saltiness).map((pos,index)=>{                   
                return (
                    <Icon key={index} path={mdiClose} size={1} />                                                   
                    )                                
                })}                   
            </div>
            <div className={style.flex}>
                <p>Fleshiness:</p> 
                {createGrade(marker.fleshiness).map((pos,index)=>{                   
                return (
                    <Icon key={index}  path={mdiFoodSteak} size={1} />                                                  
                    )                                
                })} 
                {createGrade(10-marker.fleshiness).map((pos,index)=>{                   
                return (
                    <Icon key={index} path={mdiClose} size={1} />                                                   
                    )                                
                })}                   
            </div>                  
            <p>{marker.description}</p>        
        </div>        
    )
}