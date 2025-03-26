import { db,checkLogin, setupLogout, loadHTML, setupSelectGroup, setupnickName,getCurrentGroup } from '../../js/utils/helpers.js';

document.addEventListener('DOMContentLoaded', async() => {
    const currentUser = checkLogin();
    await loadHTML();
    setupLogout();
    await setupSelectGroup(currentUser);
    await setupnickName(currentUser);
    dbbring();
});



async function dbbring(){
    const { data, error } = await db
    .from('ledger')
    .select('*, user( nickname )')
    .eq('group_id', getCurrentGroup())
    console.log(data);
    if (error) {
        console.error("데이터 가져오기 실패:", error);
        return;
    }

    const table = document.getElementById('itemTable');
    
    data.forEach(item => {
        let row = `
            <tr>
                <td style="display:none;">${item.user_id}</td>
                <td>${item.user.nickname}</td>
                <td>${item.transaction_type}</td>
                <td>${item.entry_date}</td>
                <td>${item.description}</td>
                <td>${item.amount}</td>
  
                <td><button class="delete-btn" data-id="${item.electronics_id}">삭제</button></td>
            </tr>
        `;
        table.innerHTML += row;
    });
}
