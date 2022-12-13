import { Router } from 'express';

import { getCategories, getCustomersById, getGames, getRentals, deleteRentals,
postCategories, postCustomers, postGames, postRentals, postRentalsById, putCustomers, getCustomers} from './controller.js'

import { validateCategory } from './middlewares/validateCategory.js';
import { validateCustomer } from './middlewares/validateCustomer.js';
import { validateDelete } from './middlewares/validateDelete.js';
import { validateGame } from './middlewares/validateGame.js';
import { validateRental } from './middlewares/validateRental.js';

const router = Router();

router.get("/categories", getCategories)
router.post("/categories",validateCategory,postCategories)
router.get("/games",getGames)
router.post("/games",validateGame,postGames)
router.get("/customers", getCustomers)
router.get("/customers/:id", getCustomersById)
router.post("/customers",validateCustomer, postCustomers)
router.put("/customers/:id",validateCustomer, putCustomers)
router.get("/rentals", getRentals)
router.post("/rentals",validateRental, postRentals)
router.post("/rentals/:id/return", postRentalsById)
router.delete("/rentals/:id",validateDelete,deleteRentals)

export default router;