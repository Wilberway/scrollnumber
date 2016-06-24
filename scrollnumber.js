(function(){
	var f = {};
	$.fn.lottery = function(opt){
		var I=this,$obj = $(this), set = {
			type:'roll',
			number: 0,//几个数字
			length:10,//数字长度,，默认0~9
			width:0,//宽度
			height:100,//高度
			delay: 1,//每个数字间的延迟
			time: 10,//持续时间
			result: 0,//结果
			speed: 2,//速度
			callback: ''//结束回调
		};

		if(opt && typeof opt == 'object'){
			$.extend(set, opt);
			//if(!set.now || !set.end) return;//alert('必要参数[now/end]未传入！');
			//if(set.end <= set.now && set.tipend) return $obj.html(set.tipend);
		}
		var s = '_lotteryKey', k = $obj.attr(s),dis = [],t = 0,d=[];
		if(k){
			if(f[k]) clearInterval(f[k]);//防止重复加载
			if(opt === 'stop') return;//停止
		}else{
			k = Math.random();
			$obj.attr(s, k);
		}
		cDom = function(){
			for(var i = 0; i < set.number; i++){
				var opt = {
					'height': (set.length * set.height) + 'px',
					'background-image': 'url(' + set.bg + ')',
					'position': 'absolute',
					'width': set.width + 'px'
				};
				var div1 = $('<div class="lottery_1"></div>');
				div1.css(opt);
				div1.css('top', 0);
				var div2 = $('<div class="lottery_2"></div>');
				div2.css(opt);
				div2.css('top',(set.length * set.height) + 'px');
				var li = $('<li></li>');
				li.append(div1);
				li.append(div2);
				$obj.append(li);
			}
		};
		cDom();

		//计算长度
		function calDistance(){
			var res = set.result,len = res.toString().length;
			for(i = 0;i < len;i++){
				if(res > 0){
					dis[i] = res % set.length;
					res = (res - dis[i])/set.length;
					dis[i] = set.height * (set.length * 2 + dis[i]);
				}
			}
			startRoll();
		}
		calDistance();

		//每个数字转动
		function startRoll(){
			bind($obj.find('li').eq(t),t);
			t += 1;
			var int = setInterval(function(){
				if(t < set.number){
					bind($obj.find('li').eq(t),t);
					t++;
				}else{
					window.clearInterval(int);
				}
			},set.delay * 1000 * t);
		}

		//滚动
		function bind(ele,i){
			var ele = ele.find('div');
			d[i] = [];
			for(var j =0; j < ele.length; j++){
				ele.eq(j).bind('myevent',function(){
					setTop($(this));
				});
			}
			rolling(ele.eq(0),0,i);
			rolling(ele.eq(1),1,i);
		}

		function rolling(ele,j,i){
			var u = 0,t1 = (0.2 * set.time * 60),t2 = (0.6 * set.time * 60),v = dis[i]/(0.8 * set.time * 60),a = v/t1;
			d[i][j] = dis[i]/8;
			move(ele,0,a,dis[i]/8,d[i][j],function(){
				d[i][j] = (dis[i]*6)/8;
				move(ele,v,0,(dis[i]*6)/8,d[i][j],function(){
					d[i][j] = dis[i]/8;
					move(ele,v,-a,dis[i]/8,d[i][j],function(){
					});
				})
			});
		}

		//改变高度
		function move(e,v,a,s,d,callback){
			var s0 = 0;
			var top0 = e.offset().top;
			var  c = correct(top0 - d);
			var int1 = setInterval(function(){
				if(s0 < s && v >= 0){
					v += a;
					s0 += v;
					if(e.offset().top <= -set.height * set.length){
						e.trigger('myevent');
					}
					var top = e.offset().top;
					e.css('top',top - v +'px');
				}else{
					s0 = 0;
					e.css('top',c +'px');
					window.clearInterval(int1);
					if(callback && typeof(callback) == 'function'){
						callback();
					}
				}
			},1000/60);
		}

		//滚动到上面之后重新设置高度
		function setTop(ele){
			var top = ele.offset().top + (set.height * set.length)*2;
			ele.css('top', top + 'px');
		}
		//矫正偏差值
		function correct(p){
			var t = set.length * set.height;
			while(p < -t){
				p += 2 * t;
			}
			return p;
		}
	};
})();