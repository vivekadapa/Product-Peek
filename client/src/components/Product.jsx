import React, { useContext, useEffect, useState } from 'react';
import { ProductContext } from '../context/ProductContext';
import { useParams } from 'react-router-dom';
import { uploadTextToIPFS, fetchFileFromIPFS } from '../utils/IPFSConnection';

export const Product = () => {
    const { currentAccount, createEthereumContract } = useContext(ProductContext)
    const { id } = useParams();

    const [productById, setProductById] = useState('');
    const [reviewCoolDown, setReviewCoolDown] = useState(0);
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
        const cid = await uploadTextToIPFS(addReview.review);
        const res = await productContract.addReview(id, cid, addReview.rating);
        console.log(res);

        // If the review was successfully added, update the state with the new review object
        // if (res) {
        //     const data = await fetchFileFromIPFS(res.ipfsContentHash);
        //     const newReview = {
        //         rating: res.rating,
        //         reviewer: res.reviewer,
        //         content: data,
        //     };
        //     setReviewObjects([...reviewObjects, newReview]);
        // }
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
                const obj = {
                    rating: review.rating,
                    reviewer: review.reviewer,
                    content: data,
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
                <a href={productById.productUrl} className='inline-block' target='_blank'>Amazon Url</a>
            </div>
            <div className='p-4 border-2 flex flex-col max-w-xl mx-auto mt-8 gap-4'>
                <input type="number" className='border-2 px-4 py-2' placeholder='Give Rating from 1 to 5' name='rating' min={1} max={5} onChange={(e) => handleChange(e, 'rating')} required />
                <textarea name="review" className='border-2 px-4 py-2' placeholder='Your Detailed Review of the Product' id="" cols="20" rows="5" onChange={(e) => handleChange(e, 'review')} required></textarea>
                <button className='px-4 py-2 bg-blue-500 text-white' onClick={handleSubmit}>Add Review</button>
            </div>
            <h1 className='mt-8 text-2xl font-semibold text-center'>Reviews</h1>
            <div className='max-w-2xl mx-auto'>
                {reviewObjects.map((review, index) => (
                    <div key={index} className='mt-4 border-2 p-4'>
                        <p>Reviewer: {review.reviewer}</p>
                        <p>Rating: {review.rating}</p>
                        <p>Review: {review.content}</p>
                        {/* <button className='bg-red-500 px-4 py-2 text-white mt-4 rounded' onClick={(id) => handleDelete(id)}>Delete Review</button> */}
                    </div>
                ))}
            </div>
        </div>
    )
}
