import React, { useState, useRef, useEffect } from 'react';
import './CityDropdown.css';

const CityDropdown = ({ value, onChange, placeholder = "Search city..." }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    // Cities list
    const Cities = [
        'Islamabad', 'Ahmed Nager', 'Ahmadpur East', 'Ali Khan', 'Alipur', 'Arifwala', 'Attock',
        'Bhera', 'Bhalwal', 'Bahawalnagar', 'Bahawalpur', 'Bhakkar', 'Burewala', 'Chillianwala',
        'Chakwal', 'Chichawatni', 'Chiniot', 'Chishtian', 'Daska', 'Darya Khan', 'Dera Ghazi',
        'Dhaular', 'Dina', 'Dinga', 'Dipalpur', 'Faisalabad', 'Fateh Jhang', 'Ghakhar Mandi',
        'Gojra', 'Gujranwala', 'Gujrat', 'Gujar Khan', 'Hafizabad', 'Haroonabad', 'Hasilpur',
        'Haveli Lakha', 'Jalalpur Jattan', 'Jampur', 'Jaranwala', 'Jhang', 'Jhelum', 'Kalabagh',
        'Karor Lal', 'Kasur', 'Kamalia', 'Kamoke', 'Khanewal', 'Khanpur', 'Kharian', 'Khushab',
        'Kot Adu', 'Jauharabad', 'Lahore', 'Lalamusa', 'Layyah', 'Liaquat Pur', 'Lodhran',
        'Malakwal', 'Mamoori', 'Mailsi', 'Mandi Bahauddin', 'Mian Channu', 'Mianwali', 'Multan',
        'Murree', 'Muridke', 'Muzaffargarh', 'Narowal', 'Okara', 'Renala Khurd', 'Pakpattan',
        'Pattoki', 'Pir Mahal', 'Qaimpur', 'Qila Didar', 'Rabwah', 'Raiwind', 'Rajanpur',
        'Rahim Yar', 'Rawalpindi', 'Sadiqabad', 'Safdarabad', 'Sahiwal', 'Sangla Hill',
        'Sarai Alamgir', 'Sargodha', 'Shakargarh', 'Sheikhupura', 'Sialkot', 'Sohawa',
        'Soianwala', 'Siranwali', 'Talagang', 'Taxila', 'Toba Tek', 'Vehari', 'Wah Cantonment',
        'Wazirabad', 'Badin', 'Bhirkan', 'Rajo Khanani', 'Chak', 'Dadu', 'Digri', 'Diplo',
        'Dokri', 'Ghotki', 'Haala', 'Hyderabad', 'Islamkot', 'Jacobabad', 'Jamshoro',
        'Jungshahi', 'Kandhkot', 'Kandiaro', 'Karachi', 'Kashmore', 'Keti Bandar', 'Khairpur',
        'Kotri', 'Larkana', 'Matiari', 'Mehar', 'Mirpur Khas', 'Mithani', 'Mithi', 'Mehrabpur',
        'Moro', 'Nagarparkar', 'Naudero', 'Naushahro Feroze', 'Naushara', 'Nawabshah',
        'Nazimabad', 'Qambar', 'Qasimabad', 'Ranipur', 'Ratodero', 'Rohri', 'Sakrand',
        'Sanghar', 'Shahbandar', 'Shahdadkot', 'Shahdadpur', 'Shahpur Chakar', 'Shikarpaur',
        'Sukkur', 'Tangwani', 'Tando Adam', 'Tando Allahyar', 'Tando Muhammad', 'Thatta',
        'Umerkot', 'Warah', 'Abbottabad', 'Adezai', 'Alpuri', 'Akora Khattak', 'Ayubia',
        'Banda Daud', 'Bannu', 'Batkhela', 'Battagram', 'Birote', 'Chakdara', 'Charsadda',
        'Chitral', 'Daggar', 'Dargai', 'Dera Ismail', 'Doaba', 'Dir', 'Drosh', 'Hangu',
        'Haripur', 'Karak', 'Kohat', 'Kulachi', 'Lakki Marwat', 'Latamber', 'Madyan',
        'Mansehra', 'Mardan', 'Mastuj', 'Mingora', 'Nowshera', 'Paharpur', 'Pabbi', 'Peshawar',
        'Saidu Sharif', 'Shorkot', 'Shewa Adda', 'Swabi', 'Swat', 'Tangi', 'Tank', 'Thall',
        'Timergara', 'Tordher', 'Awaran', 'Barkhan', 'Chagai', 'Dera Bugti', 'Gwadar',
        'Harnai', 'Jafarabad', 'Jhal Magsi', 'Kacchi', 'Kalat', 'Kech', 'Kharan', 'Khuzdar',
        'Killa Abdullah', 'Killa Saifullah', 'Kohlu', 'Lasbela', 'Lehri', 'Loralai', 'Mastung',
        'Musakhel', 'Nasirabad', 'Nushki', 'Panjgur', 'Pishin Valley', 'Quetta', 'Sherani',
        'Sibi', 'Sohbatpur', 'Washuk', 'Zhob', 'Ziarat',
    ].sort();

    const filtered = query.length > 0
        ? Cities.filter(c => c.toLowerCase().includes(query.toLowerCase()))
        : Cities;

    // Close on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
                setQuery('');
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSelect = (city) => {
        onChange(city);
        setOpen(false);
        setQuery('');
    };

    const handleOpen = () => {
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    return (
        <div className="city-drop" ref={wrapperRef}>
            {/* Trigger */}
            <div
                className={`city-drop__trigger ${open ? 'city-drop__trigger--open' : ''} ${value ? 'city-drop__trigger--selected' : ''}`}
                onClick={handleOpen}
            >
                <span className={`city-drop__value ${!value ? 'city-drop__placeholder' : ''}`}>
                    {value || placeholder}
                </span>
                <span className={`city-drop__arrow ${open ? 'city-drop__arrow--up' : ''}`}>▾</span>
            </div>

            {/* Dropdown */}
            {open && (
                <div className="city-drop__menu">
                    <div className="city-drop__search-wrap">
                        <span className="city-drop__search-icon">🔍</span>
                        <input
                            ref={inputRef}
                            className="city-drop__search"
                            type="text"
                            placeholder="Type to search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {query && (
                            <button className="city-drop__clear" onClick={() => setQuery('')}>✕</button>
                        )}
                    </div>
                    <div className="city-drop__list">
                        {filtered.length > 0 ? (
                            filtered.map((city) => (
                                <div
                                    key={city}
                                    className={`city-drop__item ${value === city ? 'city-drop__item--selected' : ''}`}
                                    onClick={() => handleSelect(city)}
                                >
                                    {value === city && <span className="city-drop__check">✓</span>}
                                    {city}
                                </div>
                            ))
                        ) : (
                            <div className="city-drop__empty">No city found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CityDropdown;