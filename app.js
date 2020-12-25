// jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();

// css and images are static files in our local system. 
// A public folder is the saviour if we want to load static files.
app.use(express.static("public"));


app.use(bodyParser.urlencoded({ extended: true }));

mailchimp.setConfig({
    apiKey: "Your api key",
    server: "e.g. us7"
  });

app.listen(3000, function(){
    console.log("Server running at port 3000.");
})

app.get('/', function (request,response) {
    
    response.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
 
    const listId = "Your unique list id";
    const subscribingUser = {
        firstName: req.body.FirstName,
        lastName: req.body.LastName,
        email: req.body.Email
    };
   
    async function run() {
        try{
            const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
            });
    
            console.log(
            `Successfully added contact as an audience member. The contact's id is ${response.id}.`
            );
            res.sendFile(__dirname + "/success.html");
        } 
        catch (e) {
            res.sendFile(__dirname + "/failure.html");
        }
    }
    
   
    run();
  })

  app.post("/failure", function(req, res) {
    res.redirect("/");
  })


