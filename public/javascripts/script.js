//links
//http://eloquentjavascript.net/09_regexp.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
nlp = window.nlp_compromise;

var messages = [], //array that hold the record of each string in chat
  lastUserMessage = "", //keeps track of the most recent input string from the user
  botMessage = "", //var keeps track of what the chatbot is going to say
  botName = 'Sammybot', //name of the chatbot
  talking = true; //when false the speach function doesn't work
//
//
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//edit this function to change what the chatbot says
function chatbotResponse() {
  talking = true;
  //botMessage = "How Can i help you ?"; //the default message

  /*if (lastUserMessage === 'hi') {
    botMessage = 'Howdy!';
  }

  if (lastUserMessage === 'name') {
    botMessage = 'My name is ' + botName;
  }*/
}
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//
//
//
//this runs each time enter is pressed.
//It controls the overall input and output
function newEntry() {
  //if the message from the user isn't empty then run 
  if (document.getElementById("chatbox").value != "") {
    //pulls the value from the chatbox ands sets it to lastUserMessage
    lastUserMessage = document.getElementById("chatbox").value;
    //sets the chat box to be clear
    document.getElementById("chatbox").value = "";
    //adds the value of the chatbox to the array messages
    messages.push("<b>Customer: " + lastUserMessage);
    //send the message for api.ai processing
    var body = '{"content": "' + lastUserMessage + '"}';
    /*var response = $.ajax({
           url: "http://localhost:3000/respapi",
           method: "post",
           dataType:'json',
           data: JSON.stringify(body),
           headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
           },
           success:function(response){
                if(response.result.fulfillment.speech){
                    botMessage = response.result.fulfillment.speech;
                    messages.push("<b>" + botName + ":</b> " + response.result.fulfillment.speech);
                }
                else{
                    botMessage = "Unable to connect to assistant.";
                    messages.push("<b>" + botName + ":</b> " + "Unable to connect to assistant.");
                }

                //Speech(lastUserMessage);  //says what the user typed outloud
                //sets the variable botMessage in response to lastUserMessage
                chatbotResponse();
                //add the chatbot's name and message to the array messages
                
                // says the message using the text to speech function written below
                Speech(botMessage);
                //outputs the last few array elements of messages to html
                for (var i = 1; i < 8; i++) {
                if (messages[messages.length - i])
                    document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                botMessage = "Error while connecting to assistant.";
                messages.push("<b>" + botName + ":</b> " + "Error while connecting to assistant.");

                //Speech(lastUserMessage);  //says what the user typed outloud
                //sets the variable botMessage in response to lastUserMessage
                chatbotResponse();
                //add the chatbot's name and message to the array messages
                
                // says the message using the text to speech function written below
                Speech(botMessage);
                //outputs the last few array elements of messages to html
                for (var i = 1; i < 8; i++) {
                if (messages[messages.length - i])
                    document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
                }
            } 
        }); */

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "https://evening-tor-68131.herokuapp.com/respapi", true);

        xhttp.onreadystatechange = function() {
            if (xhttp.readyState>3 && xhttp.status==200) {
                var response = JSON.parse(xhttp.responseText);

                if(response.result.fulfillment.speech){
                    botMessage = response.result.fulfillment.speech;
                    messages.push("<b>" + botName + ":</b> " + response.result.fulfillment.speech);
                }
                else{
                    botMessage = "I am having trouble answering your query. You can logon to samsclub.com or login via app.";
                    messages.push("<b>" + botName + ":</b> " + "I am having trouble answering your query. You can logon to samsclub.com or login via app");
                }

                //Speech(lastUserMessage);  //says what the user typed outloud
                //sets the variable botMessage in response to lastUserMessage
                chatbotResponse();
                //add the chatbot's name and message to the array messages
                
                // says the message using the text to speech function written below
                Speech(botMessage);
                //outputs the last few array elements of messages to html
                for (var i = 1; i < 8; i++) {
                    if (messages[messages.length - i])
                        document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
                }
            }
        };
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(body);
        for (var i = 1; i < 8; i++) {
            if (messages[messages.length - i])
                document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
        }
  }
}

//text to Speech
//https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API
function Speech(say) {
  if ('speechSynthesis' in window && talking) {
    var utterance = new SpeechSynthesisUtterance(say);
    //msg.voice = voices[10]; // Note: some voices don't support altering params
    //msg.voiceURI = 'native';
    //utterance.volume = 1; // 0 to 1
    //utterance.rate = 0.1; // 0.1 to 10
    //utterance.pitch = 1; //0 to 2
    //utterance.text = 'Hello World';
    //utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  }
}

//runs the keypress() function when a key is pressed
document.onkeypress = keyPress;
//if the key pressed is 'enter' runs the function newEntry()
function keyPress(e) {
  var x = e || window.event;
  var key = (x.keyCode || x.which);
  if (key == 13 || key == 3) {
    //runs this function when enter is pressed
    newEntry();
  }
  if (key == 38) {
    console.log('hi')
      //document.getElementById("chatbox").value = lastUserMessage;
  }
}

//clears the placeholder text ion the chatbox
//this function is set to run when the users brings focus to the chatbox, by clicking on it
function placeHolder() {
  document.getElementById("chatbox").placeholder = "";
}