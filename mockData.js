export const INITIAL_ROOMS = [
  // Floor 1 - Standard
  { id: 101, number: "101", type: "Standard", rate: 150, floor: 1, status: "Available", amenities: ["King Bed", "High-speed Wi-Fi", "Smart TV", "Mini Fridge"], rating: 4.2 },
  { id: 102, number: "102", type: "Standard", rate: 150, floor: 1, status: "Available", amenities: ["King Bed", "High-speed Wi-Fi", "Smart TV", "Mini Fridge"], rating: 4.1 },
  { id: 103, number: "103", type: "Standard", rate: 150, floor: 1, status: "Occupied", amenities: ["Twin Beds", "High-speed Wi-Fi", "Smart TV", "Mini Fridge"], rating: 4.3 },
  { id: 104, number: "104", type: "Standard", rate: 150, floor: 1, status: "Cleaning", amenities: ["King Bed", "High-speed Wi-Fi", "Smart TV", "Mini Fridge"], rating: 4.0 },
  { id: 105, number: "105", type: "Standard", rate: 150, floor: 1, status: "Available", amenities: ["King Bed", "High-speed Wi-Fi", "Smart TV", "Mini Fridge"], rating: 4.4 },
  { id: 106, number: "106", type: "Standard", rate: 150, floor: 1, status: "Maintenance", amenities: ["Twin Beds", "High-speed Wi-Fi", "Smart TV", "Mini Fridge"], rating: 3.9 },
  { id: 107, number: "107", type: "Standard", rate: 150, floor: 1, status: "Available", amenities: ["King Bed", "High-speed Wi-Fi", "Smart TV", "Mini Fridge"], rating: 4.5 },
  { id: 108, number: "108", type: "Standard", rate: 150, floor: 1, status: "Occupied", amenities: ["King Bed", "High-speed Wi-Fi", "Smart TV", "Mini Fridge"], rating: 4.2 },

  // Floor 2 - Deluxe
  { id: 201, number: "201", type: "Deluxe", rate: 280, floor: 2, status: "Available", amenities: ["King Bed", "Ocean View", "Balcony", "Mini Bar", "Espresso Machine"], rating: 4.7 },
  { id: 202, number: "202", type: "Deluxe", rate: 280, floor: 2, status: "Occupied", amenities: ["King Bed", "Ocean View", "Balcony", "Mini Bar", "Espresso Machine"], rating: 4.6 },
  { id: 203, number: "203", type: "Deluxe", rate: 280, floor: 2, status: "Available", amenities: ["King Bed", "Ocean View", "Balcony", "Mini Bar", "Espresso Machine"], rating: 4.8 },
  { id: 204, number: "204", type: "Deluxe", rate: 280, floor: 2, status: "Cleaning", amenities: ["2 Queen Beds", "Garden View", "Balcony", "Mini Bar", "Espresso Machine"], rating: 4.5 },
  { id: 205, number: "205", type: "Deluxe", rate: 280, floor: 2, status: "Available", amenities: ["King Bed", "Ocean View", "Balcony", "Mini Bar", "Espresso Machine"], rating: 4.7 },
  { id: 206, number: "206", type: "Deluxe", rate: 280, floor: 2, status: "Available", amenities: ["King Bed", "Ocean View", "Balcony", "Mini Bar", "Espresso Machine"], rating: 4.6 },
  { id: 207, number: "207", type: "Deluxe", rate: 280, floor: 2, status: "Occupied", amenities: ["2 Queen Beds", "Garden View", "Balcony", "Mini Bar", "Espresso Machine"], rating: 4.4 },
  { id: 208, number: "208", type: "Deluxe", rate: 280, floor: 2, status: "Maintenance", amenities: ["King Bed", "Ocean View", "Balcony", "Mini Bar", "Espresso Machine"], rating: 4.7 },

  // Floor 3 - Suite & Presidential
  { id: 301, number: "301", type: "Suite", rate: 500, floor: 3, status: "Available", amenities: ["King Bed", "Living Area", "Ocean View", "Jacuzzi Tub", "Balcony", "Mini Bar"], rating: 4.9 },
  { id: 302, number: "302", type: "Suite", rate: 500, floor: 3, status: "Occupied", amenities: ["King Bed", "Living Area", "Ocean View", "Jacuzzi Tub", "Balcony", "Mini Bar"], rating: 4.8 },
  { id: 303, number: "303", type: "Suite", rate: 500, floor: 3, status: "Available", amenities: ["King Bed", "Living Area", "Ocean View", "Jacuzzi Tub", "Balcony", "Mini Bar"], rating: 4.9 },
  { id: 304, number: "304", type: "Suite", rate: 500, floor: 3, status: "Cleaning", amenities: ["King Bed", "Living Area", "Ocean View", "Jacuzzi Tub", "Balcony", "Mini Bar"], rating: 4.7 },
  { id: 305, number: "305", type: "Suite", rate: 500, floor: 3, status: "Available", amenities: ["King Bed", "Living Area", "Ocean View", "Jacuzzi Tub", "Balcony", "Mini Bar"], rating: 4.9 },
  { id: 306, number: "306", type: "Suite", rate: 500, floor: 3, status: "Available", amenities: ["King Bed", "Living Area", "Ocean View", "Jacuzzi Tub", "Balcony", "Mini Bar"], rating: 4.8 },
  { id: 307, number: "307", type: "Presidential", rate: 1200, floor: 3, status: "Available", amenities: ["2 King Beds", "Private Pool", "Kitchenette", "Ocean View", "Jacuzzi Tub", "Balcony", "Personal Butler"], rating: 5.0 },
  { id: 308, number: "308", type: "Presidential", rate: 1200, floor: 3, status: "Occupied", amenities: ["2 King Beds", "Private Pool", "Kitchenette", "Ocean View", "Jacuzzi Tub", "Balcony", "Personal Butler"], rating: 4.9 },
];

export const INITIAL_GUEST = {
  name: "Alexander Vance",
  email: "alexander.vance@emerald.com",
  phone: "+1 (555) 234-5678",
  loyaltyPoints: 4850,
  loyaltyTier: "Gold", // Gold, Silver, Platinum
  avatarUrl: "", // will generate standard visual initials
  preferences: {
    temp: 21,
    pillow: "Down Feather",
    floor: "High Floor",
    dietary: "Gluten Free",
    dnd: false,
    housekeeping: "Morning (9AM - 12PM)"
  }
};

export const INITIAL_BOOKING = {
  id: "BK-8904",
  checkInDate: "2026-06-04",
  checkOutDate: "2026-06-09",
  guestsCount: 2,
  roomType: "Deluxe",
  roomAssigned: null, // Room object when assigned
  status: "Booked", // Booked, Check-In Started, ID Uploaded, Room Assigned, Checked In, Check-Out Started, Checked Out
  idDetails: {
    type: "",
    number: "",
    expiry: "",
    url: "",
    status: "None", // None, Uploaded, Approved, Rejected
    ocrData: null
  },
  charges: [
    { id: "chg-1", description: "Standard Booking Rate (5 nights)", amount: 1400, category: "Room", date: "2026-06-04" }
  ],
  digitalKey: {
    issued: false,
    active: false,
    deviceRegistered: false
  }
};

export const INITIAL_HISTORY = [
  {
    id: "BK-4102",
    hotelName: "Aetheria Resort & Spa",
    dates: "Jan 12 - Jan 15, 2026",
    roomDetails: "Standard Room - Room 105",
    totalAmount: 450,
    invoiceUrl: "#",
    status: "Completed"
  },
  {
    id: "BK-2309",
    hotelName: "Aetheria Alpine Lodge",
    dates: "Nov 03 - Nov 07, 2025",
    roomDetails: "Deluxe Chalet - Room 402",
    totalAmount: 1120,
    invoiceUrl: "#",
    status: "Completed"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Welcome to Aetheria!",
    message: "Your stay starts today. You can now start the express online check-in to skip the front desk.",
    time: "2 hours ago",
    read: false,
    type: "info"
  },
  {
    id: "notif-2",
    title: "Loyalty Tier Maintained",
    message: "Thank you for being a Gold member. Enjoy your complimentary spa credit and room upgrade availability.",
    time: "1 day ago",
    read: true,
    type: "loyalty"
  }
];

export const EXTRA_SERVICES_CATALOG = [
  { id: "serv-1", name: "In-Room Dining: Caviar & Champagne", cost: 180, description: "Delivered to your room with white glove service.", category: "Dining" },
  { id: "serv-2", name: "Aroma Therapy Massage (60 min)", cost: 150, description: "At the Azure Wellness Spa or in your private suite.", category: "Spa" },
  { id: "serv-3", name: "Airport Luxury Transfer", cost: 95, description: "Chaffeur-driven Tesla Model S direct to terminal.", category: "Travel" },
  { id: "serv-4", name: "Midnight Snack Basket", cost: 35, description: "Curated selection of artisanal cheeses, chocolates, and nuts.", category: "Dining" }
];
