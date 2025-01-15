import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Map from "./Map";
import "./map.css";

function FormNew({ addToArrUsers }) {

    //hook-form שימוש בספריית 
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

    //  use state הצהרה ואתחול משתני 
    const [suggestName, setSuggestName] = useState([]);
    const [position, setPosition] = useState([32.0853, 34.7818]);
    const [loading, setLoading] = useState(false);

    // לא מאפשרת הקשת תווים אחרים מלבד ספרות
    function handleKeyDown(e) {
        if (!((e.key >= "0" && e.key <= "9") || ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key))) {
            e.preventDefault();
        }
    }
    // בעת טעינת הדף זמן את הפונקציה למציאת מיקום נוכחי
    useEffect(() => {
        getCurrentPosition();
    }, [])

    // פונקציה לקבלת קוארדנטות של מיקום נוכחי
    async function getCurrentPosition() {
        try {
            await fetch('http://ip-api.com/json/').then(data => data.json()).then(data => {
                const currentP = [data.lat, data.lon];
                setPosition(currentP);
                return currentP;
            }
            )
         
        }

        catch {
            (err => {
                console.log("it'snt success get current position " + err);

            });
        }
    }
    // התחברות לשרת המציג כתובות לבחירה
    function shwOptions(e) {
        setLoading(true);
        setValue("address", e.target.value);
        const address = getValues("address");
        let url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}&limit=6`;
        fetch(url).then(res => res.json())
            .then(data => {
                setLoading(false);
                // וכו lat ,display_name שומר לי מערך אובייקטים שכל אובייקט מכיל שדות רבות כמו 
                setSuggestName(data);

            })
            .catch(err => {
                console.log("cannot show options " + err);
            })
    }
    // שומרת את הקוארדינטות של הכתובת שנבחרה מתוך הסלקט
    // STATE ומעדכנת ב
    function saveAddress(e) {
        const location = suggestName.find(s => s.display_name === e);
        const coordinates = location ? [location.lat, location.lon] : null;
        if (coordinates) {
            setPosition(coordinates);
            setValue("display_name", e);
            setValue("lat", coordinates[0]);
            setValue("lon", coordinates[1]);
        }

    }
    // שומר את תוכן המסמך ומוסיף אותו לרשימת USERS
    function save() {
        const formData = getValues();
        console.log(formData);
        addToArrUsers(formData);
        reset();
        setSuggestName([]);
    }

    return (
        <div className="form-container">
            <form className="form" onSubmit={handleSubmit(save)}>
                <input {...register('userName', { required: { value: true, message: "Name is required" } })}
                    className="form-input"
                    placeholder="Username" />
                {errors.userName && <div className="form-error">{errors.userName.message}</div>}

                <input {...register('address', { required: true })}
                    className="form-input"
                    placeholder="Address" onBlur={(e) => shwOptions(e)} />
                {loading ? (<p>Loading...</p>) : (
                    suggestName.length > 0 && (
                        <select onClick={(e) => saveAddress(e.target.value)} className="form-select">
                            {suggestName.map((btn) => (
                                <option key={btn.osm_id} value={btn.display_name}>{btn.display_name}</option>
                            ))}
                        </select>
                    ))}
                <input {...register('phone', {
                    required: { value: true, message: "Phone is required" },
                    validate: (v) => { return v.length >= 7 || "The phone should be at least 7 digits" },
                    pattern: { value: /^[0-9]*$/ }
                })}
                    onKeyDown={handleKeyDown}
                    className="form-input"
                    placeholder="Phone" />
                {errors.phone && <div className="form-error">{errors.phone.message}</div>}

                <input {...register('email', {
                    required: { value: true, message: "Email is required" },
                    pattern: {
                        value: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/,
                        message: "Not correct email"
                    }
                })}
                    type="email"
                    className="form-input"
                    placeholder="Email" />
                {errors.email && <div className="form-error">{errors.email.message}</div>}

                <div className="form-checkbox-container">
                    <input {...register("isOnline")}
                        type="checkbox" className="form-checkbox" />
                    <label className="form-label">Internet</label>
                </div>

                <div className="form-checkbox-container">
                    <input {...register("isCoffeeMechine")}
                        type="checkbox" className="form-checkbox" />
                    <label className="form-label">Coffee Machine</label>
                </div>

                <input {...register("amountRooms")}
                    type="number" className="form-input"
                    placeholder="Amount of Rooms" />
                <input {...register("distance")}
                    type="number" className="form-input"
                    placeholder="Distance" />
                <input {...register("submit")}
                    disabled={!isValid}
                    value={"שליחה"} className="form-submit" type="submit" />
            </form>
            <div className="map-container">
                <Map position={position} />
            </div>
        </div>
    );
}

export default FormNew;
