// 彩色数组
const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#FF85A2', '#7FCDCD'
];

// 获取随机颜色
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// 获取随机位置（垂直方向）
function getRandomTop() {
    return Math.random() * 80 + 10; // 10% - 90%
}

// 创建弹幕
function createDanmaku(isUser = false) {
    const container = document.getElementById('danmakuContainer');
    const danmaku = document.createElement('div');
    danmaku.className = 'danmaku-item';
    danmaku.textContent = 'Ciallo～(∠・ω< )⌒★';
    danmaku.style.color = getRandomColor();
    danmaku.style.top = getRandomTop() + '%';
    
    // 响应式字体大小
    const isMobile = window.innerWidth <= 768;
    const fontSize = isMobile ? Math.random() * 8 + 14 : Math.random() * 18 + 18;
    danmaku.style.fontSize = fontSize + 'px';
    
    // 随机动画时长（15-25秒）
    const duration = Math.random() * 10 + 15;
    danmaku.style.animationDuration = duration + 's';
    
    // 如果是用户发送的弹幕，添加边框
    if (isUser) {
        danmaku.classList.add('user-danmaku');
    }
    
    container.appendChild(danmaku);
    
    // 动画结束后移除元素
    setTimeout(() => {
        danmaku.remove();
        // 只有非用户弹幕才自动循环创建
        if (!isUser) {
            createDanmaku();
        }
    }, duration * 1000);
}

// 初始化多个弹幕
function initDanmaku() {
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            createDanmaku();
        }, i * 1500);
    }
}

// 初始化中间文本波浪效果
function initCenterText() {
    const text = 'Ciallo～(∠・ω< )⌒★';
    const centerText = document.getElementById('centerText');
    
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.animationDelay = (i * 0.0625) + 's';
        centerText.appendChild(span);
    }
}

// 点击播放音频并发送弹幕
let lastClickTime = 0;
const clickThrottle = 150; // 节流时间150ms
let lastDanmakuTime = 0;
const danmakuThrottle = 500; // 弹幕节流500ms，避免太频繁
let audioPool = [];
const maxAudioPool = 5; // 最多同时播放5个音频

// 初始化音频池
function initAudioPool() {
    for (let i = 0; i < maxAudioPool; i++) {
        const audio = new Audio('assets/audio/ciallo.aac');
        audio.preload = 'auto';
        audioPool.push({ audio, playing: false });
    }
}

// 获取可用的音频实例
function getAvailableAudio() {
    let available = audioPool.find(item => !item.playing);
    if (!available) {
        available = audioPool[0]; // 如果都在播放，使用第一个
    }
    return available;
}

document.body.addEventListener('click', () => {
    const now = Date.now();
    
    // 音频节流控制
    if (now - lastClickTime >= clickThrottle) {
        lastClickTime = now;
        
        // 增加点击计数
        clickCount++;
        
        // 检查是否触发特殊音频
        checkSpecialAudio();
        
        // 使用音频池播放
        const audioItem = getAvailableAudio();
        audioItem.playing = true;
        audioItem.audio.currentTime = 0;
        audioItem.audio.play().catch(err => {
            console.log('音频播放失败:', err);
        }).finally(() => {
            setTimeout(() => {
                audioItem.playing = false;
            }, 1000);
        });
    }
    
    // 弹幕节流控制，避免页面太乱
    if (now - lastDanmakuTime >= danmakuThrottle) {
        lastDanmakuTime = now;
        createDanmaku(true);
    }
});

// 背景图片切换
let currentBgIndex = 0;
const bgImages = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'];

function switchBackground() {
    currentBgIndex = (currentBgIndex + 1) % bgImages.length;
    document.body.style.backgroundImage = `url('assets/images/${bgImages[currentBgIndex]}')`;
}

// 每30秒切换一次背景
setInterval(switchBackground, 30000);

// 点击计数和时间追踪
let clickCount = 0;
let pageStartTime = Date.now();
let specialAudioPlayed = false;

// 检查是否应该播放CG音频
function checkSpecialAudio() {
    if (specialAudioPlayed) return false;
    
    const timeElapsed = (Date.now() - pageStartTime) / 1000 / 60; // 转换为分钟
    
    if (clickCount >= 10 || timeElapsed >= 10) {
        specialAudioPlayed = true;
        const specialAudio = document.getElementById('specialAudio');
        specialAudio.play().catch(err => {
            console.log('特殊音频播放失败:', err);
        });
        return true;
    }
    return false;
}

// 定时检查时间条件（每秒检查一次）
setInterval(() => {
    checkSpecialAudio();
}, 1000);

// 页面加载完成后初始化
window.addEventListener('load', () => {
    initAudioPool();
    initCenterText();
    initDanmaku();
});
