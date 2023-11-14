import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { contractABI, contractAddress } from '../utils/constants'

export const ProductContext = React.createContext();

const { ethereum } = window;
console.log(ethereum)

const createEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner()
    const PRSContract = new ethers.Contract(contractAddress, contractABI, signer)
    console.log(provider, signer, PRSContract)
    return PRSContract;
}

// console.log(new ethers.providers.Web3Provider(ethereum))



export const ProductProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState('')
    const [products, setProducts] = useState([]);
    // const [productCount,setProductCount] = useState(0);
    

    const getProducts = async () => {
        try {
            if (ethereum) {
                const productsContract = createEthereumContract();
                const count = await productsContract.getAllProducts();
                return count
            }
            else {
                console.log("Ethereum is not present");
            }
        } catch (error) {
            throw error;
        }
    }

    // const getAllReviews = async() =>{
    //     try {
    //         if (ethereum) {
    //             const productsContract = createEthereumContract();
    //             const allReviews = await productsContract.getAllProducts();
    //             setProducts(allProducts)
    //         }
    //         else {
    //             console.log("Ethereum is not present");
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const checkIfWalletConnected = async () => {
        try {
            if (!ethereum) return alert("Please Install metamask")
            const accounts = await ethereum.request({ method: 'eth_accounts' })
            if (accounts.length) {
                setCurrentAccount(accounts[0])
                const prod = await getProducts();
                setProducts(prod)
            }
            else {
                console.log('No accounts found')
            }

            console.log(accounts[0]);
        } catch (error) {
            console.log(error)
            throw Error("No ethereum Object");
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please Connect to metamask")
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0])
        } catch (error) {
            console.log(error);

            throw Error("No ethereum Object")
        }
    }

    useEffect(() => {
        checkIfWalletConnected();
    }, [])

    return (
        <ProductContext.Provider value={{ connectWallet, currentAccount, products , createEthereumContract,getProducts }}>
            {children}
        </ProductContext.Provider>
    )
}