import { loadHTML, setupSelectGroup, setupnickName, checkSession } from '../../js/utils/helpers.js';
import { Calendar } from 'https://cdn.skypack.dev/@fullcalendar/core';
import dayGridPlugin from 'https://cdn.skypack.dev/@fullcalendar/daygrid';
// interaction 플러그인을 추가해야 dateClick 이벤트를 사용할 수 있습니다.
import interactionPlugin from 'https://cdn.skypack.dev/@fullcalendar/interaction';

// 캘린더 인스턴스를 전역 변수로 선언
let calendar;

document.addEventListener('DOMContentLoaded', async () => {
  const sessionData = await checkSession();
  // 예: { status: "ok", userId: "xxx" } or { status: "unauthorized" }

  if (sessionData.status !== "ok") {
    alert("로그인이 필요합니다.");
    window.location.href = '../user/login.html';
    return;
  }
  const currentUser = sessionData.userId; // "xxx"
  await loadHTML();
//  setupLogout();
  await setupSelectGroup(currentUser);
  await setupnickName(currentUser);
  loadLedger(currentUser);
  setupLedgerForm(currentUser);
  initializeCalendar(currentUser);
  // 등록 폼의 날짜 필드에 오늘 날짜(한국시간) 기본값 설정
  document.getElementById('transactionDate').value = getTodayInKST();
});

// 오늘 날짜(한국시간, YYYY-MM-DD 포맷) 반환 함수
function getTodayInKST() {
  const now = new Date();
  const options = { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' };
  const parts = new Intl.DateTimeFormat('ko-KR', options).formatToParts(now);
  let year, month, day;
  parts.forEach(part => {
    if (part.type === 'year') year = part.value;
    if (part.type === 'month') month = part.value;
    if (part.type === 'day') day = part.value;
  });
  return `${year}-${month}-${day}`;
}

function setupLedgerForm(currentUser) {
  const ledgerForm = document.getElementById('ledgerForm');
  if (ledgerForm) {
    ledgerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const amount = parseInt(document.getElementById('amount').value);
      const type = document.getElementById('type').value;
      const date = document.getElementById('transactionDate').value;
      const groupSelect = document.getElementById('groupSelect');
      const category = document.getElementById('category').value;
      const description = document.getElementById('description').value;

      console.log('등록 정보:', groupSelect.value, currentUser, amount, type, date, description);

      const { data, error } = await db
          .from('ledger')
          .insert([{
            group_id: groupSelect.value,
            user_id: currentUser,
            transaction_type: type,
            transaction_date: date,
            category: category,
            amount: amount,
            description: description
          }]);

      if (error) {
        alert('가계부 등록 중 오류: ' + error.message);
        return;
      }

      alert("내역이 등록되었습니다.");
      window.location.reload();
    });

    // ledger 폼의 날짜 필드 변경 시 캘린더 이동
    document.getElementById('transactionDate').addEventListener('change', (e) => {
      const selectedDate = e.target.value;
      if (calendar) {
        calendar.gotoDate(selectedDate);
      }
    });
  }
}

function initializeCalendar(currentUser) {
  const calendarEl = document.getElementById('calendar');
  if (calendarEl) {
    calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, interactionPlugin],  // interaction 플러그인 추가!
      initialView: 'dayGridMonth',
      locale: 'ko',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      selectable: true,
      // 캘린더에서 날짜 클릭 시 ledger 폼의 날짜 필드 업데이트
      dateClick: function(info) {
        console.log("Date clicked:", info.dateStr);
        const dateInput = document.getElementById('transactionDate');
        if (dateInput) {
          dateInput.value = info.dateStr;
          // 수동 change 이벤트 발생으로 양방향 연동 보장
          dateInput.dispatchEvent(new Event('change'));
        }
      },
      events: async (fetchInfo, successCallback, failureCallback) => {
        try {
          const groupSelect = document.getElementById('groupSelect');
          const { data: entries, error } = await db
              .from('ledger')
              .select('*')
              .eq('group_id', groupSelect.value);

          if (error) {
            console.error('이벤트 불러오기 오류:', error);
            failureCallback(error);
            return;
          }


          // 날짜별로 항목을 그룹화 (날짜만 추출)
          const groupedEntries = {};
          entries.forEach(entry => {
            const date = entry.transaction_date.split('T')[0];
            if (!groupedEntries[date]) {
              groupedEntries[date] = { income: 0, expense: 0 };
            }
            if (entry.transaction_type === 'income') {
              groupedEntries[date].income += entry.amount;
            } else if (entry.transaction_type === 'expense') {
              groupedEntries[date].expense += entry.amount;
            }
          });

          // 각 날짜에 대해 수입, 지출을 별도의 이벤트로 생성
          const events = [];
          Object.keys(groupedEntries).forEach(date => {
            const { income, expense } = groupedEntries[date];
            if (income > 0) {
              events.push({
                title: `수입: ${income}원`,
                start: date,
                allDay: true,
                color: 'green' // 수입 이벤트에 적용할 색상 (선택사항)
              });
            }
            if (expense > 0) {
              events.push({
                title: `지출: ${expense}원`,
                start: date,
                allDay: true,
                color: 'red' // 지출 이벤트에 적용할 색상 (선택사항)
              });
            }
          });

          successCallback(events);
        } catch (err) {
          console.error('예기치 못한 오류:', err);
          failureCallback(err);
        }
      }
    });
    calendar.render();
  }
}

async function loadLedger(userId) {
  try {
    const groupSelect = document.getElementById('groupSelect');
    const { data: entries, error } = await db
        .from('ledger')
        .select('*')
        .eq('user_id', userId)
        .eq('group_id', groupSelect.value)
        .order('transaction_type', { ascending: false });

    if (error) {
      console.error('가계부 내역 조회 오류:', error);
      alert('가계부 내역이 조회되지 않습니다.');
      return [];
    }
    console.log('가계부 내역:', entries);
    return entries;
  } catch (err) {
    console.error('예기치 못한 오류:', err);
  }
}
