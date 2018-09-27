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
    enum: ["web", "mobile", "network"],
    lowercase: true,
    trim: true
  },
  author: String,
  tags: {
    type: Array,
    //custom validator
    validate: {
      isAsync: true,
      validator: function(v, callback) {
        setTimeout(() => {
          //Do some async work
          const result = v && v.length > 0;
          callback(result);
        }, 3000);

        //return v && v.length > 0; //work for null also
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
    },
    min: 10,
    max: 200,
    get: v => Math.round(v),
    set: v => Math.round(v)
  }
});

const Course = mongoose.model("course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "DotNet",
    category: ["network"],
    author: ".netMaster",
    tags: [".net"],
    isPublished: true,
    price: 25.6
  });
  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    console.log(ex.message);
  }
}

createCourse();
