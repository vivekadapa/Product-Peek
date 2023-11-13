import React, { useContext, useEffect } from 'react'
import { ProductContext } from '../context/ProductContext'
import { ProductCard } from './ProductCard'


export const Home = () => {

    const { products,getProducts } = useContext(ProductContext)
    console.log(products)

    

    useEffect(()=>{
        getProducts()
    })
    return (
        <div className='px-24 p-8 grid grid-cols-2 gap-4'>
            {  
             products.length ? (
                products.map((product,index)=>(
                    <ProductCard key={index} product={product} id={index} />
                ))
             )
             :
             (<p>No Products</p>)
            }
        </div>
    )
}
