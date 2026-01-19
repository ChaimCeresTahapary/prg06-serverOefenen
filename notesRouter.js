import express from "express";
import Note from "./notesModel.js";
import { faker } from "@faker-js/faker";


const router = express.Router();

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(`check accept header`);

    if (req.headers.accept && req.headers.accept === "application/json") {
        next();

    } else {
        if (req.method === "OPTIONS") {
            next();
        } else{
            res.status(406).json({ message: "Webservice only accept json. did you forgot to accept header?" });
        }
    }

});

router.options("/", (req, res) => {
    res.header("Allow", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
    res.header("Access-Control-Allow-Origin", "*");
    res.status(204).send();
});


// GET all notes
router.get("/", async (req, res) => {
    try {
        const notes = await Note.find({},'-body');
        const notesCollection = {
            items: notes,
            _links:{
                self: { href: process.env.BASE_URI
                },
                collection: {
                    href: process.env.BASE_URI
                }
            }
        }
        res.json(notesCollection);
    } catch (e) {
        res.status(500).json({ message: "Error fetching notes" });
    }

});

router.post("/", async (req, res) => {
    const  note = Note({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author
    });

    if (!note.title || !note.body || !note.author) {
        res.status(400).json({ message: "Title, body and author are required submit failed" });
    } else {
        await note.save();
        res.status(201).json(note);
    }

})

// SEED route
router.post("/seed", async (req, res) => {
    const notes = [];
    await Note.deleteMany({});
    const amount = req.body?.amount ?? 10;


    for (let i = 1; i < amount; i++) {
        const note = Note({
            title: faker.lorem.slug(6),
            body: faker.lorem.text(),
            author: faker.person.fullName()
        });

        note.save();
        notes.push(note);
    }

    res.json(notes);
});

// update note by ID
router.put("/:id", async (req, res) => {
    const id = req.params.id;

    // Validatie
    if (!req.body.title || !req.body.body || !req.body.author) {
        return res.status(400).json({
            message: "Title, body and author are required"
        });
    }

    try {
        const updatedNote = await Note.findByIdAndUpdate(
            id,
            {
                title: req.body.title,
                body: req.body.body,
                author: req.body.author
            },
            { new: true } // <-- heel belangrijk: return updated document
        );

        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json(updatedNote);

    } catch (err) {
        res.status(500).json({ message: "Error updating note" });
    }
});

// GET note by ID
router.get("/:id", async (req, res) => {
    const noteId = req.params.id;

    try {
        const note = await Note.findById(noteId);

        res.json(note);
    } catch (e) {
        res.status(404).json({ message: "Note not found" });
    }
});

export default router;