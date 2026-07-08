document.addEventListener("DOMContentLoaded", () => {
    
    // -------------------------------------------------------------
    //   EmailJS 대시보드 API 키 세팅
    // -------------------------------------------------------------
    const EMAILJS_PUBLIC_KEY = "W0oH-T6BDYxPznP4j";   
    const EMAILJS_SERVICE_ID = "service_s2gd9pl";   
    const EMAILJS_TEMPLATE_ID = "template_qdyfh9p"; 
    // -------------------------------------------------------------

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

    // 📅 [년/월/일] 드롭다운 리스트 세팅
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

    // 🌟 핵심: 버튼 중심과 마우스 포인터가 유지할 '절대 안전 반경' (단위: 픽셀)
    // 버튼 너비의 절반 + 약간의 여유 공간. 이 간격 안으로는 마우스가 절대 들어올 수 없음.
    const safeRadius = 60; 

    window.addEventListener('mousemove', (e) => {
        if (noBtn.style.display === 'none') return;

        const btnRect = noBtn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;

        const diffX = btnCenterX - e.clientX;
        const diffY = btnCenterY - e.clientY;
        const distance = Math.sqrt(diffX * diffX + diffY * diffY);

        // 마우스가 안전 반경(60px) 안으로 파고들려고 하면 작동
        if (distance < safeRadius) {
            const angle = Math.atan2(diffY, diffX);
            
            // 🌟 마우스가 밀고 들어온 만큼만 정확히 밀어냄 (무조건 마우스 중심으로부터 60px 거리를 유지)
            // 화면 멀리 날아가는 게 아니라, 마우스가 1px 움직이면 버튼도 1px만 움직임
            let targetCenterX = e.clientX + Math.cos(angle) * safeRadius;
            let targetCenterY = e.clientY + Math.sin(angle) * safeRadius;

            // 중심 좌표를 버튼의 좌측 상단(left, top) 좌표로 변환
            let targetLeft = targetCenterX - (btnRect.width / 2);
            let targetTop = targetCenterY - (btnRect.height / 2);

            // 브라우저 경계선 밖으로 나가지 못하게 막기 위한 안전 여백
            const padding = 15;
            const maxX = window.innerWidth - btnRect.width - padding;
            const maxY = window.innerHeight - btnRect.height - padding;

            // 🌟 벽에 닿았을 때의 처리: 텔레포트하지 않고 벽을 타고 미끄러지도록 설계
            if (targetLeft < padding || targetLeft > maxX) {
                targetLeft = Math.max(padding, Math.min(targetLeft, maxX));
                // 좌우 벽에 막히면 위아래로 살짝(30px) 빗겨나가게 해서 틈을 줌
                targetTop += (e.clientY > targetCenterY) ? -30 : 30;
            }
            if (targetTop < padding || targetTop > maxY) {
                targetTop = Math.max(padding, Math.min(targetTop, maxY));
                // 상하 벽에 막히면 좌우로 살짝(30px) 빗겨나가게 해서 틈을 줌
                targetLeft += (e.clientX > targetCenterX) ? -30 : 30;
            }

            // 계산된 최종 위치를 즉시(0초 딜레이) 반영
            noBtn.style.left = targetLeft + 'px';
            noBtn.style.top = targetTop + 'px';
        }
    });

    // 클릭 차단
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
                alert('정보가 성공적으로 전송되었습니다.');
                confirmBtn.textContent = "전송 완료!";
            }, (error) => {
                console.error('EmailJS 오류 상세 정보:', error);
                alert('전송 실패!');
                confirmBtn.disabled = false;
                confirmBtn.textContent = "Confirm";
            });
    });
});