var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    priceUnitary: { type: Number, required: [true, 'El precio únitario es necesario'] },
    description: { type: String, required: false },
    available: { type: Boolean, required: true, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Product', productSchema);