var IBT = {
    currentPageNumber: 1,

    effects: { moveUp: 1, moveDown: 2, fade: 3 },

    directions: { up: 1, down: -1 },

    isAnimating: false,

    game1ClickCount: 0,

    game1ClickUsingTime: 0,

    game1end: false,

    pageMove: function (effect, direction, pageCount) {
        var nextPageNumber = IBT.currentPageNumber + direction * pageCount;
        var fromPage = ".page-" + IBT.currentPageNumber;
        var toPage = ".page-" + nextPageNumber;
        IBT.currentPageNumber = nextPageNumber;

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
        IBT.pageMove(IBT.effects.fade, IBT.directions.up, 1);
    });

    $(".game-1.page-2 .button-left,.game-1.page-2 .button-right").on('touchstart', function () {
        IBT.game1end = false;
        if (IBT.game1ClickCount == 0) {
            startGame1Timer();
        }
        IBT.game1ClickCount++;
        $(this).attr("src", "img/button-down.png");
    });

    $('.game-1.page-2 .button-left,.game-1.page-2 .button-right').on('touchend', function (event) {
        $(".game-1.page-2 .button-left").attr("src", "img/button-click.png");
        $(".game-1.page-2 .button-right").attr("src", "img/button-click.png");
    });

    $(".game-1.page-2 .button-ok").singleTap(function () {
        IBT.game1end = true;
        if (IBT.game1ClickCount == 32) {
            var level = "E";
            if (IBT.game1ClickUsingTime < 6.1) {
                level = "S";
            }
            else if (IBT.game1ClickUsingTime < 7.1) {
                level = "A";
            }
            else if (IBT.game1ClickUsingTime < 8.1) {
                level = "B";
            }
            else if (IBT.game1ClickUsingTime < 9.1) {
                level = "C";
            }
            else if (IBT.game1ClickUsingTime < 10.1) {
                level = "D";
            }
            alert("耗时" + IBT.game1ClickUsingTime.toFixed(2) + "秒，等级为" + level);
        }
        else {
            alert(IBT.game1ClickUsingTime.toFixed(2) + "秒点击了" + IBT.game1ClickCount + "次，挑战失败！");
            IBT.pageMove(IBT.effects.fade, IBT.directions.down, 1);
        }
        IBT.game1ClickCount = 0;
        IBT.game1ClickUsingTime = 0;
    });
});


function startGame1Timer() {
    setTimeout(function () {
        if (!IBT.game1end) {
            IBT.game1ClickUsingTime += 0.01;
            $(".game-1.page-2 .using-time").html(IBT.game1ClickUsingTime.toFixed(2));
            startGame1Timer();
        }
        else {
            IBT.game1ClickUsingTime = 0;
            $(".game-1.page-2 .using-time").html("0.00");
        }
    }, 10);
}
