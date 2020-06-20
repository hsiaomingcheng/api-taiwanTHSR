/* 立即函示 + 閉包 */
(function () {
    function hasClass(el, className) {
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    }

    function addClass(el, className) {
        if (!hasClass(el, className)) {
            el.className += " " + className;
        }
    }

    function removeClass(el, className) {
        if (hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
    }

    function altFind(arr, callback) {
        for (var i = 0; i < arr.length; i++) {
            var match = callback(arr[i], i);
            if (match) {
                return arr[i];
            }
        }
    }

    function railStation() {
        var stationNav = document.getElementById('station-nav');
        var stationItem = document.getElementsByClassName('station-item');
        var stationCname = document.getElementById('station-cname');
        var stationEname = document.getElementById('station-ename');
        var stationAddress = document.getElementById('station-address');
        var stationImage = document.getElementById('station-image');
        var copyArray = []; /* 複製取回資料的陣列並處理 */
        var renderArray = []; /* 渲染陣列 */
        var stationArray = []; /* 各站 */
        var imageArray = [
            {
                id: '0990',
                path: 'https://www.thsrc.com.tw/UploadFiles/StationInfo/55d8ad33-063d-47ab-831b-06779a2e49dd.jpg'
            },
            {
                id: '1000',
                path: 'https://www.thsrc.com.tw/UploadFiles/StationInfo/02a8e78d-c8b1-4c13-9fb6-4095167fd0d8.jpg'
            },
            {
                id: '1010',
                path: 'https://www.thsrc.com.tw/UploadFiles/StationInfo/08f71160-6772-4663-8bb0-9be4e6bae343.jpg'
            },
            {
                id: '1020',
                path: 'https://www.thsrc.com.tw/UploadFiles/StationInfo/c90e3a8a-1598-46de-a565-31f017442477.jpg'
            },
            {
                id: '1030',
                path: 'https://www.thsrc.com.tw/UploadFiles/StationInfo/e69a00c8-0fc4-48cb-87cd-68a20f86d6ea.jpg'
            },
            {
                id: '1035',
                path: 'https://www.thsrc.com.tw/UploadFiles/StationInfo/3614c021-5756-480b-9615-b6133e6fbe74.jpg'
            },
            {
                id: '1040',
                path: 'https://www.thsrc.com.tw/UploadFiles/StationInfo/a7afd699-301a-4744-886b-f476c7a96bef.jpg'
            },
            {
                id: '1043',
                path: 'https://www.thsrc.com.tw/UploadFiles/StationInfo/2ee9fcdb-b4a4-4521-b037-c9aecac26119.jpg'
            },
            {
                id: '1047',
                path: 'https://www.thsrc.com.tw/UploadFiles/StationInfo/30ed9976-3fd2-4467-afaf-2b2d45a9c988.jpg'
            },
            {
                id: '1050',
                path: 'https://www.thsrc.com.tw/UploadFiles/StationInfo/e1d5d3c1-68ed-4c7b-994b-6b4294f65649.jpg'
            },
            {
                id: '1060',
                path: 'https://www.thsrc.com.tw/UploadFiles/StationInfo/9dafd11f-d20b-45bf-be9a-e000b14cc086.jpg'
            },
            {
                id: '1070',
                path: 'https://www.thsrc.com.tw/UploadFiles/StationInfo/cc9215d5-a252-4168-af6e-1a837c1d5f2a.jpg'
            }
        ];

        var apiObject = {
            handleItemClick: function () {
                for (var index = 0; index < stationItem.length; index++) {
                    const element = stationItem[index];

                    element.addEventListener('click', function () {
                        var id = element.getAttribute('data-id');

                        Array.prototype.forEach.call(stationItem, function (ele) {
                            removeClass(ele, 'active');
                        });

                        addClass(element, 'active');
                        apiObject.handleContentRender(id);
                    });
                }
            },
            handleContentRender: function (id) {
                var targetItem = altFind(renderArray, function (ele) {
                    return ele.id === id;
                });

                stationCname.innerHTML = targetItem.cName + '站';
                stationEname.innerHTML = targetItem.eName;
                stationAddress.innerHTML = targetItem.address;
                stationImage.setAttribute('src', targetItem.imagePath);
            },
            handleNavRender: function () {
                /* 處理初次渲染 */
                var structureDom = '';

                renderArray.map(function (ele) {
                    var item = '<div class="station-item" data-id="' + ele.id + '">' + ele.cName + '</div>';
                    structureDom = structureDom + item;
                });

                stationNav.innerHTML = structureDom;

                stationCname.innerHTML = renderArray[0].cName + '站';
                stationEname.innerHTML = renderArray[0].eName;
                stationAddress.innerHTML = renderArray[0].address;
                stationImage.setAttribute('src', renderArray[0].imagePath);
                addClass(stationItem[0], 'active');

                this.handleItemClick();
            },
            handleData: function (responseText) {
                /* 當api成功回傳，處理api回傳資料 */
                responseData = JSON.parse(responseText);

                /* 未來對方API欄位名稱變更，只需修改此處 */
                responseData.map(function (element) {
                    var imgPath = '';

                    altFind(imageArray, function (image) {
                        if (element.StationID === image.id) {
                            imgPath = image.path;
                        }
                    });

                    copyArray.push({
                        id: element.StationID,
                        address: element.StationAddress,
                        cName: element.StationName.Zh_tw,
                        eName: element.StationName.En,
                        imagePath: imgPath
                    });
                });

                /* 使用jQuery的$.extend做copy array */
                renderArray = $.extend(true, [], copyArray);

                /* 取出各站中文名 */
                renderArray.map(function (ele) {
                    stationArray.push(ele.cName);
                })

                this.handleNavRender();
            },
            callApi: function () {
                if (copyArray.length === 0) {
                    $.ajax({
                        method: 'GET',
                        url: 'https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/Station?$format=JSON',
                        dataType: 'text'
                    })
                        .done(function (data) {
                            apiObject.handleData(data);
                        });
                }
            },
            execute: function () {
                this.callApi();
            }
        }
        return apiObject;
    }

    function priceTable() {
        var typeButton = document.getElementsByClassName('type-button');
        var allTableContent = document.getElementsByClassName('all-table-content');
        var priceWrap = document.getElementsByClassName('price-wrap');
        var levelTable = document.getElementById('level-table');
        var allTable = document.getElementById('all-table');
        var selectTable = document.getElementById('select-table');
        var selectStart = document.getElementById('select-start');
        var selectEnd = document.getElementById('select-end');
        var selectPrice = document.getElementById('select-price');
        var selectJourney = document.getElementById('select-journey');
        var copyArray = []; /* 複製取回資料的陣列並處理 */
        var renderArray = []; /* 渲染陣列 */
        var stationArray = []; /* 各站id陣列 */
        var faresLength = 3; /* 票價種類 */

        var apiObject = {
            handleType: function (type) {
                Array.prototype.forEach.call(priceWrap, function (ele) {
                    removeClass(ele, 'active');
                });

                switch (type) {
                    case 4:
                        addClass(allTable, 'active');
                        break;
                    case 5:
                        addClass(selectTable, 'active');
                        break;
                    default:
                        apiObject.handleCreateLevelTable(type);

                        addClass(levelTable, 'active');
                        break;
                }
            },
            handleTypeButton: function () {
                var type = '';

                for (var index = 0; index < typeButton.length; index++) {
                    typeButton[index].addEventListener('click', function () {
                        Array.prototype.forEach.call(typeButton, function (ele) {
                            removeClass(ele, 'active');
                        });
                        addClass(this, 'active');

                        type = this.getAttribute('data-type');
                        apiObject.handleType(parseInt(type, 10));
                    });
                }
            },
            handleRenderSelect: function (journey) {
                /* 起訖站票價跟地點 */
                selectJourney.innerText = journey.startCName + '到' + journey.endCName;
                selectPrice.innerHTML = '<p class="select-price-item">商務票價格為：' + journey.fares[0].price + '</p>' + '<p class="select-price-item">標準票價格為：' + journey.fares[1].price + '</p>' + '<p class="select-price-item">自由票價格為：' + journey.fares[2].price + '</p>'
            },
            handleSelectTableChange: function () {
                /* 起訖站下拉選單事件 */
                var startSpot = '';
                var endSpot = '';
                var journey = [];

                selectStart.addEventListener('change', function () {
                    startSpot = this.value;

                    if (this.value === '0') {
                        return;
                    }

                    if (!endSpot || endSpot === '0') {
                        journey = renderArray.filter(function (ele) {
                            return ele.startId === startSpot;
                        });
                        return;
                    }

                    if (selectStart.value === selectEnd.value) {
                        alert('起點站/終點站 不能相同');
                    } else {
                        journey = altFind(renderArray, function (ele) {
                            return ele.startId === startSpot && ele.endId === endSpot;
                        });

                        apiObject.handleRenderSelect(journey);
                    }
                });

                selectEnd.addEventListener('change', function () {
                    endSpot = this.value;

                    if (this.value === '0') {
                        return;
                    }

                    if (!startSpot || startSpot === '0') {
                        journey = renderArray.filter(function (ele) {
                            return ele.endId === endSpot;
                        });
                        return;
                    }

                    if (selectStart.value === selectEnd.value) {
                        alert('起點站/終點站 不能相同');
                    } else {
                        journey = altFind(renderArray, function (ele) {
                            return ele.startId === startSpot && ele.endId === endSpot;
                        });

                        apiObject.handleRenderSelect(journey);
                    }
                });
            },
            handleCreateSelectTable: function () {
                /* 起訖站票價 */
                var tmpStartDom = '<option value="0">請選擇起點</option>';
                var tmpEndDom = '<option value="0">請選擇終點</option>';

                stationArray.map(function (ele) {
                    tmpStartDom = tmpStartDom + '<option value="' + ele.id + '">' + ele.cName + '</option>';
                    tmpEndDom = tmpEndDom + '<option value="' + ele.id + '">' + ele.cName + '</option>';
                });

                selectStart.innerHTML = tmpStartDom;
                selectEnd.innerHTML = tmpEndDom;

                this.handleSelectTableChange();
            },
            handleCreateLevelTable: function (type) {
                /* 個別票價 */
                var tmpDom = '';

                stationArray.forEach(function (ele) {
                    var price = '';

                    ele.list.forEach(function (item) {
                        price = price + '<div class="price-item"><div>' + item.endCName + '</div><div class="price-dolor">' + item.fares[type].price + '</div></div>';
                    });

                    tmpDom = tmpDom + '<div class="price-box"><div class="price-item">' + ele.cName + '</div>' + price + '</div>';
                });

                levelTable.innerHTML = tmpDom;
            },
            handleCreateAllTable: function () {
                /* 所有票價 */
                for (var index = 0; index < faresLength; index++) {
                    var tmpDom = allTableContent[index].innerHTML;

                    stationArray.forEach(function (ele) {
                        var price = '';

                        ele.list.forEach(function (item) {
                            price = price + '<div class="price-item"><div>' + item.endCName + '</div><div class="price-dolor">' + item.fares[index].price + '</div></div>';
                        });

                        tmpDom = tmpDom + '<div class="price-box"><div class="price-item">' + ele.cName + '</div>' + price + '</div>';
                    });

                    allTableContent[index].innerHTML = tmpDom;
                }
            },
            handleStation: function () {
                var tmpArray = [];

                renderArray.forEach(function (ele) {
                    tmpArray.push(ele.startId);
                });

                stationArray = tmpArray.filter(function (element, index, arr) {
                    return arr.indexOf(element) === index;
                }).sort();

                stationArray.forEach(function (ele, index) {
                    stationArray.splice(index, 1, {
                        id: ele,
                        list: []
                    });
                });

                renderArray.map(function (ele) {
                    altFind(stationArray, function (station, index) {
                        if (ele.startId === station.id) {
                            if (!stationArray[index].cName) {
                                stationArray[index].cName = ele.startCName;
                            }

                            stationArray[index].list.push(ele);
                            stationArray[index].list.sort(function (a, b) {
                                return a.endId - b.endId;
                            });
                        }
                    });
                });
            },
            handleData: function (responseText) {
                /* 當api成功回傳，處理api回傳資料 */
                responseData = JSON.parse(responseText);

                /* 未來對方API欄位名稱變更，只需修改此處 */
                responseData.map(function (element) {
                    var faresRenameArray = [];
                    var faresSortArray = element.Fares.sort(function (a, b) {
                        if (a.TicketType < b.TicketType) {
                            return -1;
                        }
                        if (a.TicketType > b.TicketType) {
                            return 1;
                        }
                        return 0;
                    });

                    faresSortArray.forEach(function (ele) {
                        faresRenameArray.push({
                            type: ele.TicketType,
                            price: ele.Price
                        });
                    });

                    copyArray.push({
                        startId: element.OriginStationID,
                        endId: element.DestinationStationID,
                        startCName: element.OriginStationName.Zh_tw,
                        startEName: element.OriginStationName.En,
                        endCName: element.DestinationStationName.Zh_tw,
                        endEName: element.DestinationStationName.En,
                        fares: faresRenameArray
                    });
                });

                /* 使用jQuery的$.extend做copy array */
                renderArray = $.extend(true, [], copyArray);

                renderArray.sort(function (a, b) {
                    return a.startId - b.startId;
                });

                this.handleStation();
                this.handleCreateAllTable();
                this.handleCreateSelectTable();
            },
            execute: function () {
                this.handleTypeButton();
            }
        }

        return apiObject;
    }

    function timeTable() {
        var queryStart = document.getElementById('query-start');
        var queryEnd = document.getElementById('query-end');
        var queryDate = document.getElementById('query-date');
        var queryTrip = document.getElementById('query-trip');
        var queryButton = document.getElementById('query-button');
        var timeTableTitle = document.getElementById('time-table-title');
        var timeTableHead = document.getElementById('time-table-head');
        var timeTableBody = document.getElementById('time-table-body');
        var timePriceWrap = document.getElementById('time-price-wrap');
        var queryRule = document.getElementsByClassName('query-rule');
        var copyArray = []; /* 複製取回資料的陣列並處理 */
        var renderArray = []; /* 渲染陣列 */
        var stationArray = []; /* 各站id陣列 */
        var tripArray = []; /* 所有車次陣列 */
        var startStationId = '0';
        var endStationId = '0';

        var apiObject = {
            handleRenderTrip: function (date, trip) {
                /* 產生指定日期車次的時刻表 */
                var tripDom = '';
                var startCName = '';
                var endCName = '';
                var tripStartId = '';
                var tripEndId = '';
                var fares = [];

                altFind(tripArray, function (ele) {
                    if (ele.trainNumber === trip) {
                        tripStartId = ele.startId;
                        tripEndId = ele.endId;
                        startCName = ele.startCName;
                        endCName = ele.endCName;

                        ele.stopTimes.map(function (stopTime) {
                            var stationCName = '<p>' + stopTime.StationName.Zh_tw + '</p>';
                            var departureTime = '<p>' + stopTime.DepartureTime + '</p>';

                            tripDom = tripDom + '<div class="item-trip">' + stationCName + departureTime + '</div>';
                        });
                    }
                });

                altFind(stationArray, function (startStation) {
                    if (tripStartId === startStation.id) {
                        altFind(startStation.list, function (endStation) {
                            if (tripEndId === endStation.endId) {
                                fares = endStation.fares;
                            }
                        });
                    }
                });

                timeTableTitle.innerHTML = '<div>' + date + '的' + trip + '車次' + '</div><div>從' + startCName + '站出發到' + endCName + '站</div>';
                timeTableHead.innerHTML = '<div class="item-table">各站出發時間</div>';
                timeTableBody.innerHTML = '<div>' + tripDom + '</div>';
                timePriceWrap.innerHTML = '<div class="price-tr">商務票價格：' + fares[0].price + '</div>' + '<div class="price-tr">標準票價格：' + fares[1].price + '</div>' + '<div class="price-tr">自由票價格：' + fares[2].price + '</div>';
            },
            handleRenderTable: function (date, startId, endId, tmpArray) {
                /* 產生指定日期起訖站的時刻表 */
                var startCName = '';
                var endCName = '';
                var fares = [];
                var tbodyDom = '';

                altFind(stationArray, function (ele) {
                    if (ele.id === startId) {
                        startCName = ele.cName;

                        altFind(ele.list, function (eleList) {
                            if (eleList.endId === endId) {
                                endCName = eleList.endCName;
                                fares = eleList.fares;
                            }
                        });
                    }
                });

                tmpArray.map(function (ele) {
                    var trainNumber = '<div class="item-table">' + ele.trainNumber + '</div>';
                    var departureTime = '<div class="item-table">' + ele.departureTime + '</div>';
                    var arrivalTime = '<div class="item-table">' + ele.arrivalTime + '</div>';
                    tbodyDom = tbodyDom + '<div>' + trainNumber + departureTime + arrivalTime + '</div>';
                });

                timeTableTitle.innerHTML = date + ' ' + startCName + '站 到 ' + endCName + '站';
                timeTableHead.innerHTML = '<div class="item-table">車次</div><div class="item-table">出發時間</div><div class="item-table">到站時間</div>';
                timeTableBody.innerHTML = tbodyDom;
                timePriceWrap.innerHTML = '<div class="price-tr">商務票價格：' + fares[0].price + '</div>' + '<div class="price-tr">標準票價格：' + fares[1].price + '</div>' + '<div class="price-tr">自由票價格：' + fares[2].price + '</div>';
            },
            handleQuery: function () {
                var startId = queryStart.value;
                var endId = queryEnd.value;
                var date = queryDate.value;
                var trip = queryTrip.value;

                if (!queryDate.value) {
                    return alert('請選擇日期');
                }

                if (queryStart.value !== '0' && queryEnd.value !== '0') {
                    if (queryStart.value === queryEnd.value) {
                        return alert('起點/終點 不能是同一個點');
                    }

                    if (trip !== '0') {
                        apiObject.callDateDestination(date, startId, endId, trip);
                    } else {
                        apiObject.callDateDestination(date, startId, endId);
                    }
                    return;
                }

                if (queryStart.value !== '0' || queryEnd.value !== '0') {
                    return alert('請選擇 起點/終點');
                }

                if (trip && trip !== '0') {
                    apiObject.handleRenderTrip(date, trip);
                }
            },
            handleTripSelect: function (tripDataArray) {
                /* 車次下拉選單 */
                queryTrip.innerHTML = '';
                var optionDom = '<option value="0">請選擇車次</option>';

                tripDataArray.map(function (ele) {
                    optionDom = optionDom + '<option value="' + ele.trainNumber + '">' + ele.trainNumber + '</option>'
                });

                queryTrip.innerHTML = optionDom;
            },
            handleDate: function () {
                Date.prototype.addDays = function (days) {
                    this.setDate(this.getDate() + days);
                    return this;
                }

                var today = new Date();
                var limitDay = new Date().addDays(28);

                var transToday = today.toISOString().substr(0, 10);
                var transLimitDay = limitDay.toISOString().substr(0, 10);

                // queryDate.defaultValue =  transToday;
                queryDate.setAttribute('min', transToday);
                queryDate.setAttribute('max', transLimitDay);

                /* 使用預設當日取得當日所有車次的時刻表資料 */
                this.callDate(transToday);
            },
            handleStationSelect: function () {
                /* 起訖站下拉選單 */
                var tmpStartDom = '<option value="0">請選擇起點</option>';
                var tmpEndDom = '<option value="0">請選擇終點</option>';

                stationArray.map(function (ele) {
                    tmpStartDom = tmpStartDom + '<option value="' + ele.id + '">' + ele.cName + '</option>';
                    tmpEndDom = tmpEndDom + '<option value="' + ele.id + '">' + ele.cName + '</option>';
                });

                queryStart.innerHTML = tmpStartDom;
                queryEnd.innerHTML = tmpEndDom;
            },
            handleStation: function () {
                var tmpArray = [];

                renderArray.forEach(function (ele) {
                    tmpArray.push(ele.startId);
                });

                stationArray = tmpArray.filter(function (element, index, arr) {
                    return arr.indexOf(element) === index;
                }).sort();

                stationArray.forEach(function (ele, index) {
                    stationArray.splice(index, 1, {
                        id: ele,
                        list: []
                    });
                });

                renderArray.map(function (ele) {
                    altFind(stationArray, function (station, index) {
                        if (ele.startId === station.id) {
                            if (!stationArray[index].cName) {
                                stationArray[index].cName = ele.startCName;
                            }

                            stationArray[index].list.push(ele);
                            stationArray[index].list.sort(function (a, b) {
                                return a.endId - b.endId;
                            });
                        }
                    });
                });
            },
            handleBindEvent: function () {
                queryButton.addEventListener('click', this.handleQuery);
                queryStart.addEventListener('change', function () {
                    var date = queryDate.value;
                    startStationId = this.value;

                    /* 篩選符合起訖站之車次下拉選單 */
                    if (endStationId !== '0' && startStationId !== '0') {
                        apiObject.callDateDestination(date, startStationId, endStationId, '0');
                    } else if (endStationId === '0' && startStationId === '0') {
                        apiObject.handleTripSelect(tripArray);
                    }
                });

                queryEnd.addEventListener('change', function () {
                    var date = queryDate.value;
                    endStationId = this.value;

                    /* 篩選符合起訖站之車次下拉選單 */
                    if (startStationId !== '0' && endStationId !== '0') {
                        apiObject.callDateDestination(date, startStationId, endStationId, '0');
                    } else if (endStationId === '0' && startStationId === '0') {
                        apiObject.handleTripSelect(tripArray);
                    }
                });

                queryDate.addEventListener('change', function () {
                    var date = queryDate.value;

                    if (!!date) {
                        Array.prototype.forEach.call(queryRule, function (ele) {
                            addClass(ele, 'show');
                        });
                    }

                    if (startStationId !== '0' && endStationId !== '0') {
                        apiObject.callDateDestination(date, startStationId, endStationId, '0');
                    } else {
                        apiObject.callDate(this.value);
                    }
                });
            },
            handleData: function (responseText) {
                /* 當api成功回傳，處理api回傳資料 */
                responseData = JSON.parse(responseText);

                /* 未來對方API欄位名稱變更，只需修改此處 */
                responseData.map(function (element) {
                    var faresRenameArray = [];
                    var faresSortArray = element.Fares.sort(function (a, b) {
                        if (a.TicketType < b.TicketType) {
                            return -1;
                        }
                        if (a.TicketType > b.TicketType) {
                            return 1;
                        }
                        return 0;
                    });

                    faresSortArray.forEach(function (ele) {
                        faresRenameArray.push({
                            type: ele.TicketType,
                            price: ele.Price
                        });
                    });

                    copyArray.push({
                        startId: element.OriginStationID,
                        endId: element.DestinationStationID,
                        startCName: element.OriginStationName.Zh_tw,
                        startEName: element.OriginStationName.En,
                        endCName: element.DestinationStationName.Zh_tw,
                        endEName: element.DestinationStationName.En,
                        fares: faresRenameArray
                    });
                });

                /* 使用jQuery的$.extend做copy array */
                renderArray = $.extend(true, [], copyArray);

                renderArray.sort(function (a, b) {
                    return a.startId - b.startId;
                });

                this.handleStation();
                this.handleStationSelect();
                this.handleDate();
                this.handleBindEvent();
            },
            callDateDestination: function (date, startId, endId, trip) {
                /* 取得指定[日期],[起迄站間]之時刻表資料 */
                $.ajax({
                    method: 'GET',
                    url: 'https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/DailyTimetable/OD/' + startId + '/to/' + endId + '/' + date + '?$format=JSON',
                    dataType: 'text'
                })
                    .done(function (data) {
                        var tmpArray = []

                        responseData = JSON.parse(data);

                        responseData.map(function (ele) {
                            tmpArray.push({
                                trainNumber: ele.DailyTrainInfo.TrainNo,
                                departureTime: ele.OriginStopTime.DepartureTime,
                                arrivalTime: ele.DestinationStopTime.ArrivalTime
                            });
                        });

                        tmpArray.sort(function (a, b) {
                            if (a.departureTime < b.departureTime) {
                                return -1;
                            }
                            if (a.departureTime > b.departureTime) {
                                return 1;
                            }
                            return 0;
                        });

                        if (trip !== '0') {
                            altFind(tmpArray, function (ele) {
                                if (ele.trainNumber === trip) {
                                    tmpArray = [];
                                    tmpArray.push(ele);
                                }
                            });

                            apiObject.handleRenderTable(date, startId, endId, tmpArray);
                        } else if (trip === '0') {
                            apiObject.handleTripSelect(tmpArray);
                        }
                    });
            },
            callDate: function (date) {
                /* 取得指定[日期]所有車次的時刻表資料(高鐵提供近28天每日時刻表) */
                $.ajax({
                    method: 'GET',
                    url: 'https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/DailyTimetable/TrainDate/' + date + '?$format=JSON',
                    dataType: 'text'
                })
                    .done(function (data) {
                        var tmpArray = [];
                        responseData = JSON.parse(data);

                        responseData.map(function (ele) {
                            tmpArray.push({
                                trainNumber: ele.DailyTrainInfo.TrainNo,
                                startId: ele.DailyTrainInfo.StartingStationID,
                                endId: ele.DailyTrainInfo.EndingStationID,
                                startCName: ele.DailyTrainInfo.StartingStationName.Zh_tw,
                                endCName: ele.DailyTrainInfo.EndingStationName.Zh_tw,
                                stopTimes: ele.StopTimes
                            });
                        });

                        /* 使用jQuery的$.extend做copy array */
                        tripArray = $.extend(true, [], tmpArray);

                        apiObject.handleTripSelect(tripArray);
                    });
            }
        }

        return apiObject;
    }

    function handleOnload(assembleObj) {
        var navItem = document.getElementsByClassName('nav-item');
        var contentWrap = document.getElementsByClassName('content-wrap');
        var railStation = assembleObj.railStation();
        var priceTable = assembleObj.priceTable();
        var timeTable = assembleObj.timeTable();

        var apiObject = {
            callApi: function () {
                $.ajax({
                    method: 'GET',
                    url: 'https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/ODFare?$format=JSON',
                    dataType: 'text'
                })
                    .done(function (data) {
                        priceTable.handleData(data);
                        timeTable.handleData(data);
                    });
            },
            handleClick: function () {
                Array.prototype.forEach.call(navItem, function (ele) {
                    ele.addEventListener('click', function () {
                        var dataIndex = this.getAttribute('data-index');

                        Array.prototype.forEach.call(navItem, function (ele) {
                            removeClass(ele, 'active');
                        });

                        Array.prototype.forEach.call(contentWrap, function (ele) {
                            removeClass(ele, 'active');
                        });

                        addClass(contentWrap[dataIndex], 'active');
                        addClass(this, 'active');
                    });
                });
            },
            execute: function () {
                railStation.execute();
                priceTable.execute();
                this.handleClick();
                this.callApi();
            }
        }

        return apiObject;
    };

    var assembleObj = {
        railStation: railStation,
        priceTable: priceTable,
        timeTable: timeTable
    }

    var executeOnload = handleOnload(assembleObj);

    executeOnload.execute();
})();
/* 立即函示 + 閉包 */