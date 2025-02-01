document.addEventListener('DOMContentLoaded', function () {
  // ハンバーガーメニューの処理
  handleMoreButton();
});

function handleMoreButton() {
  const moreButton = document.querySelector('.js-more-button');
  const tags = document.querySelector('.search-tag');
  moreButton.addEventListener('click', () => {
    tags.classList.toggle('is-expanded');
  });
}
