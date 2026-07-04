document.addEventListener("DOMContentLoaded", () => {
    // ⚠️ [필수] 본인의 EmailJS 대시보드 정보로 변경해야 이메일이 발송돼!
    const EMAILJS_PUBLIC_KEY = "W0oH-T6BDYxPznP4j";  
    const EMAILJS_SERVICE_ID = "Yservice_s2gd9pl";  
    const EMAILJS_TEMPLATE_ID = "template_qdyfh9p"; 

    // EmailJS SDK 초기화
    emailjs.init(EMAILJS_PUBLIC_KEY);

    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const askButtons = document.getElementById('askButtons');
    const formSection = document.getElementById('formSection');
    const dateSelect = document.getElementById('dateSelect');
    const title = document.getElementById('title');
    const confirmBtn = document.getElementById('confirmBtn');

    // 1. 오늘 날짜 기준으로 30일치 목록 동적 생성 (월/일 포맷)
    function initDates() {
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + i);
            
            const month = nextDate.getMonth() + 1;
            const date = nextDate.getDate();
            const optionText = `${month}월 ${date}일`;
            
            const option = document.createElement('option');
            option.value = optionText;
            option.textContent = optionText;
            dateSelect.appendChild(option);
        }
    }
    initDates();

    // 2. NO 버튼 근접 감지 도망치기 (마우스가 80px 반경 진입 시 작동)
    const proximityRadius = 80;

    window.addEventListener('mousemove', (e) => {
        if (noBtn.style.display === 'none') return;

        const container = document.getElementById('mainContainer');
        const btnRect = noBtn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;

        const distanceX = e.clientX - btnCenterX;
        const distanceY = e.clientY - btnCenterY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < proximityRadius) {
            const containerRect = container.getBoundingClientRect();
            const padding = 20;
            
            const maxX = container.clientWidth - noBtn.clientWidth - padding;
            const maxY = container.clientHeight - noBtn.clientHeight - padding;

            let randomX = Math.max(padding, Math.floor(Math.random() * maxX));
            let randomY = Math.max(60, Math.floor(Math.random() * maxY));

            const newDistX = (containerRect.left + randomX) - e.clientX;
            const newDistY = (containerRect.top + randomY) - e.clientY;
            if (Math.sqrt(newDistX * newDistX + newDistY * newDistY) < proximityRadius) {
                randomX = (randomX + 100) % maxX;
                randomY = (randomY + 100) % maxY;
            }

            noBtn.style.left = randomX + 'px';
            noBtn.style.top = randomY + 'px';
        }
    });

    noBtn.addEventListener('click', (e) => e.preventDefault());

    // 3. YES 버튼 클릭 시 입력 폼으로 전환
    yesBtn.addEventListener('click', () => {
        title.textContent = "날짜와 장소를 선택해주세요!";
        askButtons.style.display = 'none';
        noBtn.style.display = 'none'; 
        formSection.style.display = 'block';
    });

    // 4. Confirm 클릭 시 외부 사이트 이동 없이 EmailJS로 이메일 즉시 발송
    confirmBtn.addEventListener('click', () => {
        const selectedDate = dateSelect.value;
        const enteredPlace = document.getElementById('placeInput').value.trim();

        if (!enteredPlace) {
            alert('장소를 입력해주세요!');
            return;
        }

        // 버튼 비활성화 및 텍스트 변경
        confirmBtn.disabled = true;
        confirmBtn.textContent = "전송 중...";

        // EmailJS 데이터 매핑
        const templateParams = {
            date: selectedDate,
            place: enteredPlace,
            to_email: 'agussstd@outlook.kr' 
        };

        // 이 자리에서 바로 이메일 쏘기 (window.open 같은 팝업 주소 없음!)
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then((response) => {
                alert('🎉 약속 정보가 성공적으로 전송되었습니다!');
                confirmBtn.textContent = "전송 완료!";
            }, (error) => {
                console.error('EmailJS 오류:', error);
                alert('전송에 실패했습니다. API 키 설정을 확인해주세요.');
                confirmBtn.disabled = false;
                confirmBtn.textContent = "Confirm";
            });
    });
});