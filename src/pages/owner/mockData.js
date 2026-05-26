import hero1 from '../../assets/hero.jpg';
import hero2 from '../../assets/hero2.webp';
import hero3 from '../../assets/hero3.webp';
import avatarImg from '../../assets/avatar.png';

export const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 234 567 8900",
  avatar: avatarImg
};

export const userProperties = [
  { 
    id: 1,  
    image: hero1, 
    images: [hero1, hero2, hero3],
    title: "EOS Residence",      
    specs: "2-3 Bedrooms Apartments",
    description: "Experience luxury living at EOS Residence. These beautifully designed apartments offer modern amenities, spacious layouts, and stunning city views. Perfect for families and professionals alike.",
    price: "1,200,000 SYP", 
    area: 120, 
    beds: 3, 
    baths: 2,
    type: "Sale",
    location: "Homs, AlHamra",
    approvedBy: "Admin Salma"
  },
  { 
    id: 2,  
    image: hero2, 
    images: [hero2, hero3],
    title: "GAIA Project",       
    specs: "2-3 Bedrooms Apartments & Skyvillas",   
    description: "The GAIA Project redefines elegance with its breathtaking skyvillas. Featuring state-of-the-art smart home integrations, private terraces, and exclusive access to fitness centers.",
    price: "2,500,000 SYP",  
    area: 250, 
    beds: 4, 
    baths: 3,
    type: "Sale",
    location: "Homs, AlGhouta"
  },
  { 
    id: 3,  
    image: hero3, 
    images: [hero3, hero1],
    title: "NOX Residences",     
    specs: "2-3 Bedroom Apartments",                
    description: "NOX Residences offers comfortable and affordable living without compromising on quality. Located in a vibrant neighborhood, you'll have easy access to shops, cafes, and public transport.",
    price: "850,000 SYP", 
    area: 95,  
    beds: 2, 
    baths: 1,
    type: "Rent",
    location: "Homs, Akrama",
    approvedBy: "Admin Kareem"
  },
  { 
    id: 4,  
    image: hero1, 
    images: [hero1, hero3, hero2],
    title: "ATHENA Heights",     
    specs: "Luxury Penthouses",                     
    description: "Reach new heights at ATHENA. Our luxury penthouses feature panoramic views, premium finishes, private elevator access, and unparalleled privacy. The epitome of high-end real estate.",
    price: "3,800,000 SYP", 
    area: 320, 
    beds: 5, 
    baths: 4,
    type: "Sale",
    location: "Homs, Hamidia"
  },
  { 
    id: 5,  
    image: hero2, 
    images: [hero2, hero1],
    title: "OLYMPUS Tower",      
    specs: "1-2 Bedroom Studios",                   
    description: "Perfect for young professionals, OLYMPUS Tower provides sleek, modern studios in the heart of the business district. Enjoy luxury amenities including a rooftop pool and gym.",
    price: "650,000 SYP", 
    area: 75,  
    beds: 1, 
    baths: 1,
    type: "Rent",
    location: "Homs, Hamidia"
  },
  { 
    id: 6,  
    image: hero3, 
    images: [hero3, hero2, hero1],
    title: "ZEN Gardens",        
    specs: "3 Bedroom Villas",                      
    description: "Escape the city bustle in ZEN Gardens. These calm, beautifully landscaped villas offer private gardens, spacious interiors, and a secure gated community environment.",
    price: "4,200,000 SYP",  
    area: 400, 
    beds: 3, 
    baths: 3,
    type: "Sale",
    location: "Homs, AlHamra",
    approvedBy: "Admin Dana"
  }
];

export const updateUserPropertyById = (propertyId, updates) => {
  const propertyIndex = userProperties.findIndex((property) => property.id === propertyId);

  if (propertyIndex === -1) {
    return null;
  }

  const nextImages = updates.images?.length ? updates.images : userProperties[propertyIndex].images;

  userProperties[propertyIndex] = {
    ...userProperties[propertyIndex],
    ...updates,
    images: nextImages,
    image: nextImages?.[0] ?? updates.image ?? userProperties[propertyIndex].image,
  };

  return userProperties[propertyIndex];
};
