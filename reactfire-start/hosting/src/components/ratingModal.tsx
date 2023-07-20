import { useState } from 'react';
import ReviewIcon from '../assets/review.svg';

const RatingModal = ({ addReview }: any) => {
    const [showModal, setShowModal] = useState(false);
    const [review, setReview] = useState({ rating: 0, review: '' });

    const onChange = (value: any, name: string) => {
        setReview({ ...review, [name]: value });
    };
    return (
        <>
            <div
                className="flex flex-wrap cursor-pointer mx-auto"
                onClick={() => setShowModal(true)}
            >
                <img
                    className="h-16 bg-amber-400 rounded-xl right-40 shadow-lg"
                    src={ReviewIcon}
                    alt={'Add review'}
                />
            </div>
            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative my-6 mx-auto max-w-3xl w-5/6">
                            <div className="border-0 shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-5 border-slate-200 rounded-t">
                                    <h3 className="text-lg font-semibold">Add a review</h3>
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
                                <ul className="flex justify-start mx-auto py-10">
                                    {[...Array(5)].map((_star, index) => {
                                        index += 1;
                                        return (
                                            <button
                                                type="button"
                                                key={index}
                                                onClick={() => onChange(index, 'rating')}
                                            >
                                                {index <= review.rating ? (
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
                                                ) : (
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
                                                )}
                                            </button>
                                        );
                                    })}
                                </ul>
                                <textarea
                                    id="message"
                                    onChange={(e) => onChange(e.target.value, 'review')}
                                    className="block p-2.5 w-3/4 text-sm text-gray-900 dark:placeholder-gray-400 border-b-2 border-amber-900 focus:ring-0 mx-auto"
                                    placeholder="Write your thoughts here..."
                                ></textarea>
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
                                            addReview(review);
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

export default RatingModal;
