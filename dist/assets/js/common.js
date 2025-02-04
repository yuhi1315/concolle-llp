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
});