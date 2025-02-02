"use strict";

document.addEventListener('DOMContentLoaded', function () {
  // ハンバーガーメニューの処理
  handleMoreButton();
});
function handleMoreButton() {
  var moreButton = document.querySelector('.js-more-button');
  var tags = document.querySelector('.search-tag');
  moreButton.addEventListener('click', function () {
    tags.classList.toggle('is-expanded');
  });
}