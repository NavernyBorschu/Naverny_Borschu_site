import style from './PersonalInfo.module.css';

export const PersonalInfo=()=>{
    return(
        <div className={style.clientPage}>
            <div className={style.clientCard}>
                <div className={style.clientHeader}>
                    <img src={"fotoborsh.jpg"}  alt={"Foto user"}  className={style.clientAvatar}/>
                    <div>
                        <h2 className={style.clientInfo}>Harry Potter</h2>
                        <p className={style.clientId}>ID: 123456</p>
                    </div>
                </div>
                <div className={style.clientDetails} >
                    <p><strong>Email:</strong> HarryPotter@gmail.com</p>
                    <p><strong>Tel:</strong> +4(999) 123-45-67</p>
                    <p><strong>Adress:</strong> House No. 4, Privet Street (4 Privet Drive)
                        Little Whinging, Surrey, England</p>
                </div>
            </div>
        </div>


    )
}