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
for (var i = 0; i < m.length; i++) {
    mnums = mnums + m[i].num;
    mm[m[i].name] = 1;//需要选择的图片
}
var IBT = {
    currentPageNumber: 0,

    effects: { moveUp: 1, moveDown: 2, fade: 3 },

    results: { S: 1, A: 2, B: 3, C: 4, D: 5, E: 6, Failed: 0 },

    directions: { up: 1, down: -1 },

    isAnimating: false,

    game1ClickCount: 0,

    game1ClickUsingTime: 0,

    game2ClickUsingTime: 0,

    game1end: false,

    game1result: null,

    game2result: null,

    resultReturnPageNumber: 1,

    resultNextPageNumber: 1,

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
        IBT.pageMove(IBT.effects.fade, 99);
    }
};

$(function () {
    game2Init();
    $(".game-1.page-1 .start").singleTap(function () {
        $('#clickaudio')[0].play();
        IBT.pageMove(IBT.effects.fade, 2);
    });
    $(".game-2.page-3 .start").singleTap(function () {
        $('#clickaudio')[0].play();
        IBT.pageMove(IBT.effects.fade, 4);
        timerGo();
    });

    $(".game-1.page-2 .button-left,.game-1.page-2 .button-right").on('touchstart pointerdown', function () {
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

    $('.game-1.page-2 .button-left,.game-1.page-2 .button-right').on('touchmove', function (event) {
        return false;
    });

    $('.game-1.page-2 .button-left,.game-1.page-2 .button-right').on('touchend pointerup', function (event) {
        $(this).attr("src", "img/button-click.png");
    });

    $(".game-1.page-2 .button-ok").on('touchstart pointerdown', function () {
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
            showResult(IBT.game1result, IBT.game1ClickUsingTime.toFixed(2), 2, 4)
        }
        else {
            IBT.game1result = IBT.results.Failed;
            IBT.pageMove(IBT.effects.fade, 1);
            alert("点击了" + IBT.game1ClickCount + "次，挑战失败！请重新进行挑战！");
        }
        IBT.game1ClickCount = 0;
        IBT.game1ClickUsingTime = 0;
    });

    $(".game-1.page-100 .button-return").singleTap(function () {
        $('#clickaudio')[0].play();
        IBT.pageMove(IBT.effects.fade, IBT.resultReturnPageNumber);
    });

    $(".game-1.page-100 .button-next").singleTap(function () {
        $('#clickaudio')[0].play();
        IBT.pageMove(IBT.effects.fade, IBT.resultNextPageNumber);
    });

    $(".game-2.page-100 .button-return").singleTap(function () {
        $('#clickaudio')[0].play();
        game2Reset();
        IBT.pageMove(IBT.effects.fade, IBT.resultReturnPageNumber);
    });

    $(".game-2.page-100 .button-next").singleTap(function () {
        $('#clickaudio')[0].play();
        IBT.pageMove(IBT.effects.fade, IBT.resultNextPageNumber);
    });
});

//游戏1计时器
function startGame1Timer() {
    setTimeout(function () {
        if (!IBT.game1end) {
            IBT.game1ClickUsingTime += 0.01;
            $(".game-1.page-2 .using-time").html(IBT.game1ClickUsingTime.toFixed(2) + "s");
            startGame1Timer();
        }
        else {
            IBT.game1ClickUsingTime = 0;
            $(".game-1.page-2 .using-time").html("0.00s");
        }
    }, 10);
}

//显示结果页面，目前不清楚4个游戏的结果页面是否通用，如果不通用，还需要进行一些修改
function showResult(result, text, returnPageNumber, nextPageNumber) {
    IBT.resultReturnPageNumber = returnPageNumber;
    IBT.resultNextPageNumber = nextPageNumber;
    IBT.pageMove(IBT.effects.fade, 100);
    $(".game-1.page-100 .using-time").html(text + "s");
    switch (result) {
        case IBT.results.S:
            $(".game-1.page-100 .result").attr("src", "img/score-s.png");
            $(".game-1.page-100 .logo").addClass("right");
            $(".game-1.page-100 .using-time").removeClass().addClass("using-time s");
            break;
        case IBT.results.A:
            $(".game-1.page-100 .result").attr("src", "img/score-a.png");
            $(".game-1.page-100 .logo").addClass("right");
            $(".game-1.page-100 .using-time").removeClass().addClass("using-time a");
            break;
        case IBT.results.B:
            $(".game-1.page-100 .result").attr("src", "img/score-b.png");
            $(".game-1.page-100 .logo").addClass("right");
            $(".game-1.page-100 .using-time").removeClass().addClass("using-time b");
            break;
        case IBT.results.C:
            $(".game-1.page-100 .result").attr("src", "img/score-c.png");
            $(".game-1.page-100 .logo").removeClass("right");
            $(".game-1.page-100 .using-time").removeClass().addClass("using-time c");
            break;
        case IBT.results.D:
            $(".game-1.page-100 .result").attr("src", "img/score-d.png");
            $(".game-1.page-100 .logo").removeClass("right");
            $(".game-1.page-100 .using-time").removeClass().addClass("using-time d");
            break;
        case IBT.results.E:
            $(".game-1.page-100 .result").attr("src", "img/score-e.png");
            $(".game-1.page-100 .logo").removeClass("right");
            $(".game-1.page-100 .using-time").removeClass().addClass("using-time e");
            break;
    }
}
function showResultGame2(result, text, returnPageNumber, nextPageNumber) {
    IBT.resultReturnPageNumber = returnPageNumber;
    IBT.resultNextPageNumber = nextPageNumber;
    IBT.pageMove(IBT.effects.fade, 100);
    $(".game-2.page-100 .using-time").html(text + "s");
    switch (result) {
        case IBT.results.S:
            $(".game-2.page-100 .result").attr("src", "img/score-s.png");
            $(".game-2.page-100 .logo").addClass("right");
            $(".game-2.page-100 .using-time").removeClass().addClass("using-time s");
            break;
        case IBT.results.A:
            $(".game-2.page-100 .result").attr("src", "img/score-a.png");
            $(".game-2.page-100 .logo").addClass("right");
            $(".game-2.page-100 .using-time").removeClass().addClass("using-time a");
            break;
        case IBT.results.B:
            $(".game-2.page-100 .result").attr("src", "img/score-b.png");
            $(".game-2.page-100 .logo").addClass("right");
            $(".game-2.page-100 .using-time").removeClass().addClass("using-time b");
            break;
        case IBT.results.C:
            $(".game-2.page-100 .result").attr("src", "img/score-c.png");
            $(".game-2.page-100 .logo").removeClass("right");
            $(".game-2.page-100 .using-time").removeClass().addClass("using-time c");
            break;
        case IBT.results.D:
            $(".game-2.page-100 .result").attr("src", "img/score-d.png");
            $(".game-2.page-100 .logo").removeClass("right");
            $(".game-2.page-100 .using-time").removeClass().addClass("using-time d");
            break;
        case IBT.results.E:
            $(".game-2.page-100 .result").attr("src", "img/score-e.png");
            $(".game-2.page-100 .logo").removeClass("right");
            $(".game-2.page-100 .using-time").removeClass().addClass("using-time e");
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
    }
    else if (IBT.game2ClickUsingTime < 11) {
        IBT.game2result = IBT.results.A;
    }
    else if (IBT.game2ClickUsingTime < 13) {
        IBT.game2result = IBT.results.B;
    }
    else if (IBT.game2ClickUsingTime < 15) {
        IBT.game2result = IBT.results.C;
    }
    else if (IBT.game2ClickUsingTime < 17) {
        IBT.game2result = IBT.results.D;
    }
    else {
        IBT.game2result = IBT.results.E;
    }
    showResultGame2(IBT.game2result, IBT.game2ClickUsingTime.toFixed(2), 3, 5)
}
function game2Fail() {
    alert("你失败了，请重新挑战！");
    game2Reset();//延时
    IBT.pageMove(IBT.effects.fade, 3);
}
function game2Reset() {
    IBT.game2ClickUsingTime = 0.0;
    sstop = 0;
    ssuccess = 0;
    sfail = 0;
    selectednums = 0;
    random16();
    setRandomDivs();
}
