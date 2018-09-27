const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/CRUDMongo")
  .then(() => console.log("connected to MongoDB"))
  .catch(err => console.log("could not connect to Mongo"));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});

const Course = mongoose.model("course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Java",
    author: "JavaMaster",
    tags: ["Java", "Allrounder"],
    isPublished: true
  });
  const result = await course.save();
  console.log(result);
}

async function getCourses() {
  //comaparison operator
  //eq (equal), ne(not equal), gt(greater than), gte(greater than or equal to), lt(less than), lte(less than equal to)
  // in , nin (not in)
  //EXAMPLES
  //find({price:{$gt:10,$lte:20}})
  //find({price:{$in:[10,15,20]}})

  //Logical Operator
  //or, and
  //EXAMPLES
  //find().or([{author:mosh},{isPublish:true}])
  //find().and([{},{}])

  //Regular Expressions
  //EXAMPLES
  // Starts with mosh
  //find({author:/^mosh/})

  //End with Hamedani
  //find({author:/Hamedani$/i})

  //Mosh can be anywhere
  //find({author:/.*Mosh.*/i})

  const courses = await Course.find();
  console.log(courses);
  const filterCourseData = await Course.find({ name: "AngularJs" });
  //    console.log(filterCourseData);
  const particularCoursesfield = await Course.find().select({
    name: 1,
    tags: 1
  });
  //    console.log(particularCoursesfield)
}

async function updateCourse(id) {
  //Approach1: Query first
  //findById()
  //Modify its properties
  //save()
  //Approach2: update first
  //update directly
  // Optionally : get update document
  //=========Method1 query and update document===============
  // const course = await Course.findById(id);
  // if (!course) return;
  // First Approach
  // course.isPublished = false;
  // course.author = "Author Changed";
  //Second Approach
  // course.set({
  //   isPublished: false,
  //   author: "Author Changed"
  // });

  //============Method2 update diretly in DB==================
  const course = await Course.findByIdAndUpdate(
    id,
    {
      $set: {
        author: "jason",
        isPublish: true
      }
    },
    { new: true } //new is true to show updated Document in the console, if dont use new:true old doucment will be shown in
    // console
  );
  //const result = await course.save();
  console.log(course);
}

async function removeCourse(id) {
  const result = await Course.deleteOne({ _id: id }); //DB method return {n:0,ok:1}
  //  const result = await Course.findByIdAndRemove(id); //Mongoose Method return an object with info
  console.log(result);
}

//createCourse();
//getCourses();
//updateCourse("5ba88c845051f60da0d40378");
removeCourse("5bab361bbfe8283e5cfeca7b");
