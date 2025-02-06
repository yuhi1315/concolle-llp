"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var radioItems = document.querySelectorAll('.concolle-form__radio-item');
  radioItems.forEach(function (item) {
    var input = item.querySelector('.concolle-form__radio-input');
    input.addEventListener('change', function () {
      // 全ての項目から "checked" クラスを削除
      radioItems.forEach(function (item) {
        return item.classList.remove('checked');
      });

      // チェックされた項目に "checked" クラスを追加
      if (input.checked) {
        item.classList.add('checked');
      }
    });
  });
  var btnInquiry = document.querySelector('.js-btn--inquiry');
  var btnPublish = document.querySelector('.js-btn--publish');
  var btnHeader = document.querySelector('.js-btn--header');
  if (btnInquiry && btnPublish && btnHeader && radioItems.length >= 2) {
    btnInquiry.addEventListener('click', function () {
      radioItems.forEach(function (item) {
        return item.classList.remove('checked');
      });
      radioItems[1].classList.add('checked'); // 2つ目に `checked` を付与
      radioItems[1].querySelector("input[type='radio']").checked = true; // 2つ目のラジオボタンを選択
    });

    btnPublish.addEventListener('click', function () {
      radioItems.forEach(function (item) {
        return item.classList.remove('checked');
      });
      radioItems[0].classList.add('checked'); // 1つ目に `checked` を付与
      radioItems[0].querySelector("input[type='radio']").checked = true; // 1つ目のラジオボタンを選択
    });

    btnHeader.addEventListener('click', function () {
      radioItems.forEach(function (item) {
        return item.classList.remove('checked');
      });
      radioItems[0].classList.add('checked'); // 1つ目に `checked` を付与
      radioItems[0].querySelector("input[type='radio']").checked = true; // 1つ目のラジオボタンを選択
    });
  }
});