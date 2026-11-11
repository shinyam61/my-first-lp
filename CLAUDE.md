# CLAUDE.md

## プロジェクト概要

- 種別：HTML / CSS / JavaScript のみで作る静的サイト（架空のコーヒーショップ「CAFÉ MORI」のランディングページ）
- ビルドツール・フレームワークは使わない
- ファイル構成
  - `index.html`：構造とコンテンツ
  - `style.css`：スタイルをすべてここにまとめる
  - `scripts/`：JavaScript のモジュールをまとめるディレクトリ（下記「JavaScript のルール」参照）

## コーディングルール

- CSS は `style.css` にまとめる。HTML 内の `<style>` タグや `style=""` 属性は使わない
- JavaScript は HTML 内の `<script>` 内に処理を書かない。すべて `scripts/` 配下のファイルに書く
- コメントは日本語で書く
- 動作確認用の `console.log` は残さない（デバッグ中に使った場合は、コミット前に必ず削除する）

## JavaScript のルール

- JavaScript はセクション単位でモジュール化し、モジュールごとに別ファイルにする
- モジュールのファイルは `scripts/` ディレクトリに置く
  - 複数のページや機能で共通して使うものは `scripts/common/` に置く
  - ページ固有のものは、そのページのディレクトリ名で `scripts/<ページ名>/` に置く（例：トップページなら `scripts/index/`）
- 要素の取得には `querySelector` / `querySelectorAll` を使わず、`getElementsByClassName` を使う

## デザイン方針

- シンプルでモダンなデザインにする
- 既存の配色（エスプレッソ、クリーム、モスグリーン系）とフォントを基本として使い、新しい色を増やしすぎない
- 色やフォントは `style.css` の `:root` に定義した変数を使う

## 作業の進め方

- 変更後は、`index.html` をブラウザで開いて表示と動作を確認する
- JavaScript を変更したら `node --check script.js` で構文を確認する
