var productsAndSubstitutes = {};

$(document).ready(function(){
    $("#header").load("../components/header.html");
    $("#footer").load("../components/footer.html");
    getProductsAndSubstitues(parseProductsAndSubstitutes);
    backToAllProducts();
});

function getProductsAndSubstitues(callback) {
    const sampleJsonFile = new XMLHttpRequest();
    sampleJsonFile.overrideMimeType("application/json");
    sampleJsonFile.open("GET", "../sample/result.json", true);
    sampleJsonFile.onload = () => {
        productsAndSubstitutes = JSON.parse(sampleJsonFile.responseText);
        callback(JSON.parse(sampleJsonFile.responseText));
    };
    sampleJsonFile.send();
}

function parseProductsAndSubstitutes(data) {
    $(".cart-list-contents").html("");
    var counter = 0;
    $.each(data, function (index, value) {
        const singleProduct =
            '<div>'+
                '<div class="item-title"> "' +
                    value.derived_food_item+
                '" </div>'+
                '<div class="row recommended-item"> ' +
                    'Recommended item: ' +
                '</div> ' +
                '<div class="row"> ' +
                    '<div class="col-3"> ' +
                        '<img class="productImg" src='+value.products[0].primaryImage+'>'+
                    '</div> ' +
                    '<div class="col-5 description">' +
                        value.products[0].productName +
                        '<div class="col-1 price"><b> ' +
                        '$' + value.products[0].price +
                    '</b></div> ' +
                    '</div>' +
                    '<div class="itemCounter"><img id="decrement' +
                    counter + '" class="counter-button" src="../assets/img/Minus.png"><input id ="counter-box' +
                    counter + '" type="text" value="0"/><img id="increment' +
                    counter + '" class="counter-button" src="../assets/img/Plus.png"></div></div>' +
                    '<a class="substitute-link" href="#" id=substitute'+ index +' product='+ value.food_id+ '> SUBSTITUTE </a> ' + '</div><br><div class="divider"></div>' 
                '</div>' +
            '</div>'
            '<br><br> ' + 
            '<hr> ';
        counter = counter + 1;
        $(".cart-list-contents").append(singleProduct);
        loadButtonFunctions(counter-1);
        registeringSubstituteClick(index);
    });
}

function loadButtonFunctions(counter) {
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

function registeringSubstituteClick(index) {
    $("#substitute" + index).click(function () {
        $(".cart-contents").hide();
        $(".substitutes-items").show();
        showAllSubstituteProducts($(this).attr("product"), index);
    });
}

function showAllSubstituteProducts(productId, indexOfProductsAndSubstitutes) {
    $(".substitutes-items-content").html("");
    const productSubstitutes = productsAndSubstitutes.filter(obj => {
        return obj.food_id === productId
    });

    $.each(productSubstitutes[0].products, function (index, value) {
        if(value.productName.length>30){
            value.productName = value.productName.substr(0,27)+'...';
        }
    const singleSubstituteProduct =
            '<a class="select-substitute-link" href="#" id=productSelected' + value.id + '>'+
                '<div class="substitute-item-container"> ' +
                    '<div class="substitute-item-desc"> ' +
                        '<div class="substitute-item-image">' +
                            '<img class="substitute-img" src="' + value.primaryImage + '"> ' +
                        '</div> '+
                        '<div class="substitute-item-name">' +
                            value.productName + 
                        '</div> '+
                        '<div class="substitute-item-price"><b> $' +
                            value.price + 
                        '</b></div> '+
                        // '<a href="#" id=productSelected' + value.id +' product="'+ value.id + '">' +value.productName + ' $ ' + value.price + '</a>'+
                        // '<a class="select-substitute-link" href="#" id=productSelected' + value.id +'> SELECT </a>'+
                    '</div> ' +
                '</div>'+
            '</a>';
        $(".substitutes-items-content").append(singleSubstituteProduct);
        registeringSingleSubstituteProductClicks(index, value.id, indexOfProductsAndSubstitutes)
    });
}

function registeringSingleSubstituteProductClicks(indexOfSubstituteChosen, productId, indexOfProductsAndSubstitutes) {
    $("#productSelected" + productId).unbind("click").click(function () {
        $(".cart-contents").show();
        $(".substitutes-items").hide();
        var tempProduct = productsAndSubstitutes[indexOfProductsAndSubstitutes].products[0];
        productsAndSubstitutes[indexOfProductsAndSubstitutes].products[0] = productsAndSubstitutes[indexOfProductsAndSubstitutes].products[indexOfSubstituteChosen];
        productsAndSubstitutes[indexOfProductsAndSubstitutes].products[indexOfSubstituteChosen] = tempProduct;
        parseProductsAndSubstitutes(productsAndSubstitutes);
    });
}

function backToAllProducts() {
    $("#back").unbind("click").click(function () {
        $(".cart-contents").show();
        $(".substitutes-items").hide();
    });
}