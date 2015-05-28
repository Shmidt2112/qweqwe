var app = (function () {

    var dataSource,
        mobileApp = {},
        purchase = [];

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
            filterable: {
                field: "name",
                operator: "startswith",
                placeholder: "Поиск..."
            },
            template: $("#main-template").html(),
            headerTemplate: "<h4 style='color:gray'>${value}</h4>"
        });
    }

    var Item = function (id, price) {
        this.id = id;
        this.price = price;
        this.count = 1;
        this.total = price;
    }

    function agregate() {
        //Подводим итог
        //Суммируем все елементы массива и заносим в корзину
        var sum = 0;
        for (var j = 0; j < purchase.length; j++) {
            sum += purchase[j].total;
        }
        $("#basket").text(sum);
    }

    function plus(e) {
        //Получаем текущий объект по id
        var id = $(e.target).prev().data("id");
        for (var i = 0; i < purchase.length; i++) {
            if (purchase[i].id === id) {
                //Увеличиваем на кол-во на 1
                purchase[i].count++;
                //Заносим в текущий элемент
                $(e.target).prev().text(purchase[i].count);
                //Устанавливаем новую стоимость
                purchase[i].total = purchase[i].count * purchase[i].price;
                break;
            }
        }
        agregate();
    }

    function minus(e) {
        //Получаем текущий объект по id
        var id = $(e.target).next().data("id");
        for (var i = 0; i < purchase.length; i++) {
            if (purchase[i].id === id) {
                if (purchase[i].count > 1) {
                    //Уменьшаем кол-во на 1
                    purchase[i].count--;
                    //Заносим в текущий элемент
                    $(e.target).next().text(purchase[i].count);
                    //Устанавливаем новую стоимость
                    purchase[i].total = purchase[i].count * purchase[i].price;
                    break;
                }
            }
        }
        agregate();
    }

    function doPrice(e) {
        
        var curId = $(e.target).data("id");
        
        //Если цена выделена
        if (!$(e.target).data("on")) {
			var item = new Item(curId, $(e.target).data("price"))
            purchase.push(item);
            //price += item.price;
            //Добавляем сразу в корзину
            agregate();
            $(e.target).data("on", true);
        } else {
            //Ищем полное кол-во по текущему итему
            for (var i = 0; i < purchase.length; i++) {
                if (curId === purchase[i].id) {
                    //Удаляем итем из общего массива
                    purchase.splice(i, 1);
                    $("span[data-id='" + curId + "']").text(1);
                }
            }
            agregate();
            $(e.target).data("on", false);
        }

        //Применяем эффекты
        $(e.target).toggleClass("prices-clicked");
        $("#" + curId).slideToggle("normal");
        $("#img" + curId).fadeToggle("normal");
        $("p.description").toggleClass("description-left");
    }

    function toBasket () {
        mobileApp.navigate("#basket", "slide");
    }
    
    function toFilter () {
        mobileApp.navigate("#filterView", "slide");
    }
    
    function filterViewInit () {
        var listviews = this.element.find("ul.km-listview");

        $("#select-filter").kendoMobileButtonGroup({
            select: function(e) {
                listviews.hide()
                         .eq(e.index)
                         .show();
            },
            index: 0
        });
    }

    document.addEventListener("deviceready", initialize);

    return {
        init: initMain,
        doPrice: doPrice,
        p: plus,
        m: minus,
        goBasket: toBasket,
        goFilter: toFilter,
        filterViewInit: filterViewInit
    }

}());