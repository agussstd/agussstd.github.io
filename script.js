document.addEventListener("DOMContentLoaded", () => {
    
    // -------------------------------------------------------------
    //   EmailJS 대시보드 API 키 값 완벽 세팅
    // -------------------------------------------------------------
    const EMAILJS_PUBLIC_KEY = "W0oH-T6BDYxPznP4j";   
    const EMAILJS_SERVICE_ID = "service_s2gd9pl";   
    const EMAILJS_TEMPLATE_ID = "template_qdyfh9p"; 
    // -------------------------------------------------------------

    // EmailJS 초기화 실행
    if (EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const askButtons = document.getElementById('askButtons');
    const formSection = document.getElementById('formSection');
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    const daySelect = document.getElementById('daySelect');
    const title = document.getElementById('title');
    const confirmBtn = document.getElementById('confirmBtn');

    // 첫 로딩 시 NO 버튼 위치 강제 지정
    function setInitialNoBtnPosition() {
        const rect = noBtn.getBoundingClientRect();
        noBtn.style.left = rect.left + 'px';
        noBtn.style.top = rect.top + 'px';
    }
    setTimeout(setInitialNoBtnPosition, 100);

    // 📅 [년/월/일] 드롭다운 리스트 동적 생성 함수
    function initYearMonthDay() {
        const today = new Date();
        const currentYear = today.getFullYear();
        
        for (let y = currentYear; y <= currentYear + 1; y++) {
            const opt = document.createElement('option');
            opt.value = y;
            opt.textContent = `${y}년`;
            yearSelect.appendChild(opt);
        }
        yearSelect.value = currentYear;

        for (let m = 1; m <= 12; m++) {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = `${m}월`;
            monthSelect.appendChild(opt);
        }
        monthSelect.value = today.getMonth() + 1;

        function updateDays() {
            daySelect.innerHTML = '';
            const selectedYear = parseInt(yearSelect.value);
            const selectedMonth = parseInt(monthSelect.value);
            const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();

            for (let d = 1; d <= lastDay; d++) {
                const opt = document.createElement('option');
                opt.value = d;
                opt.textContent = `${d}일`;
                daySelect.appendChild(opt);
            }
        }

        yearSelect.addEventListener('change', updateDays);
        monthSelect.addEventListener('change', updateDays);
        
        updateDays();
        daySelect.value = today.getDate();
    }
    initYearMonthDay();

    // 🌟 마우스가 이 거리 안으로 들어오면 밀려나기 시작하는 반경 (가깝게 고정)
    const proximityRadius = 75; 

    window.addEventListener('mousemove', (e) => {
        if (noBtn.style.display === 'none') return;

        const btnRect = noBtn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;

        // 마우스와 버튼 중심 사이의 X, Y 거리 계산
        const diffX = btnCenterX - e.clientX;
        const diffY = btnCenterY - e.clientY;
        const distance = Math.sqrt(diffX * diffX + diffY * diffY);

        // 마우스가 바짝 다가왔을 때 작동
        if (distance < proximityRadius) {
            const padding = 30;
            
            // 🌟 마우스가 다가오는 방향의 '정반대 각도'를 구함
            const angle = Math.atan2(diffY, diffX);
            
            // 🌟 멀리 도망치지 않고 마우스 바로 옆(약 80px 근처)에 딱 붙어있도록 좌표 설정
            // 마우스 위치를 기준으로 반대 방향 벡터만큼만 정교하게 밀어냄
            let randomX = e.clientX + Math.cos(angle) * 85;
            let randomY = e.clientY + Math.sin(angle) * 85;

            // 브라우저 화면 창 밖으로 완전히 탈출하는 것 방지 (화면 구석 페일세이프)
            const maxX = window.innerWidth - noBtn.clientWidth - padding;
            const maxY = window.innerHeight - noBtn.clientHeight - padding;

            // 만약 구석에 몰려 더 이상 도망칠 곳이 없다면 완전히 반대편으로 팅겨줌
            if (randomX < padding || randomX > maxX || randomY < padding || randomY > maxY) {
                randomX = Math.max(padding, Math.floor(Math.random() * maxX));
                randomY = Math.max(padding, Math.floor(Math.random() * maxY));
            }

            noBtn.style.left = randomX + 'px';
            noBtn.style.top = randomY + 'px';
        }
    });

    // NO 버튼 클릭 차단
    noBtn.addEventListener('click', (e) => e.preventDefault());

    // YES 버튼 클릭 시 입력 폼으로 전환
    yesBtn.addEventListener('click', () => {
        title.textContent = "날짜와 장소를 골라주세요.";
        askButtons.style.display = 'none';
        noBtn.style.display = 'none';
        formSection.style.display = 'block';
    });

    // Confirm 버튼 클릭 시 데이터 전송
    confirmBtn.addEventListener('click', () => {
        const yearVal = yearSelect.value;
        const monthVal = monthSelect.value;
        const dayVal = daySelect.value;
        const selectedDate = `${yearVal}년 ${monthVal}월 ${dayVal}일`;

        const enteredPlace = document.getElementById('placeInput').value.trim();

        if (!enteredPlace) {
            alert('장소를 입력해주세요!');
            return;
        }

        confirmBtn.disabled = true;
        confirmBtn.textContent = "전송 중...";

        const templateParams = {
            date: selectedDate,
            place: enteredPlace,
            to_email: 'agussstd@outlook.kr' 
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(() => {
                alert('정보가 성공적으로 전달되었습니다.');
                confirmBtn.textContent = "전송 완료!";
            }, (error) => {
                console.error('EmailJS 오류 상세 정보:', error);
                alert('전송 실패!');
                confirmBtn.disabled = false;
                confirmBtn.textContent = "Confirm";
            });
    });
});