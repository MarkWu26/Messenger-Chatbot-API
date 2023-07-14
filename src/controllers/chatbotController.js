require("dotenv").config();

import request from "request";

const test = (req, res) => {
    return res.send("Welcome to messenger chatbot")
}



const getWebhook = (req, res) => {
    console.log("Webhook Im working")
    const YOUR_VERIFY_TOKEN = process.env.YOUR_VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === YOUR_VERIFY_TOKEN) {
            console.log("Webhook is verified yehey!")
            res.status(200).send(challenge)
        } 
    } else {
        res.sendStatus(403)
    }
}

const postWebhook = (req, res) => {
    console.log("Im working")
    const body = req.body;
    
    if (body.object === "page") {
        body.entry.forEach(function(entry) {
            const webhookEvent = entry.messaging[0];
            console.log(webhookEvent);
        
        const sender_psid = webhookEvent.sender.id;
        console.log(`sender Id: ${sender_psid}`);

        if(webhookEvent.message){
            handleMessage(sender_psid, webhookEvent.message);
        }

        });

        res.status(200).send('EVENT RECEIVED');
    } else {
        res.sendStatus(404)
    }

}

// Handles messages events
const handleMessage = (sender_psid, received_message) => {

    console.log("handling message....");

    let response;

    if(received_message.text){
        response = {
            "text": `You sent the message: "${received_message.text}".  `
        }
    }

    callSendAPI(sender_psid, response)

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
const callSendAPI = (sender_psid, response) => {

    console.log("sending back message");
    
    const PAGE_ACCESS_TOKEN = process.env.NEWPAGETOKEN

  let request_body ={
    "recipient": {
        "id": sender_psid
    },
    "message": response
  }

  request({
    "uri": "https://graph.facebook.com/v17.0/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN},
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 


}

module.exports = {
    test:test,
    getWebhook:getWebhook,
    postWebhook:postWebhook
};