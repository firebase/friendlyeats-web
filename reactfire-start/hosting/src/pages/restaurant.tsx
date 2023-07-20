import {
    useFirestoreCollectionData,
    useFirestore,
    useStorage,
} from 'reactfire';
import {
    doc,
    collection,
    runTransaction,
    getDoc,
    updateDoc,
} from 'firebase/firestore';
import { useOutletContext, useParams } from 'react-router-dom';
import RatingModal from '../components/ratingModal';
import { JSX } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import AddIcon from '../assets/add.svg';

const Restaurant = () => {
    const uid = useOutletContext();
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState<any>();

    // Firestore
    const firestore = useFirestore();
    const getRestaurant = () => {
        // TODO: complete function
    };

    const { data: reviews } = { data: [] };

    // Storage
    const storage = useStorage();

    const updateRestaurantImage = async (target: HTMLInputElement) => {
        // TODO: complete function
    };

    const addReview = (review: any) => {    
        // TODO: complete function
    };

    useEffect(() => {
        getRestaurant();
    }, [uid]);

    return (
        <div className="bg-navy-20 min-h-screen">
            <div className="relative w-full">
                <img className="w-full h-[400px]" src={restaurant?.photo} />
                <div className="absolute bottom-0 left-0 right-0 px-4 py-2 h-full bg-gradient-to-tr from-navy-400">
                    <div className="absolute bottom-0 h-1/2">
                        <p className="text-white font-light text-3xl pt-10 px-8">
                            {restaurant?.name}
                        </p>
                        <ul className="flex justify-start pl-8 py-2">
                            {renderStars(restaurant?.avgRating)}
                            <p className="text-white font-light pt-2 px-2">{`(${restaurant?.numRatings})`}</p>
                        </ul>
                        <p className="text-white px-8">
                            {restaurant?.category} · {restaurant?.city}
                        </p>
                        <p className="text-white px-8">{renderPrice(restaurant?.price)}</p>
                    </div>
                    <div className="flex absolute bottom-[-30px] flex-row right-0 justify-end w-1/3">
                        <RatingModal addReview={addReview} />
                        <label
                            onChange={(event) =>
                                updateRestaurantImage(event.target as HTMLInputElement)
                            }
                            htmlFor="upload-image"
                            className=" bg-amber-800 w-16 h-16 rounded-full cursor-pointer shadow-lg mx-auto"
                        >
                            <input
                                name=""
                                type="file"
                                id="upload-image"
                                className="file-input hidden w-full h-full"
                            />
                            <img className="w-16 h-16" src={AddIcon} alt="Upload image" />
                        </label>
                    </div>
                </div>
            </div>
            <div className="w-3/4 h-full mx-auto">
                {reviews?.map((rating) => (
                    <Rating rating={rating} />
                ))}
            </div>
        </div>
    );
};

export default Restaurant;

const Rating = ({ rating }: any) => {
    return (
        <>
            <div className={'border-b border-gray-400 py-10 justify-self-end'}>
                <ul className="flex justify-start pl-8 py-2">
                    {renderStars(rating.rating)}
                </ul>
                <p className="pl-8">{rating.review}</p>
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
    const arr: JSX.Element[] = [];
    {
        [...Array(5)].map((_e, i) => {
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
        });
    }
    return arr;
};
