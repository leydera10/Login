import {promises as fs} from 'fs';
import { nanoid } from 'nanoid';
import { productsModel } from '../models/products.model.js';

class ProductManager extends productsModel {
    constructor() {
        super();

    }

    async addProducts(product) {
        try {
            const newProduct = new productsModel(product);
            await newProduct.save();
            return "Producto Agregado";
        } catch (error) {
            throw error;
        }
    }

    async getProducts() {
        try {
            const products = await productsModel.find();
            return products;
        } catch (error) {
            throw error;
        }
    }

   

    async getProductsByLimit(limit)
    {
        try {
            const products = await ProductManager.find().limit(limit);
            if (products.length < limit ){
                limit = products.length;
            }
            return products;
        } catch (error) {
            throw error;
        }
    }

    async getProductsByPage(page, productsPerPage)
    {
        if (page <= 0) {
            page = 1 
        }

        try {
            const products = await ProductManager.find()
            .skip((page - 1 ) * productsPerPage)
            .limit(productsPerPage);
            return products;
            } catch (error) {
                throw error;
            }
    }

    async getProductsByQuery(query)
    {
        console.log(query)
        try{
            const products = await productsModel.find({
                description :  { $regex: query, $options: 'i' }
            });
            console.log(products)
            return products;

        } catch (error) {
            throw error;
        }
    }

    async getProductsBySort (sortOrder) {
        try {
            const products = await productsModel
            .find({})
            .sort({ price : sortOrder});
            return products;

        } catch (error) {
            throw error;
        }
    } 

    async getProductsMaster (page = 1, limit = 10 , category, avalability, sortOrder){
        try
        {
            let filter = {};

            const startIndex = (page -1) * limit;
            const endIndex = page * limit;

            const sortOptions =  {};

            if (sortOrder === 'asc'){
                sortOptions.price = 1 ;
            } else if  (sortOrder === 'desc') {
                sortOptions.price = -1;
            }else {
                throw new Error ('El parametro para ordenar debe ser "asc" o "desc".');
            }

            if (category != "") {
                filter.category = category;
            }

            if (avalability != "" ) {
                filter.avalability = avalability;
            }

            const query = ProductManager.find(filter)
            .skip(startIndex)
            .limit(limit)
            .sort(sortOptions);;
            
            
            const products = await query.exec();

            const totalProducts = await ProductManager.countDocuments(filter);
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = startIndex > 0;
            const hasNextPage = endIndex < totalProducts;
            const prevLink = hasPrevPage ? `/api/products?page=${page - 1}&limit=${limit}` : null;
            const nextLink = hasNextPage ? `/api/products?page=${page + 1}&limit=${limit}` : null;


            return {
                status: 'success',
                payload : products,
                totalPages: totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: prevLink,
                nextLink:nextLink, 
            };
            
        } catch (error){
            console.error( 'Error al obtener los productos:', error);

            return { status: ' error ', payload: 'Error al obtener los productos'};
        }
    }


    async getProductsById(id) {
        try {
            const product = await productsModel.findById(id);
            const productDetails = product.toJSON(); // Convierte el producto a JSON
            console.log("Product Details:", productDetails);
            return productDetails;
        } catch (error) {
            throw error;
        }
    }
    
}

export default ProductManager