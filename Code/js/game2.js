        var timer = 0.0;
        var m = [{ "name": "red2000", "num": 3 }, { "name": "redz", "num": 2 },{ "name": "redg", "num": 2 },{ "name": "green250", "num": 2 }];
		var mselected = [{ "name": "red2000", "selectednum": 0 }, { "name": "redz", "selectednum": 0 },{ "name": "redg", "selectednum": 0 },{ "name": "green250", "selectednum": 0 }];
        var mnums = 0;
		var mm = new Array();
        var selectednums = 0;
        var t;//timer;
        var watertimer;
        var sstop = 0;//结束标记
		var ssuccess=0;
		var sfail=0;
        var divs = new Array();//所有图片的div集合
        var rands = new Array();//16个不相同的0-15随机数组成的数组
        for (var i = 0; i < m.length; i++) {
            mnums = mnums + m[i].num;
			mm[m[i].name] = 1;//需要选择的图片
        }
        function timerPlus() {//TODO:游戏胜负判断是否在这里？，参照watergame再修改
			if(sstop==1){
			alert(22);
				if(ssuccess==1){
					clearInterval(t);
					game2Success();
				}
				else if(sfail==1){alert(22);
					clearInterval(t);
					game2Fail();
				}
			}
            else {
                timer = timer + 0.01;
                $("#timer").text(timer.toFixed(2));
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
		function game2Success(){
			if (timer < 9) {
                IBT.game2result = IBT.results.S;
            }
            else if (timer < 11) {
                IBT.game2result = IBT.results.A;
            }
            else if (timer < 13) {
                IBT.game2result = IBT.results.B;
            }
            else if (timer < 15) {
                IBT.game2result = IBT.results.C;
            }
            else if (timer < 17) {
                IBT.game2result = IBT.results.D;
            }
            else {
                IBT.game2result = IBT.results.E;
            }
			showResult(IBT.game2result, timer, 3, 5)
		}
		function game2Fail(){
		alert("你失败了，请重新挑战！");
		IBT.pageMove(IBT.effects.fade, 3);
		}
		$('document').ready(function () {
            document.addEventListener('touchmove', function (e) {
                e.preventDefault();
            }, false);
            for (var i = 0; i < 16; i++) {
                divs[i] = $('.items').eq(i);
                rands[i] = -1;
            }
			random16();
			setRandomDivs();
			$('.juxing-g2').removeClass("hide");
            $('.items').each(function () {
                $(this).on("tap", function () {

                    if (mm[$(this).attr("adata")] == 1) {

                        //是需要选择的图片
                        if (!$(this).hasClass("selected")) {
                            selectednums++;
                            $(this).removeClass("unselected");
                            $(this).addClass("selected");
							if (selectednums == mnums && selectednums != 0) {
								ssuccess=1;
								sstop=1;
							}
                        }
                    }
                    else {
						sfail=1;
                        sstop = 1;
                    }
                })
            })
		})