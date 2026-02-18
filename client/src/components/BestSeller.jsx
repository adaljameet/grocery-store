import React from 'react'
import ProductCart from './ProductCart'
import { useAppContext } from '../context/AppContext'

function BestSeller() {
  const { products } = useAppContext();

  // ✅ Ensure products is always an array
  const inStockProducts = Array.isArray(products) ? products.filter(p => p && p.inStock) : [];

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
        {inStockProducts.slice(0, 5).map((product, index) => (
          <ProductCart key={product._id || index} product={product} />
        ))}
      </div>
    </div>
  )
}

export default BestSeller
