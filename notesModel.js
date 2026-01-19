
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: { type: String},
    body: { type: String},
    author: { type: String},
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform(doc, ret) {
            ret._links = {
                self: {

                href: `${process.env.BASE_URI}${ret._id}`,
            },
                collection: {
                    href: `${process.env.BASE_URI}`,
        },
            };
            delete ret._id;
        },
    },

});



const Note = mongoose.model("Note", noteSchema);

export default Note;