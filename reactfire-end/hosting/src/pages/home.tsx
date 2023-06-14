import { useEffect, useState } from 'react';
import { useFirestoreCollectionData, useFirestore } from 'reactfire';
import { where, collection, orderBy, query } from 'firebase/firestore';
import FilterModal from '../components/filterModal';
import RestaurantCards from '../components/restaurantCards';

const Home = () => {
    const [filters, setFilters] = useState({
        category: '',
        city: '',
        price: '',
        sort: 'Rating',
    });

    // Read from Firestore
    const firestore = useFirestore();
    const getFilteredRestaurants = () => {
        let q = query(collection(firestore, 'restaurants'));
        if (filters.category !== '') {
            q = query(q, where('category', '==', filters.category));
        }
        if (filters.city !== '') {
            q = query(q, where('city', '==', filters.city));
        }
        if (filters.price !== '') {
            q = query(q, where('price', '==', filters.price.length));
        }
        if (filters.sort === 'Rating') {
            q = query(q, orderBy('avgRating', 'desc'));
        } else if (filters.sort === 'Reviews') {
            q = query(q, orderBy('numRatings', 'desc'));
        }
        return q;
    };

    const { data: restaurants } = useFirestoreCollectionData(
        getFilteredRestaurants(),
        {
            idField: 'id',
        }
    );
    
    useEffect(() => {
        console.log('fetching filters...');
    }, [filters]);

    const updateField = (type: string, value: string) => {
        setFilters({ ...filters, [type]: value });
    };

    const [displayCol, setDisplayCol] = useState(true);
    return (
        <div className="bg-navy-50 min-h-screen h-full ">
            <div className="w-3/4 bg-navy-20 min-h-screen h-full mx-auto">
                <div className="flex items-center justify-center p-4">
                    <FilterModal filters={filters} setFilters={setFilters} />
                    <label className="relative inline-flex items-center cursor-pointer mx-6">
                        <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            onChange={() => setDisplayCol(!displayCol)}
                        />
                        <div className="w-11 h-6 bg-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                <div className="flex items-start justify-start px-4 ml-32">
                    {Object.entries(filters).map(([type, value]) => {
                        if (type == 'sort' || value == '') {
                            return null;
                        }
                        return (
                            <Tag
                                key={value}
                                type={type}
                                value={value}
                                updateField={updateField}
                            />
                        );
                    })}
                </div>
                <RestaurantCards restaurants={restaurants} displayCol={displayCol} />
            </div>
        </div>
    );
};

export default Home;

const Tag = ({ type, value, updateField }: any) => {
    return (
        <span
            id={`${type}`}
            className="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-white bg-navy-300 rounded-full"
        >
            {value}
            <button
                type="button"
                className="inline-flex items-center p-0.5 ml-2 text-sm text-navy-20 bg-transparent rounded-full hover:bg-navy-300"
                data-dismiss-target={`#${type}`}
                aria-label="Remove"
                onClick={() => updateField(type, '')}
            >
                <svg
                    aria-hidden="true"
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    ></path>
                </svg>
                <span className="sr-only">Remove badge</span>
            </button>
        </span>
    );
};
