var app = (function () {

    var mobileApp = {};
    
     var groupedData = [
        {
            name: "Sashimi Salad",
            description: "Зелень, украшеная свежими сашими, васаби, соевый винегрет.",
            url: "images/sashimi-salad.jpg",
            price: 170,
            letter: "Роллы"
            },
        {
            name: "Seaweed Salad",
            description: "Салат из морепродуктов.",
            url: "images/seaweed-salad.jpg",
            price: 290,
            letter: "Роллы"
            },
        {
            name: "Edamame",
            description: "Вареные соевые бобы с солью.",
            url: "images/edamame.jpg",
            price: 120,
            letter: "Роллы"
            },
        {
            name: "Maguro",
            description: "Кусочки тунца.",
            url: "images/maguro.jpg",
            price: 150,
            letter: "Роллы"
            },
        {
            name: "Tekka Maki",
            description: "Тунец-ролл с васаби.",
            url: "images/tekka-maki.jpg",
            price: 240,
            letter: "Роллы"
            },
        {
            name: "California",
            description: "Крабовые палочки, авокадо и огурец.",
            url: "images/california-rolls.jpg",
            price: 250,
            letter: "Роллы"
            }
    ];

    function initialize() {
        mobileApp = new kendo.mobile.Application(document.body, {skin: "flat"});
    };
    
    function initMain() {
        $("#main-list").kendoMobileListView({
                dataSource: kendo.data.DataSource.create({
                    data: groupedData,
                    group: "letter"
                }),
                template: $("#main-template").html(),
                headerTemplate: "<h2>${value}</h2>"
            });
    }

    document.addEventListener("deviceready", initialize);
    
    return {
        init: initMain
    }

}());