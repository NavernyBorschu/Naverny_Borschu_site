
// import style from './CardAbout.module.css'

// const createGrade=(number)=>{
//     const array=[];
//     for(let i=0; i < number; i++){
//         array.push(i);
//     }
//     return array
// };

export const CardAbout=({place})=>{  
    console.log(place.places);
             
    return(
        <>       
            {/* {place.map((place,index)=>{           
                <div className={style.cardConteiner} key={index}>
                    <div className={style.imgConteiner}>                           
                        <img className={style.image} src={place .url} alt={"Borshch"} width={'100%'} height={'100%'} loading={'lazy'}/>
                    </div>
                    
                </div>                
            })} */}
        </>
            
    )
}