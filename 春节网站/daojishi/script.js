function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 设置2025年春节日期（农历正月初一）
    const chineseNewYear = new Date('2025-01-29T00:00:00');
    
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastHexagonTime = 0;
    const hexagonContainer = document.querySelector('.hexagon-container');
    
    // 添加祝福语数组
    const messages = [
        "新的一年，愿所求皆所愿",
        "带着梦想启程，怀着希望前行",
        "让温暖环绕，让美好如期而至",
        "这一年，与你共赴春暖花开",
        "所有的期待，都将成为惊喜",
        "愿你的生活如这光影般绚丽",
        "让时光带你去往最好的远方",
        "新的篇章，新的精彩即将开始",
        "把温暖的期许，写进春天的信笺",
        "在这里，为你的梦想倒数"
    ];

    const messageElement = document.querySelector('.message');
    let currentMessageIndex = 0;
    let isTyping = false;

    // 打字效果函数
    async function typeText(text) {
        messageElement.classList.add('typing');
        let displayText = '';
        
        // 恢复为200ms/字的打字速度
        for (let i = 0; i < text.length; i++) {
            if (!isTyping) break;
            displayText += text[i];
            messageElement.textContent = displayText;
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        messageElement.classList.remove('typing');
    }

    // 删除效果函数
    async function deleteText() {
        messageElement.classList.add('typing');
        let text = messageElement.textContent;
        
        // 恢复为100ms/字的删除速度
        while (text.length > 0) {
            if (!isTyping) break;
            text = text.slice(0, -1);
            messageElement.textContent = text;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        messageElement.classList.remove('typing');
    }

    // 更新祝福语的函数
    async function updateMessage() {
        isTyping = true;
        
        // 删除当前文本
        await deleteText();
        
        // 准备下一条消息
        currentMessageIndex = (currentMessageIndex + 1) % messages.length;
        
        // 输入新文本
        await typeText(messages[currentMessageIndex]);
        
        isTyping = false;
    }

    // 初始化第一条改这部分）
    async function initialize() {
        isTyping = true;
        await typeText(messages[0]);
        isTyping = false;
    }

    // 调用初始化函数
    initialize();

    // 设置定时器前先等待初始化完成
    setTimeout(() => {
        setInterval(() => {
            if (!isTyping) {
                updateMessage();
            }
        }, 8000);
    }, 1000); // 给予足够时间完成初始化

    // 更新鼠标移动效果
    document.addEventListener('mousemove', throttle((e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        requestAnimationFrame(() => {
            document.documentElement.style.setProperty('--mouse-x', `${x}%`);
            document.documentElement.style.setProperty('--mouse-y', `${y}%`);
        });
    }, 16)); // 约60fps的频率
    
    function createHexagon(x, y) {
        const hexagon = document.createElement('div');
        hexagon.className = 'hexagon';
        hexagon.style.left = `${x - 60}px`;  // 调整为新的大小
        hexagon.style.top = `${y - 69.28}px`;  // 调整为新的大小
        
        // 创建2-4个方向边形
        const directions = ['Left', 'Right', 'Up', 'Down'];
        const numDirections = Math.floor(Math.random() * 3) + 2; // 随机2-4个方向
        const selectedDirections = shuffleArray(directions).slice(0, numDirections);
        
        selectedDirections.forEach((direction, index) => {
            const clone = hexagon.cloneNode(true);
            clone.style.border = '1px solid rgba(74, 158, 255, 0.15)';
            
            // 为每个方向设置不同的延迟
            const delay = index * 100; // 100ms的延迟差
            clone.style.animation = `hexagonDraw${direction} 1s ease-out ${delay}ms forwards`;
            
            hexagonContainer.appendChild(clone);
            
            // 动画结束后移除元素
            setTimeout(() => {
                clone.remove();
            }, 1000 + delay);
        });
    }

    // Fisher-Yates 洗牌算法
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 替换原来的矩阵效果相关代码为滑动效果代码
    function updateDigit(element, newValue) {
        const wrapper = element;
        const oldSlide = wrapper.querySelector('.digit-slide');
        const newSlide = document.createElement('div');
        newSlide.className = 'digit-slide slide-enter';
        newSlide.textContent = newValue;

        // 添加新数字
        wrapper.appendChild(newSlide);

        // 触发动画
        requestAnimationFrame(() => {
            newSlide.classList.remove('slide-enter');
            newSlide.classList.add('slide-enter-active');
            oldSlide.classList.add('slide-exit-active');
        });

        // 动画结束后清理
        setTimeout(() => {
            oldSlide.remove();
        }, 625); // 从500ms改为625ms，匹配新的动画时长
    }

    // 修改更新倒计时的函数
    function updateCountdown() {
        const now = new Date();
        const diff = chineseNewYear - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };

        Object.entries({days, hours, minutes, seconds}).forEach(([key, value]) => {
            const element = elements[key];
            const currentValue = element.querySelector('.digit-slide').textContent;
            const newValue = String(value).padStart(2, '0');
            
            if (currentValue !== newValue) {
                updateDigit(element, newValue);
            }
        });
    }

    // 每秒更新倒计时
    setInterval(updateCountdown, 1000);
    updateCountdown(); // 初始化显示

    function createMatrixEffect() {
        const matrixText = document.querySelector('.matrix-text');
        const characters = '0123456789';
        const numDrops = 15; // 每次创建的数字数量

        function createDrop() {
            const digit = document.createElement('span');
            digit.className = 'matrix-digit';
            digit.textContent = characters[Math.floor(Math.random() * characters.length)];
            
            // 随机位置
            const left = Math.random() * 100;
            digit.style.left = `${left}%`;
            
            matrixText.appendChild(digit);

            // 动画结束后移除
            setTimeout(() => {
                digit.remove();
            }, 1000);
        }

        // 每100ms创建新的数字
        setInterval(() => {
            for (let i = 0; i < 3; i++) { // 每次创建3个数字
                createDrop();
            }
        }, 100);
    }

    // 在初始化时调用
    createMatrixEffect();

    // 添加双击事件监听
    document.addEventListener('dblclick', (e) => {
        createFirework(e.clientX, e.clientY);
    });

    function createFirework(x, y) {
        const colors = [
            'rgba(100, 255, 218, 0.8)', // primary-color
            'rgba(74, 158, 255, 0.8)',  // secondary-color
            'rgba(187, 255, 238, 0.8)', // 浅色变体
            'rgba(156, 200, 255, 0.8)'  // 浅色变体
        ];

        // 创建多层烟花效果
        for (let ring = 0; ring < 3; ring++) {
            const particleCount = 12 + (ring * 8); // 每层递增粒子数
            const radius = 50 + (ring * 30); // 每层递增半径

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'firework-particle';
                
                // 计算粒子轨迹
                const angle = (i * (360 / particleCount)) * (Math.PI / 180);
                const velocity = 0.8 + Math.random() * 0.4;
                const tx = Math.cos(angle) * radius * velocity;
                const ty = Math.sin(angle) * radius * velocity;

                // 设置粒子样式
                particle.style.cssText = `
                    left: ${x}px;
                    top: ${y}px;
                    width: ${6 - ring}px;
                    height: ${6 - ring}px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    box-shadow: 0 0 ${10 + ring * 5}px ${colors[0]};
                    --tx: ${tx}px;
                    --ty: ${ty}px;
                    animation: firework ${0.8 + Math.random() * 0.4}s ease-out forwards;
                `;

                document.body.appendChild(particle);

                // 动画结束后移除粒子
                particle.addEventListener('animationend', () => {
                    particle.remove();
                });
            }
        }

        // 添加中心爆炸光效
        const burst = document.createElement('div');
        burst.className = 'firework-particle';
        burst.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: white;
            box-shadow: 0 0 40px 20px rgba(100, 255, 218, 0.8);
            animation: firework 0.4s ease-out forwards;
            transform-origin: center;
        `;
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 400);
    }

    const fu = document.querySelector('.fu');
    let canClick = true;

    fu.addEventListener('click', () => {
        if (!canClick) return;
        canClick = false;
        createFuExplosion();
        
        // 3秒后才能再次点击
        setTimeout(() => {
            canClick = true;
        }, 3000);
    });

    function createFuExplosion() {
        const fuRect = fu.getBoundingClientRect();
        const centerX = fuRect.left + fuRect.width / 2;
        const centerY = fuRect.top + fuRect.height / 2;
        
        // 创建12个福字
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'fu-particle';
            particle.textContent = '福';
            
            // 随机方向和距
            const angle = (i * 30 + Math.random() * 20) * (Math.PI / 180);
            const distance = 100 + Math.random() * 100;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const rotation = Math.random() * 360;
            
            particle.style.cssText = `
                left: ${centerX}px;
                top: ${centerY}px;
                --tx: ${tx}px;
                --ty: ${ty}px;
                --rot: ${rotation}deg;
            `;
            
            document.body.appendChild(particle);
            
            // 动画结束后移除
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
        
        // 播放福到了的音效（可选）
        const audio = new Audio('data:audio/mp3;base64,...'); // 可以添加音效
        audio.play().catch(() => {}); // 忽略可能的自动播放限制错误
    }

    let keySequence = '';
    const targetSequence = 'xnkl';

    // 添加键盘事件监听
    document.addEventListener('keydown', (e) => {
        keySequence += e.key.toLowerCase();
        if (keySequence.length > targetSequence.length) {
            keySequence = keySequence.slice(-targetSequence.length);
        }
        if (keySequence === targetSequence) {
            showBlessingDialog();
        }
    });

    // 修改祝福语模板
    const relationTypes = {
        family: {
            label: "家人",
            options: ["父母", "兄弟姐妹", "长辈", "晚辈"]
        },
        friend: {
            label: "朋友",
            options: ["挚友", "闺蜜", "同学", "网友"]
        },
        business: {
            label: "商务",
            options: ["客户", "合作伙伴", "投资人", "上下游"]
        },
        work: {
            label: "职场",
            options: ["领导", "同事", "下属", "前同事"]
        },
        teacher: {
            label: "师长",
            options: ["恩师", "导师", "教授", "老师"]
        }
    };

    // 添加风格配置
    const styleConfigs = {
        warm: {
            systemPrompt: `你是一位温暖贴心的长辈，特别擅长写暖心的新年祝福。
要求：
1. 语气要温暖亲切，像家人间的对话
2. 多用温馨、暖心的词语
3. 表达要自然，像日常交谈
4. 要体现出关心和牵挂
5. 可以适当提到具体的生活细节`,
            temperature: 0.7
        },
        professional: {
            systemPrompt: `你是一位专业的商务人士，擅长写得体的新年祝福。
要求：
1. 语言要专业、简洁、有力
2. 措辞要体大方
3. 要体现出专业领域特点
4. 可以适当融入行业元素
5. 保持礼貌性和适当的距离感`,
            temperature: 0.6
        },
        funny: {
            systemPrompt: `你是一位幽默风趣的好友，擅长写让人开心的新年祝福。
要求：
1. 语气要轻松活泼
2. 可以适当开玩笑，但不失礼貌
3. 融入一些俏皮的比喻或双关语
4. 让人读完会心一笑
5. 避免过于严肃的表达`,
            temperature: 0.9
        },
        literary: {
            systemPrompt: `你是一位文艺优雅的作家，擅长写优美的新年祝福。
要求：
1. 语言要优美典雅
2. 可以使用优美的比喻和意象
3. 融入文学气息
4. 意境要唯美
5. 避免过于直白的表达`,
            temperature: 0.8
        },
        traditional: {
            systemPrompt: `你是一位深谙传统文化的长者，擅长写富有传统韵味的新年祝福。
要求：
1. 融入传统文化元素
2. 可以使用典故或谚语
3. 体现龙年特色
4. 保持文言与白话的优雅结合
5. 突出传统节日的仪式感`,
            temperature: 0.7
        }
    };

    // 添加 AI 调用函数
    async function generateAIBlessing(relation, subRelation, name, style, wordCount) {
        try {
            const styleConfig = styleConfigs[style];
            const basePrompt = styleConfig.systemPrompt;

            const prompt = `你现在要写一段新年祝福给${name}（你的${subRelation}）。
注意事项：
1. 不要出现"尊敬的"、"此致敬礼"等客套话
2. 直接用称呼开头，像写给亲近的人一样自然
3. 字数要严格控制在${wordCount}字以内
4. 要符合写给${subRelation}的身份和语气
5. 要像日常交谈一样自然流畅
6. 避免过于生硬的祝福套话
7. 字数限制很重要，请务必遵守

${basePrompt}`;

            const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer sk-apapjllgqaosvrudsodksyzhtxchkscuoswpofrxwrrrugcz',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "Qwen/Qwen2.5-7B-Instruct",
                    messages: [
                        {
                            role: "system",
                            content: prompt
                        },
                        {
                            role: "user",
                            content: `请写一段${wordCount}字以内的新年祝福，要像平常说话一样自然。`
                        }
                    ],
                    temperature: styleConfig.temperature,
                    stream: true
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            let result = '';
            const resultElement = document.querySelector('.blessing-result');
            resultElement.style.display = 'block';
            
            while (true) {
                const {done, value} = await reader.read();
                if (done) break;
                
                const text = new TextDecoder().decode(value);
                console.log('收到数据:', text);
                
                const lines = text.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.choices[0].delta.content) {
                                result += data.choices[0].delta.content;
                                resultElement.textContent = result;
                            }
                        } catch (e) {
                            console.error('解析数据失败:', e, line);
                        }
                    }
                }
            }

            return result;

        } catch (error) {
            console.error('AI 生成失败:', error);
            document.querySelector('.blessing-result').textContent = 
                '抱歉，生成祝福语时出现了问题，请检查网络连接后重试。错误信息：' + error.message;
            return null;
        }
    }

    // 修改对话框显示逻辑
    function showBlessingDialog() {
        const dialog = document.querySelector('.blessing-dialog');
        dialog.style.display = 'flex';
        setTimeout(() => dialog.classList.add('active'), 10);

        // 更新关系选择器
        updateRelationSelectors();
        
        const generateBtn = dialog.querySelector('.generate-btn');
        const shareBtn = dialog.querySelector('.share-btn');
        const closeBtn = dialog.querySelector('.close-btn');
        const result = dialog.querySelector('.blessing-result');
        
        generateBtn.onclick = async () => {
            const relation = document.getElementById('relation').value;
            const subRelation = document.getElementById('subRelation').value;
            const name = document.getElementById('name').value || '您';
            const style = document.getElementById('style').value;
            const wordCount = document.getElementById('wordCount').value; // 获取字数限制
            
            result.style.display = 'block';
            result.textContent = '正在生成祝福语...';
            
            const blessing = await generateAIBlessing(
                relationTypes[relation].label,
                subRelation,
                name,
                style,
                wordCount
            );
            
            result.textContent = blessing;
        };
        
        shareBtn.onclick = () => {
            if (result.textContent) {
                navigator.clipboard.writeText(result.textContent)
                    .then(() => {
                        showToast('✨ 祝福语已复制到剪贴板');
                    })
                    .catch(() => {
                        showToast('❌ 复制失败，请手动复制');
                    });
            }
        };
        
        closeBtn.onclick = () => {
            dialog.classList.remove('active');
            setTimeout(() => dialog.style.display = 'none', 300);
        };
    }

    // 添加关系选择器更新函数
    function updateRelationSelectors() {
        const relationSelect = document.getElementById('relation');
        const subRelationContainer = document.querySelector('.sub-relation-group');
        
        // 清空现有选项
        relationSelect.innerHTML = '';
        
        // 添加主关系选
        Object.entries(relationTypes).forEach(([value, {label}]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            relationSelect.appendChild(option);
        });
        
        // 更新子关系选项
        function updateSubRelation() {
            const selectedRelation = relationSelect.value;
            const options = relationTypes[selectedRelation].options;
            
            const subRelationSelect = document.getElementById('subRelation');
            subRelationSelect.innerHTML = '';
            
            options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                subRelationSelect.appendChild(opt);
            });
        }
        
        relationSelect.addEventListener('change', updateSubRelation);
        updateSubRelation(); // 初始化子关系选项
    }

    function typeWriter(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    const blessingTrigger = document.querySelector('.blessing-trigger');
    blessingTrigger.addEventListener('click', showBlessingDialog);

    // 添加 showToast 函数
    function showToast(message, duration = 2000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
}); 