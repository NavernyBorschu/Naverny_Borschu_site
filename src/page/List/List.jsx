import { Grade } from "../../components/Grade/Grage"
// import { Star } from "../../components/Star/Star"
import style from "./List.module.css";

export const List=()=>{   
  return( 
    <div className={style.pageList}>
    {/* <Star/> */}
    <Grade />
    </div>
    
  )
}