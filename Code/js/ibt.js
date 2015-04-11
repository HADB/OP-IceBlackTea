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
for (var i = 0; i < m.length; i++) {
    mnums = mnums + m[i].num;
    mm[m[i].name] = 1;//需要选择的图片
}
var IBT = {
    gamePoint: 0,

    perGamePoint: { game1: 0, game2: 0, game3: 0, game4: 0 },

    currentPageNumber: 0,

    effects: { moveUp: 1, moveDown: 2, fade: 3 },

    results: { S: 1, A: 2, B: 3, C: 4, D: 5, E: 6, Failed: 0 },

    directions: { up: 1, down: -1 },

    isAnimating: false,
	
	game1Played: 0,

    game1ClickCount: 0,

    game1ClickUsingTime: 0,

    game2ClickUsingTime: 0,

    game1end: false,

    game1result: null,
	
	game1LevelResult: null,
	
	game1TimeResult: 0,//上面的usingtime置零了

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
		checkUser();
        IBT.pageMove(IBT.effects.fade, 1000);
    }
};

$(function () {
    $(".page-1000 .button-enter-game").singleTap(function () {
        $('#clickaudio')[0].play();
        IBT.pageMove(IBT.effects.fade, 1001);
    });

    $(".page-1000 .button-rank-list").singleTap(function () {
        $('#clickaudio')[0].play();
        $.get("/api/game/item/leaders", { "gameId": gameId, "start": 0, "size": 10 }, function (data, textStatus) {
            var itemSize = 0;
            if (data == null) {
				alert("没有排行数据！");
            }
            else {
			console.log(data);
                itemSize = data.length;
                var trs = "<tr class='rank-th-tr'><th style='width: 10%;' align='center'>序号</th><th style='width: 18%;' align='center'>昵称</th><th style='width: 14%;' align='center'>成绩1</th><th style='width: 14%;' align='center'>成绩2</th><th style='width: 14%;' align='center'>成绩3</th><th style='width: 14%;' align='center'>成绩4</th><th style='width: 14%;' align='center'>总成绩</th></tr>";
                $.each(data, function (i, item) {

                    var trColor;
                    if (i % 2 == 0) {
                        trColor = "even-tr";
                    } else {
                        trColor = "odd-tr";
                    }
                    trs += "<tr class='" + trColor + " rank-td-tr'><td align='center'>" + (i + 1) + "</td>" + "<td align='center'>" + formatPalyerName(item.userName == null ? item.userId : item.userName) + "</td>" + "<td align='center'>" + item.point + "</td><td align='center'>无</td><td align='center'>无</td><td align='center'>无</td><td align='center'>" + (((item.timeUsed) / 100.00).toFixed(2)) + "</td></tr>";

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
				IBT.game1LevelResult="S";
            }
            else if (IBT.game1ClickUsingTime < 7.1) {
                IBT.game1result = IBT.results.A;
				IBT.game1LevelResult="A";
            }
            else if (IBT.game1ClickUsingTime < 8.1) {
                IBT.game1result = IBT.results.B;
				IBT.game1LevelResult="B";
            }
            else if (IBT.game1ClickUsingTime < 9.1) {
                IBT.game1result = IBT.results.C;
				IBT.game1LevelResult="C";
            }
            else if (IBT.game1ClickUsingTime < 10.1) {
                IBT.game1result = IBT.results.D;
				IBT.game1LevelResult="D";
            }
            else {
                IBT.game1result = IBT.results.E;
				IBT.game1LevelResult="E";
            }
            submitScore();//提交分数;
			IBT.game1Played=1;
			IBT.game1TimeResult=IBT.game1ClickUsingTime.toFixed(2);
            showResult(IBT.game1result, 101, IBT.game1ClickUsingTime.toFixed(2), 1, 9999)//提示下周挑战游戏2
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
        timerGo();
    });

    $(".page-101 .button-return").singleTap(function () {
        $('#clickaudio')[0].play();
        //IBT.pageMove(IBT.effects.fade, IBT.resultReturnPageNumber);
		$('.game1-time-span').text(IBT.game1TimeResult+" S");
		$('.game1-level-span').text(IBT.game1LevelResult);
		IBT.pageMove(IBT.effects.fade, 1001);
    });

    $(".page-101 .button-next").singleTap(function () {
        $('#clickaudio')[0].play();
        if (IBT.resultNextPageNumber == 9999) {
            alert("下一周挑战下一个游戏！");
			$('.game1-time-span').text(IBT.game1TimeResult+" S");
			$('.game1-level-span').text(IBT.game1LevelResult);
			 IBT.pageMove(IBT.effects.fade, 1001);
        }
        else {
            IBT.pageMove(IBT.effects.fade, IBT.resultNextPageNumber);
        }
    });

    $(".page-102 .button-return").singleTap(function () {
        $('#clickaudio')[0].play();
        game2Reset();
        IBT.pageMove(IBT.effects.fade, IBT.resultReturnPageNumber);
    });

    $(".page-102 .button-next").singleTap(function () {
        $('#clickaudio')[0].play();
        IBT.pageMove(IBT.effects.fade, IBT.resultNextPageNumber);
    });

    $("#testrank").singleTap(function () {
        IBT.pageMove(IBT.effects.fade, 1002);
        $.get("/api/game/item/leaders", { "gameId": gameId, "start": 0, "size": 10 }, function (data, textStatus) {
            var itemSize = 0;
            if (data == null) {

            }
            else {
                itemSize = data.length;
                var trs = "<tr class='rank-th-tr'><th style='width: 10%;' align='center'>序号</th><th style='width: 18%;' align='center'>昵称</th><th style='width: 14%;' align='center'>成绩1</th><th style='width: 14%;' align='center'>成绩2</th><th style='width: 14%;' align='center'>成绩3</th><th style='width: 14%;' align='center'>成绩4</th><th style='width: 14%;' align='center'>总成绩</th></tr>";
                $.each(data, function (i, item) {

                    var trColor;
                    if (i % 2 == 0) {
                        trColor = "even-tr";
                    } else {
                        trColor = "odd-tr";
                    }
                    trs += "<tr class='" + trColor + " rank-td-tr'><td align='center'>" + (i + 1) + "</td>" + "<td align='center'>" + formatPalyerName(item.userName == null ? item.userId : item.userName) + "</td>" + "<td align='center'>" + item.point + "</td><td align='center'>无</td><td align='center'>无</td><td align='center'>无</td><td align='center'>" + item.point +"</td></tr>";

                });
                $(".rank-table").append(trs);

            }
        });
    });
	$('.mission').each(function(){
		$(this).singleTap(function(){
			if($('.lock-'+$(this).attr("adata")).hasClass('lock-closed')){
				alert("下一周挑战该游戏！");
			}
			else{
				$('#clickaudio')[0].play();
				setTimeout(function(){
				checkGameAndUser();
				}
				,200);
				if(IBT.game1Played==0){//TODO:还有其他游戏
					IBT.pageMove(IBT.effects.fade, $(this).attr('pdata'));
				}
				else{
					alert("你已经参加过了疯狂点点点。");
				}
			}
			
		})
	})
	
	$('.lock').each(function(){
		$(this).click(function(){
			if($(this).hasClass('lock-closed')){
				alert("下一周挑战该游戏！");
			}
			else{
				return false;
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
    showResultGame(IBT.game2result, 102, IBT.game2ClickUsingTime.toFixed(2), 3, 5)
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
function setGamePoints() {
    IBT.perGamePoint.game1 = 25.00 - (25.00 / (11.00)).toFixed(2) * IBT.game1ClickUsingTime.toFixed(2);
    IBT.gamePoint = IBT.perGamePoint.game1;//TODO:+game2...
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

    $.get("http://121.41.105.146/api/game/id", { id: gameId }, function (data, textStatus) {
			if (data == null) {
				alert("游戏不存在");
				window.location.href="www.xxx.com";
			}
		});
	
}

function checkUser() {
	userId = getUrlParam("userId");
    if (userId == null) {
        alert("无法确认用户身份，请从微信中访问我们.");
		window.location.href="www.xxx.com";
    }
	else{
    $.get("http://121.41.105.146/api/game/item", { userId: userId, game: gameId }, function (data, textStatus) {

        if (data != null) {
			IBT.game1Played=1;
				//alert("你已经参加过了疯狂点点点。");
			}
		})
	}

}
function formatPalyerName(strName) {
    if (strName.length > 8) {
        return strName.substr(0, 5) + '...';
    } else {
        return strName;
    }
}
function submitScore() {
    setGamePoints();
    var submitData = {
        "gameId": gameId,
        "userId": userId,
        "point": IBT.perGamePoint.game1,
        "timeUsed": IBT.game1ClickUsingTime.toFixed(2) * 100,
        "playTime": new Date().getTime(),

    };
    $.ajax({
        type: "post",
        url: "/api/game/play",
        // 1 需要使用JSON.stringify 否则格式为 a=2&b=3&now=14...  
        // 2 需要强制类型转换，否则格式为 {"a":"2","b":"3"}  
        data: JSON.stringify(submitData),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
           // alert("保存成功");
            // window.location = "排行榜地址TODO";
        }, // 注意不要在此行增加逗号  
        error: function (e) {
            alert($.parseJSON(e.responseText));
        }
    });
}

