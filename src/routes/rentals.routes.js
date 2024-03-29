import { Router } from "express";
import {createRental, deleteRental, getRentals, finishRental} from "../controllers/rentals.controllers.js"
import validateSchema from "../middlewares/validateSchema.middleware.js"
import {customerSchema} from "../schemas/rentals.schema.js"
import { restart } from "nodemon";

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals", validateSchema(rentalSchema), createRental)
rentalsRouter.post("/rentals/:id/return", finishRental)
rentalsRouter.delete("rentals/:id", deleteRental)

export default rentalsRouter


