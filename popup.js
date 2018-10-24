//initial global variable settings
var counter = 0;
var parsedData = {};
var loader;

var PopupController = function () {
    this.button_ = document.getElementById('button');
    this.addListeners_();
};

PopupController.prototype = {
    button_: null,

    addListeners_: function () {
        this.button_.addEventListener('click', this.handleClick_.bind(this));
    },

    handleClick_: function () {
        console.log('parsedData: ', parsedData);
        this.button_.setAttribute('disabled', 'disabled');
        this.button_.innerText = 'Sending...';

        console.log("Adding items to cart");
        document.getElementById("loblaws-header").style.display = "none";
        document.getElementById("extension-body").style.display = "none";
        document.getElementById("success-page").style.display = "block";
        var success = document.createElement('div');
        success.classList.add('overlay');
        success.setAttribute('role', 'alert');
        success.textContent = 'Data has been sent.';
        document.body.appendChild(success);

        setDomInfo();

        chrome.runtime.sendMessage({
                from: 'popup', subject: 'postStuff', message: parsedData
            },
            function (response) {
                alert(parsedData);
                // getInfo(response);
            }
        );
        // setTimeout(function() { success.classList.add('visible'); }, 10);
        // setTimeout(function() {
        //   if (close === false)
        //     success.classList.remove('visible');
        //   else
        //     window.close();
        // }, 4000);
    }
};

function setDomInfo() {
    var i = 0;
    for (i = 0; i < counter; i++) {
        var qty = document.getElementById('counter-box' + i);
        parsedData.entries[i].quantity = parseInt(qty.value, 10);
    }
    console.log('POST: ', parsedData);
}

function loaderFunction(info) {
  document.getElementById("extension-body").style.display = "none";
  document.getElementById("success-page").style.display = "none";
  document.getElementById("loader-body").style.display = "block";
  // loader = setTimeout(setInfo(info), 1);
  loader = setInfo(info);
}

function setInfo(info) {
    var url = "http://18.217.104.139/parse_ner";
    // var data = {"food_item": info.docContent};
    var data = {"food_item":info.docContent};
    // var data = "{'food_item':'"+info.docContent+"'}"
    // console.log(data);
    // console.log(data);
    data.message = "Recipe AI Sample";
    var json = JSON.stringify(data);
    // console.log(data);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onload = function () {
        document.getElementById("loader-body").style.display = "none";
        document.getElementById("extension-body").style.display = "block";
        document.getElementById("success-page").style.display = "none";
        // alert(xhr.responseText);
        console.log(xhr.responseText);
    };
    // console.log(dataEntry);
    // xhr.send(data);
    xhr.send(json);

    // document.getElementById("loader-body").style.display = "none";
    // document.getElementById("extension-body").style.display = "block";
    // document.getElementById("success-page").style.display = "none";
    //
    var rawJsonFile = new XMLHttpRequest();
    rawJsonFile.overrideMimeType("application/json");
    rawJsonFile.open("GET", "../data/entries.json", true);
        rawJsonFile.onload = () => {
        // sendResponse(
        getInfo(rawJsonFile.responseText);
        // );
    };
    rawJsonFile.send();
}
// https://www.allrecipes.com/recipe/236602/chef-johns-corned-beef-hash/?internalSource=rotd&referringContentType=home%20page&clickId=cardslot%201
function getInfo(info) {
    //resets the counter every single time you relaunch extension
    counter = 0;
    parsedData = JSON.parse(JSON.stringify(info));
    if (parsedData || typeof parsedData === 'string') {
        parsedData = JSON.parse(parsedData);
    }
    var dataEntry = parsedData.entries;
    var recipeItems = document.getElementById('recipeItems');
    var content = '';
    for (counter = 0; counter < dataEntry.length; counter++) {
        content = '<div class="divider"></div>' +
            '<div class="food-item-holder"><div class="item-container"><div class="item-title">' +
            dataEntry[counter].Product + '</div><div class="item-recommended">Recommended item: </div><table><tbody><tr><td><img src=' +
            dataEntry[counter].ImageURL + ' class="productImg"/></td><td class="description" height=auto valign="top">' +
            dataEntry[counter].Description + '<br/><b>' +
            dataEntry[counter].minQty + ' x $' +
            dataEntry[counter].Price + '</b></td><td valign="top"><b>' +
            dataEntry[counter].Price + '</b></td></tr></tbody></table><div class="button-container"><div class="substitute">SUBSTITUTE</div><div class="itemCounter"><img id="decrement' +
            counter + '" class="counter-button" src="./assets/Minus.png"><input id ="counter-box' +
            counter + '" type="text" value="0"/><img id="increment' +
            counter + '" class="counter-button" src="./assets/Plus.png"></div></div></div></div></div>';
        $("#recipeItems").append(content);
        loadButtonFunctions(parsedData, counter, dataEntry[counter].Id);
    }
}

function loadButtonFunctions(data, counter, productId) {
    var increment = document.getElementById('increment' + counter);
    var decrement = document.getElementById('decrement' + counter);
    var counterbox = document.getElementById('counter-box' + counter);

    increment.addEventListener('click', function () {
        counterbox.value = parseInt(counterbox.value) + 1;
    })
    decrement.addEventListener('click', function () {
        if (counterbox.value > 0) {
            counterbox.value = parseInt(counterbox.value) - 1;
        } else {
            counterbox.value = 0;
        }
    })
}


window.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {from: 'popup', subject: 'info'},
            loaderFunction);
            // setInfo);
    });
    // chrome.runtime.sendMessage(
    //   {from:'background', subject: 'getStuff'},
    //   function (response) {
    //       getInfo(response);
    //   }
    // );
    window.PC = new PopupController();
});
