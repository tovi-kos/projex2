import { useState } from "react";
import { useForm } from "react-hook-form";
import Map from "./Map";




function Form({ addToArrUsers }) {

    let { register, getValues, setValue, handleSubmit, reset,
        formState: { errors, isValid } } = useForm({
            mode: "all", defaultValues: {
                lat: "",
                lon: "",
                display_name: "",
                isCoffeeMechine: true,
                isOnline: true

            }
        });
    const [suggestName, setSuggestName] = useState([]);
    const [mapData, setMapData] = useState({});
    let [objSearch, setObjSearch] = useState({});
    const [position, setPosition] = useState([0, 0]);


    // לא מאפשרת הקשת תווים אחרים מלבד ספרות
    function handleKeyDown(e) {
        if (
            !(
                (e.key >= "0" && e.key <= "9") ||
                ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
            )
        ) {
            e.preventDefault();
        }
    };



    function shwOptions(e) {
        setValue("address", e.target.value);
        const address = getValues("address");
        let url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}&limit=6`;
        try {
            fetch(url).then(res => res.json()).then(data => {
                console.log(data);
                // const dic = {};
                // data.forEach((item) => {
                //     console.log("the item is print");
                //     console.log(item);
                //     dic[item.display_name] = {
                //         lat: item.lat,
                //         lon: item.lon
                //     };
                // });
                // console.log(dic);
                // setMapData(dic);
                // const names = Object.keys(dic); //שומר את כל שמות ההצעות 
                setSuggestName(data); //USE STATE מעדכן ב
            });
        }
        catch { err => console.log(err) };
    }
    
    function saveAddress(e) {
        const location = suggestName.find(s=> s.display_name==e);
        const coordinates = location ? [location.lat, location.lon] : null;
        if (coordinates)
            setPosition(coordinates);
    }


    function save() {
        addToArrUsers(register)
        reset(userName = "", Address = "", phone = "",
            email = "", isOnline = true, isCoffeeMechine = true,
            amountRooms = 0, distance = 0);
    }


    return (
        <>
            <form onSubmit={handleSubmit(save)}>
                <input {...register('userName', { required: { value: true, message: "Name is required" } })}
                    placeholder="Username" />
                {errors.userName && <div>{errors.userName.message}</div>}
                <input {...register('address', { required: true })}
                    placeholder="Address" onBlur={(e) => shwOptions(e)} />
                {suggestName.length > 0 && (
                    <select onClick={(e) => saveAddress(e.target.value)}>
                        {suggestName.map((btn) => (
                            <option key={btn.osm_id} value={btn.display_name}>{btn.display_name}</option>
                        ))}
                    </select>
                )}
                <input {...register('phone', {
                    required: { value: true, message: "Phone is required" },
                    validate: (v) => { return v.length >= 7 || "The phone should be at least 7 digits" },
                    pattern: { value: /^[0-9]*$/ }
                })}
                    onKeyDown={handleKeyDown}
                    placeholder="phone" />
                {errors.phone && <div>{errors.phone.message}</div>}
                <input {...register('email', {
                    required: { value: true, message: "Email is required" },
                    pattern: {
                        value: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/,
                        message: "Not correct email" }  
                })}
                    type="email"
                    placeholder="email"/>
                {errors.email && <div>{errors.email.message}</div>}
                <label value="">Enternet</label>
                <input {...register("isOnline")}
                    type="checkbox" placeholder="isOnline" />
                <label value="">coffee Mechine</label>
                <input {...register("isCoffeeMechine")}
                    type="checkbox" placeholder="isCoffeeMechine" />
                <input {...register("amountRooms")}
                    type="Number" placeholder="amountRooms" />
                <input {...register("distance")}
                    type="Number" placeholder="distance" />
                <input {...register("submit")}
                    disabled={!isValid} value={"שליחה"} type="submit" />
                {/* {showMap()} */}
            </form>
            <Map position={[0,0]} />

        </>
    );
}



export default Form;