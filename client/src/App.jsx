import { useState, useContext } from 'react'
import './App.css'
import { ProductContext } from './context/ProductContext'
import { Layout } from './components/Layout'
import { Routes, Route } from 'react-router-dom'
import { Home } from './components/Home'
import { AddProduct } from './components/AddProduct'
import { Product } from './components/Product'


function App() {

  // const { connectWallet, currentAccount } = useContext(ProductContext);
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/addproduct' element={<AddProduct />} />
          <Route path='/product/:id' element={<Product />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
