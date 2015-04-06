var IBT = {
    currentPageNumber: 1,

    effects: { moveUp: 1, moveDown: 2, fade: 3 },

    directions: { up: 1, down: -1 },

    isAnimating: false,

    clickCount: 0,

    clickUsingTime: 0,

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

    $(".game-1.page-2 .button-left,.game-1.page-2 .button-right").singleTap(function () {
        IBT.game1end = false;
        if (IBT.clickCount == 0) {
            startTimer();
        }
        IBT.clickCount++;
        $(this).attr("src", "img/button-down.png");
        console.log(IBT.clickCount);
    });

    $(document).on('touchend MSPointerUp pointerup', function (event) {
        $(".game-1.page-2 .button-left").attr("src", "img/button-click.png");
        $(".game-1.page-2 .button-right").attr("src", "img/button-click.png");
    });

    $(".game-1.page-2 .button-ok").singleTap(function () {
        IBT.game1end = true;
        if (IBT.clickCount == 32) {
            var level = "E";
            if (IBT.clickUsingTime < 6.1) {
                level = "S";
            }
            else if (IBT.clickUsingTime < 7.1) {
                level = "A";
            }
            else if (IBT.clickUsingTime < 8.1) {
                level = "B";
            }
            else if (IBT.clickUsingTime < 9.1) {
                level = "C";
            }
            else if (IBT.clickUsingTime < 10.1) {
                level = "D";
            }
            alert("耗时" + IBT.clickUsingTime.toFixed(1) + "秒，等级为" + level);
        }
        else {
            alert(IBT.clickUsingTime.toFixed(1) + "秒点击了" + IBT.clickCount + "次，挑战失败！");
            IBT.pageMove(IBT.effects.fade, IBT.directions.down, 1);
        }
        IBT.clickCount = 0;
        IBT.clickUsingTime = 0;
    });
});


function startTimer() {
    setTimeout(function () {
        IBT.clickUsingTime += 0.1;
        console.log(IBT.clickUsingTime);
        if (!IBT.game1end) {
            startTimer();
        }
    }, 100);
}
