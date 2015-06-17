var app = (function () {

    var dataSource, sum, curId, listviews, timer, apiKey = "gR2l3Bi8JjZC4Hhv",
        rootUrl = "http://frontpad.ru/api/index.php",
        mobileApp = {},
        purchase = [],
        purchaseHist = [],
        dirName = "Ayamy",
        fileName = "AyamyHistory.txt",
        userFile = "AyamyUser.txt",
        versionFile = "version.txt",
        el = new Everlive(apiKey),
        dtB = new kendo.data.DataSource({
            type: "everlive",
            transport: {
                typeName: "Settings"
            }
        }),
        groupedData = [
        {	id: 1010,
            name: "Спайси Эби пицца",
            description: "креветка, спайс, сыр (270гр.)",
            url: "images/1010.jpg",
            price: 180,
            letter: "Суши пицца",
            hash: "sushi-pizza"	
        },{	
            id: 1011,
            name: "Сяке Тари пицца",
            description: "куриная грудка, сладкий перец, томаты, майонез, сыр (270гр.)",
            url: "images/1011.jpg",
            price: 180,
            letter: "Суши пицца",
            hash: "sushi-pizza"
        },{
            id: 1012,
            name: "Сяке Эби пицца",
            description: "лосось, креветка, тобико, майонез, сыр (270гр.)",
            url: "images/1012.jpg",
            price: 180,
            letter: "Суши пицца",
            hash: "sushi-pizza"
        },{
            id: 1013,
            name: "Унаги пицца",
            description: "копченый угорь, креветка, кунжут, майонез, сыр (270гр.)",
            url: "images/1013.jpg",
            price: 180,
            letter: "Суши пицца",
            hash: "sushi-pizza"
        },{
            id: 1040,
            name: "Ayami mix",
            description: "копченый угорь, тунец, лосось, авокадо, огурец, сливочн сыр, тобико, кунжут (260гр.)",
            url: "images/1040.jpg",
            price: 250,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 1041,
            name: "BIG унаги маки",
            description: "копченый угорь, огурец, кунжут",
            url: "images/1041.jpg",
            price: 160,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 1043,
            name: "Америка",
            description: "рис, копченый лосось, копченый угорь, лосось терияки, огурей, сливочный сыр (350гр.)",
            url: "images/1043.jpg",
            price: 250,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 1044,
            name: "Атлантический",
            description: "лосось, угорь, сыр сливочный, тобико, огурец (255гр.)",
            url: "images/1044.jpg",
            price: 180,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 1045,
            name: "Банзай",
            description: "копченый угорь, креветка, жаренный лосось, сливочн сыр (250гр.)",
            url: "images/1045.jpg",
            price: 180,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 1049,
            name: "Бостон запеченный",
            description: "рис, угорь, авокодо, гребешок, креветки, огурец, сливочный сыр, яки соус (330гр.)",
            url: "images/1049.jpg",
            price: 270,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10411,
            name: "Гейша",
            description: "копченый угорь, креветка, огурец, сливочн сыр (260гр.)",
            url: "images/10411.jpg",
            price: 190,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10412,
            name: "Греческий",
            description: "рис, сладкий перец, огурец, томат, лист салата ,маслины, сливочный сыр (250гр.)",
            url: "images/10412.jpg",
            price: 170,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10413,
            name: "Дракон",
            description: "копченый угорь, лосось, огурец, кунжут, сливочный сыр (250гр.)",
            url: "images/10413.jpg",
            price: 180,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10414,
            name: "Дядя Сем запеченный",
            description: "копченый угорь, лосось,авокадо, сыр (200гр.)",
            url: "images/10414.jpg",
            price: 190,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10415,
            name: "Жаренный ролл с креветкой",
            description: "креветка, сливочный сыр, темпур, огурец, тобико (250гр.)",
            url: "images/10415.jpg",
            price: 170,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10416,
            name: "Жаренный ролл с курицей",
            description: "курица, сливочный сыр, темпур, огурец, тобико (250гр.)",
            url: "images/10416.jpg",
            price: 170,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10417,
            name: "Жаренный ролл с лососем",
            description: "лосось, сливочный сыр, темпур, огурец, тобико (250гр.)",
            url: "images/10417.jpg",
            price: 170,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10419,
            name: "Жаренный ролл с угрем",
            description: "угорь, сливочный сыр, темпур, огурец, тобико (250гр.)",
            url: "images/10419.jpg",
            price: 170,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10420,
            name: "Жаренный с гребешком",
            description: "гребешок, сливочный сыр, темпур, огурец, тобико (250гр.)",
            url: "images/10420.jpg",
            price: 170,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10422,
            name: "Запеченный Цезарь с креветкой",
            description: "рис, креветка, томат, лист салата, сыр (230гр.)",
            url: "images/10422.jpg",
            price: 210,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10423,
            name: "Запеченный Цезарь с курицей",
            description: "рис, куриная грудка, соус карри, томат, лист салата, сыр (230гр.)",
            url: "images/10423.jpg",
            price: 200,
            letter: "Роллы",
            hash: "rolls"
        },{
			id: 10425,
            name: "Император",
            description: "копченый угорь, маринованный имбирь, огурец,сливочный сыр (250гр.)",
            url: "images/10425.jpg",
            price: 185,
            letter: "Роллы",
            hash: "rolls"
        },{
			id: 10426,
            name: "Инь-янь",
            description: "лосось, тунец (150гр.)",
            url: "images/10426.jpg",
            price: 90,
            letter: "Роллы",
            hash: "rolls"
        },{
			id: 10427,
            name: "Казань",
            description: "копченый лосось, креветка, огурец, сливоч сыр (350гр.)",
            url: "images/10427.jpg",
            price: 260,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10428,
            name: "Калифорния с креветкой",
            description: "креветка, огурец, авокадо, майонез, тобико (240гр.)",
            url: "images/10428.jpg",
            price: 160,
            letter: "Роллы",
            hash: "rolls"
        },{
             id: 10429,
            name: "Камикадзе",
            description: "копченый угорь, креветка, огурец, острый соус, тобико (250гр.)",
            url: "images/10429.jpg",
            price: 180,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10430,
            name: "Карсар",
            description: "лосось терияки, огурец, омлет, чипсы, сливочный сыр (240гр.)",
            url: "images/10430.jpg",
            price: 170,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10431,
            name: "Киа жаренный",
            description: "мидии, сливоч сыр, тобико, спайс, темпур (260гр.)",
            url: "images/10431.jpg",
            price: 190,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10432,
            name: "Киотo",
            description: "креветка, огурец, лист салата, сливоч сыр (240гр.)",
            url: "images/10432.jpg",
            price: 190,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10438,
            name: "Класс. сливочный с лососем",
            description: "острый-сливочный ролл с лососем (145гр.)",
            url: "images/10438.jpg",
            price: 95,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10439,
            name: "Класс. сливочный с тунцом",
            description: "острый-сливочный ролл с тунцом (145гр.)",
            url: "images/10439.jpg",
            price: 95,
            letter: "Роллы",
            hash: "rolls"
        },{
             id: 10440,
            name: "Класс. сливочный с угрем",
            description: "острый-сливочный ролл с угрем (145.)",
            url: "images/10440.jpg",
            price: 95,
            letter: "Роллы",
            hash: "rolls"
        },{
             id: 10453,
            name: "Классический ролл с лососем",
            description: "ролл с лососем (140гр.)",
            url: "images/10453.jpg",
            price: 85,
            letter: "Роллы",
            hash: "rolls"
        },{
             id: 10455,
            name: "Классический ролл с тунцом",
            description: "ролл с тунцом (140гр.)",
            url: "images/10455.jpg",
            price: 85,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10456,
            name: "Классический ролл с угрем",
            description: "ролл с угрем (140гр.)",
            url: "images/10456.jpg",
            price: 85,
            letter: "Роллы",
            hash: "rolls"
        },{
             id: 10461,
            name: "Макс",
            description: "копченый угорь, лосось, куриная грудка,авокадо, огурец, сливоч сыр (310гр.)",
            url: "images/10461.jpg",
            price: 180,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10462,
            name: "Мальта",
            description: "креветка, копченая курица, лист салата, соус цезарь (230гр.)",
            url: "images/10462.jpg",
            price: 190,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10463,
            name: "Маями",
            description: "копченый лосось, огурец, сливоч сыр, укроп (240гр.)",
            url: "images/10463.jpg",
            price: 185,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10464,
            name: "Мехико",
            description: "сырная лепешка, копченный лосось, сливоч сыр, зелень (200гр.)",
            url: "images/10464.jpg",
            price: 220,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10465,
            name: "Нептун запеченный",
            description: "рис, мидии, угорь, креветка, лосось, огурец, сливочный сыр, спайс (270гр.)",
            url: "images/10465.jpg",
            price: 230,
            letter: "Роллы",
            hash: "rolls"
        },{
             id: 10468,
            name: "Овощной микс",
            description: "сладкий перец, огурец, авокадо, лист салаты, майонез (210гр.)",
            url: "images/10468.jpg",
            price: 135,
            letter: "Роллы",
            hash: "rolls"
        },{
             id: 10469,
            name: "Панко жаренный",
            description: "копченый угорь, креветка, авокадо, тобико, сливочн сыр, темпур (260гр.)",
            url: "images/10469.jpg",
            price: 195,
            letter: "Роллы",
            hash: "rolls"
        },{
             id: 10470,
            name: "Прага",
            description: "лосось, бекон, сливоч сыр (250гр.)",
            url: "images/10470.jpg",
            price: 160,
            letter: "Роллы",
            hash: "rolls"
        },{
             id: 10473,
            name: "Ролл с копченой курицей",
            description: "копченая куриная грудка, огурец, кунжут, майонез (240гр.)",
            url: "images/10473.jpg",
            price: 130,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10475,
            name: "Самурай",
            description: "копченый угорь, лосось,авокадо, сливоч сыр (250гр.)",
            url: "images/10475.jpg",
            price: 180,
            letter: "Роллы",
            hash: "rolls"
        },{
             id: 10477,
            name: "Сливочный с креветкой",
            description: "креветка, огурец, кунжут, сливочный сыр (240гр.)",
            url: "images/10477.jpg",
            price: 160,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10478,
            name: "Сливочный с лососем",
            description: "лосось, огурец, кунжут, сливочный сыр (240гр.)",
            url: "images/10478.jpg",
            price: 160,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10479,
            name: "Сливочный с угрем",
            description: "копченый угорь, огурец, кунжут, сливочный сыр (240гр.)",
            url: "images/10479.jpg",
            price: 180,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10483,
            name: "Сюрприз жаренный",
            description: "рис, угорь, авокадо, сливоч.сыр, тобико, спайс (230гр.)",
            url: "images/10483.jpg",
            price: 210,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10485,
            name: "Сяке хотатэ запеченный",
            description: "рис, гребешок, лосось, креветки, спайс, яки соус (290гр.)",
            url: "images/10485.jpg",
            price: 230,
            letter: "Роллы",
            hash: "rolls"
        },{
             id: 10487,
            name: "Такомуру жаренный",
            description: "рис, бекон, коп. курица, сладкий перец, спайс (260гр.)",
            url: "images/10487.jpg",
            price: 200,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10490,
            name: "Токио запеченный",
            description: "рис, копченый лосось, лосось, бекон, огурец, сливочный сыр, тобико (310гр.)",
            url: "images/10490.jpg",
            price: 220,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10494,
            name: "Филадельфия de luxe",
            description: "лосось, сливочный сыр (250гр.)",
            url: "images/10494.jpg",
            price: 165,
            letter: "Роллы",
            hash: "rolls"
        },{
             id: 10495,
            name: "Фристайл",
            description: "лосось, яблоко, сливочный сыр, тобико (240гр.)",
            url: "images/10495.jpg",
            price: 160,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10496,
            name: "Фьюжен",
            description: "лосось, креветка, перец, авокадо, сливоч сыр, спайс, кунжут, тобико (250гр.)",
            url: "images/10496.jpg",
            price: 200,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 10497,
            name: "Хоккайдо",
            description: "копченый угорь, лосось, сливоч сыр, кунжут (250гр.)",
            url: "images/10497.jpg",
            price: 180,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 104100,
            name: "Цезарь ролл",
            description: "куриная грудка, томат, лист салата, соус цезарь (240гр.)",
            url: "images/104100.jpg",
            price: 130,
            letter: "Роллы",
            hash: "rolls"
        },{
             id: 104101,
            name: "Цезарь с кунжутом",
            description: "копченая курица, сладкий перец, лист салата, кунжут, соус цезарь (190гр.)",
            url: "images/104101.jpg",
            price: 145,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 104102,
            name: "Цезарь с сыром",
            description: "копченая куриная грудка, огурец, лист салата, сыр, майонез (180гр.)",
            url: "images/104102.jpg",
            price: 170,
            letter: "Роллы",
            hash: "rolls"
        },{
             id: 104103,
            name: "Черри ролл жаренный",
            description: "копченый угорь, копченая курица, помидоры Черри, сливоч сыр, темпур (300гр.)",
            url: "images/104103.jpg",
            price: 200,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 104106,
            name: "Чудо ролл",
            description: "лосось терияки,, огурец, стружка тунца, сливоч сыр (250гр.)",
            url: "images/104106.jpg",
            price: 180,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 104107,
            name: "Шеф жаренный",
            description: "копченый угорь, лосось, лист салата, сливочн сыр, тобико (300гр.)",
            url: "images/104107.jpg",
            price: 200,
            letter: "Роллы",
            hash: "rolls"
        },{
            id: 1050,
            name: "Cяке",
            description: "рис, лосось (40гр.)",
            url: "images/1050.jpg",
            price: 45,
            letter: "Суши",
            hash: "sushi"
        },{
             id: 1058,
            name: "Муки эби",
            description: "40гр.",
            url: "images/1058.jpg",
            price: 50,
            letter: "Суши",
            hash: "sushi"
        },{
             id: 10511,
            name: "Спайси унаги",
            description: "рис,коп.угорь,лосось,авокадо,сливоч.сыр (250гр.)",
            url: "images/10511.jpg",
            price: 55,
            letter: "Суши",
            hash: "sushi"
        },{
            id: 10510,
            name: "Спайси сяке",
            description: "рис, лосось, спайс (45гр.)",
            url: "images/10510.jpg",
            price: 55,
            letter: "Суши",
            hash: "sushi"
        },{
            id: 10513,
            name: "Спайси эби",
            description: "рис, кревтка, спайс (45гр.)",
            url: "images/10513.jpg",
            price: 55,
            letter: "Суши",
            hash: "sushi"
        },{
             id: 10514,
            name: "Тобико",
            description: "40гр.",
            url: "images/10514.jpg",
            price: 45,
            letter: "Суши",
            hash: "sushi"
        },{
            id: 10515,
            name: "Тори унаги",
            description: "55гр.",
            url: "images/10515.jpg",
            price: 55,
            letter: "Суши",
            hash: "sushi"
        },{
             id: 10516,
            name: "Унаги",
            description: "рис, копченый угорь (40гр.)",
            url: "images/10516.jpg",
            price: 45,
            letter: "Суши",
            hash: "sushi"
        },{
             id: 10518,
            name: "Эби",
            description: "рис, креветка (40гр.)",
            url: "images/10518.jpg",
            price: 45,
            letter: "Суши",
            hash: "sushi"
        },{
             id: 1060,
            name: "Ассорти «4 ролла»",
            description: "Черри ролл, Киото, Сливочный с креветкой, Фристайл (810гр.)",
            url: "images/1060.jpg",
            price: 630,
            letter: "Ассорти",
            hash: "assorted"
        },{
            id: 1061,
            name: "Ассорти «5»",
            description: "Киа, Цезарь с кунжутом, Чиккен роллc, Мальта, Нику Маки (1030гр.)",
            url: "images/1061.jpg",
            price: 750,
            letter: "Ассорти",
            hash: "assorted"
        },{
            id: 1062,
            name: "Вечеринка",
            description: "Карсар, Бон-бекон, Атлантический, Cамурай, Макс, Цезарь, Филадельфия de luxe, Калифорния, Дракон ½, Филадельфия ½ (1860гр.)",
            url: "images/1062.jpg",
            price: 1300,
            letter: "Ассорти",
            hash: "assorted"
        },{
            id: 1064,
            name: "Лайт",
            description: "Греческий, Летний, Америка, Такомуру (1030гр.)",
            url: "images/1064.jpg",
            price: 710,
            letter: "Ассорти",
            hash: "assorted"
        },{
             id: 1065,
            name: "На двоих",
            description: "Калифорния, Макс, Самурай, суши тобико, унаги, эби, сяке (670гр.)",
            url: "images/1065.jpg",
            price: 610,
            letter: "Ассорти",
            hash: "assorted"
        },{
             id: 1070,
            name: "Гречневая лапша с курицей",
            description: "",
            url: "images/1070.jpg",
            price: 170,
            letter: "Блюда",
            hash: "dish"
        },{
            id: 1071,
            name: "Паста Карбонара",
            description: "",
            url: "images/1071.jpg",
            price: 190,
            letter: "Блюда",
            hash: "dish"
        },{
            id: 1072,
            name: "Паста с говядиной в сливочно-сырном соусе",
            description: "",
            url: "images/1072.jpg",
            price: 240,
            letter: "Блюда",
            hash: "dish"
        },{
             id: 1073,
            name: "Паста с креветками и лимоном",
            description: "",
            url: "images/1073.jpg",
            price: 210,
            letter: "Блюда",
            hash: "dish"
        },{
             id: 1074,
            name: "Паста Тальятелле",
            description: "",
            url: "images/1074.jpg",
            price: 180,
            letter: "Блюда",
            hash: "dish"
        },{
            id: 1075,
            name: "Паста Фарфале с телятиной и грибами",
            description: "",
            url: "images/1075.jpg",
            price: 190,
            letter: "Блюда",
            hash: "dish"
        },{
            id: 1076,
            name: "Тяхан с курицей",
            description: "",
            url: "images/1076.jpg",
            price: 150,
            letter: "Блюда",
            hash: "dish"
        },{
            id: 1077,
            name: "Тяхан с морепродуктами",
            description: "",
            url: "images/1077.jpg",
            price: 180,
            letter: "Блюда",
            hash: "dish"
        },{
             id: 1078,
            name: "Удон с говядиной",
            description: "",
            url: "images/1078.jpg",
            price: 220,
            letter: "Блюда",
            hash: "dish"
        },{
            id: 1079,
            name: "Удон с курицей",
            description: "",
            url: "images/1079.jpg",
            price: 180,
            letter: "Блюда",
            hash: "dish"
        },{
            id: 1080,
            name: "Дары моря",
            description: "",
            url: "images/1080.jpg",
            price: 140,
            letter: "Супы",
            hash: "soups"
        },{
            id: 1081,
            name: "Ким чи",
            description: "",
            url: "images/1081.jpg",
            price: 140,
            letter: "Супы",
            hash: "soups"
        },{
            id: 1082,
            name: "Мисо классический",
            description: "",
            url: "images/1082.jpg",
            price: 120,
            letter: "Супы",
            hash: "soups"
        },{
            id: 1090,
            name: "Бурито",
            description: "",
            url: "images/1090.jpg",
            price: 150,
            letter: "Закуски",
            hash: "snacks"
        },{
             id: 1091,
            name: "Картофель по деревенски 200 гр.",
            description: "",
            url: "images/1091.jpg",
            price: 100,
            letter: "Закуски",
            hash: "snacks"
        },{
             id: 1092,
            name: "Картофель по деревенски 400 гр.",
            description: "",
            url: "images/1092.jpg",
            price: 170,
            letter: "Закуски",
            hash: "snacks"
        },{
            id: 1093,
            name: "Картофель фри 200 гр.",
            description: "",
            url: "images/1093.jpg",
            price: 100,
            letter: "Закуски",
            hash: "snacks"
        },{
            id: 1094,
            name: "Картофель фри 400 гр.",
            description: "",
            url: "images/1094.jpg",
            price: 170,
            letter: "Закуски",
            hash: "snacks"
        },{
            id: 1095,
            name: "Куринные нагетсы 14 шт.",
            description: "",
            url: "images/1095.jpg",
            price: 260,
            letter: "Закуски",
            hash: "snacks"
        },{
            id: 1096,
            name: "Куринные нагетсы 7 шт.",
            description: "",
            url: "images/1096.jpg",
            price: 120,
            letter: "Закуски",
            hash: "snacks"
        },{
            id: 1097,
            name: "Сашими с креветками",
            description: "",
            url: "images/1097.jpg",
            price: 170,
            letter: "Закуски",
            hash: "snacks"
        },{
             id: 1098,
            name: "Сашими с лососем",
            description: "",
            url: "images/1098.jpg",
            price: 160,
            letter: "Закуски",
            hash: "snacks"
        },{
             id: 1099,
            name: "Сашими с угрем",
            description: "",
            url: "images/1099.jpg",
            price: 190,
            letter: "Закуски",
            hash: "snacks"
        },{
             id: 1100,
            name: "7up 0,33",
            description: "",
            url: "images/1100.jpg",
            price: 40,
            letter: "Напитки",
            hash: "drinkables"
        },{
            id: 1101,
            name: "7up 0,6",
            description: "",
            url: "images/1101.jpg",
            price: 60,
            letter: "Напитки",
            hash: "drinkables"
        },{
             id: 1102,
            name: "Lipton",
            description: "",
            url: "images/1102.jpg",
            price: 60,
            letter: "Напитки",
            hash: "drinkables"
        },{
             id: 1103,
            name: "Mirinda 0,33",
            description: "",
            url: "images/1103.jpg",
            price: 40,
            letter: "Напитки",
            hash: "drinkables"
        },{
             id: 1104,
            name: "Mirinda 0,6",
            description: "",
            url: "images/1104.jpg",
            price: 60,
            letter: "Напитки",
            hash: "drinkables"
        },{
            id: 1105,
            name: "Pepsi 0,33",
            description: "",
            url: "images/1105.jpg",
            price: 40,
            letter: "Напитки",
            hash: "drinkables"
        },{
            id: 1106,
            name: "Pepsi-cola 0,6",
            description: "",
            url: "images/1106.jpg",
            price: 60,
            letter: "Напитки",
            hash: "drinkables"
        },{
             id: 1107,
            name: "Аква минерале без газа",
            description: "",
            url: "images/1107.jpg",
            price: 40,
            letter: "Напитки",
            hash: "drinkables"
        },{
             id: 1108,
            name: "Аква минерале с газом",
            description: "",
            url: "images/1108.jpg",
            price: 40,
            letter: "Напитки",
            hash: "drinkables"
        },{
            id: 1109,
            name: "Сок 0.5",
            description: "",
            url: "images/1109.jpg",
            price: 50,
            letter: "Напитки",
            hash: "drinkables"
        },{
            id: 11010,
            name: "Сок Фруктовый сад 1л.",
            description: "",
            url: "images/11010.jpg",
            price: 70,
            letter: "Напитки",
            hash: "drinkables"
        },{
            id: 1110,
            name: "Orbit",
            description: "",
            url: "images/1110.jpg",
            price: 0.66,
            letter: "Дополнительно",
            hash: "extra"
        },{
            id: 1111,
            name: "Васаби",
            description: "",
            url: "images/1111.jpg",
            price: 15,
            letter: "Дополнительно",
            hash: "extra"
        },{
            id: 1112,
            name: "Имбирь",
            description: "",
            url: "images/1112.jpg",
            price: 15,
            letter: "Дополнительно",
            hash: "extra"
        },{
             id: 1113,
            name: "Коробка 34 см",
            description: "",
            url: "images/1113.jpg",
            price: 20,
            letter: "Дополнительно",
            hash: "extra"
        },{
            id: 1114,
            name: "Палочки",
            description: "",
            url: "images/1114.jpg",
            price: 20,
            letter: "Дополнительно",
            hash: "extra"
        },{
            id: 1115,
            name: "Cалфетка",
            description: "",
            url: "images/1115.jpg",
            price: 0,
            letter: "Дополнительно",
            hash: "extra"
        },{
            id: 1116,
            name: "Соевый соус",
            description: "",
            url: "images/1116.jpg",
            price: 15,
            letter: "Дополнительно",
            hash: "extra"
        },{
            id: 1117,
            name: "Соус Heinz",
            description: "",
            url: "images/1117.jpg",
            price: 15,
            letter: "Дополнительно",
            hash: "extra"
        },{
            id: 1118,
            name: "Спайс",
            description: "",
            url: "images/1118.jpg",
            price: 15,
            letter: "Дополнительно",
            hash: "extra"
        },{
            id: 1119,
            name: "Темпур",
            description: "",
            url: "images/1119.jpg",
            price: 15,
            letter: "Дополнительно",
            hash: "extra"
        }
    ];

    dataSource = new kendo.data.DataSource({
        data: groupedData,
        filter: {
            field: "name",
            operator: "startswith",
            value: ""
        },
       // serverPaging: true,
        serverSorting: true,
       // pageSize: 40,
        sort: { field: "letter", dir: "asc" },
        schema: {
            model: {
                id: "id"
            }
        }, 
        group: "letter"
    });

    /* dataSource = new kendo.data.DataSource({
         transport: {
             read: {
                 url: "scripts/data.js",
                 type: "get",
                 dataType: "json"
             }
         },
         schema: {
             data: "groupedData",
             model: {
                      id: "id"
             }
         },
         group: "letter",
         filter: {
             field: "name",
             operator: "startswith",
             value: ""
         }
     });*/

    var Item = function (id) {
        this.id = id;
        this.price = dataSource.get(id).price;
        this.name = dataSource.get(id).name;
        this.count = 1;
        this.total = dataSource.get(id).price;
        this.url = dataSource.get(id).url;
    };

    var ItemHist = function (id, count, price) {
        this.id = id;
        this.price = price;
        this.count = count;
    };

    /* var User = function (name, tel, street, house, porch, floor, flat) {
         this.name = name;
         this.telephone = tel;
         this.street = street;
         this.house = house;
         this.porch = porch;
         this.floor = floor;
         this.flat = flat;
     }*/

    //Обновление проекта
    function updateProject() {
        if (window.livesync) {
            window.livesync.sync();
        }
    }

    function initialize() {
        mobileApp = new kendo.mobile.Application(document.body, {
            skin: "flat"
        });
        navigator.splashscreen.hide();

        // $("#title").one("click", updateProject);


        //Считываем с локальной бд и с файла телефона и сравниваем версии
        dtB.fetch(function () {
            var curVers = dtB.at(0).Version;
            // alert(curVers);
            rwd.read(dirName, versionFile, curVers);
        });
        
       // $(document.body).addEventListener("");

    }

    var listF;

    function initMain() {


        //Устанавливаем начальный список
        listF = $("#main-list").kendoMobileListView({
            dataSource: dataSource,
            filterable: {
                field: "name",
                operator: "startswith",
                placeholder: "     поиск..."
            },
            template: $("#main-template").html(), 
           // endlessScroll: true,
            headerTemplate: "<h4 id='#= data.items[0].hash #' style='color:gray;margin:5px;'>${value}</h4>"
        }).data("kendoMobileListView");

        
       // var scroller = listF.scroller();
        //alert(scroller);
        /*$("#qrCode").kendoQRCode({
            value: "https://bit.ly/1GdCozW",
            size: 240
                // background: "red"
        });*/

    }
    
    var prevD = 0;
	var direction=0;
    function showMain(e) {

        //Устанавливаем скрол в первоначальную позицию
       // e.view.element.find(".km-scroll-container").css("-webkit-transform", "translate3d(0px, 0px, 0px) scale(1)");
        //Сбрасываем фильтр в начальное состояние
        dataSource.filter({
            field: "name",
            operator: "startswith",
            value: "",
            placeholder: "поиск..."
        });
        //Определяем тип параметра либо хэш либо ингредиент
        if (e.view.params.hasOwnProperty("hash")) {
            var el = $("#" + e.view.params.hash);
            //Если элемент существует
            if (el.hasOwnProperty("length")) {
                //Получаем позицию элемента
                var pos = el.offset();
                if(prevD==0){
                    prevD = pos.top;
                }
                else{
                    prevD += pos.top
                }
                //Устанавливаем скролл на эту позицию
              //  e.view.element.find(".km-scroll-container").css("-webkit-transform", "translate3d(0px, -" + (pos.top - 70) + "px, 0px) scale(1)");
               // e.view.
               // e.preventDefault();
               //  $("#scroller").data("kendoMobileScroller").reset();
               // $("#scroller").data("kendoMobileScroller").animatedScrollTo(0, -(pos.top-55));
                if(direction ==0)
                    {
                 $("#scroller").data("kendoMobileScroller").animatedScrollTo(0, -(prevD-55)); direction =1;
                    } else{
                        $("#scroller").data("kendoMobileScroller").animatedScrollTo(0, -(prevD-95)); direction =1;
                    }
                //listF.scroller().scrollTop = -pos.top;
                
            }
        } else if (e.view.params.hasOwnProperty("item")) {
            //Фильтруем существующий список по терму
            dataSource.filter({
                field: "description",
                operator: "contains",
                ignoreCase: true,
                value: e.view.params.item
            });
        } // else {
        //Считываем с текстового файла историю покупок
        rwd.read(dirName, fileName, null);
        // }
    }

    function hideMain(e) {
        //Устанавливаем скрол в первоначальную позицию
        //e.view.element.find(".km-scroll-container").css("-webkit-transform", "translate3d(0px, 0px, 0px) scale(1)");
        $("#scroller").data("kendoMobileScroller").reset();
        //Сбрасываем фильтр в начальное состояние
        dataSource.filter({
            field: "name",
            operator: "startswith",
            value: "",
            placeholder: "поиск..."
        });
    }

    //Подводим итог
    function agregate() {
        //Суммируем все елементы массива и заносим в корзину
        sum = 0;
        for (var j = 0; j < purchase.length; j++) {
            sum += purchase[j].total;
        }
        $("#basket").text(sum);
        //Все изменения записываем в файл
        var delivery = "";
        if (purchase.length > 0) {

            for (var i = 0; i < purchase.length; i++) {
                delivery += purchase[i].id + "|" + purchase[i].count + "|" + purchase[i].price + ";";
            }
            //Удаляем последний знак ';'
            delivery = delivery.slice(0, -1);
        }
        //Записываем в текстовый файл совершённый заказ
        rwd.write(dirName, fileName, delivery);
    }

    function plus(e) {
        //Получаем текущий объект по id
        for (var i = 0; i < purchase.length; i++) {
            if (purchase[i].id === $(e.target).prev().data("id")) {
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

    function animationImg(id) {
        var obj = $("#img" + id);
        var w = $(obj).width();
        var directionAnimate = +$("#img" + id).data("direct");

        if (w > 0 && directionAnimate == 0) { ///если ширина >  0, уменьшаем ширину блока на 5px 
            $(obj).css('width', w - 10 + "px");
            $(obj).css('height', 80 + "px");
        }

        if (w < 75 && directionAnimate == 1) ///если ширина < 75, уменьшаем ширину блока на 5px
        {
            $(obj).css('width', w + 10 + "px");
            $(obj).css('height', 80 + "px");
        }

        if (w == 0 && directionAnimate == 0) { ///если нет, разрушим интервал (перестанем вызывать функцию animation()) 
            directionAnimate = 1;
            $("#img" + id).data("direct", directionAnimate);
            clearInterval(timer);
        }

        if (w == 80 && directionAnimate == 1) { ///если нет, разрушим интервал (перестанем вызывать функцию animation())  
            directionAnimate = 0;
            $("#img" + id).data("direct", directionAnimate);
            clearInterval(timer);
        }

    }

    function minus(e) {

        for (var i = 0; i < purchase.length; i++) {
            //alert(typeof purchase[i].id + " " + typeof $(e.target).next().data("id"));
            if (purchase[i].id === $(e.target).next().data("id")) {

                if (purchase[i].count > 1) {
                    //Уменьшаем кол-во на 1
                    purchase[i].count--;
                    //Заносим в текущий элемент
                    $(e.target).next().text(purchase[i].count);
                    //Устанавливаем новую стоимость
                    purchase[i].total = purchase[i].count * purchase[i].price;
                    break;
                } else {
                    var button = $(e.target).closest('li').find('a.prices');
                    //$("#" + $(e.target).next().data("id")).slideToggle("normal");
                    //var a = $(e.target).data("on");
                    //Ищем полное кол-во по текущему итему
                    for (var i = 0; i < purchase.length; i++) {
                        //if (curId === purchase[i].id) {
                        if ($(e.target).next().data("id") === purchase[i].id) {
                            //Удаляем итем из общего массива
                            purchase.splice(i, 1);
                            $("span[data-id='" + $(e.target).next().data("id") + "']").text(1);
                        }
                    }
                    //agregate();
                    $(button).data("on", false);
                    var directionAnimate = parseInt($("#" + $(e.target).next().data("direct")));
                    if (directionAnimate == 0) {

                        $("#" + $(e.target).next().data("id")).fadeToggle("fast");
                        setTimeout(function () {
                            $(button).fadeToggle("fast");
                        }, 300);
                        //setTimeout(function(){ $("#" + $(e.target).next().data("id")).fadeToggle("fast");}, 300);
                        //$(button).css("display", "block");
                        //setTimeout(function(){ $(button).fadeToggle("fast");}, 300);

                    } else {

                        $("#" + $(e.target).next().data("id")).fadeToggle("fast");
                        setTimeout(function () {
                            $(button).fadeToggle("fast");
                        }, 300);
                        //$(button).fadeToggle("fast");
                        //$(button).css("display", "block");
                    }
                    timer = setInterval(animationImg, 20, $(e.target).next().data("id"));
                }
            }
        }
        agregate();
    }

    function doPrice(e) {
        curId = $(e.target).data("id");
        //Если цена выделена
        if (!$(e.target).data("on")) {
            // var a = $(e.target).data("on");
            var item = new Item(curId);
            purchase.push(item);
            //price += item.price;
            //Добавляем сразу в корзину
            agregate();
            $(e.target).data("on", true);
        }
        //else 
        //{
        //    var a = $(e.target).data("on");
        //Ищем полное кол-во по текущему итему
        //    for (var i = 0; i < purchase.length; i++) {
        //        if (curId === purchase[i].id) {
        //            //Удаляем итем из общего массива
        //            purchase.splice(i, 1);
        //            $("span[data-id='" + curId + "']").text(1);
        //        }
        //    }
        //    agregate();
        //   $(e.target).data("on", false);
        //}

        //Применяем эффекты
        //$(e.target).toggleClass("prices-clicked");
        $(e.target).hide();
        //$(e.target).slideToggle("normal"); 
        //$("#" + curId).slideToggle("normal");
        $("#" + curId).show();
        //$("#img" + curId).fadeToggle("normal");   
        timer = setInterval(animationImg, 20, curId);
    }

    function toMain() {
        mobileApp.navigate("#main-view#rools", "slide");
    }

    function toBasket() {
        mobileApp.navigate("#basket", "slide");
    }

    function toFilter() {
        mobileApp.navigate("#filterView", "slide");
    }

    function filterViewInit() {
        listviews = this.element.find("ul.km-listview");
        //Инициализируем список с фильтрами
        $("#select-filter").kendoMobileButtonGroup({
            select: function (e) {
                listviews.hide()
                    .eq(e.index)
                    .show();
            },
            index: 0
        });
    }

    function mClose(e) {
        $("input[name='time']").val("");
        var el = $(e.target).data("form");
        var d = $(el).closest("div[data-role='modalview']");
        $(d).kendoMobileModalView("close");
    }

    function mSubm(e) {

        //Если все поля введены, записываем в файл и закрываем окно
        if (validator.validate($(e.target).data("form"))) {

            var user = "";

            if (this.name) {
                user += this.name;
            }
            if (this.tel) {
                user += "|" + this.tel;
            }
            if (this.street) {
                user += "|" + this.street;
            }
            if (this.house) {
                user += "|" + this.house;
            }
            if (this.porch) {
                user += "|" + this.porch;
            }
            if (this.floor) {
                user += "|" + this.floor;
            }
            if (this.flat) {
                user += "|" + this.flat;
            }

            if (user) {
                rwd.write(dirName, userFile, user);
            }

            var el = $(e.target).data("form");
            var d = $(el).closest("div[data-role='modalview']");
            $(d).kendoMobileModalView("close");
            $("input[name='time']").val("");


            //  $("span.tooltip").text();

         /*   var product = [];
            product[0] = 2992;
            var product_kol = [];
            product_kol[0] = 100;
            //Делаем запрос к серверу
            $.ajax({
                url: rootUrl,
                type: "POST",
                //  crossdomain: true,
                // content:"text/html; charset=utf-8",
                data: {
                    "product[]": product[0],
                    "product_kol[]": product_kol[0],
                    "secret": "NhyiD2iEFrrrKNHHfszn"
                },
                success: function (data) {
                    if (data.Success) {
                        setTimeout(function () {
                            $("div.tooltip").text("Спасибо за заказ, в скором времени наш менеджер свяжеться с вами! :)").slideDown("normal").delay(3000).slideUp("normal");
                        }, 500);
                    } else {
                         setTimeout(function () {
                            $("div.tooltip").text("Что-то пошло не так :( Попробуйте позже.").slideDown("normal").delay(3000).slideUp("normal");
                        }, 500);
                    }
                }
            });*/
        }
    }

    function sumBasket() {
        var sum = 0;
        for (var i = 0; i < purchase.length; i++) {
            sum += purchase[i].total;
        }
        if (purchase.length > 0) {
            $("#hready").text("Ваш заказ");
            $("#finish").text(sum);
            $("#finish2").text("Cумма " + sum + " Р");
            $("#fin").show();
            $("#foo").show();
        } else {
            $("#hready").text("Ваша корзина пуста");
            $("#fin").hide();
            $("#foo").hide();
        }
    }

    function initBasket() {
        $("#basket-list").kendoMobileListView({
            dataSource: purchase,
            template: $("#basket-template").html(),
            headerTemplate: "<h4 style='color:gray;margin:5px;'>${value}</h4>"
        });
        sumBasket();
    }

    function doPriceBasket(e) {
        curId = $(e.target).data("id");
        $(e.target).hide();
        $("#b" + curId).show();
    }

    function back() {
        //Очищаем список покупок
        purchase.length = 0;
        $("#basket").text(0);
    }

    function ready() {
        mobileApp.navigate("#ready");

        $("input[name='person']").val(1);
        //Считываем с файла пользователя
        rwd.read(dirName, userFile, null);
    }

    function mB(e) {
        for (var i = 0; i < purchase.length; i++) {
            if (purchase[i].id === $(e.target).next().data("id")) {
                if (purchase[i].count > 1) {
                    //Уменьшаем кол-во на 1
                    purchase[i].count--;
                    //Заносим в текущий элемент
                    $(e.target).next().text(purchase[i].count);
                    //Устанавливаем новую стоимость
                    purchase[i].total = purchase[i].count * purchase[i].price;
                    break;
                } else {
                    for (var i = 0; i < purchase.length; i++) {
                        //if (curId === purchase[i].id) {
                        if ($(e.target).next().data("id") === purchase[i].id) {
                            //Удаляем итем из общего массива
                            purchase.splice(i, 1);
                            //curId = $(e.target).next().data("id");
                            //$("#b" + curId).hide();
                            $(e.target).closest('li').fadeToggle('fast');
                        }
                    }
                }
            }

        }
        agregate();
        sumBasket();
    }

    function pB(e) {
        //Получаем текущий объект по id
        for (var i = 0; i < purchase.length; i++) {
            if (purchase[i].id === $(e.target).prev().data("id")) {
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
        sumBasket();
    }

    function renderWithHistory() {

        for (var i = 0; i < purchaseHist.length; i++) {
            var img = $("#img" + purchaseHist[i].id);
            $(img).css('width', 0 + 'px');
            $(img).data('direct', 1);
            $(img).closest('li').css('height', 80 + 'px');
            var div = $(img).closest('li').find('#' + purchaseHist[i].id).css('display', 'block');
            // $(div).find('span').html(purchaseHist[i].count);

            $(img).closest('li').find('.prices').find('a').css('display', 'none');
            $("span[data-id='" + purchaseHist[i].id + "']").text(purchaseHist[i].count);
            var item = new Item(purchaseHist[i].id);
            item.count = purchaseHist[i].count;
            item.price = purchaseHist[i].price;
            item.total = purchaseHist[i].count * purchaseHist[i].price;
            purchase.push(item);

            agregate();

        }
    }

    function getPurchaseHistory(history) {
        //Сначало считываем все строки, разделённые ';'
        var vals = history.split(";");
        //Обнуляем purchaseHist перед чтением с файала истории
        purchaseHist.length = 0;
        purchase.length = 0;
        //Формируем массив объектов истории покупок
        for (var i = 0; i < vals.length; i++) {
            var t = vals[i].split("|");
            //Формируем новый объект из строки
            var item = new ItemHist(+t[0], +t[1], +t[2]);
            purchaseHist.push(item);
        }
        /*   var item1 = new ItemHist(1,2,290);
         purchaseHist.push(item1);
         var item2 = new ItemHist(2,3,120);
         purchaseHist.push(item2);*/

        setTimeout(renderWithHistory, 300);
    }

    //Автозаполнение полей форм
    function getUserFromFile(content) {
        var user = content.split("|");
        if (user[0]) { //Имя
            $("input[name='name']").val(user[0]);
        }
        if (user[1]) { //Телефон
            $("input[name='tel']").val(user[1]);
        }
        if (user[2]) { //улица
            $("input[name='street']").val(user[2]);
        }
        if (user[3]) { //дом
            $("input[name='house']").val(user[3]);
        }
        if (user[4]) { //подьезд
            $("input[name='porch']").val(user[4]);
        }
        if (user[5]) { //этаж
            $("input[name='floor']").val(user[5]);
        }
        if (user[6]) { //квартира
            $("input[name='flat']").val(user[6]);
        }
    }

    window.submView = kendo.observable({
        subm: mSubm,
        close: mClose
    });

    window.pickupView = kendo.observable({
        subm: mSubm,
        close: mClose
    });
    
    function test (e) {
        alert("1");
}

    document.addEventListener("deviceready", initialize);

    return {
        init: initMain,
        update: updateProject,
        show: showMain,
        hide: hideMain,
        doPrice: doPrice,
        p: plus,
        m: minus,
        goMain: toMain,
        goBasket: toBasket,
        goFilter: toFilter,
        filterViewInit: filterViewInit,
        // mClose: mClose,
        //  mSubm: mSubm,
        initBasketView: initBasket,
        doPriceBasket: doPriceBasket,
        back: back,
        ready: ready,
        mB: mB,
        pB: pB,
        getPurchaseHistory: getPurchaseHistory,
        getUserFromFile: getUserFromFile,
        test: test
    }

}());