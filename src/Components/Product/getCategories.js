const getCategories = async () => {
  const data = await fetch("https://dummyjson.com/products/category-list")
    .then((res) => {return res.json()})
  const options = data.map((element) => {
    return {
      value: element,
      label: element,
    };
  });
  return options
};
export default getCategories
