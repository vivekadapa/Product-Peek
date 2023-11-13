import React, { useContext, useEffect, useState } from 'react';
import { ProductContext } from '../context/ProductContext';
import { useParams } from 'react-router-dom';
import { uploadTextToIPFS, fetchFileFromIPFS } from '../utils/IPFSConnection';
import { FaRegUserCircle } from 'react-icons/fa';

export const Product = () => {
    const { currentAccount, createEthereumContract } = useContext(ProductContext)
    const { id } = useParams();

    const [productById, setProductById] = useState('');
    const [reviewCoolDown, setReviewCoolDown] = useState(0);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [addReview, setAddReview] = useState({
        rating: 1, // Initialize rating
        review: '', // Initialize review
    });

    const handleChange = (e, name) => {
        setAddReview({ ...addReview, [name]: e.target.value });
    }

    const [reviewObjects, setReviewObjects] = useState([]);

    async function handleSubmit() {
        const productContract = createEthereumContract();

        try {
            const cid = await uploadTextToIPFS(addReview.review);
            const res = await productContract.addReview(id, cid, addReview.rating);
            // console.log(res);   
            setError(null)
        } catch (error) {
            console.log(error)
            if (error instanceof Error && error.message.includes("execution reverted:")) {
                setError("You Already have review for this product")
            } else {
                setError("Error adding review. Please try again.");
            }

        }
    }

    useEffect(() => {
        const productsContract = createEthereumContract();

        const fetchReviewCoolDown = async () => {
            const reviewcool = await productsContract.getReviewCoolDownTime();
            console.log(reviewcool.toNumber());
        }

        const fetchProductAndReviews = async () => {
            const pById = await productsContract.getProductById(id);
            setProductById(pById);

            const reviewsById = await productsContract.getProductReviews(id);
            const reviewObjects = [];
            for (const review of reviewsById) {
                const data = await fetchFileFromIPFS(review.ipfsContentHash);
                const date = new Date(review.timestamp * 1000)
                // console.log(date.toLocaleDateString())
                // console.log(date.toLocaleTimeString())
                const obj = {
                    rating: review.rating,
                    reviewer: review.reviewer,
                    content: data,
                    time: date.toLocaleTimeString(),
                    date: date.toLocaleDateString()
                };
                reviewObjects.push(obj);
            }
            setReviewObjects(reviewObjects);
        }

        fetchProductAndReviews();
        fetchReviewCoolDown();
    }, []);

    async function handleDelete(id) {
        const productContext = createEthereumContract();
        const res = await productContext.deleteReview(id);
        console.log(res);
    }

    return (
        <div className='px-8 py-8'>
            <div className='p-4 border-2 max-w-xl mx-auto flex flex-col gap-4'>
                <p className='font-semibold text-2xl'>{productById.name}</p>
                <p className='font-light '>{productById.description}</p>
                <a href={productById.productUrl} className='inline-block' target='_blank'>Link To Amazon </a>
            </div>
            <div className='p-4 border-2 flex flex-col max-w-xl mx-auto mt-8 gap-4'>
                <input type="number" className='border-2 px-4 py-2' placeholder='Give Rating from 1 to 5' name='rating' min={1} max={5} onChange={(e) => handleChange(e, 'rating')} required />
                <textarea name="review" className='border-2 px-4 py-2' placeholder='Your Detailed Review of the Product' id="" cols="20" rows="5" onChange={(e) => handleChange(e, 'review')} required></textarea>
                <button className='px-4 py-2 bg-blue-500 text-white' onClick={handleSubmit}>Add Review</button>
                {error && <p className="text-red-500">{error}</p>}
            </div>
            <h1 className='mt-8 text-2xl font-semibold text-center'>Reviews</h1>
            <div className='max-w-4xl mx-auto'>
                {reviewObjects.map((review, index) => (
                    <div key={index} className='flex flex-col gap-4 mt-4 border-2 p-4'>
                        <div className='flex items-center justify-between gap-2'>
                            <div className='flex items-center gap-2'>
                                <p className='text-2xl'><FaRegUserCircle /></p>
                                <p>{review.reviewer}</p>
                            </div>
                            <div className='flex gap-2 text-sm'>
                                <p>Reviewed On:</p>
                                <p>{review.time}</p>
                                <p>{review.date}</p>
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <p>{review.content}</p>
                            <div className="flex gap-2">
                                {[...Array(review.rating)].map((_, i) => (
                                    <img key={i} src="/star.svg" alt="star" className="w-5 h-5" />
                                ))}
                            </div>
                        </div>
                        {/* <button className='bg-red-500 px-4 py-2 text-white mt-4 rounded' onClick={(id) => handleDelete(id)}>Delete Review</button> */}
                    </div>
                ))}
            </div>
        </div>
    )
}
