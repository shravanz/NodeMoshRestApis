const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/CRUDMongo")
  .then(() => console.log("connected to MongoDB"))
  .catch(err => console.log("could not connect to Mongo"));

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 255 },
  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "network"]
  },
  author: String,
  tags: {
    type: Array,
    //custom validator
    validate: {
      validator: function(v) {
        return v && v.length > 0; //work for null also
      },
      message: "A course should have at least one tag"
    }
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function() {
      return this.isPublished;
    }
  }
});

const Course = mongoose.model("course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "DotNet",
    category: ["network"],
    author: ".netMaster",
    tags: [],
    isPublished: true,
    price: 25
  });
  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    console.log(ex.message);
  }
}

createCourse();
