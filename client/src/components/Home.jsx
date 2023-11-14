import React, { useContext, useEffect, useState } from 'react';
import { ProductContext } from '../context/ProductContext';
import { ProductCard } from './ProductCard';

export const Home = () => {
  const { products, getProducts } = useContext(ProductContext);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getProducts();
  }, []);

  const handleSearch = (e) => {
    const inputText = e.target.value;
    setSearchText(inputText);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div className='mt-4 flex items-center justify-center'>
        <input
          type='text'
          className='w-96 px-4 py-2 border-2'
          onChange={handleSearch}
          placeholder='Search For Product'
        />
      </div>
      <div className='px-24 p-8 grid grid-cols-2 gap-4'>
        {searchText === '' ? (
          products.map((product, index) => (
            <ProductCard key={index} product={product} id={index} />
          ))
        ) : filteredProducts.length ? (
          filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} id={index} />
          ))
        ) : (
          <p>No matching products found.</p>
        )}
      </div>
    </div>
  );
};
