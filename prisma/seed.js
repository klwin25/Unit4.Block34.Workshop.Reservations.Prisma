const prisma = require("../prisma");
const seed = async () => {
  // TODO: Create Customers, Restaurants and Reservations
  //customers
  const customers = await prisma.customer.createMany({
    data: [
      { name: "Lisa Miller" },
      { name: "Erin Potts" },
      { name: "Kit Johnson" },
      { name: "Bobby Shields" },
    ],
  });

  //restaurants
  const restaurants = await prisma.restaurant.createMany({
    data: [
      { name: "Texas Roadhouse" },
      { name: "Ditali's" },
      { name: "Grandma Noodle" },
      { name: "Paco's Tacos" },
    ],
  });

  //reservations
  await prisma.reservation.createMany({
    data: [
      {
        date: new Date("2024-09-10T18:00:00Z"),
        partyCount: 4,
        customerId: 1,
        restaurantId: 1,
      },
      {
        date: new Date("2024-12-20T17:30:00Z"),
        partyCount: 2,
        customerId: 2,
        restaurantId: 2,
      },
      {
        date: new Date("2024-10-20T17:30:00Z"),
        partyCount: 3,
        customerId: 3,
        restaurantId: 3,
      },
    ],
  });

  console.log("Seeding completed!");
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
