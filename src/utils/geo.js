const defaultCenter = {
    lat: 50.450001,
    lng: 30.523333
};
export const getBrowserLocation =()=>{
    return new Promise((resolve,reject)=>{
        if('geolocation' in navigator){
            navigator.geolocation.getCurrentPosition(
                (pos)=>{
                    const {latitude:lat,longitude:lng}=pos.coords;
                    resolve({lat,lng});
                },
                ()=>{
                    reject(defaultCenter);
                },
            );
        }else{
            reject(defaultCenter);
        }
    });
};