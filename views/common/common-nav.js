$(document).ready(function(){
    // 현재 페이지의 파일명을 추출
    var path = window.location.pathname;
    var page = path.substring(path.lastIndexOf('/') + 1);
  
    // 모든 nav 링크에서 active 클래스를 제거
    $('#navbar a').removeClass('nav-active');
  
    // 파일명에 따라 해당 링크에 active 클래스를 추가
    if(page === "group_create.html") {
      $('#navbar a[href*="group_create.html"]').addClass('nav-active');
    } else if(page === "group_leader.html") {
      $('#navbar a[href*="group_leader.html"]').addClass('nav-active');
    } else if(page === "group_member.html") {
      $('#navbar a[href*="group_member.html"]').addClass('nav-active');
    } else if(page === "group_withdraw.html") {
      $('#navbar a[href*="group_withdraw.html"]').addClass('nav-active');
    } else if(page === "setting.html") {
      $('#navbar a[href*="setting.html"]').addClass('nav-active');
    } else if(page === "setting_main.html") {
      $('#navbar a[href*="setting_main.html"]').addClass('nav-active');
    } else if(page === "setting_withdraw.html") {
      $('#navbar a[href*="setting_withdraw.html"]').addClass('nav-active');
    }
  });
  