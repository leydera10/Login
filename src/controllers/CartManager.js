import {promises as fs} from 'fs';
import { nanoid } from 'nanoid';
import ProductManager from './ProductManager.js';
import { cartsModel } from '../models/carts.model.js';

const allProducts = new ProductManager;

class CartManager extends cartsModel {
    constructor() {
        super();
        //this.path = "./src/models/carts.json";

    }

    readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8");
        return JSON.parse(carts);
    }

    writeCarts = async (cart) => {
        await fs.writeFile(this.path, JSON.stringify(cart));
    }

    exist = async (id) => {
        let carts = await this.readCarts();
        return carts.find(cart => cart.id === id);
    }

    addCarts = async () => {
        let oldCarts = await this.readCarts();
        let id = nanoid()
        let cartsConcat = [{ id : id, products : []}, ...oldCarts]
        await this.writeCarts(cartsConcat)
        return "Carrito agregado"
    }

    getCartsById = async (id) => {
        let cartById = await this.exist(id)
        if(!cartById) return "Carrito no encontrado"
        return cartById;
    };

    addProductToCart = async (cartId, productId) => {
        let cartById = await this.exist(cartId)
        if(!cartById) return "Carrito no encontrado";
        let productById = await allProducts.exist(productId)
        if(!productById) return "Producto no encontrado";
        
        let allCarts = await this.readCarts()
        let cartFilter = allCarts.filter(cart => cart.id != cartId)

        if(cartById.products.some((prod) => prod.id === productId)){
            let addProductInCart = cartById.products.find(prod => prod.id === productId)
            addProductInCart.quantity++;
            let cartsConcat = [cartById, ...cartFilter]
            await this.writeCarts(cartsConcat)
            return "Producto sumado al carrito";
        }

        cartById.products.push({id:productById.id, quantity: 1})
        let cartsConcat = [cartById, ...cartFilter]
        await this.writeCarts(cartsConcat)
        return "Producto agregado al carrito";
    }

    async getCarts(){
        try{

            const carts = await CartManager.find({})
            .populate({
                path: "products.productId",
                model: "products",
                select:"img description price stock",
            });
        } catch (error){
            console.error('error al obtener los carritos:' , error );
            return[];

        }
    }

    async removeProductFromCart (cartId,  prodId) {
        try {
            const cart = await cartsModel.findById(cartId);
            if(!cart) {
                return 'carrito no encontrado';
            }

            const productIndex = cart.products.findIndex((products)=> products.productId == prodId)

            if (productIndex !== -1){
                cart.products.splice(productIndex, 1);
                await cart.save();
                return 'Producto no encontrado en el carrito';
            }
        } catch (error) {
            console.error ('Error al eliminar el producto del carrito ', error);
            return 'Error al eliminar el producto del carrito';

        }
    }


    async updateProductsInCart (cartId, newProducts){
        try {
            const cart = await cartsModel.findById(cartId);
            if(!cart) {
                return 'carrito no encontrado';
            }

            cart.products = newProducts;

            await cart.save();
            return 'Carrtito actualizado con nuevos productos';
        } catch (error) {
            console.error ('Error al actualizar el carrito ', error);
            return 'Error al actualizar el carrito ';

        }

    }

    async updateProductsInCart (cartId, prodId, updatedProduct){
        try {
            const cart = await cartsModel.findById(cartId);
            if(!cart) {
                return 'carrito no encontrado';
            }

            const productToUpdate = cart.products.find((product)=> product.productId === prodId);

            if (!productToUpdate) {
                return 'producto no encontrado en el carrito' 
            }

            Object.assign(productToUpdate, updatedProduct);

            await cart.save();
            return 'Producto actualizado en el carrito';
        } catch (error) {
            console.error ('Error al actualizar el carrito ', error);
            return 'Error al actualizar el carrito ';

        }

    }

    async removeAllProdutsFromCart (cartId){
        try {
            const cart = await cartsModel.findById(cartId);

            if(!cart) {
                return 'carrito no encontrado';
            }

            cart.products = [];
            await cart.save();

            return ' Todos los productos han sido eliminados del carrito';
        } catch (error) {
            console.error ('Error al actualizar el carrito ', error);
            return 'Error al actualizar el carrito ';
        }
    }

    
    async getCartWithProducts (cartId){
        try {
            const cart = await cartsModel.findById(cartId).populate('products.productId').lean();

            if(!cart) {
                return 'carrito no encontrado';
            }

            return cart;
        } catch (error) {
            console.error ('Error al obtener el carrito con products', error);
            return 'Error al obtener el carrito con products';
        }
    }





}

export default CartManager



