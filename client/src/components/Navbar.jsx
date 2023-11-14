import React, { useContext, useEffect, useState } from 'react'
import { ProductContext } from '../context/ProductContext'
import { Link } from 'react-router-dom';


export const Navbar = () => {
    const { connectWallet, currentAccount, products, createEtheruemContext } = useContext(ProductContext);
    console.log(products);

    // const [reviewCoolDown,setReviewCoolDown] = useState("");

    // useEffect(()=>{
    //     const productsContract = createEtheruemContext(); 
    //     const fetchReviewCoolDown = async() =>{
    //         const reviewcool = await productsContract.getReviewCooldownTime();
    //         console.log(reviewcool);
    //     }
    //     fetchReviewCoolDown()
    // })

    return (
        <nav className='flex justify-between items-center bg-black opacity-80 p-6'>
            <Link to="/">
                <h1 className='text-white text-3xl font-semibold'>Product<span className='text-blue-600'>Peek</span></h1>
            </Link>
            <div className='flex gap-4'>
                {
                    currentAccount == '0xaffd5414fe9ef3987da8a8f1a0c298a8d47efc8c' ?
                        (
                            <Link to={"/addproduct"} className='text-white px-4 py-2 bg-blue-600 rounded-md hover:scale-105 transition-all duration-300 cursor-pointer'>Add Product</Link>
                        ) : ""
                }
                {
                    currentAccount ? (
                        <div className='relative group'>
                            <p className='text-white px-4 py-2 bg-blue-600 rounded-md hover:scale-105 transition-all duration-300 cursor-pointer'>
                                Account
                            </p>
                            <p className='absolute p-8 top-20 right-2 bg-slate-700 text-white opacity-0 group-hover:opacity-100 transition-all duration-300'>
                                <span className='text-red-500 font-semibold'>Address:</span>{currentAccount}
                            </p>
                        </div>
                    ) : (
                        <button className='px-4 py-2 border bg-blue-500 text-white'
                            onClick={() => connectWallet()}
                        >Connect Wallet</button>
                    )
                }
            </div>
        </nav>
    )
}
