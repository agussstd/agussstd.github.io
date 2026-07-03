document.addEventListener("DOMContentLoaded", () => {
    // ⚠️ 본인의 EmailJS 정보로 반드시 변경해야 작동해!
    const EMAILJS_PUBLIC_KEY = "W0oH-T6BDYxPznP4j";  // 본인의 Public Key 입력
    const EMAILJS_SERVICE_ID = "service_s2gd9pl";  // 본인의 Service ID 입력
    const EMAILJS_TEMPLATE_ID = "template_qdyfh9p"; // 본인의 Template ID 입력
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

            // 새로 바뀔 위치가 마우스와 너무 가까우면 좌표 재보정
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

    // 클릭이나 터치 시도 시 강제 차단
    noBtn.addEventListener('click', (e) => e.preventDefault());

    // 3. YES 버튼 클릭 시 입력 폼으로 전환
    yesBtn.addEventListener('click', () => {
        title.textContent = "날짜와 장소를 골라줘! 🚀";
        askButtons.style.display = 'none';
        noBtn.style.display = 'none'; // 도망치던 버튼 숨김
        formSection.style.display = 'block';
    });

    // 4. Confirm 클릭 시 알림창 없이 EmailJS로 이메일 즉시 발송
    confirmBtn.addEventListener('click', () => {
        const selectedDate = dateSelect.value;
        const enteredPlace = document.getElementById('placeInput').value.trim();

        if (!enteredPlace) {
            alert('장소를 입력해주세요!');
            return;
        }

        // 중복 클릭 방지를 위해 버튼 비활성화 및 텍스트 변경
        confirmBtn.disabled = true;
        confirmBtn.textContent = "전송 중...";

        // EmailJS로 넘겨줄 데이터 매핑
        const templateParams = {
            date: selectedDate,
            place: enteredPlace,
            to_email: 'agussstd@outlook.kr' 
        };

        // EmailJS API 호출 (외부 창 이동이나 중간 안내 팝업 없이 즉시 실행)
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then((response) => {
                alert('🎉 약속 정보가 성공적으로 전송되었습니다!');
                confirmBtn.textContent = "전송 완료!";
            }, (error) => {
                console.error('EmailJS 오류:', error);
                alert('전송에 실패했습니다. 설정 및 API 키를 확인해주세요.');
                confirmBtn.disabled = false;
                confirmBtn.textContent = "Confirm";
            });
    });
});