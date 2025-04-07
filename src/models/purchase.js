"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- */

const PurchaseSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    firmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm',
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
    collection: 'purchases',
    timestamps: true
});

module.exports = mongoose.model('Purchase', PurchaseSchema);