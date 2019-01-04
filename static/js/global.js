$(function() {
	//nav
	var url = location.href;
	var last = url.lastIndexOf(".html");
	var fileName = url.substring(url.lastIndexOf("/") + 1, last)

	var $thisNav = $(".nav a[href*='" + fileName + "']");
	if ($thisNav.length > 0) {
		$(".nav a").removeClass('active');
		console.log($thisNav.parents("li").find('a').eq(0))
		$thisNav.parents("li").find('a').eq(0).addClass('active');
	} else {

	}

	//市场前瞻页面
	var audioData = {
		size: $('.zixun-list ul li').length,
		page: 0
	};
	showListMore();
	$("#showListMore").on('click', function(argument) {
		showListMore()
	});

	function showListMore() {
		for (var i = 0; i < 20; i++) {
			var eq = i + audioData.page * 20
			if (eq >= audioData.size || eq === 0) {
				$("#showListMore").fadeOut();
				break;
			}
			$('.zixun-list ul li').eq(eq).fadeIn();
		}
		audioData.page++;
	}


})

function getQueryString(name, noUnescape) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg); //window.location控制获取当前页面的URL参数

	noUnescape = noUnescape == undefined ? false : noUnescape;
	if (noUnescape) {
		if (r != null) return r[2];
		return null;
	} else {
		if (r != null) return unescape(r[2]);
		return null;
	}
}
var isPC = (function() {
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone",
		"SymbianOS", "Windows Phone",
		"iPad", "iPod"
	];
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}

	return !!(flag && document.documentElement.clientWidth > 768);
})();