"use strict"
/* -------------------------------------------------------
| FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */

const Product = require('../models/product');
const Sale = require('../models/sale');

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "List Sales"
            #swagger.description = `
                You can use <u>filter[] & search[] & sort[] & page & limit</u> queries with endpoint.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
                    <li>URL/?<b>limit=10&page=1</b></li>
                </ul>
            `
        */

        const data = await res.getModelList(Sale, {}, [
            { path: 'userId', select: 'username firstName lastName' },
            { path: 'brandId', select: 'name' },
            { path: 'productId', select: 'name' }
        ]);

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Sale),
            data
        });
    },

    create: async (req, res) => {

        /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Create Sale"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    $ref: "#/definitions/Sale"
                }
            }
        */

        //? Set userId from loggedIn user
        req.body.userId = req.user._id;

        const currentProduct = await Product.findById(req.body.productId);


        if (currentProduct.quantity < req.body.quantity) {
            res.errorStatusCode = 422;
            throw new Error('There is not enough product-quantity for this sale', { cause: `Quantity in our stock: ${currentProduct.quantity}` });
        };

        const data = await Sale.create(req.body);

        //? Decrease quantity of product which is sold
        await Product.updateOne({ _id: data.productId }, { $inc: { quantity: -data.quantity } });

        res.status(200).send({
            error: false,
            data
        });
    },

    read: async (req, res) => {

        /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Get Single Sale"
        */

        const data = await Sale.findById(req.params.id).populate([
            { path: 'userId', select: 'username firstName lastName' },
            { path: 'brandId', select: 'name' },
            { path: 'productId', select: 'name' }
        ])

        res.status(200).send({
            error: false,
            data
        });
    },

    update: async (req, res) => {

        /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Update Sale"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    $ref: "#/definitions/Sale"
                }
            }
        */

        //? Update stocks
        if (req.body.quantity) {
            // get currentSale
            const currentSale = await Sale.findById(req.params.id);

            // Calculate the difference
            const difference = req.body.quantity - currentSale.quantity;

            // Decrease quanitity from product
            await Product.updateOne({ _id: currentSale.productId }, { $inc: { quantity: -difference } });

        };

        const data = await Sale.updateOne({ _id: req.params.id }, req.body, { runValidators: true });

        res.status(200).send({
            error: false,
            data,
            new: await Sale.findById(req.params.id)
        });
    },

    deletee: async (req, res) => {
        /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Delete Sale"
        */

        const currentSale = await Sale.findById(req.params.id);

        const data = await Sale.deleteOne({ _id: req.params.id });

        //? Increase quantity of product back
        if (data.deletedCount) {
            await Product.updateOne({ _id: currentSale.productId }, { $inc: { quantity: currentSale.quantity } });
        };

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            message: data.deletedCount ? 'Data deleted.' : 'Data is not found or already deleted.',
            data
        });
    },
};