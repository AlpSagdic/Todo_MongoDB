import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const itemSchema = new mongoose.Schema({
    title: String,
    complete: Boolean
});

const Item = mongoose.model("Item", itemSchema);

app.get("/", async (req, res) => {
    const todos = await Item.find({});
    res.render("index.ejs", { todos: todos });
});

app.post("/add", (req, res) => {
    const newTodo = req.body;
    const todo = new Item({
        title: newTodo.title,
        complete: false
    });
    todo.save();

    res.redirect("/");
});

app.post("/delete", async (req, res) => {
    const deleteItem = req.body.id;
    if (deleteItem != undefined) {
        await Item.findByIdAndRemove(deleteItem)
        .then(() => console.log(`Item Deleted ${deleteItem} Successfully`))
        .catch((err) => console.log("Error: " + err));
        res.redirect("/");
    }
});

app.post("/complete", async (req, res) => {
    const completeItem = req.body.id;
    if (completeItem != undefined) {
        await Item.findByIdAndUpdate(completeItem, { complete: true }, {
            returnOriginal: false
        })
        .then(() => console.log(`Item Deleted ${completeItem} Successfully`))
        .catch((err) => console.log("Error: " + err));
        res.redirect("/");
    }
});

//app.get("/:name", async (req, res) => {
//    console.log("Selam ben "+req.params.name);
//});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


