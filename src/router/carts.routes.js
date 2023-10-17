import { Router } from "express";
import CartManager from "../controllers/CartManager.js";

const CartRouter = Router()
const carts = new CartManager

CartRouter.post("/", async (req, res) => {
    let newCart = req.body
    res.send(await carts.addCarts(newCart));
})

CartRouter.get('/', async (req, res) => {
    res.send(await carts.getCarts())
}) 




CartRouter.get('/:id', async (req, res) => {
    res.send(await carts.getCartsById(req.params.id))
}) 

CartRouter.post('/:cid/products/:pid', async (req, res) => {
    let cartId = req.params.cid;
    let prodId = req.params.pid;
    res.send(await carts.addProductToCart(cartId, prodId))
})

CartRouter.delete('/:cid/products/:pid', async (req, res) => {
    let cartId = req.params.cid;
    let prodId = req.params.pid;
    res.send(await carts.removeProductFromCart(cartId, prodId))
})

CartRouter.put('/:cid', async (req, res) => {
    let cartId = req.params.cid;
    let newProducts = req.body;
    res.send(await carts.updateProductsInCart(cartId, newProducts))
})


CartRouter.put('/:cid/products/:pid', async (req, res) => {
    let cartId = req.params.cid;
    let prodId = req.params.pid;
    let newProducts = req.body;
    res.send(await carts.updateProductsInCart(cartId, prodId,newProducts))
})

CartRouter.delete('/:cid', async (req, res) => {
    let cartId = req.params.cid;
    res.send(await carts.removeAllProdutsFromCart((cartId)))
})

CartRouter.get('/population/:cid', async (req, res) => {
    let cartId = req.params.cid;
    res.send(await carts.getCartWithProducts((cartId)))
})



export default CartRouter