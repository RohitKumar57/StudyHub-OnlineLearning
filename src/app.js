const express = require('express');
const path = require('path');
require("./database/connection.js");
const hbs = require('hbs')
const app = express();
const session = require('express-session');

// Mongoose
const User = require("./models/userdetails.js");
const { log } = require('console');


const port = process.env.PORT || 2000;

// Paths
const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");



// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticPath));
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
}));
// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
    if (req.session.loginSuccess === true) {
        next(); // User is authenticated, continue to the next middleware/route
    } else {
        // User is not authenticated, redirect to login page with an alert
        res.render("loginus", { loginAlert: true });
    }
}


// Using view engine
app.set("view engine", "hbs");
app.set("views", templatePath)
hbs.registerPartials(partialPath)

// Routing
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/aboutus", isLoggedIn,(req, res) => {
    res.render("aboutus");
});
app.get("/ourservices", (req, res) => {
    res.render("ourservices");
});
app.get("/location", (req, res) => {
    res.render("location");
});
app.get("/contactus", (req, res) => {
    res.render("contactus");
});
// app.get("/contactus", (req, res) => {
//     const isNotLoggedIn = req.session.loginSuccess !== true;

//     res.render("contactus", { isNotLoggedIn });
// });


app.get("/loginus", (req, res) => {
    res.render("loginus");
});

app.get("*", (req, res)=>{
    res.render("404page");
})







// POSTING 

app.post("/contactus", async (req, res) => {
    try {
        const userData = new User(req.body);
        await userData.save();
        
        // Now that the data is saved, render the contactus view with a success flag
        res.status(201).render("loginus", { registrationSuccess: true });
    } catch (error) {
        res.status(500).send(error);
    }
});


// app.post("/loginus", async(req, res)=>{
//     try {
//         const my_email= req.body.email;
//         const password = req.body.password;

//         const user_mail = await userData.findOne({email: my_email})
//         console.log(user_mail);
//         console.log("hello guys")
//         res.send(user_mail);
//     } catch (error) {
//         res.status(400).send("Invalid login Details..")
//     }
// })
app.post('/loginus', async (req, res) => {
    try {
        const my_email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email: my_email });

        if (!user) {
            return res.render('usernotfound_page');
        }

        // Assuming your password field in the schema is hashed
        if (user.password !== password) {
            // return res.status(400).send('Incorrect Details');
            return res.render('usernotfound_page');
        }

        // Set the loginSuccess flag in the session
        req.session.loginSuccess = true;

        console.log(user);
        console.log('Login successful');

        // Redirect the user to the aboutus page
        res.redirect('/aboutus');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// Server
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
