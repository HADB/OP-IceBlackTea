var IBT = {
    currentPageNumber: 1,

    effects: { moveUp: 1, moveDown: 2, fade: 3 },

    results: { S: 1, A: 2, B: 3, C: 4, D: 5, E: 6, Failed: 0 },

    directions: { up: 1, down: -1 },

    isAnimating: false,

    game1ClickCount: 0,

    game1ClickUsingTime: 0,

    game1end: false,

    game1result: null,

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
};

$(function () {
    $(".game-1.page-1 .start").singleTap(function () {
	$('#clickaudio')[0].play();
        IBT.pageMove(IBT.effects.fade, 2);
    });

    $(".game-1.page-2 .button-left,.game-1.page-2 .button-right").on('touchstart', function () {
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

    $('.game-1.page-2 .button-left,.game-1.page-2 .button-right').on('touchend pointerup', function (event) {
	$('#clickaudio')[0].play();
        $(this).attr("src", "img/button-click.png");
    });

    $(".game-1.page-2 .button-ok").singleTap(function () {
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
            alert("点击了" + IBT.game1ClickCount + "次，挑战失败！请重新进行挑战！");
            IBT.pageMove(IBT.effects.fade, 1);
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
