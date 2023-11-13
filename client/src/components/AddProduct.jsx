import React, { useContext, useEffect, useState } from 'react';
import { ProductContext } from '../context/ProductContext';

export const AddProduct = () => {
  const [product, setProduct] = useState({});
  const { createEthereumContract,products,getProducts } = useContext(ProductContext);

  function handleChange(e, name) {
    setProduct({ ...product, [name]: e.target.value });
  }

  async function handleSubmit() {
    console.log('Product:', product);
    const productsContract = createEthereumContract();
    const res = await productsContract.addProduct(product.pName, product.pDescription, product.productUrl);
    console.log(res);
  }

  useEffect(()=>{
        getProducts()
  },[products])
  

  return (
    <div className='min-h-screen   flex items-center justify-center flex-col w-screen'>
      <div className='p-6 gap-2 flex flex-col border-2 border-green-500'>
        <input
          type="text"
          placeholder="product Name"
          name="pName"
          className='border-2 px-4 py-2'
          onChange={(e) => handleChange(e, 'pName')}
          required
        />
        <textarea
          name="pDescription"
          id="pDescription"
          placeholder='product description'
          className='border-2 px-4 py-2'
          cols="30"
          rows="10"
          onChange={(e) => handleChange(e, 'pDescription')}
        ></textarea>
        <input
          type="text"
          name="productUrl"
          placeholder='product Url'
          className='border-2 px-4 py-2'
          onChange={(e) => handleChange(e, 'productUrl')}
          required
        />
        <button onClick={handleSubmit} className='px-4 py-2 bg-blue-500'>Add Product</button>
      </div>

    </div>
  );
};
