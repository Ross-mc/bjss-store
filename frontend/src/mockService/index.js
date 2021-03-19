
const wait = (amount = 0) =>
  new Promise((resolve) => setTimeout(resolve, amount));

const store = [
  {
    id: 1,
    shortDescription: "Raindrops on Roses",
    longDescription:
      "Light catching transparent liquid spheres on a base of rosa gallica",
    price: 9.99,
    category: 1,
    deal: true,
    stock: 0,
    image: 'https://acma-bucket.s3.eu-west-2.amazonaws.com/public/647946-spring-raindrops-on-roses.jpg'
  },
  {
    id: 2,
    shortDescription: "Whiskers on Kittens",
    longDescription:
      "A set of 10 long projecting bristles harvested from the snouts of diminutive felines",
    price: 3.79,
    category: 1,
    deal: true,
    stock: 25,
    image: 'https://acma-bucket.s3.eu-west-2.amazonaws.com/public/kittens.jpg'
  },
  {
    id: 3,
    shortDescription: "Bright Copper Kettle",
    longDescription:
      "Copper base water heating device, professionally cleaned to a high standard",
    price: 19.99,
    category: 3,
    deal: true,
    stock: 15,
    image: 'https://acma-bucket.s3.eu-west-2.amazonaws.com/public/brightcopperkettle.png'
  },
  {
    id: 4,
    shortDescription: "Warm Woollen Mittens",
    longDescription: "Pair of angora wool mittens in a fetching shade of puce",
    price: 7.99,
    category: 2,
    deal: true,
    stock: 8,
    image: 'https://acma-bucket.s3.eu-west-2.amazonaws.com/public/warmwollenmittens.jpg'
  },
];

const categories = [
  {id: 1, name: 'Garden'},
  {id: 2, name: 'Clothes'},
  {id: 3, name: 'Kitchen'}
]

export const getTodaysDeals = async () => {
  // await wait(500);
  // return store.filter((product) => product.deal);
  // return fetch("http://localhost:4001/api/product/deals").then(res => res.json()).then(data => data)
  const items = fetch("http://localhost:4001/api/product/deals").then(res => res.json()).then(data => data ).catch(e => console.log(e));
  console.log(items);
  return items;
};

export const getProductsForCategory = async (category) => {
  await wait(500);
  return store.filter((product) => `${product.category}` === category);
};

export const getProductSearch = async (searchString) => {
  const trimmedSearch = searchString.trim().toLowerCase();
  await wait(500);

  const results = store.filter(
    (product) =>
      product.shortDescription.toLowerCase().includes(trimmedSearch) ||
      product.longDescription.toLowerCase().includes(trimmedSearch)
  );
  return results;
};

export const getProductCategories = async () => {
  return categories;
};
