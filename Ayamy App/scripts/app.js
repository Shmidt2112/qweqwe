var app = (function () {

    var mobileApp = {},
        dataSource, price, total = 0,
        count = 0,
        countEl;

    var groupedData = [
        {
            id: 0,
            name: "Sashimi Salad",
            description: "Зелень, украшеная свежими сашими, васаби, соевый винегрет.",
            url: "images/sashimi-salad.jpg",
            price: 170,
            letter: "Роллы"
            },
        {
            id: 1,
            name: "Seaweed Salad bla bla bla",
            description: "Салат из морепродуктов.",
            url: "images/seaweed-salad.jpg",
            price: 290,
            letter: "Роллы"
            },
        {
            id: 2,
            name: "Edamame",
            description: "Вареные соевые бобы с солью.",
            url: "images/edamame.jpg",
            price: 120,
            letter: "Роллы"
            },
        {
            id: 3,
            name: "Maguro",
            description: "Кусочки тунца.",
            url: "images/maguro.jpg",
            price: 150,
            letter: "Роллы"
            },
        {
            id: 4,
            name: "Tekka Maki",
            description: "Тунец-ролл с васаби.",
            url: "images/tekka-maki.jpg",
            price: 240,
            letter: "Роллы"
            },
        {
            id: 5,
            name: "California",
            description: "Крабовые палочки, авокадо и огурец.",
            url: "images/california-rolls.jpg",
            price: 250,
            letter: "Роллы"
            }
    ];

    function initialize() {

        mobileApp = new kendo.mobile.Application(document.body, {
            skin: "flat"
        });

        dataSource = new kendo.data.DataSource({
            data: groupedData
        });
    }

    function initMain() {
        $("#main-list").kendoMobileListView({
            dataSource: kendo.data.DataSource.create({
                data: groupedData,
                group: "letter"
            }),
            template: $("#main-template").html(),
            headerTemplate: "<h4>${value}</h4>"
        });
    }

    function plus(e) {
        //Получаем текущий элемент с кол-вом
        countEl = $(e.target).prev();
        //Получаем текущее кол-во
        count = +$(e.target).prev().text();
        price = +$(e.target).prev().data("price");
        //Прибавляем 1
        count++;
        //Заносим в текущий элемент
        $(e.target).prev().text(count);
        //Вычитаем из общей стоимости текущий товар
        total += price;
        // //Заносим с текущим кол-вом
        //total += price * count;
        $("#basket").text(total);
    }

    function minus(e) {
        countEl = $(e.target).next();
        count = +$(e.target).next().text();
        price = +$(e.target).next().data("price");
        if (count > 1) {
            count--;
            $(e.target).next().text(count);
            //Вычитаем из общей стоимости текущий товар
            total -= price;
            $("#basket").text(total);
        }
    }

    var purchase = [];
    var item = {};

    function doPrice(e) {

        //Текущая цена
        price = $(e.target).data("price");
        //Если цена выделена
        if (!$(e.target).data("on")) {
            //Общая стоимость
            total += price;
            $(e.target).data("on", true);
        } else {
            if (total - price * count > 0) {
                total -= price * count;
                $(countEl).text(1);
            } else {
                total = 0;
            }
            $(e.target).data("on", false);
        }

        $("#basket").text(total);
        $(e.target).toggleClass("prices-clicked");
        $("#" + $(e.target).data("id")).slideToggle("normal");
    }

    document.addEventListener("deviceready", initialize);

    return {
        init: initMain,
        doPrice: doPrice,
        p: plus,
        m: minus
    }

}());