export const Products = [
  {
    id: "1",
    name: "Classic Sneaker - White/Blue",
    description:
      "Stylish and comfortable high-quality sneaker, perfect for daily wear and activity.",
    mainImage: "/assets/images/img-11.jpg",
    images: [
      "/assets/images/product-2.jpg",
      "/assets/images/product-3.jpg",
      "/assets/images/product-4.jpg",
    ],
    price: 600,
    estimatedPrice: 500,
    soldOut: true,
    category: "general",
    offer: true,
    sizes: [
      {
        type: "38", // Shoe size
        soldOut: true,
      },
      {
        type: "39",
        soldOut: false,
      },
      {
        type: "40",
        soldOut: false,
      },
    ],
    colors: [
      {
        value: "#2196F3",
        soldOut: true,
      },
      {
        value: "#E91E63",
        soldOut: false,
      },
      {
        value: "#4CAF50",
        soldOut: false,
      },
    ],
    createdAt: "2024-05-02T08:15:49.427+00:00",
  },
  {
    id: "2",
    name: "Leather Flat Sandal - Brown",
    description:
      "Comfortable and trendy summer sandal with genuine leather straps, suitable for light outings.",
    mainImage: "/assets/images/product-2.jpg",
    images: [
      "/assets/images/product-3.jpg",
      "/assets/images/product-1.jpg",
      "/assets/images/product-4.jpg",
    ],
    price: 900,
    estimatedPrice: 0,
    soldOut: false,
    category: "girls", // Can be 'women' or 'ladies'
    offer: false,
    sizes: [
      {
        type: "36",
        soldOut: true,
      },
      {
        type: "37",
        soldOut: false,
      },
      {
        type: "38",
        soldOut: false,
      },
    ],
    colors: [
      {
        value: "#2196F3",
        soldOut: true,
      },
      {
        value: "#E91E63",
        soldOut: false,
      },
      {
        value: "#4CAF50",
        soldOut: false,
      },
    ],
    createdAt: "2024-05-02T08:15:49.427+00:00",
  },
  {
    id: "3",
    name: "Formal Leather Shoe - Black",
    description:
      "Luxury classic formal leather shoe, ideal for business meetings and special events.",
    mainImage: "/assets/images/product-3.jpg",
    images: [
      "/assets/images/product-4.jpg",
      "/assets/images/product-1.jpg",
      "/assets/images/product-2.jpg",
    ],
    price: 350,
    estimatedPrice: 0,
    soldOut: false,
    category: "boys", // Can be 'men' or 'gentlemen'
    offer: false,
    sizes: [
      {
        type: "41",
        soldOut: true,
      },
      {
        type: "42",
        soldOut: false,
      },
      {
        type: "43",
        soldOut: false,
      },
    ],
    colors: [
      {
        value: "#2196F3",
        soldOut: true,
      },
      {
        value: "#E91E63",
        soldOut: false,
      },
      {
        value: "#4CAF50",
        soldOut: false,
      },
    ],
    createdAt: "2024-05-02T08:15:49.427+00:00",
  },
  {
    id: "4",
    name: "High Heel Pump - Red",
    description:
      "Elegant stiletto heel with a sharp design, perfect for parties and evening wear.",
    mainImage: "/assets/images/img-10.jpg",
    images: [
      "/assets/images/product-2.jpg",
      "/assets/images/product-1.jpg",
      "/assets/images/product-3.jpg",
    ],
    price: 600,
    estimatedPrice: 400,
    soldOut: true,
    category: "general",
    offer: true,
    sizes: [
      {
        type: "37",
        soldOut: true,
      },
      {
        type: "38",
        soldOut: false,
      },
      {
        type: "39",
        soldOut: false,
      },
    ],
    colors: [
      {
        value: "#2196F3",
        soldOut: true,
      },
      {
        value: "#E91E63",
        soldOut: false,
      },
      {
        value: "#4CAF50",
        soldOut: false,
      },
    ],
    createdAt: "2024-05-02T08:15:49.427+00:00",
  },
];

export const AllProducts = [
  {
    id: "1",
    name: "Leather Winter Boot - Black",
    description:
      "Warm and durable leather boot, waterproof and perfect for the cold winter season.",
    mainImage: "/assets/images/product-1.jpg",
    images: [
      "/assets/images/img-3.jpg",
      "/assets/images/product-3.jpg",
      "/assets/images/product-4.jpg",
    ],
    price: 600,
    estimatedPrice: 500,
    soldOut: true,
    category: "general",
    offer: true,
    sizes: [
      {
        typeEn: " 41 ",
        typeAr: " 38 ",
        soldOut: true,
      },
      {
        typeEn: " 42",
        typeAr: " 39",
        soldOut: false,
      },
      {
        typeEn: "43",
        typeAr: "35 ",
        soldOut: false,
      },
    ],
    colors: [
      {
        value: "#000",
        soldOut: true,
      },
      {
        value: "#5D4037",
        soldOut: false,
      },
      {
        value: "#607D8B",
        soldOut: false,
      },
    ],
    createdAt: "2024-12-02T08:15:49.427+00:00",
  },
  {
    id: "2",
    name: "Comfortable Flat Shoe - Beige",
    description:
      "Light and stylish flat shoe, suitable for long walks, with a modern design and soft insole.",
    mainImage: "/assets/images/product-2.jpg",
    images: [
      "/assets/images/img-6.jpg",
      "/assets/images/product-1.jpg",
      "/assets/images/product-4.jpg",
    ],
    price: 900,
    estimatedPrice: 0,
    soldOut: false,
    category: "girls",
    offer: false,
    sizes: [
      {
        typeEn: " 41 ",
        typeAr: " 38 ",
        soldOut: true,
      },
      {
        typeEn: " 42",
        typeAr: " 39",
        soldOut: false,
      },
      {
        typeEn: "43",
        typeAr: "35 ",
        soldOut: false,
      },
    ],
    createdAt: "2024-02-02T08:15:49.427+00:00",
    colors: [
      {
        value: "#FFEB3B",
        soldOut: true,
      },
      {
        value: "#CDDC39",
        soldOut: false,
      },
      {
        value: "#FFC107",
        soldOut: false,
      },
    ],
  },
  {
    id: "3",
    name: "Velvet House Slipper - Grey",
    description:
      "Soft and warm indoor slipper with a velvet finish, perfect for home comfort and relaxation.",
    mainImage: "/assets/images/img-1.jpg",
    images: [
      "/assets/images/img-2.jpg",
      "/assets/images/product-1.jpg",
      "/assets/images/product-2.jpg",
    ],
    price: 350,
    estimatedPrice: 0,
    soldOut: false,
    category: "boys",
    offer: false,
    sizes: [
      {
        typeEn: " 40",
        typeAr: " 37",
        soldOut: true,
      },
      {
        typeEn: " 41 ",
        typeAr: " 38 ",
        soldOut: false,
      },
      {
        typeEn: " 42 ",
        typeAr: " 39",
        soldOut: false,
      },
    ],
    colors: [
      {
        value: "#9E9E9E",
        soldOut: true,
      },
      {
        value: "#E0F2F1",
        soldOut: false,
      },
      {
        value: "#795548",
        soldOut: false,
      },
    ],
    createdAt: "2024-11-02T08:15:49.427+00:00",
  },
  {
    id: "4",
    name: "Professional Running Shoe",
    description:
      "Athletic shoe with advanced shock-absorption technology, ideal for running and intensive workouts.",
    mainImage: "/assets/images/product-4.jpg",
    images: [
      "/assets/images/img-5.jpg",
      "/assets/images/product-1.jpg",
      "/assets/images/product-3.jpg",
    ],
    price: 600,
    estimatedPrice: 400,
    soldOut: true,
    category: "general",
    offer: true,
    sizes: [
      {
        typeEn: " 42",
        typeAr: " 39 ",
        soldOut: true,
      },
      {
        typeEn: " 43",
        typeAr: " 38",
        soldOut: false,
      },
      {
        typeEn: " 44",
        typeAr: "37",
        soldOut: false,
      },
    ],
    colors: [
      {
        value: "#2196F3",
        soldOut: true,
      },
      {
        value: "#FF9800",
        soldOut: false,
      },
      {
        value: "#000",
        soldOut: false,
      },
    ],
    createdAt: "2024-09-02T08:15:49.427+00:00",
  },
  {
    id: "5",
    name: "Water Shower Slipper - Blue",
    description:
      "Slipper designated for waterproof use inside bathrooms, pools, or beach areas.",
    mainImage: "/assets/images/img-10.jpg",
    images: [
      "/assets/images/product-2.jpg",
      "/assets/images/product-1.jpg",
      "/assets/images/product-3.jpg",
    ],
    price: 400,
    estimatedPrice: 250,
    soldOut: false,
    category: "general",
    offer: true,
    sizes: [
      {
        typeEn: " 39 ",
        typeAr: " 36",
        soldOut: false,
      },
      {
        typeEn: "40",
        typeAr: " 37",
        soldOut: false,
      },
      {
        typeEn: " 41",
        typeAr: " 38 ",
        soldOut: false,
      },
    ],
    colors: [
      {
        value: "#2196F3",
        soldOut: true,
      },
      {
        value: "#E91E63",
        soldOut: false,
      },
      {
        value: "#4CAF50",
        soldOut: false,
      },
    ],
    createdAt: "2024-05-02T08:15:49.427+00:00",
  },
  {
    id: "6",
    name: "Formal Oxford Shoe",
    description:
      "Classic Oxford design leather shoe with polished finish, for an elegant formal look.",
    mainImage: "/assets/images/img-9.jpg",
    images: [
      "/assets/images/product-2.jpg",
      "/assets/images/product-1.jpg",
      "/assets/images/product-3.jpg",
    ],
    price: 1200,
    estimatedPrice: 0,
    soldOut: true,
    category: "general",
    offer: true,
    sizes: [
      {
        typeEn: "43",
        typeAr: "35",
        soldOut: true,
      },
      {
        typeEn: "44",
        typeAr: "37 ",
        soldOut: false,
      },
      {
        typeEn: " 45 ",
        typeAr: " 38 ",
        soldOut: false,
      },
    ],
    colors: [
      {
        value: "#3E2723",
        soldOut: true,
      },
      {
        value: "#1A237E",
        soldOut: false,
      },
      {
        value: "#000",
        soldOut: false,
      },
    ],
    createdAt: "2024-03-02T08:15:49.427+00:00",
  },
  {
    id: "7",
    name: "Athletic Adventure Sandal",
    description:
      "Durable and comfortable sport sandal with rugged sole, perfect for nature walking and outdoor adventures.",
    mainImage: "/assets/images/img-11.jpg",
    images: [
      "/assets/images/product-2.jpg",
      "/assets/images/product-1.jpg",
      "/assets/images/product-3.jpg",
    ],
    price: 1500,
    estimatedPrice: 1300,
    soldOut: false,
    category: "general",
    offer: true,
    sizes: [
      {
        typeEn: " 41 ",
        typeAr: " 38 ",
        soldOut: true,
      },
      {
        typeEn: " 42",
        typeAr: " 39",
        soldOut: false,
      },
      {
        typeEn: "43",
        typeAr: "35 ",
        soldOut: false,
      },
    ],
    colors: [
      {
        value: "#000",
        soldOut: true,
      },
      {
        value: "#4CAF50",
        soldOut: false,
      },
      {
        value: "#FF5722",
        soldOut: false,
      },
    ],
    createdAt: "2024-04-02T08:15:49.427+00:00",
  },
  {
    id: "8",
    name: "Leather Ballerina Flat",
    description:
      "Flat and elegant Ballerina shoe, suitable for casual and light formal looks with high comfort.",
    mainImage: "/assets/images/img-12.jpg",
    images: [
      "/assets/images/product-2.jpg",
      "/assets/images/product-1.jpg",
      "/assets/images/product-3.jpg",
    ],
    price: 900,
    estimatedPrice: 0,
    soldOut: false,
    category: "general",
    offer: true,
    sizes: [
      {
        typeEn: " 41 ",
        typeAr: " 38 ",
        soldOut: true,
      },
      {
        typeEn: " 42",
        typeAr: " 39",
        soldOut: false,
      },
      {
        typeEn: "43",
        typeAr: "35 ",
        soldOut: false,
      },
    ],
    colors: [
      {
        value: "#F48FB1",
        soldOut: true,
      },
      {
        value: "#9C27B0",
        soldOut: false,
      },
      {
        value: "#000",
        soldOut: false,
      },
    ],
    createdAt: "2024-01-02T08:15:49.427+00:00",
  },
  {
    id: "9",
    name: "Suede Boat Shoe",
    description:
      "Comfortable and trendy Loafer/Boat shoe in suede leather, perfect for a casual summer look.",
    mainImage: "/assets/images/product-3.jpg",
    images: [
      "/assets/images/product-2.jpg",
      "/assets/images/product-1.jpg",
      "/assets/images/product-3.jpg",
    ],
    price: 600,
    estimatedPrice: 500,
    soldOut: false,
    category: "general",
    offer: true,
    sizes: [
      {
        typeEn: " 41 ",
        typeAr: " 38 ",
        soldOut: true,
      },
      {
        typeEn: " 42",
        typeAr: " 39",
        soldOut: false,
      },
      {
        typeEn: "43",
        typeAr: "35 ",
        soldOut: false,
      },
    ],
    colors: [
      {
        value: "#FF9800",
        soldOut: true,
      },
      {
        value: "#607D8B",
        soldOut: false,
      },
      {
        value: "#4CAF50",
        soldOut: false,
      },
    ],
    createdAt: "2024-07-02T08:15:49.427+00:00",
  },
  {
    id: "10",
    name: "Mountain Climbing Boot",
    description:
      "Strong and durable athletic boot, perfect for mountain climbing and challenging terrain walking.",
    mainImage: "/assets/images/img-8.jpg",
    images: [
      "/assets/images/product-2.jpg",
      "/assets/images/product-1.jpg",
      "/assets/images/product-3.jpg",
    ],
    price: 600,
    estimatedPrice: 500,
    soldOut: true,
    category: "general",
    offer: true,
    sizes: [
      {
        typeEn: " 41 ",
        typeAr: " 38 ",
        soldOut: true,
      },
      {
        typeEn: " 42",
        typeAr: " 39",
        soldOut: false,
      },
      {
        typeEn: "43",
        typeAr: "35 ",
        soldOut: false,
      },
    ],
    colors: [
      {
        value: "#f00",
        soldOut: true,
      },
      {
        value: "#29d",
        soldOut: false,
      },
      {
        value: "#000",
        soldOut: false,
      },
    ],
    createdAt: "2024-10-02T08:15:49.427+00:00",
  },
];

export const Categories = [
  {
    id: "1",
    name: "Sneakers",
    image: "/assets/images/product-1.jpg",
  },
  {
    id: "2",
    name: "Flats",
    image: "/assets/images/product-2.jpg",
  },
  {
    id: "3",
    name: "Sandals",
    image: "/assets/images/product-3.jpg",
  },
  {
    id: "4",
    name: "Heels",
    image: "/assets/images/product-4.jpg",
  },
];
