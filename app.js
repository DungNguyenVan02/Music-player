
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//Danh sách nhạc
const listSong = $('.songs__content--list')
const blockSong = $('.play__music');
const close = $('.play__close');

//Load currentSong
const audio = $('#audio');
const cd = $('.player__cd');
const nameSong = $('.player__name');
const singer = $('.player__singer');

//Control
const playBtn = $('.btn-toggle-play');
const optionBtn = $$('.btn-toggle-option');
const playerControl = $('.player__control')
const btnList = $('.btn-list')
const play = $('.icon-play');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');

// nav Time
const progressArea = $('.progress-area');

//option
const sort = $('.icon-sort');
const random = $('.icon-random');
const repeat = $('.icon-repeat');

//like
const heart = $('.heart')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isHeart: false,
    arrOldIndexes: [],
    songs: [
        {
            name: "Thương em đến già",
            singer: "Lê Bảo Bình",
            src: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Vì mẹ anh bắt chia tay',
            singer: 'Miu Lê Ft KaRik',
            src: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Đào nương',
            singer: 'Hoàng Vương',
            src: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Độ tộc 2',
            singer: 'Độ Mixi x Phúc Du x Pháo',
            src: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Chạy về nơi phía anh',
            singer: 'Khắc Việt',
            src: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Đường tôi chở em về',
            singer: 'BuiTruongLinh',
            src: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Chiều hôm ấy',
            singer: 'JayKii',
            src: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Hạ còn vương nắng',
            singer: 'Đatkaa',
            src: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Váy cưới',
            singer: 'Trung Tự',
            src: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'Thấm thía remix',
            singer: 'Tống Gia Vĩ',
            src: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg'
        },
        {
            name: 'Xin má rước dâu remix',
            singer: 'Diệu Kiên',
            src: './assets/music/song11.mp3',
            image: './assets/img/song11.jpg'
        },
        {
            name: '4 in 1 Remix',
            singer: 'Hoàn Remix',
            src: './assets/music/song12.mp3',
            image: './assets/img/song12.jpg'
        },
        {
            name: 'Phượng buồn',
            singer: 'H2k x Sli petey',
            src: './assets/music/song13.mp3',
            image: './assets/img/song13.jpg'
        },
        {
            name: 'Buồn thì cứ khóc đi',
            singer: 'Lynk Lee',
            src: './assets/music/song14.mp3',
            image: './assets/img/song14.jpg'
        },
        {
            name: 'Cơn mưa ngang qua',
            singer: 'Son Tùng M-tp',
            src: './assets/music/song15.mp3',
            image: './assets/img/song15.jpg'
        },
        {
            name: 'À Thế Làm Sao Mà À',
            singer: 'DJ Long Nhật',
            src: './assets/music/song16.mp3',
            image: './assets/img/song16.jpg'
        }
    ],
    loadCurrentSong: function() {
        const currentSong = this.songs[this.currentIndex];
        cd.style.backgroundImage = `url(${currentSong.image})`
        nameSong.innerText = currentSong.name
        singer.innerText = currentSong.singer
        audio.src = currentSong.src;
    },
    renderList: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <li class="songs__content--item" data-index = "${index}">
                <div class="music">
                    <div class="music__img" style="background-image: url('${song.image}');"></div>
                    <div class="music__info">
                        <span class="music__name">${song.name}</span>
                        <span class="music__singer">${song.singer}</span>
                    </div>
                </div>
                <div class="option">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </li>
            `
        })
        listSong.innerHTML = htmls.join('');
    },
    handlEvents: function() {
        const _this = this;
        //Xử lý cd quay
        const thumbnailAnimation = cd.animate([{
            transform: 'rotate(360deg)'
         }], {
            duration: 8000,
            iterations: Infinity
         })
        thumbnailAnimation.pause();
        //Xử lí mở list song
        btnList.onclick = function(){
            blockSong.classList.add('active')
            _this.scrollToActiveSong();
        }
        //Xử lí đóng list
        close.onclick = () => blockSong.classList.remove('active');
        
        //Xử lý khi bấm play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            _this.highlightSong();
        }
        // Lắng nghe song thực sự play
        audio.onplay = function() {
            _this.isPlaying = true;
            playerControl.classList.add('playing');
            thumbnailAnimation.play();
        }
        // Lắng nghe song khi bị pause
        audio.onpause = function() {
            _this.isPlaying = false;
            playerControl.classList.remove('playing');
            thumbnailAnimation.pause();
        }

        //Xử lí tiến độ bài hát
        audio.ontimeupdate = function(e) {
            const currentTime = e.target.currentTime

            let progressBarWidth = (audio.currentTime/audio.duration)*100;
            $('.progress-bar').style.width = `${progressBarWidth}%`
        

            audio.onloadeddata = function() {
                let audioDuration = audio.duration
                let totalMin = Math.floor(audioDuration / 60)
                let totalSec = Math.floor(audioDuration % 60)
                if (totalSec < 10) {
                    totalSec = `0${totalSec}`
                }
                $('.duration').innerText = `${totalMin}:${totalSec}`
    
            }
            //Xử lí time chạy
            let currentMin = Math.floor(currentTime / 60)
            let currentSec = Math.floor(currentTime % 60)
            if (currentSec < 10) {
                currentSec = `0${currentSec}`
            }
            $('.current').innerText = `${currentMin}:${currentSec}`
        }
        //Xử lí khi tua
        progressArea.onclick = function(e) {
            let progressWidthValue = progressArea.clientWidth
            let clickOffSetX = e.offsetX
            let songDuration = audio.duration
            audio.currentTime = (clickOffSetX * songDuration / progressWidthValue)
            audio.play();
        }

        //Xử lí next bài
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            _this.highlightSong();
            audio.play();
        }
        // Xử lí khi prev bài hát
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong();
            } else {{
                _this.prevSong();
            }}
            _this.highlightSong();
            audio.play();
        }
        // Xử lí khi hết bài tự next
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }
        // Xử lí lựa chọn phát
        for(let i =0; i< optionBtn.length; i++) {
            optionBtn[0].onclick = function() {
                optionBtn[1].classList.add('active');
                _this.isRandom = true;
                optionBtn[0].style.display = 'none';
            }
            optionBtn[1].onclick = function() {
                optionBtn[2].classList.add('active');
                optionBtn[1].classList.remove('active');
                _this.isRandom = false;
                _this.isRepeat = true;
            }
            optionBtn[2].onclick = function() {
                optionBtn[2].classList.remove('active');
                optionBtn[0].style.display = 'block';
                _this.isRepeat = false;
            }
        }
        //Xử lí khi click vào list item song
        listSong.onclick = function (e) {
            const songNode = e.target.closest('.songs__content--item:not(.active');
            if (songNode || e.target.closest('.heart')) {
                if (songNode) {
                    _this.currentIndex = songNode.dataset.index;
                    _this.loadCurrentSong();
                    _this.highlightSong();
                    audio.play();
                }
        
                if (e.target.closest('.heart')) {
                    
                }
 
            }
        }
        // heart.onclick = function() {
        //     _this.isHeart = !_this.isHeart
        //     heart.classList.toggle('active', _this.isHeart)
        // }
        
    },
    scrollToActiveSong: function() {
        setTimeout( () => {
            $('.songs__content--item.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 300)
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    //highlight song when active
    highlightSong: function () {
        let songItem = $$('.songs__content--item');
        for (var i = 0; i < songItem.length; i++) {
        songItem[i].classList.remove('active');
        }
        songItem[this.currentIndex].classList.add('active');
    },
    start: function() {
        this.loadCurrentSong();
        this.renderList();
        this.handlEvents();
    }

}


app.start();
