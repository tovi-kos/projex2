import { useState } from "react";
import { useForm } from "react-hook-form";
import './map.css';
import L from "leaflet"; // ייבוא Leaflet
import "leaflet/dist/leaflet.css"; // ייבוא CSS של Leaflet
import './map.css';
import Map from "./Map";


function handleKeyDown (e) {
    if (
      !(
        (e.key >= "0" && e.key <= "9") || 
        ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
      )
    ) {
      e.preventDefault();
    }
  };


// import * as L from './leaflet';
// export * from './leaflet';

// export default L;

{/* <script src=


integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
crossorigin=""></script> */}


function Form({addToArrUsers}) {

    let { register, getValues, setValue, handleSubmit, reset,
        formState: { errors, isValid } } = useForm({
        mode: "all"
    });

    const [buttons, setButtons] = useState([]);
    const [map, setMap] = useState(null);
    let [objSearch, setObjSearch] = useState({
    });



    function shwOptions(e) {

        setValue("address", e.target.value);
        const address = getValues("address");
        let flag = false;
        let url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}&limit=6`;
        try {
            fetch(url).then(res => res.json()).then(data => {
                const dic = {};
                data.forEach((item) => {
                    dic[item.display_name] = {
                        lat: item.lat,
                        lon: item.lon
                    };
                });
                setObjSearch(dic);
                const names = Object.keys(dic);
                setButtons(names);
                flag = true;

            });

        }
        catch { err => console.log(err) };

        return flag;
    }


    function save() {



        reset(userName = "", Address = "", phone = "", email = "", isOnline = true, isCoffeeMechine = true, amountRooms = 0, distance = 0);


    }

    //     function showMap(namePlace) {
    // fetch().then(res=>res.json()).then(data=>{
    // console.log(data);
    // })

    function showMap(e) {
        // lat 54.3793174
        // lon -5.9694446

        if (!objSearch[e])
            console.log("errrrror");
        else {
            const { lat, lon } = objSearch[e];

            if (!map) {
                let newMap = L.map('map').setView([lat, lon], 13);
                L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19
                    ,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                }).addTo(newMap);
                setMap(newMap);
            }
            else
                map.setView([lat, lon], 13);
        }
    }



    return (
        <>
            <form onSubmit={handleSubmit(save)}>
                <input {...register('userName', { required:{value:true,message:"Name is required"} })}
                    placeholder="Username" />
                {errors.userName&&<div>{errors.userName.message}</div>}
                <input {...register('address', { required: true })}
                    placeholder="Address" onBlur={(e) => shwOptions(e)} />
                {buttons.length > 0 && (
                    <select onClick={(e) => showMap(e.target.value)}>
                        {buttons.map((btn) => (
                            <option key={btn} value={btn}>{btn}</option>
                        ))}
                    </select>
                )}
                <input {...register('phone', { required:{ value: true,message: "phone is required" },validate:(v)=> {return v.length>=7||"the phone should be at least 7 digits"}, pattern: {
            value: /^[0-9]*$/} })}     onKeyDown={handleKeyDown}
                    placeholder="phone" />
                {errors.phone && <div>{errors.phone.message}</div>}
                <input {...register('email', { required:{ value: true,message: "email is required" } ,pattern:{value:/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/,message:"not correct email"}})} type="email"
                    placeholder="email"
                />
                {errors.email&&<div>{errors.email.message}</div>}
                <label value="">Enternet</label>
                <input {...register("isOnline")} type="checkbox" placeholder="isOnline" defaultChecked />
                <label value="">coffee Mechine</label>
                <input {...register("isCoffeeMechine")} type="checkbox" placeholder="isCoffeeMechine" defaultChecked/>
                <input {...register("amountRooms")} type="Number" placeholder="amountRooms" />
                <input {...register("distance")} type="Number" placeholder="distance" />
               
                <input {...register("submit")} disabled={!isValid} />
            
            </form>
            
        </>
    );
}



export default Form;