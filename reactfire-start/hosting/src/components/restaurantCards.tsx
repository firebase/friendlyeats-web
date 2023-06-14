import { useNavigate } from 'react-router-dom';

const RestaurantCards = ({ restaurants, displayCol }: any) => {
    const navigate = useNavigate();

    return (
        <>
            <div
                className={`h-full w-full grid ${
                    displayCol ? 'grid-cols-3 gap-3' : 'grid-cols-1'
                } justify-items-center`}
            >
                {restaurants?.map((restaurant: any) => {
                    return displayCol ? (
                        <ColCard restaurant={restaurant} navigate={navigate} />
                    ) : (
                        <RowCard restaurant={restaurant} navigate={navigate} />
                    );
                })}
            </div>
        </>
    );
};

export default RestaurantCards;

const ColCard = ({ restaurant, navigate }: any) => {
    return (
        <>
            <div
                key={restaurant.name + restaurant.city + restaurant.type + '-col'}
                className="bg-white w-4/5 hover:cursor-pointer h-[450px] mt-10 transition duration-300 ease-in-out hover:shadow-lg dark:hover:shadow-black/3 overflow-auto"
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
            >
                <img className="w-full h-3/5" src={restaurant.photo} />
                <p className="text-navy-600 font-light text-3xl pt-10 pb-4 px-8">
                    {restaurant.name}
                </p>
                <ul className="flex justify-start pl-8 py-2">
                    {renderStars(restaurant.avgRating)}
                    <p className="text-gray-400 font-light pt-2 px-2">{`(${restaurant.numRatings})`}</p>
                </ul>
                <div className="flex w-full place-content-between">
                    <p className="text-navy-900 font-semibold px-8">
                        {restaurant.category} · {restaurant.city}
                    </p>
                    <p className="font-semibold px-6">{renderPrice(restaurant.price)}</p>
                </div>
            </div>
        </>
    );
};

const RowCard = ({ restaurant, navigate }: any) => {
    return (
        <>
            <div
                key={restaurant.name + restaurant.city + restaurant.type + '-row'}
                className="bg-white w-4/5 hover:cursor-pointer h-32 mt-4 transition duration-300 ease-in-out hover:shadow-lg dark:hover:shadow-black/30 flex overflow-auto"
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
            >
                <img className="w-1/6 h-full" src={restaurant.photo} />
                <div className="p-3 w-full">
                    <p className="text-navy-600 font-light text-3xl pl-6">
                        {restaurant.name}
                    </p>
                    <ul className="flex justify-start pl-6 py-2">
                        {renderStars(restaurant.avgRating)}
                        <p className="text-gray-400 font-light pt-2 px-2">{`(${restaurant.numRatings})`}</p>
                    </ul>
                    <div className="flex w-full place-content-between">
                        <p className="text-navy-900 font-semibold px-6">
                            {restaurant.category} · {restaurant.city}
                        </p>
                        <p className="font-semibold px-6">
                            {renderPrice(restaurant.price)}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
const renderPrice = (price: number) => {
    let str = '';
    for (let i = 0; i < price; i++) {
        str += '$';
    }
    return str;
};

const renderStars = (avgRating: number) => {
    const arr = [];
    for (let i = 0; i < 5; i++) {
        if (i < Math.floor(avgRating)) {
            arr.push(
                <li>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-8 w-8 text-amber-400"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                        />
                    </svg>
                </li>
            );
        } else {
            arr.push(
                <li>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-8 w-8 text-amber-400"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                    </svg>
                </li>
            );
        }
    }
    return arr;
};
