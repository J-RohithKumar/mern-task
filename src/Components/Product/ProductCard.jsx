/* eslint-disable react/prop-types */

import './ProductCard.css'
const ProductCard = ({product}) => {
  return (
    // <Link to='/products/productdetails' >
      <div className='productcard w-[15rem] transition-all cursor-pointer border m-3 flex flex-col '>
        <div className='h-[20rem]'>
          <img  loading="lazy" className='h-full w-full object-cover object-left-top productcard-img' src={product.image} alt='' />
        </div>
        <div className='textPart bg-white p-3'>
          <div>
            <p className='font-bold opacity-800'>{product.brand}</p>
            <p className=' opacity-50'>{product.description}</p>
          </div>
          <div className='flex space-x-2 items-center'>
            <p className='font-bold opacity-100'>${product.original_price}</p>
            <p className='text-green-500 font-semibold'>{product.discount_percentage} off</p>
          </div>
        </div>
      </div>
  )
}

export default ProductCard