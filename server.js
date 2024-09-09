const express = require("express");
const app = express();
const PORT = 3000;

const prisma = require("./prisma");

app.use(express.json());
app.use(require("morgan")("dev"));

//get customers
app.get("/api/customers", async (req, res, next) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    next(error);
  }
});

//get restaurants
app.get("/api/restaurants", async (req, res, next) => {
  try {
    const restaurants = await prisma.restaurant.findMany();
    res.json(restaurants);
  } catch (error) {
    next(error);
  }
});

//get reservations
app.get("/api/reservations", async (req, res, next) => {
  try {
    const reservations = await prisma.reservation.findMany();
    res.json(reservations);
  } catch (error) {
    next(error);
  }
});

//post customers id reservations
app.post("/api/customers/:id/reservations", async (req, res, next) => {
  const { id } = req.params;
  const { restaurantId, date, partyCount } = req.body;

  try {
    const reservation = await prisma.reservation.create({
      data: {
        date: new Date(date),
        partyCount,
        customer: { connect: { id: Number(id) } },
        restaurant: { connect: { id: restaurantId } },
      },
    });
    res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
});

//delete customers customerId reservations id
app.delete(
  "/api/customers/:customerId/reservations/:id",
  async (req, res, next) => {
    const { customerId, id } = req.params;
    const reservationId = parseInt(id);

    try {
      const reservationExists = await prisma.reservation.findFirst({
        where: { id: reservationId },
      });
      if (!reservationExists) {
        return next({
          status: 404,
          message: `Could not find reservation with id ${reservationId}`,
        });
      }

      await prisma.reservation.delete({ where: { id: reservationId } });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

//error handling
app.use((error, req, res, next) => {
  res.status(res.status || 500).send({ error: error });
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
