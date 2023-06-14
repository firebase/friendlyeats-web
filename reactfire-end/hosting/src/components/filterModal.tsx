import { useState } from 'react';
import FilterIcon from '../assets/filter.svg';
import ArrowDownIcon from '../assets/arrowDown.svg';
import FoodIcon from '../assets/food.svg';
import LocationIcon from '../assets/location.svg';
import PriceIcon from '../assets/price.svg';
import SortByIcon from '../assets/sortBy.svg';

const FilterModal = ({ filters, setFilters }: any) => {
    const [showModal, setShowModal] = useState(false);
    const [editFilter, setEditFilter] = useState(filters);

    const onChange = (value: string, name: string) => {
        setEditFilter({ ...editFilter, [name]: value });
    };

    return (
        <>
            <div
                className="flex flex-wrap bg-navy-10 px-3 py-2 border-b border-navy-600 mr-1 mb-1 ease-linear transition-all duration-150 w-4/5 shadow-sm justify-between cursor-pointer"
                onClick={() => setShowModal(true)}
            >
                <div className="flex flex-wrap">
                    <img className="h-12" src={FilterIcon} alt="Filter restaurants" />
                    <div className="flex-row ml-5">
                        <p className="font-light text-xl">Restaurants</p>
                        <p className="text-navy-500 font-semibold text-sm">
                            Sorted by {filters.sort}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center">
                    <img className="h-8" src={ArrowDownIcon} alt="Filter restaurants" />
                </div>
            </div>
            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative my-6 mx-auto max-w-3xl w-5/6">
                            <div className="border-0 shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-5 border-slate-200 rounded-t">
                                    <h3 className="text-lg font-semibold">Filters</h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto ">
                                    <ModalSelect
                                        name="category"
                                        icon={FoodIcon}
                                        editFilter={editFilter}
                                        onChange={onChange}
                                    />
                                    <ModalSelect
                                        name="city"
                                        icon={LocationIcon}
                                        editFilter={editFilter}
                                        onChange={onChange}
                                    />
                                    <ModalSelect
                                        name="price"
                                        icon={PriceIcon}
                                        editFilter={editFilter}
                                        onChange={onChange}
                                    />
                                    <ModalSelect
                                        name="sort"
                                        icon={SortByIcon}
                                        editFilter={editFilter}
                                        onChange={onChange}
                                    />
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6">
                                    <button
                                        className="text-navy-50 background-transparent uppercase px-6 py-2 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-amber-900 text-white active:bg-amber-900 font-light uppercase px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            setFilters(editFilter);
                                            setShowModal(false);
                                        }}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-75 fixed inset-0 z-40 bg-navy-600"></div>
                </>
            ) : null}
        </>
    );
};

export default FilterModal;
const ModalSelect = ({ name, icon, onChange, editFilter }: any) => {
    return (
        <div className="my-4 text-slate-500 text-lg leading-relaxed flex flex-row">
            <img className="h-16" src={icon} alt={`Restaurant ${name}`} />
            <div className="w-full mx-2">
                <label
                    htmlFor={name}
                    className="block mb-2 text-xs font-light text-gray-600"
                >
                    {name}
                </label>
                <select
                    id={name}
                    className="text-gray-900 text-sm border-b-2 block w-full px-2.5 py-2"
                    defaultValue={editFilter[name]}
                    onChange={(event) => onChange(event.target.value, name)}
                >
                    {filterTemplate[name].map((item: string) => {
                        return (
                            <option value={item} key={item}>
                                {item == '' ? 'All ' + item : item}
                            </option>
                        );
                    })}
                </select>
            </div>
        </div>
    );
};
const filterTemplate: any = {
    category: [
        '',
        'Brunch',
        'Burgers',
        'Coffee',
        'Deli',
        'Dim Sum',
        'Indian',
        'Italian',
        'Mediterranean',
        'Mexican',
        'Pizza',
        'Ramen',
        'Sushi',
    ],
    city: [
        '',
        'Albuquerque',
        'Arlington',
        'Atlanta',
        'Austin',
        'Baltimore',
        'Boston',
        'Charlotte',
        'Chicago',
        'Cleveland',
        'Colorado Springs',
        'Columbus',
        'Dallas',
        'Denver',
        'Detroit',
        'El Paso',
        'Fort Worth',
        'Fresno',
        'Houston',
        'Indianapolis',
        'Jacksonville',
        'Kansas City',
        'Las Vegas',
        'Long Island',
        'Los Angeles',
        'Louisville',
        'Memphis',
        'Mesa',
        'Miami',
        'Milwaukee',
        'Nashville',
        'New York',
        'Oakland',
        'Oklahoma',
        'Omaha',
        'Philadelphia',
        'Phoenix',
        'Portland',
        'Raleigh',
        'Sacramento',
        'San Antonio',
        'San Diego',
        'San Francisco',
        'San Jose',
        'Tucson',
        'Tulsa',
        'Virginia Beach',
        'Washington',
    ],
    price: ['', '$', '$$', '$$$', '$$$$', '$$$$$'],
    sort: ['Rating', 'Review'],
};
