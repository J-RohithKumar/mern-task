const getData = async (category,skip) => {
  const data = await fetch(
    `https://dummyjson.com/products${category}?limit=10&skip=${skip}`
  ).then((res) => {
    return res.json();
  });
  let ProductsData = data.products.map((x) => {
    return {
      id:x.id,
      image: x.images[0],
      brand: x.brand,
      description: x.description,
      discount_percentage: x.discountPercentage,
      original_price: x.price,
    };
  });
  return ProductsData
};


export default getData
