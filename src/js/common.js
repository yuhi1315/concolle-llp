document.addEventListener('DOMContentLoaded', () => {
  const radioItems = document.querySelectorAll('.concolle-form__radio-item');

  radioItems.forEach((item) => {
    const input = item.querySelector('.concolle-form__radio-input');

    input.addEventListener('change', () => {
      // 全ての項目から "checked" クラスを削除
      radioItems.forEach((item) => item.classList.remove('checked'));

      // チェックされた項目に "checked" クラスを追加
      if (input.checked) {
        item.classList.add('checked');
      }
    });
  });
});
