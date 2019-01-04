    if (!("classList" in document.documentElement)) {
        Object.defineProperty(HTMLElement.prototype, 'classList', {
            get: function() {
                var self = this;

                function update(fn) {
                    return function(value) {
                        var classes = self.className.split(/\s+/g),
                            index = classes.indexOf(value);

                        fn(classes, index, value);
                        self.className = classes.join(" ");
                    }
                }

                return {
                    add: update(function(classes, index, value) {
                        if (!~index) classes.push(value);
                    }),

                    remove: update(function(classes, index) {
                        if (~index) classes.splice(index, 1);
                    }),

                    toggle: update(function(classes, index, value) {
                        if (~index)
                            classes.splice(index, 1);
                        else
                            classes.push(value);
                    }),

                    contains: function(value) {
                        return !!~self.className.split(/\s+/g).indexOf(value);
                    },

                    item: function(i) {
                        return self.className.split(/\s+/g)[i] || null;
                    }
                };
            }
        });
    };

    (function(window, document) {
        var AudioPlay = function(ele) {
            this.ele = ele; //音频父元素
            this.index = null; //当前音频
            this.sliderWidth = 400 - 12;
            this.volume = 0.6;
            this.isPlay = 0; //0缓冲 1播放 2暂停
            this.init();
            this.createHTML();
        }

        //初始化数据
        AudioPlay.prototype.init = function() {
            this.audio = new Audio();
            this.btnPlay = document.querySelectorAll(this.ele);

            //播放结束
            this.audio.addEventListener("ended", function() {
                console.log("ended")
                than.end();
            }, false);

            //监听可以播放
            this.audio.addEventListener("playing", function() {
                console.log("playing");
                than.playing();
            }, false);
            //播放error
            this.audio.addEventListener("error", function() {
                console.log("error");
                than.error();
            }, false);
            //缓冲waiting
            this.audio.addEventListener("waiting", function() {
                console.log("waiting")
                than.waiting();
            }, false);
            var than = this;

            for (var index = 0; index < this.btnPlay.length; index++) {
                (function(index) {
                    than.btnPlay[index].addEventListener("click", function(e) {
                        if (this.classList.contains("btn-none")) return;
                        document.querySelector(".audio-box").style.display = "block";
                        document.querySelector("body").style.marginBottom = "80PX";
                        than.sliderWidth = document.querySelector(".times-slider").offsetWidth - 12;
                        //判断当前播放状态
                        // console.log(index)
                        if (than.index == index) {
                            if (than.isPlay === 2) {
                                than.play();
                            };
                            if (than.isPlay === 1) {
                                than.stop();
                            };
                            if (than.isPlay === 0) {
                                than.stop();
                            };
                            return;
                        }

                        than.index = index;
                        than.set(this.getAttribute("src"));
                    }, false);
                })(index)
            }
        };

        AudioPlay.prototype.set = function(src) {
            // console.log(src)
            var than = this;
            this.audio.src = src;
            // than.audio.currentTime = 0;
            than.play();

        }

        //播放
        AudioPlay.prototype.play = function(e) {

            this.upControls();
            this.audio.volume = this.volume;
            clearInterval(this.interval);
            this.audio.play();
        };
        //音乐加载error
        AudioPlay.prototype.error = function(index) {
            this.btnPlay[this.index].classList.remove("btn-waiting");
            this.btnPlay[this.index].classList.remove("btn-play");
            this.btnPlay[this.index].classList.add("btn-none");
            this.palyEle.classList.remove("play");
            this.palyEle.classList.remove("waiting");
            this.palyEle.classList.add("none");
            // this.index = null;
        };

        //正在播放中
        AudioPlay.prototype.playing = function() {
            this.palyEle.classList.add("stop");
            this.btnPlay[this.index].classList.remove("btn-waiting");
            this.btnPlay[this.index].classList.remove("btn-play");
            this.btnPlay[this.index].classList.add("btn-pause");
            this.palyEle.classList.remove("waiting");
            this.times();
            this.isPlay = 1;
            var than = this;
            this.interval = setInterval(function() {
                than.times();
            }, 1000);
        }

        //音频正在加载缓存当中....
        AudioPlay.prototype.waiting = function() {
            // console.log('音频正在加载缓存当中');
            this.isPlay = 0;
            this.btnPlay[this.index].classList.add("btn-waiting");
            this.btnPlay[this.index].classList.remove("btn-play");
            this.palyEle.classList.remove("play");
            this.palyEle.classList.remove("none");
            this.palyEle.classList.add("waiting");
        }

        //切换音频更新控件的显示
        AudioPlay.prototype.upControls = function() {
            this.allTime.innerText = "00:00";
            this.moveTime.innerText = "00:00";
            this.controlsSlider.style.left = 0 + "px";
            this.sliderNew.style.width = 0 + "px";
            if (this.index == null) return;
            for (var i = 0; i < this.btnPlay.length; i++) {
                this.btnPlay[i].classList.remove("btn-pause");
                this.btnPlay[i].classList.remove("btn-waiting");
                this.btnPlay[i].classList.remove("btn-none");
                this.btnPlay[i].classList.add("btn-play");
            };
            this.nextEle.classList.remove("disabled");
            this.prevEle.classList.remove("disabled");
            if (this.index == this.btnPlay.length - 1) {
                this.nextEle.classList.add("disabled");
            }
            if (this.index == 0) {
                this.prevEle.classList.add("disabled");
            }
        };

        //暂停播放
        AudioPlay.prototype.stop = function() {
            this.audio.pause();
            this.btnPlay[this.index].classList.remove("btn-pause");
            this.btnPlay[this.index].classList.add("btn-play");
            this.palyEle.classList.add("play");
            this.palyEle.classList.remove("stop");
            this.isPlay = 2;
            clearInterval(this.interval);
        };
        //播放结束
        AudioPlay.prototype.end = function() {
            this.nextEle.classList.remove("disabled");
            this.prevEle.classList.remove("disabled");
            this.audio.currentTime = 0;
            this.btnPlay[this.index].classList.remove("btn-pause");
            this.btnPlay[this.index].classList.add("btn-play");
            this.palyEle.classList.remove("stop");
            this.palyEle.classList.add("play");
            this.isPlay = 2;
            clearInterval(this.interval);
        };
        //设置slider 进度条和时间
        AudioPlay.prototype.times = function() {

            var m = parseInt(this.audio.duration / 60)
            var s = parseInt(this.audio.duration % 60);
            var allTime = (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
            this.allTime.innerText = allTime ? allTime : "00:00";
            var m1 = parseInt(this.audio.currentTime / 60)
            var s1 = parseInt(this.audio.currentTime % 60);
            var moveTime = (m1 < 10 ? "0" + m1 : m1) + ":" + (s1 < 10 ? "0" + s1 : s1);
            this.moveTime.innerText = moveTime;
            if (this.mouserEnter) {
                return;
            }
            var slider = Math.ceil((this.audio.currentTime * this.sliderWidth) / this.audio.duration)
            this.controlsSlider.style.left = slider + "px";
            this.sliderNew.style.width = slider + "px";
        };

        //插入html control 事件
        AudioPlay.prototype.createHTML = function() {
            var than = this;
            var html = '<div class="content"><div class="times-slider"><span class="controls-slider"></span><i class="slider-new"></i></div>';
            html = html + '<div class="time"><span class="move-time">00:00</span> / <span class="all-time">00:00</span></div>';
            html = html + '<div class="panel"><span class="prev"></span><span class="play"></span><span class="next"></span></div>';
            html = html + '<div class="volume-box"><span class="muted"></span><div class="volume-slider"><span class="controls-volume"></span><i class="volume-slider-new"></i></div></div>'
            html = html + "</div>"
            var audioBox = document.createElement("div");
            audioBox.className = "audio-box";
            audioBox.innerHTML = html
            document.body.appendChild(audioBox);
            this.allTime = document.querySelector(".all-time");
            this.moveTime = document.querySelector(".move-time");
            this.controlsSlider = document.querySelector(".controls-slider");
            this.sliderNew = document.querySelector(".slider-new");


            //slider
            var startX, endX, left, styleLeft;
            var isTouch = "ontouchstart" in document.createElement("div");
            var tstart = isTouch ? "touchstart" : "mousedown";
            var tmove = isTouch ? "touchmove" : "mousemove";
            var tend = isTouch ? "touchend" : "mouseup";
            var tcancel = isTouch ? "touchcancel" : "mouseout";
            this.controlsSlider.addEventListener(tstart, function(e) {

                e.preventDefault();
                startX = e.touches ? e.touches[0].clientX : e.clientX;
                console.log(startX)
                left = parseInt(window.getComputedStyle(this, null).left);
                // console.log("left", left);
                than.mouserEnter = true;
                document.addEventListener(tmove, move, false);
                document.addEventListener(tend, up, false);
            }, false);

            function move() {

                if (!than.mouserEnter) return;
                event.preventDefault();
                endX = event.touches ? event.touches[0].clientX : event.clientX;
                styleLeft = left + endX - startX;
                styleLeft = Math.ceil(styleLeft <= 0 ? 0 : styleLeft >= than.sliderWidth ? than.sliderWidth : styleLeft);

                than.controlsSlider.style.left = styleLeft + "px";
                than.sliderNew.style.width = styleLeft + "px";
            }

            function up() {
                than.mouserEnter = false;
                document.removeEventListener(tmove, move, false);
                document.removeEventListener(tend, up, false);
                //设置播放时间段currentTime
                var currentTime = Math.floor(than.audio.duration * styleLeft / than.sliderWidth);
                than.audio.currentTime = currentTime;
            }

            //暂停或播放当前
            this.palyEle = document.querySelector(".play");
            this.palyEle.addEventListener("click", function() {
                if (than.isPlay === 2) {
                    than.play();
                };
                if (than.isPlay === 1) {
                    than.stop();
                };
                if (than.isPlay === 0) {
                    than.stop();
                };
            }, false);
            //上一首
            this.prevEle = document.querySelector(".prev");
            this.prevEle.addEventListener("click", function() {
                than.index = than.index - 1;
                if (than.btnPlay[than.index] && than.btnPlay[than.index].classList.contains("btn-none")) {
                    // console.log(than.index)
                    than.index = than.index - 1;
                }
                if (than.index < 0) {
                    alert("已经是第一个音频了")
                    than.index = 0;
                    return false;
                }
                var src = than.btnPlay[than.index].getAttribute("src");
                than.set(src)
            }, false);
            //下一首
            this.nextEle = document.querySelector(".next");
            this.nextEle.addEventListener("click", function() {
                than.index = than.index + 1;
                if (than.btnPlay[than.index] && than.btnPlay[than.index].classList.contains("btn-none")) {
                    // console.log(than.index)
                    than.index = than.index + 1;
                }
                if (than.index > than.btnPlay.length - 1) {
                    alert("已经是最后一个音频了")
                    than.index = than.btnPlay.length - 1;
                    return false;
                }
                var src = than.btnPlay[than.index].getAttribute("src");
                than.set(src)
            }, false);

            //声音控制
            //slider
            this.controlsSliderV = document.querySelector(".controls-volume");
            this.volumeSliderNew = document.querySelector(".volume-slider-new");
            var startXV, endXV, leftV, styleLeftV, mouserEnter;
            this.controlsSliderV.addEventListener("mousedown", function(e) {
                e.preventDefault();
                startX = e.clientX;
                left = parseInt(window.getComputedStyle(this, null).left);
                // console.log("left", left);
                mouserEnter = true;
                document.addEventListener("mousemove", moveV, false);
                document.addEventListener("mouseup", upV, false);
            }, false);

            function moveV(e) {
                if (!mouserEnter) return;
                e.preventDefault();
                endX = e.clientX;
                styleLeft = left + endX - startX;
                styleLeft = Math.ceil(styleLeft <= 0 ? 0 : styleLeft >= 50 - 12 ? 50 - 12 : styleLeft);
                than.volume = styleLeft * 100 / 50 / 100;
                than.audio.volume = than.volume;
                than.controlsSliderV.style.left = styleLeft + "px";
                than.volumeSliderNew.style.width = styleLeft + "px";
            };

            function upV() {
                mouserEnter = false;
                document.removeEventListener("mousemove", move, false);
                document.removeEventListener("mouseup", up, false);
            };
        };

        window.AudioPlay = AudioPlay;
    }(window, document));
    document.addEventListener("DOMContentLoaded", function() {
        var play = new AudioPlay(".btn-control");
    }, false)