import React, { useContext, useEffect, useState } from 'react'
import { ProductContext } from '../context/ProductContext'
import { Link } from 'react-router-dom'
import { AiOutlineStar } from 'react-icons/ai'

export const ProductCard = ({ product, id }) => {
    const { createEthereumContract } = useContext(ProductContext)
    // const [reviews, setReviews] = useState([])
    const [rating, setRating] = useState([])
    const [numReviews, setNumReviews] = useState(0);
    useEffect(() => {
        const getAllReviews = async (id) => {
            try {
                if (ethereum) {
                    const productsContract = createEthereumContract();
                    const reviewsById = await productsContract.getProductReviews(id);
                    let avgRate = 0;
                    if (reviewsById.length !== 0) {
                        for (var i = 0; i < reviewsById.length; i++) {
                            avgRate = avgRate + reviewsById[i].rating;
                        }
                        setRating(avgRate / reviewsById.length);
                    }
                    // setReviews(allReviews);
                    setNumReviews(reviewsById.length);
                }
                else {
                    console.log("Ethereum is not present");
                }
            } catch (error) {
                console.log(error)
            }
        }
        getAllReviews(id)
    }, [])
    // console.log(reviews);
    console.log(numReviews);
    console.log(rating)
    console.log(product)
    console.log(product.productUrl)
    const starIcons = Array.from({ length: rating }, (_, index) => (
        <img src="/star.svg" key={index} />
    ));

    return (
        <div className='max-w-xl border-2 p-4 flex flex-col gap-2'>
            <p> <span className='font-semibold'>Product Id:</span>{id}</p>
            <div className='flex justify-between'>
                <Link to={`/product/${id}`} className='block'><p><span className='font-semibold'>Name:</span> <span className='hover:border-b-2 hover:text-[1.05rem] transition duration-300 border-blue-600'>{product.name}</span> </p></Link>
                {
                    rating == 0 ? (
                        <p>No Reviews Yet</p>
                    ) : (

                        <div className='flex items-center'>
                            <p>{rating}</p>
                            <p className='flex' >{starIcons}</p>
                        </div>
                    )
                }
            </div>
            <p> <span className='font-semibold'> Description:</span>{product.description}</p>
            <span className='font-semibold'>Visit Amazon:</span><a href={product.productUrl} className='text-blue-600' target='_blank'>Product Url</a>

        </div>
    )
}
