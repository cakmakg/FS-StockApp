"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- */

const SaleSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    amount: {
        type: Number,
        set: function () { return this.quantity * this.price }, // runs on create method and if data not sent it does not run
        default: function () { return this.quantity * this.price }, // only runs on create method
        transform: function () { return this.quantity * this.price } // onlye runs on update method
    },

}, {
    collection: 'sales',
    timestamps: true
});

module.exports = mongoose.model('Sale', SaleSchema);