const express = require("express");
const bodyParser = require("body-parser");// it is npm module which process data sent in the HTTP request body
const request = require("request");
const app = express();
const https = require("https") // it is used  for making http calls.

app.use(express.static("public")); // use this code to render css and images on server using static and placed files in public

app.use(bodyParser.urlencoded({ extended: true }));// written for post method to take input from user on html page to thr server

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function (req, res) {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);// converts javascript object into string , here data is object

    const url = "https://us21.api.mailchimp.com/3.0/lists/cd295a67ec";

    const options = {
        method: "POST",
        auth: "dhiraj1:0bd16fe6de30d359f2070e40d1e4a370-us21"
    }

    const request = https.request(url, options, function (response) { // makes request

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));// using JSON.parse data converted into javascript object
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure.html", function (req, res) { // when we got failure we will land on home page
    res.redirect("/")// redirect method will land us on home page.
})
app.listen(3000, function () {
    console.log("server started on port 3000")
})

// API key
// 0bd16fe6de30d359f2070e40d1e4a370-us21


// list id
// cd295a67ec