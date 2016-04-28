/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 * - Web service: communicate with an external web service to get tide data from NOAA CO-OPS API (http://tidesandcurrents.noaa.gov/api/)
 * - Multiple optional slots: has 2 slots (city and date), where the user can provide 0, 1, or 2 values, and assumes defaults for the unprovided values
 * - DATE slot: demonstrates date handling and formatted date responses appropriate for speech
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 * - Dialog and Session state: Handles two models, both a one-shot ask and tell model, and a multi-turn dialog model.
 *   If the user provides an incorrect slot in a one-shot model, it will direct to the dialog model. See the
 *   examples section for sample interactions of these models.
 * - Pre-recorded audio: Uses the SSML 'audio' tag to include an ocean wave sound in the welcome response.
 *
 * Examples:
 * One-shot model:
 *  User:  "Alexa, ask Tide Pooler when is the high tide in Seattle on Saturday"
 *  Alexa: "Saturday June 20th in Seattle the first high tide will be around 7:18 am,
 *          and will peak at ...""
 * Dialog model:
 *  User:  "Alexa, open Tide Pooler"
 *  Alexa: "Welcome to Tide Pooler. Which city would you like tide information for?"
 *  User:  "Seattle"
 *  Alexa: "For which date?"
 *  User:  "this Saturday"
 *  Alexa: "Saturday June 20th in Seattle the first high tide will be around 7:18 am,
 *          and will peak at ...""
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined;//replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var http = require('http'),
    alexaDateUtil = require('./alexaDateUtil');

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * TidePooler is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var VisaEverywhere = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
VisaEverywhere.prototype = Object.create(AlexaSkill.prototype);
VisaEverywhere.prototype.constructor = VisaEverywhere;

// ----------------------- Override AlexaSkill request and intent handlers -----------------------

VisaEverywhere.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

VisaEverywhere.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleWelcomeRequest(response);
};

VisaEverywhere.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

/**
 * override intentHandlers to map intent handling functions.
 */
VisaEverywhere.prototype.intentHandlers = {
    "OneshotTideIntent": function (intent, session, response) {
       // handleOneshotTideRequest(intent, session, response);
    },

    "DialogTideIntent": function (intent, session, response) {
        // Determine if this turn is for city, for date, or an error.
        // We could be passed slots with values, no slots, slots with no value.
        var citySlot = intent.slots.Everywhere;
        handleCityDialogRequest(intent, session, response);
        handleConfirmationDialogRequest(intent, session, response);
        // var dateSlot = intent.slots.Date;
        // if (citySlot && citySlot.value) {
        //     handleCityDialogRequest(intent, session, response);
        // } else if (dateSlot && dateSlot.value) {
        //     handleDateDialogRequest(intent, session, response);
        // } else {
        //     handleNoSlotDialogRequest(intent, session, response);
        // }
    },

    "SupportedCitiesIntent": function (intent, session, response) {
        //handleSupportedCitiesRequest(intent, session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        //handleHelpRequest(response);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};


function handleWelcomeRequest(response) {
    var whichCityPrompt = "What do you want to buy?",
        speechOutput = {
            speech: "<speak>Welcome to Visa Everywhere. "
                + "<audio src='https://s3.amazonaws.com/ask-storage/tidePooler/OceanWaves.mp3'/>"
                + whichCityPrompt
                + "</speak>",
            type: AlexaSkill.speechOutputType.SSML
        },
        repromptOutput = {
            speech: "I can lead you through providing a city and "
                + "day of the week to get tide information, "
                + "or you can simply open Tide Pooler and ask a question like, "
                + "get tide information for Seattle on Saturday. "
                + "For a list of supported cities, ask what cities are supported. "
                + whichCityPrompt,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };

    response.ask(speechOutput, repromptOutput);
}


function handleCityDialogRequest(intent, session, response) {
    
     var pwd = intent.slots.Everywhere.value;

        if(pwd == "test"){
        var s = "Done,A conformation email has been sent. Anything else?";
        response.ask(s);
        //getFxRateResponse(intent,session,response);
        //console.log("8. last...");
        }


        if(pwd == "yes"){
        var s1 = "what do you want me to look for?";
        response.ask(s1);
        }


        if(pwd == "tickets"){
        var s2 = "Sure, a link has been sent for viewing best avaialable seats.Do you want me to buy them?";
        response.ask(s2);
        }

        if(pwd == "get them"){
        var s3 = "Done. You got it.";
        response.ask(s3);
        }

        if(pwd == "thanks"){
            var s4 = "Have a good one. Bye";
            response.tell(s4);
        }
        // if we received a value for the incorrect city, repeat it to the user, otherwise we received an empty slot
        var speechOutput = "Sent one time password to your mobile.Please repeat the password";
        response.ask(speechOutput);
        return;
}


function handleConfirmationDialogRequest(intent, session, response) {

    repromptText = "";
        // if we received a value for the incorrect city, repeat it to the user, otherwise we received an empty slot
        speechOutput = "Your trasaction is complete.Goodbye";
        response.ask(speechOutput, repromptText);
}



// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var visaEverywhere = new VisaEverywhere();
    visaEverywhere.execute(event, context);
};

