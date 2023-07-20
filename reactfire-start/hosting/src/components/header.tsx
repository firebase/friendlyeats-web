import { Auth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth, useUser, useFirestore } from 'reactfire';
import FriendlyEatsLogo from '../assets/friendly-eats.svg';
import MenuIcon from '../assets/menu.svg';
import { useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';

const Header = () => {
    // Auth
    const auth = null;
    const user = null;

    const signOut = (auth: Auth) => {
        // TODO: complete function
    };

    const signIn = async (auth: Auth) => {
        // TODO: complete function
    };

    // Firestore 
    const firestore = null;

    const addRestaurant = (data: any) => {
        // TODO: complete function
    };

    const navigate = useNavigate();

    const getRandomItem = (arr: any) => {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    const addMockRestaurants = () => {
        const promises = [];
        for (let i = 0; i < 20; i++) {
            const name =
        getRandomItem(restaurantData.words) +
        ' ' +
        getRandomItem(restaurantData.words);
            const category = getRandomItem(restaurantData.categories);
            const city = getRandomItem(restaurantData.cities);
            const price = Math.floor(Math.random() * 4) + 1;
            const photoID = Math.floor(Math.random() * 22) + 1;
            const photo =
        'https://storage.googleapis.com/firestorequickstarts.appspot.com/food_' +
            photoID + '.png';
            const numRatings = 0;
            const avgRating = 0;

            const promise = addRestaurant({
                name: name,
                category: category,
                price: price,
                city: city,
                numRatings: numRatings,
                avgRating: avgRating,
                photo: photo,
            });

            if (promise === null) {
                alert('addRestaurant() is not implemented yet!');
                return Promise.reject();
            } else {
                promises.push(promise);
            }
        }
    };

    useEffect(() => {
        if (user && user?.data) {
            console.log(`${user?.data?.displayName}`);
        }
    }, [user]);

    return (
        <header>
            <nav className="bg-navy-400 px-2 lg:px-4 py-2.5 h-18">
                <div className="flex flex-wrap justify-between items-center max-w-screen">
                    <a
                        href="#"
                        className="flex items-center"
                        onClick={() => navigate('/')}
                    >
                        <img
                            className="mr-3 h-10 sm:h-8"
                            src={FriendlyEatsLogo}
                            alt="FriendlyEats"
                        />
                        <span className="mr-3 self-center text-xl whitespace-nowrap font-light text-white">
                            Friendly Eats
                        </span>
                    </a>
                    <div className="flex flex-wrap items-end">
                        {user?.data ? (
                            <div className="flex flex-wrap justify-between text-white">
                                <img
                                    className="w-10 h-10 rounded-full"
                                    src={`${user?.data?.photoURL}`}
                                    alt={`${user?.data?.displayName}`}
                                />{' '}
                                <span className="text-white text-xl whitespace-nowrap font-light px-4 lg:px-5 py-2 lg:py-2.5">
                                    {user?.data?.displayName}
                                </span>{' '}
                                <div className="dropdown inline-block relativ ">
                                    <button className=" text-gray-700 py-2 px-4 rounded inline-flex items-center font-semibold">
                                        <img className="w-8 h-8 rounded-full" src={MenuIcon} />
                                    </button>
                                    <ul className="dropdown-menu absolute hidden text-gray-700 pt-3 w-48 right-2">
                                        <li className="bg-white p-4 flex-row">
                                            <img
                                                className="w-10 h-10 rounded-full"
                                                src={`${user?.data?.photoURL}`}
                                                alt={`${user?.data?.displayName}`}
                                            />{' '}
                                            <span className="text-navy-200 text-md whitespace-nowrap px-4 lg:px-5 py-2 lg:py-2.5 mr-6">
                                                {user?.data?.displayName}
                                            </span>{' '}
                                        </li>
                                        <li className="">
                                            <a
                                                className="rounded-b bg-white hover:bg-navy-20 py-3 p-4 block whitespace-no-wrap text-amber-900 font-semibold"
                                                href="#"
                                                onClick={() => {
                                                    addMockRestaurants();
                                                    navigate('/');
                                                }}
                                            >
                                                Add Random Items
                                            </a>
                                        </li>
                                        <li className="">
                                            <a
                                                className="bg-white hover:bg-navy-20 py-3 px-4 block whitespace-no-wrap text-navy-500 font-semibold"
                                                href="#"
                                                onClick={() => signOut(auth)}
                                            >
                                                Logout
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <a
                                href="#"
                                className="text-white text-xl whitespace-nowrap font-light px-4 lg:px-5 py-2 lg:py-2.5 mr-6"
                                onClick={() => signIn(auth)}
                            >
                                Log in
                            </a>
                        )}
                    </div>
                </div>
            </nav>
            <Outlet context={user?.data?.uid} />
        </header>
    );
};

export default Header;

const restaurantData = {
    words: [
        'Bar',
        'Fire',
        'Grill',
        'Drive Thru',
        'Place',
        'Best',
        'Spot',
        'Prime',
        'Eatin\'',
    ],
    cities: [
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
    categories: [
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
    ratings: [
        {
            rating: 1,
            text: 'Would never eat here again!',
        },
        {
            rating: 2,
            text: 'Not my cup of tea.',
        },
        {
            rating: 3,
            text: 'Exactly okay :/',
        },
        {
            rating: 4,
            text: 'Actually pretty good, would recommend!',
        },
        {
            rating: 5,
            text: 'This is my favorite place. Literally.',
        },
    ],
};
