const { src, dest, watch, series, parallel } = require('gulp'); // Gulpの基本関数をインポート
const sass = require('gulp-sass')(require('sass')); // SCSSをCSSにコンパイルするためのモジュール
const plumber = require('gulp-plumber'); // エラーが発生してもタスクを続行するためのモジュール
const notify = require('gulp-notify'); // エラーやタスク完了の通知を表示するためのモジュール
const sassGlob = require('gulp-sass-glob-use-forward'); // SCSSのインポートを簡略化するためのモジュール
const mmq = require('gulp-merge-media-queries'); // メディアクエリをマージするためのモジュール
const postcss = require('gulp-postcss'); // CSSの変換処理を行うためのモジュール
const autoprefixer = require('autoprefixer'); // ベンダープレフィックスを自動的に追加するためのモジュール
const cssdeclsort = require('css-declaration-sorter'); // CSSの宣言をソートするためのモジュール
const postcssPresetEnv = require('postcss-preset-env'); // 最新のCSS構文を使用可能にするためのモジュール
const sourcemaps = require('gulp-sourcemaps'); // ソースマップを作成するためのモジュール
const babel = require('gulp-babel'); // ES6+のJavaScriptをES5に変換するためのモジュール
const imageminSvgo = require('imagemin-svgo'); // SVGを最適化するためのモジュール
const browserSync = require('browser-sync'); // ブラウザの自動リロード機能を提供するためのモジュール
const imagemin = require('gulp-imagemin'); // 画像を最適化するためのモジュール
const imageminMozjpeg = require('imagemin-mozjpeg'); // JPEGを最適化するためのモジュール
const imageminPngquant = require('imagemin-pngquant'); // PNGを最適化するためのモジュール
const changed = require('gulp-changed'); // 変更されたファイルのみを対象にするためのモジュール
const del = require('del'); // ファイルやディレクトリを削除するためのモジュール
const webp = require('gulp-webp'); //webp変換
const rename = require('gulp-rename'); //ファイル名変更
const ejs = require('gulp-ejs');
const replace = require('gulp-replace'); // 追加

const srcPath = {
  css: '../src/sass/**/*.scss',
  js: '../src/js/**/*',
  img: '../src/images/**/*',
  ejs: ['../src/templates/**/*.ejs', '!../dist/**/*.html'] // distディレクトリを除外
};

// html反映用
const destPath = {
  all: '../dist/**/*',
  css: '../dist/assets/css/',
  js: '../dist/assets/js/',
  img: '../dist/assets/images/',
  //html: "../dist/",
  ejs: '../dist/'
};

const browsers = ['last 2 versions', '> 5%', 'ie = 11', 'not ie <= 10', 'ios >= 8', 'and_chr >= 5', 'Android >= 5'];

// HTMLファイルのコピー
// const htmlCopy = () => {
//   return src(srcPath.html).pipe(dest(destPath.html));
// };

// EJSのコンパイル
const compileEjs = async () => {
  // Prettierを動的インポート
  const prettier = (await import('gulp-prettier')).default;

  return (
    src(srcPath.ejs)
      .pipe(ejs()) // EJS を HTML にコンパイル
      .pipe(rename({ extname: '.html' })) // ファイル名を .html に変更
      // `<!-- prettier-ignore -->` を削除
      .pipe(replace(/<!-- prettier-ignore -->/g, '')) // 不要なコメントを削除
      // Prettierでフォーマットを適用
      .pipe(prettier()) // Prettier でフォーマット
      .pipe(dest(destPath.ejs)) // `dist/` フォルダに保存
  );
};

const cssSass = () => {
  // ソースファイルを指定
  return (
    src(srcPath.css)
      // ソースマップを初期化
      .pipe(sourcemaps.init())
      // エラーハンドリングを設定
      .pipe(
        plumber({
          errorHandler: notify.onError('Error: <%= error.message %>')
        })
      )
      // Sassのパーシャル（_ファイル）を自動的にインポート
      .pipe(sassGlob())
      // SassをCSSにコンパイル
      .pipe(
        sass.sync({
          includePaths: ['src/sass'],
          outputStyle: 'expanded' // コンパイル後のCSSの書式（expanded or compressed）
        })
      )
      // ベンダープレフィックスを自動付与
      .pipe(
        postcss([
          postcssPresetEnv({
            stage: 3, // 安定したCSSのみ適用
            features: {
              'gap-properties': false // grid-gap の自動変換を無効化
            }
          }),
          autoprefixer({
            grid: true
          })
        ])
      )
      // CSSプロパティをアルファベット順にソートし、未来のCSS構文を使用可能に
      .pipe(
        postcss([
          cssdeclsort({
            order: 'alphabetical'
          })
        ]),
        postcssPresetEnv({ browsers: 'last 2 versions' })
      )
      // メディアクエリを統合
      .pipe(mmq())

      // コンパイル済みのCSSファイルを出力先に保存
      .pipe(dest(destPath.css))
      // Sassコンパイルが完了したことを通知
      .pipe(
        notify({
          message: 'Sassをコンパイルしました！',
          onLast: true
        })
      )
  );
};

// 画像圧縮
const imgImagemin = () => {
  // 画像ファイルを指定
  return (
    src(srcPath.img)
      // 変更があった画像のみ処理対象に
      .pipe(changed(destPath.img))
      // 画像を圧縮
      .pipe(
        imagemin(
          [
            // JPEG画像の圧縮設定
            imageminMozjpeg({
              quality: 80 // 圧縮品質（0〜100）
            }),
            // PNG画像の圧縮設定
            imageminPngquant(),
            // SVG画像の圧縮設定
            imageminSvgo({
              plugins: [
                {
                  removeViewbox: false // viewBox属性を削除しない
                }
              ]
            })
          ],
          {
            verbose: true // 圧縮情報を表示
          }
        )
      )
      .pipe(dest(destPath.img))
      .pipe(webp()) //webpに変換
      // 圧縮済みの画像ファイルを出力先に保存
      .pipe(dest(destPath.img))
  );
};

// js圧縮
const jsBabel = () => {
  // JavaScriptファイルを指定
  return (
    src(srcPath.js)
      // エラーハンドリングを設定
      .pipe(
        plumber({
          errorHandler: notify.onError('Error:Js <?php= error.message ?>')
        })
      )
      // Babelでトランスパイル（ES6からES5へ変換）
      .pipe(
        babel({
          presets: ['@babel/preset-env']
        })
      )
      // 圧縮済みのファイルを出力先に保存
      .pipe(dest(destPath.js))
  );
};

// ブラウザーシンク
const browserSyncOption = {
  notify: false,
  server: '../dist/'
};
const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
};
const browserSyncReload = done => {
  browserSync.reload();
  done();
};

// ファイルの削除
const clean = () => {
  return del(destPath.all, { force: true });
};
// ファイルの監視
const watchFiles = () => {
  watch(srcPath.css, series(cssSass, browserSyncReload));
  watch(srcPath.js, series(jsBabel, browserSyncReload));
  watch(srcPath.img, series(imgImagemin, browserSyncReload));
  //watch(srcPath.html, series(htmlCopy, browserSyncReload));
  watch(srcPath.ejs, series(compileEjs, browserSyncReload));
};

// ブラウザシンク付きの開発用タスク
exports.default = series(
  series(cssSass, jsBabel, imgImagemin, compileEjs /*htmlCopy*/),
  parallel(watchFiles, browserSyncFunc)
);

// 本番用タスク
exports.build = series(clean, cssSass, jsBabel, imgImagemin, compileEjs /*htmlCopy*/);
