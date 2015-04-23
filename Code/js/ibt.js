var userId;
var gameId = "fourgame_dian_0409";
var m = [{ "name": "red2000", "num": 3 }, { "name": "redz", "num": 2 }, { "name": "redg", "num": 2 }, { "name": "green250", "num": 2 }];
var mselected = [{ "name": "red2000", "selectednum": 0 }, { "name": "redz", "selectednum": 0 }, { "name": "redg", "selectednum": 0 }, { "name": "green250", "selectednum": 0 }];
var mnums = 0;
var mm = new Array();
var selectednums = 0;
var t;//timer
var watertimer;
var sstop = 0;//结束标记
var ssuccess = 0;
var sfail = 0;
var divs = new Array();//所有图片的div集合
var rands = new Array();//16个不相同的0-15随机数组成的数组

var lockers = {
    lock1_click: false,
    lock2_click: false,
    lock3_click: false,
    lock4_click: false,
    text1_click: false,
    text2_click: false,
    text3_click: false,
    text4_click: false
}
for (var i = 0; i < m.length; i++) {
    mnums = mnums + m[i].num;
    mm[m[i].name] = 1;//需要选择的图片
}
var GAME = {

    game1: { name: 'fourgame_dian_0409', open: false, etime: 11.00 },

    game2: { name: 'fourgame_find_0420', open: false, etime: 18.00 },

    game3: { name: 'fourgame_lian_0427', open: false },

    game4: { name: 'fourgame_shen_0503', open: false },

    current: -1

}
var defaultPoints = {
    fourgame_dian_0409_t: 0,
    fourgame_find_0420_t: 0,
    fourgame_lian_0427_t: 0,
    fourgame_shen_0503_t: 0,
    fourgame_dian_0409_l: -1,
    fourgame_find_0420_l: -1,
    fourgame_lian_0427_l: -1,
    fourgame_shen_0503_l: -1
}

var gamePlayed = {
    fourgame_dian_0409: false,
    fourgame_find_0420: false,
    fourgame_lian_0427: false,
    fourgame_shen_0503: false
}


var gameOpen = {
    fourgame_dian_0409: null,
    fourgame_find_0420: null,
    fourgame_lian_0427: null,
    fourgame_shen_0503: null
}

var IBT = {
    gamePoint: 0,

    perGamePoint: { game1: 0, game2: 0, game3: 0, game4: 0 },

    currentPageNumber: 0,

    effects: { moveUp: 1, moveDown: 2, fade: 3 },

    results: { S: "S", A: "A", B: "B", C: "C", D: "D", E: "E", Failed: "F" },

    directions: { up: 1, down: -1 },

    isAnimating: false,

    game1Played: 0,

    game1ClickCount: 0,

    game1ClickUsingTime: 0,

    game2ClickUsingTime: 0,

    game1end: false,

    game1result: null,

    game1TimeResult: 0,//上面的usingtime置零了

    game2result: null,

    game2LevelResult: null,

    game2TimeResult: 0,

    resultReturnPageNumber: 1,

    resultNextPageNumber: 1,

    game3Data: [1, 2, 3, 4, 5, 6, 7, 8, 1, 7, 4, 5, 8, 3, 2, 6],

    game3LastId: 0,

    game3OutCount: 0,

    game3end: false,

    game3UsingTime: 0,

    game3Result: null,

    game3FlipCard: function (id) {
        var targetImgSrc = "img/game-3/block-" + IBT.game3Data[id - 1] + ".png";
        var originalImgSrc = "img/game-3/block-0.png";
        var card = $("#block-" + id);
        if (card.attr("src") == originalImgSrc) {
            card.addClass("ani-flipOutY");
            setTimeout(function () {
                card.attr("src", targetImgSrc);
                card.removeClass("ani-flipOutY");
                card.addClass("ani-flipInY");
            }, 500);
        }
        else if (!$("#block-" + id).hasClass("out")) {
            card.addClass("ani-flipOutY");
            setTimeout(function () {
                card.attr("src", originalImgSrc);
                card.removeClass("ani-flipOutY");
                card.addClass("ani-flipInY");
            }, 500);
        }
    },

    pageMove: function (effect, pageNumber) {
        var fromPage = ".page-" + IBT.currentPageNumber;
        var toPage = ".page-" + pageNumber;
        IBT.currentPageNumber = pageNumber;

        switch (effect) {
            case IBT.effects.fade:
                outClass = 'ani-fadeOut';
                inClass = 'ani-fadeIn';
                break;
        }
        IBT.isAnimating = true;
        $(toPage).removeClass("hide");
        $(fromPage).addClass(outClass);
        $(toPage).addClass(inClass);

        setTimeout(function () {
            $(fromPage).removeClass('page-current');
            $(fromPage).removeClass(outClass);
            $(fromPage).addClass("hide");
            $(fromPage).find("*").addClass("hide");

            $(toPage).addClass('page-current');
            $(toPage).removeClass(inClass);
            $(toPage).find("*").removeClass("hide");

            IBT.isAnimating = false;
        }, 600);
    },

    loadComplete: function () {
        //if (getUrlParam("userId") == null || getUrlParam("userId") == "") {
        //    if (window.localStorage.getItem("bhcid") != null) {
        //        userId = window.localStorage.getItem("bhcid");
        //    }
        //    else {
        //        alert("测试代码：请关注公众号...");
        //        window.location.href = "www.xxx.com";
        //    }
        //}
        //else {
        //    window.localStorage.setItem("bhcid", getUrlParam("userId"));
        //    window.location.href = "index.html";
        //}

        //checkGameOpenOrClose();//TODO:
        //setDefaultScores();
        ////setLockByGameStatus();
        //checkUser();
        IBT.pageMove(IBT.effects.fade, 5);
    }
};

$(function () {
    $(".page-1000 .button-enter-game").singleTap(function () {
        $('#clickaudio')[0].play();
        IBT.pageMove(IBT.effects.fade, 1001);
    });

    $(".page-1000 .button-rank-list").singleTap(function () {
        $('#clickaudio')[0].play();
        $.get("/index.php?r=game/getrank", function (data, textStatus) {
            if (data.success == false) {
                alert("没有排行数据！");
            }
            else {
                var trs = "<tr class='rank-th-tr'><th style='width: 10%;' align='center'>序号</th><th style='width: 18%;' align='center'>昵称</th><th style='width: 14%;' align='center'>成绩1</th><th style='width: 14%;' align='center'>成绩2</th><th style='width: 14%;' align='center'>成绩3</th><th style='width: 14%;' align='center'>成绩4</th><th style='width: 14%;' align='center'>总成绩</th></tr>";
                $.each(data.data, function (i, item) {
                    var trColor;
                    if (i % 2 == 0) {
                        trColor = "even-tr";
                    } else {
                        trColor = "odd-tr";
                    }
                    trs += "<tr class='" + trColor + " rank-td-tr'><td align='center'>" + (i + 1) + "</td>" + "<td align='center'>" + formatPalyerName(item.userName == null ? item.userId : item.userName) + "</td>" + "<td align='center'>" + formatTime(item.fourgame_dian_0409_t) + "</td><td align='center'>" + formatTime(item.fourgame_find_0420_t) + "</td><td align='center'>" + formatTime(item.fourgame_lian_0427_t) + "</td><td align='center'>" + formatTime(item.fourgame_shen_0503_t) + "</td><td align='center'>" + item.sum_point + "</td></tr>";

                });
                $(".rank-table").append(trs);

            }
        });
        IBT.pageMove(IBT.effects.fade, 1002);
    });

    $(".page-1 .start").singleTap(function () {
        $('#clickaudio')[0].play();
        IBT.pageMove(IBT.effects.fade, 2);
    });


    $(".page-2 .button-left,.page-2 .button-right").on('touchstart pointerdown', function () {
        //alert(IBT.game1ClickCount);
        $('#clickaudio')[0].play();
        if (IBT.game1ClickCount == 0) {
            IBT.game1end = false;
            startGame1Timer();
        }
        if (!IBT.game1end) {
            IBT.game1ClickCount++;
            $(this).attr("src", "img/button-down.png");
        }
    });

    $('.page-2 .button-left,.page-2 .button-right').on('touchmove', function (event) {
        return false;
    });

    $('.page-2 .button-left,.page-2 .button-right').on('touchend pointerup', function (event) {
        $(this).attr("src", "img/button-click.png");
    });

    $(".page-2 .button-ok").on('touchstart pointerdown', function () {
        $('#clickaudio')[0].play();
        IBT.game1end = true;
        if (IBT.game1ClickCount == 32) {
            if (IBT.game1ClickUsingTime < 6.1) {
                IBT.game1result = IBT.results.S;
            }
            else if (IBT.game1ClickUsingTime < 7.1) {
                IBT.game1result = IBT.results.A;
            }
            else if (IBT.game1ClickUsingTime < 8.1) {
                IBT.game1result = IBT.results.B;
            }
            else if (IBT.game1ClickUsingTime < 9.1) {
                IBT.game1result = IBT.results.C;
            }
            else if (IBT.game1ClickUsingTime < 10.1) {
                IBT.game1result = IBT.results.D;
            }
            else {
                IBT.game1result = IBT.results.E;
            }
            IBT.game1TimeResult = IBT.game1ClickUsingTime.toFixed(2);
            if (gamePlayed[GAME.game1.name] == false) {
                submitScore();
            }
            else {
                submitScoreAgain();
            }
            //if(IBT.game1Played==0){
            //IBT.game1Played=1;
            //}
            if (GAME.game2.open == true) {//游戏2开启了
                showResult(IBT.game1result, 101, IBT.game1TimeResult, 1, 3)//进入游戏2
            }
            else {
                showResult(IBT.game1result, 101, IBT.game1TimeResult, 1, 9999)//提示下周挑战游戏2
            }
        }
        else {
            IBT.game1result = IBT.results.Failed;
            IBT.pageMove(IBT.effects.fade, 1);
            alert("点击了" + IBT.game1ClickCount + "次，挑战失败！请重新进行挑战！");
        }
        IBT.game1ClickCount = 0;
        IBT.game1ClickUsingTime = 0;
    });

    $(".page-3 .start").singleTap(function () {
        $('#clickaudio')[0].play();
        IBT.pageMove(IBT.effects.fade, 4);
        setTimeout(function () {
            game2Reset();
            game2Init();
            timerGo();
        }, 600);

    });

    //游戏三
    $(".page-5 .start").singleTap(function () {
        $('#clickaudio')[0].play();
        IBT.pageMove(IBT.effects.fade, 6);
        startGame3Timer();
        var totalWidth = HAOest.browser.screen.width;
        var blocksWidth = totalWidth * 95 / 100;
        var left = (totalWidth * 5 / 100 - 4) / 2;
        var blockWidth = parseInt(blocksWidth / 4);
        $(".page-6 .blocks").css("width", blocksWidth);
        $(".page-6 .blocks").css("height", blocksWidth);
        $(".page-6 .blocks").css("left", left + "px");
        $(".page-6 .row").css("height", blockWidth);

        for (var i = 1; i <= 4; i++) {
            var block = $("<img />");
            block.attr("id", "block-" + i);
            block.attr("class", "block");
            block.attr("src", "img/game-3/block-0.png");
            block.css("width", blockWidth)
            $(".page-6 .blocks .row-1").append(block);
        }

        for (var i = 5; i <= 8; i++) {
            var block = $("<img />");
            block.attr("id", "block-" + i);
            block.attr("class", "block");
            block.attr("src", "img/game-3/block-0.png");
            block.css("width", blockWidth)
            $(".page-6 .blocks .row-2").append(block);
        }

        for (var i = 9; i <= 12; i++) {
            var block = $("<img />");
            block.attr("id", "block-" + i);
            block.attr("class", "block");
            block.attr("src", "img/game-3/block-0.png");
            block.css("width", blockWidth)
            $(".page-6 .blocks .row-3").append(block);
        }

        for (var i = 13; i <= 16; i++) {
            var block = $("<img />");
            block.attr("id", "block-" + i);
            block.attr("class", "block");
            block.attr("src", "img/game-3/block-0.png");
            block.css("width", blockWidth)
            $(".page-6 .blocks .row-4").append(block);
        }

        $(".page-6 .block").singleTap(function (e) {
            var id = e.target.id.replace(/block-/, "");
            IBT.game3FlipCard(id);
            if (IBT.game3LastId != 0) {
                if (IBT.game3Data[id - 1] == IBT.game3Data[IBT.game3LastId - 1]) {
                    IBT.game3OutCount += 2;
                    console.log(IBT.game3OutCount);
                    $("#block-" + id).addClass("out");
                    $("#block-" + IBT.game3LastId).addClass("out");
                    IBT.game3LastId = 0;
                    if (IBT.game3OutCount == 16) {
                        if (IBT.game3UsingTime < 5) {
                            IBT.game3Result = IBT.results.S;
                        }
                        else if (IBT.game3UsingTime <= 8) {
                            IBT.game3Result = IBT.results.A;
                        }
                        else if (IBT.game3UsingTime <= 11) {
                            IBT.game3Result = IBT.results.B;
                        }
                        else if (IBT.game3UsingTime <= 14) {
                            IBT.game3Result = IBT.results.C;
                        }
                        else if (IBT.game3UsingTime <= 17) {
                            IBT.game3Result = IBT.results.D;
                        }
                        else {
                            IBT.game3Result = IBT.results.E;
                        }
                        showResult(IBT.game3Result, 103, IBT.game3UsingTime.toFixed(2), 1001, 9999);
                        IBT.game3end = true;
                    }
                }
                else {
                    setTimeout(function () {
                        IBT.game3FlipCard(IBT.game3LastId);
                        IBT.game3LastId = id;
                    }, 1000);
                }
            }
            else {
                IBT.game3LastId = id;
            }
        });
    });

    $(".page-101 .button-return").singleTap(function () {
        $('#clickaudio')[0].play();
        //IBT.pageMove(IBT.effects.fade, IBT.resultReturnPageNumber);
        $('.game1-time-span').text(IBT.game1TimeResult + " S");
        $('.game1-level-span').text(IBT.game1result);
        IBT.pageMove(IBT.effects.fade, 1001);
    });

    $(".page-101 .button-next").singleTap(function () {
        $('#clickaudio')[0].play();
        if (IBT.resultNextPageNumber == 9999) {
            alert("下一周挑战下一个游戏！");


            GAME.current = -1;
            IBT.pageMove(IBT.effects.fade, 1001);
        }
        else {
            GAME.current = 2;
            IBT.pageMove(IBT.effects.fade, IBT.resultNextPageNumber);
        }
    });

    $(".page-102 .button-return").singleTap(function () {
        $('#clickaudio')[0].play();
        // game2Reset();
        IBT.pageMove(IBT.effects.fade, 1001);
    });

    $(".page-102 .button-next").singleTap(function () {
        $('#clickaudio')[0].play();
        if (IBT.resultNextPageNumber == 9999) {
            alert("下一周挑战下一个游戏！");


            GAME.current = -1;
            IBT.pageMove(IBT.effects.fade, 1001);
        }

    });


    $('.mission').each(function () {
        $(this).singleTap(function () {
            if (lockers["lock" + $(this).attr("adata") + "_click"] == true) {
                return false;
            }
            else {
                lockers["text" + $(this).attr("adata") + "_click"] = true;
                $('#clickaudio')[0].play();
                if ($('.lock-' + $(this).attr("adata")).hasClass('lock-closed')) {
                    alert("下一周挑战该游戏！");
                }
                else {
                    setTimeout(function () {


                        //checkGameAndUser();
                    }
                    , 200);
                    //if(IBT.game1Played==0){//TODO:还有其他游戏
                    lockers["text" + $(this).attr("adata") + "_click"] = false;
                    IBT.pageMove(IBT.effects.fade, $(this).attr('pdata'));

                    GAME.current = $(this).attr('adata');
                    //}
                    //else{
                    //	alert("只有第一次过关的成绩有效。");
                    //	IBT.pageMove(IBT.effects.fade, $(this).attr('pdata'));
                    //}
                }
            }
        })
    })

    $('.lock').each(function () {
        $(this).singleTap(function () {
            if (lockers["text" + $(this).attr("adata") + "_click"] == true) {
                return false;
            }
            else {
                lockers["lock" + $(this).attr("adata") + "_click"] = true;
                $('#clickaudio')[0].play();
                if ($(this).hasClass('lock-closed')) {
                    alert("下一周挑战该游戏！");
                }
                else {
                    setTimeout(function () {
                        //checkGameAndUser();

                    }
                    , 200);
                    //if(IBT.game1Played==0){//TODO:还有其他游戏
                    lockers["lock" + $(this).attr("adata") + "_click"] = false;
                    IBT.pageMove(IBT.effects.fade, $(this).attr('pdata'));
                    GAME.current = $(this).attr('adata');
                    //}
                    //else{
                    //	alert("只有第一次过关的成绩有效。");
                    //	IBT.pageMove(IBT.effects.fade, $(this).attr('pdata'));
                    //}
                }
            }
        })
    })
});

//游戏1计时器
function startGame1Timer() {
    setTimeout(function () {
        if (!IBT.game1end) {
            IBT.game1ClickUsingTime += 0.01;
            $(".page-2 .using-time").html(IBT.game1ClickUsingTime.toFixed(2) + "s");
            startGame1Timer();
        }
        else {
            IBT.game1ClickUsingTime = 0;
            $(".page-2 .using-time").html("0.00s");
        }
    }, 10);
}

function startGame3Timer() {
    setTimeout(function () {
        if (!IBT.game3end) {
            IBT.game3UsingTime += 0.01;
            $(".page-6 .using-time").html(IBT.game3UsingTime.toFixed(2));
            startGame3Timer();
        }
        else {
            IBT.game3UsingTime = 0;
        }
    }, 10);
}

//显示结果页面，目前不清楚4个游戏的结果页面是否通用，如果不通用，还需要进行一些修改
function showResult(result, pageNumber, text, returnPageNumber, nextPageNumber) {
    IBT.resultReturnPageNumber = returnPageNumber;
    IBT.resultNextPageNumber = nextPageNumber;
    IBT.pageMove(IBT.effects.fade, pageNumber);
    $(".page-" + pageNumber + " .using-time").html(text + "s");
    switch (result) {
        case IBT.results.S:
            $(".page-" + pageNumber + " .result").attr("src", "img/score-s.png");
            $(".page-" + pageNumber + " .logo").addClass("right");
            $(".page-" + pageNumber + " .using-time").removeClass().addClass("using-time s");
            break;
        case IBT.results.A:
            $(".page-" + pageNumber + " .result").attr("src", "img/score-a.png");
            $(".page-" + pageNumber + " .logo").addClass("right");
            $(".page-" + pageNumber + " .using-time").removeClass().addClass("using-time a");
            break;
        case IBT.results.B:
            $(".page-" + pageNumber + " .result").attr("src", "img/score-b.png");
            $(".page-" + pageNumber + " .logo").addClass("right");
            $(".page-" + pageNumber + " .using-time").removeClass().addClass("using-time b");
            break;
        case IBT.results.C:
            $(".page-" + pageNumber + " .result").attr("src", "img/score-c.png");
            $(".page-" + pageNumber + " .logo").removeClass("right");
            $(".page-" + pageNumber + " .using-time").removeClass().addClass("using-time c");
            break;
        case IBT.results.D:
            $(".page-" + pageNumber + " .result").attr("src", "img/score-d.png");
            $(".page-" + pageNumber + " .logo").removeClass("right");
            $(".page-" + pageNumber + " .using-time").removeClass().addClass("using-time d");
            break;
        case IBT.results.E:
            $(".page-" + pageNumber + " .result").attr("src", "img/score-e.png");
            $(".page-" + pageNumber + " .logo").removeClass("right");
            $(".page-" + pageNumber + " .using-time").removeClass().addClass("using-time e");
            break;
    }
}

function game2Init() {
    for (var i = 0; i < 16; i++) {
        divs[i] = $('.items').eq(i);
        rands[i] = -1;
    }
    random16();
    setRandomDivs();
    $('.juxing-g2').removeClass("hide");
    $('.items').each(function () {
        $(this).on("tap", function () {
            $('#clickaudio')[0].play();
            if (mm[$(this).attr("adata")] == 1) {

                //是需要选择的图片
                if (!$(this).hasClass("selected")) {
                    selectednums++;
                    $(this).removeClass("unselected");
                    $(this).addClass("selected");
                    if (selectednums == mnums && selectednums != 0) {
                        ssuccess = 1;
                        sstop = 1;
                    }
                }
            }
            else {
                sfail = 1;
                sstop = 1;
            }
        })
    })
}

function timerPlus() {//TODO:游戏胜负判断是否在这里？，参照watergame再修改
    if (sstop == 1) {

        if (ssuccess == 1) {
            clearInterval(t);
            game2Success();
        }
        else if (sfail == 1) {
            clearInterval(t);
            game2Fail();
        }
    }
    else {
        IBT.game2ClickUsingTime = IBT.game2ClickUsingTime + 0.01;
        $(".game-2.page-4 .using-time").text(IBT.game2ClickUsingTime.toFixed(2) + " S");
    }
}
function timerGo() {
    t = setInterval(timerPlus, 10);
}

function random16() {
    var tmp = new Array();
    var rand;
    for (var i = 0; i < 16; i++) {
        tmp[i] = -1;
    }
    for (var i = 0; i < 16; i++) {
        while (1 == 1) {
            rand = Math.round(Math.random() * 16);
            if (tmp[rand] == -1) {//rand
                rands[i] = rand;
                tmp[rand] = 0;
                break;
            }
        }
    }
}

function setRandomDivs() {
    $('.items').removeClass("selected");
    $('.items').addClass("unselected");
    $('.items').detach();
    for (var i = 0; i < 16; i++) {
        $('.juxing-g2').append(divs[rands[i]]);
    }
}
function game2Success() {
    if (IBT.game2ClickUsingTime < 9) {
        IBT.game2result = IBT.results.S;
        IBT.game2LevelResult = "S";

    }
    else if (IBT.game2ClickUsingTime < 11) {
        IBT.game2result = IBT.results.A;
        IBT.game2LevelResult = "A";
    }
    else if (IBT.game2ClickUsingTime < 13) {
        IBT.game2result = IBT.results.B;
        IBT.game2LevelResult = "B";
    }
    else if (IBT.game2ClickUsingTime < 15) {
        IBT.game2result = IBT.results.C;
        IBT.game2LevelResult = "C";
    }
    else if (IBT.game2ClickUsingTime < 17) {
        IBT.game2result = IBT.results.D;
        IBT.game2LevelResult = "D";
    }
    else {
        IBT.game2result = IBT.results.E;
        IBT.game2LevelResult = "E";
    }
    IBT.game2TimeResult = IBT.game2ClickUsingTime.toFixed(2);
    if (gamePlayed[GAME.game2.name] == false) {
        submitScore();
    }
    else {
        submitScoreAgain();
    }
    showResult(IBT.game2result, 102, IBT.game2ClickUsingTime.toFixed(2), 1001, 9999)
}
function game2Fail() {
    alert("你失败了，请重新挑战！");
    IBT.pageMove(IBT.effects.fade, 3);
    game2Reset();//延时

}
function game2Reset() {
    IBT.game2ClickUsingTime = 0.0;
    sstop = 0;
    ssuccess = 0;
    sfail = 0;
    selectednums = 0;
    //random16();
    //setRandomDivs();

}
function setGamePoints() {
    IBT.perGamePoint["game" + GAME.current] = 25.00 - (25.00 / (GAME["game" + GAME.current].etime)).toFixed(2) * IBT["game" + GAME.current + "TimeResult"];
    if (IBT.perGamePoint["game" + GAME.current] < 0) {
        IBT.perGamePoint["game" + GAME.current] = 0;
    }
    // IBT.gamePoint = IBT.perGamePoint["game" + GAME.current];//TODO:+game2...
}
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

function checkGameAndUser() {
    checkGame();
    checkUser();
}

function checkGame() {

    $.get("/api/game/id", { id: gameId }, function (data, textStatus) {
        if (data == null) {
            alert("游戏不存在");
            window.location.href = "www.xxx.com";
        }
    });

}

function checkUser() {
    //userId = getUrlParam("userId");
    userId = window.localStorage.getItem("bhcid");
    if (userId == null) {
        alert("无法确认用户身份，请从微信中访问我们.");
        window.location.href = "www.xxx.com";
    }


}
function formatPalyerName(strName) {
    if (strName.length > 8) {
        return strName.substr(0, 5) + '...';
    } else {
        return strName;
    }
}
function formatTime(secs100) {
    var sec = 0, ssec = 0;//时间默认值		
    if (secs100 > 0) {
        sec = Math.floor(secs100 / 100);
        ssec = secs100 - sec * 100;
    }
    return sec + '\″' + ssec;
}
function getGameLevel(time, gameId) {
    var mresult = "";
    switch (gameId) {
        case GAME.game1.name:
            if (time < 6.1) {
                mresult = "S";

            }
            else if (time < 7.1) {
                mresult = "A";
            }
            else if (time < 8.1) {
                mresult = "B";
            }
            else if (time < 9.1) {
                mresult = "C";
            }
            else if (time < 10.1) {
                mresult = "D";
            }
            else {
                mresult = "E";
            }
            break;
        case GAME.game2.name:
            if (time < 9) {
                mresult = "S";

            }
            else if (time < 11) {
                mresult = "A";
            }
            else if (time < 13) {
                mresult = "B";
            }
            else if (time < 15) {
                mresult = "C";
            }
            else if (time < 17) {
                mresult = "D";
            }
            else {
                mresult = "E";
            }
            break;
    }

    return mresult;
}

function getGame1LevelByTime() {
    if (IBT.game1ClickUsingTime < 6.1) {
        IBT.game1result = IBT.results.S;
    }
    else if (IBT.game1ClickUsingTime < 7.1) {
        IBT.game1result = IBT.results.A;
    }
    else if (IBT.game1ClickUsingTime < 8.1) {
        IBT.game1result = IBT.results.B;
    }
    else if (IBT.game1ClickUsingTime < 9.1) {
        IBT.game1result = IBT.results.C;
    }
    else if (IBT.game1ClickUsingTime < 10.1) {
        IBT.game1result = IBT.results.D;
    }
    else {
        IBT.game1result = IBT.results.E;
    }
}

function submitScoreAgain() {
    setGamePoints();

    // alert(JSON.stringify(submitData));
    $.get("/index.php?r=game/playagain", {
        "gameId": GAME["game" + GAME.current].name,
        "userId": userId,
        "point": IBT.perGamePoint["game" + GAME.current],
        "timeUsed": IBT["game" + GAME.current + "TimeResult"] * 100,
        "playTime": new Date().getTime()
    }, function (data, textStatus) {
        if (data.success = true) {
            setDefaultScores();
        }
        else {
            alert("数据新增失败！");
        }
    })
}
function submitScore() {
    setGamePoints();
    var submitData = {
        "gameId": GAME["game" + GAME.current].name,
        "userId": userId,
        "point": IBT.perGamePoint["game" + GAME.current],
        "timeUsed": IBT["game" + GAME.current + "TimeResult"] * 100,
        "playTime": new Date().getTime(),

    };
    //alert(JSON.stringify(submitData));
    $.ajax({
        type: "post",
        url: "/api/game/play",
        // 1 需要使用JSON.stringify 否则格式为 a=2&b=3&now=14...  
        // 2 需要强制类型转换，否则格式为 {"a":"2","b":"3"}  
        data: JSON.stringify(submitData),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            gamePlayed[GAME["game" + GAME.current].name] = true;
            setDefaultScores();
            // alert("保存成功");
            // window.location = "排行榜地址TODO";
        }, // 注意不要在此行增加逗号  
        error: function (e) {
            alert($.parseJSON(e.responseText));
        }
    });
}

function checkGameOpenOrClose() {
    $.get("/index.php?r=game/getgamesoption", function (data, textStatus) {
        if (data.success == true) {
            for (var i = 0; i < data.data.length; i++) {
                gameOpen[data.data[i].id] = data.data[i].status;
                // alert(data.data[i].status);
            }

            GAME.game1.open = gameOpen[GAME.game1.name] == 1 ? true : false;
            GAME.game2.open = gameOpen[GAME.game2.name] == 1 ? true : false;
            GAME.game3.open = gameOpen[GAME.game3.name] == 1 ? true : false;
            GAME.game4.open = gameOpen[GAME.game4.name] == 1 ? true : false;
            setLockByGameStatus();
        }
        else {
            alert("数据获取失败！");
        }
    })

}
function setLockByGameStatus() {
    for (i = 1; i < 5; i++) {
        if (GAME["game" + i].open == true) {
            $('.lock-' + i).addClass('lock-open');
            $('.lock-' + i).attr("src", "img/lock-open.png");
        }
        else {
            $('.lock-' + i).addClass('lock-closed');
            $('.lock-' + i).attr("src", "img/lock-closed.png");
        }
    }
}
function setDefaultScores() {
    $.get("/index.php?r=game/getmygamespoint", { "userId": userId }, function (data, textStatus) {
        if (data.success == true) {
            for (var i = 0; i < data.data.length; i++) {
                defaultPoints[data.data[i].game_id + "_t"] = (data.data[i].time_used / 100).toFixed(2);
                defaultPoints[data.data[i].game_id + "_l"] = getGameLevel(data.data[i].time_used / 100, data.data[i].game_id);
                gamePlayed[data.data[i].game_id] = true;
            }
            $('.game1-time-span').text(defaultPoints[GAME.game1.name + "_t"] != 0 ? (defaultPoints[GAME.game1.name + "_t"] + " S") : "");
            $('.game1-level-span').text(defaultPoints[GAME.game1.name + "_l"] != -1 ? defaultPoints[GAME.game1.name + "_l"] : "");
            $('.game2-time-span').text(defaultPoints[GAME.game2.name + "_t"] != 0 ? (defaultPoints[GAME.game2.name + "_t"] + " S") : "");
            $('.game2-level-span').text(defaultPoints[GAME.game2.name + "_l"] != -1 ? defaultPoints[GAME.game2.name + "_l"] : "");
            $('.game3-time-span').text(defaultPoints[GAME.game3.name + "_t"] != 0 ? (defaultPoints[GAME.game3.name + "_t"] + " S") : "");
            $('.game3-level-span').text(defaultPoints[GAME.game3.name + "_l"] != -1 ? defaultPoints[GAME.game3.name + "_l"] : "");
            $('.game4-time-span').text(defaultPoints[GAME.game4.name + "_t"] != 0 ? (defaultPoints[GAME.game4.name + "_t"] + " S") : "");
            $('.game4-level-span').text(defaultPoints[GAME.game4.name + "_l"] != -1 ? defaultPoints[GAME.game4.name + "_l"] : "");
        }
        else {
            alert("数据获取失败！");
        }
    })
}
