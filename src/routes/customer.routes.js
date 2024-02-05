import { Router } from "express";
import {createCustomer, getCustomerById, getCustomers, updateCustomer} from "../controllers/customer.controllers.js"
import validateSchema from "../middlewares/validateSchema.middleware.js"
import {customerSchema} from "../schemas/customers.schema.js"

const customersRouter = Router()

customersRouter.get("/customers", getCustomers)
customersRouter.get("/customers/:id", getCustomerById)
customersRouter.get("/customers", validateSchema(customerSchema), createCustomer)
customersRouter.get("/customers/:id", validateSchema(customerSchema), updateCustomerCustomer)

export default customersRouter
