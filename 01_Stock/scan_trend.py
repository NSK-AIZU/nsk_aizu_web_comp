#!/usr/bin/env python3
"""
トレンド銘柄スキャナー

使い方:
    # A. 指数ベースでスキャン
    python scan_trend.py --index nikkei225      # 日経225をスキャン
    python scan_trend.py --index core30         # TOPIX Core30をスキャン
    python scan_trend.py --index defense        # 防衛関連をスキャン
    python scan_trend.py --index semiconductor  # 半導体関連をスキャン
    python scan_trend.py --index high_dividend  # 高配当銘柄をスキャン
    python scan_trend.py --list                 # 利用可能な指数一覧

    # B. 外部リストからスキャン
    python scan_trend.py --file watchlist.txt   # ファイルから読み込み
    python scan_trend.py 7011.T 7013.T 8306.T   # 直接指定

    # オプション
    --top N     上位N件だけ表示（デフォルト: 20）
    --save      結果をCSVに保存
"""

import sys
import os
import time
import argparse
from datetime import datetime

import yfinance as yf
import pandas as pd

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from src.trend_screener import TrendScreener
from data.index_components import INDEX_MAP, get_index, list_indices


def load_symbols_from_file(filepath: str) -> list:
    """ファイルから銘柄リストを読み込む"""
    symbols = []
    with open(filepath, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                # 銘柄コードだけ抽出（タブ/スペース区切りの場合は最初の要素）
                code = line.split()[0]
                # .Tがなければ追加
                if not code.endswith('.T'):
                    code = code + '.T'
                symbols.append(code)
    return symbols


def scan_symbols(symbols: list, batch_size: int = 20, delay: float = 1.0) -> list:
    """銘柄リストをスキャン"""
    screener = TrendScreener()
    results = []
    total = len(symbols)

    print(f"\n🔍 {total}銘柄をスキャン中...\n")

    for i, symbol in enumerate(symbols):
        try:
            # プログレス表示
            progress = (i + 1) / total * 100
            print(f"\r  [{i+1}/{total}] {progress:.0f}% - {symbol}...", end="", flush=True)

            # データ取得
            ticker = yf.Ticker(symbol)
            df = ticker.history(period="2y")

            if df.empty or len(df) < 200:
                continue

            # 分析
            result = screener.analyze(df)
            result['symbol'] = symbol

            # 銘柄名を取得
            try:
                info = ticker.info
                result['name'] = info.get('shortName', info.get('longName', symbol))
            except:
                result['name'] = symbol

            # メトリクスから主要指標を追加
            m = result.get('metrics', {})
            result['yearly_return'] = m.get('yearly_return', 0)
            result['ma50_slope'] = m.get('ma50_slope_3m', 0)
            result['days_above_ma50'] = m.get('days_above_ma50', 0)

            results.append(result)

            # バッチごとに遅延
            if (i + 1) % batch_size == 0:
                time.sleep(delay)

        except Exception as e:
            pass  # エラーは無視して続行

    print(f"\r  完了！ {len(results)}銘柄のデータを取得          ")
    return results


def show_results(results: list, top_n: int = 20):
    """結果を表示"""
    if not results:
        print("\n⚠️ 結果がありません")
        return

    # スコア順にソート
    results.sort(key=lambda x: x['score'], reverse=True)

    print("\n" + "=" * 75)
    print("📊 トレンド銘柄ランキング（スコア順）")
    print("=" * 75)

    type_icon = {
        'STRONG_TREND': '🚀',
        'WEAK_TREND': '📈',
        'SIDEWAYS': '➡️',
        'DOWNTREND': '📉',
        'UNKNOWN': '❓'
    }

    print(f"\n{'順位':>4} {'':2} {'スコア':>6} {'銘柄':8} {'年間':>8} {'MA50傾き':>8} {'銘柄名'}")
    print("-" * 75)

    for i, r in enumerate(results[:top_n]):
        icon = type_icon.get(r['trend_type'], '❓')
        name = r.get('name', '')[:18]
        print(f"{i+1:>4}  {icon} {r['score']:>4}点  {r['symbol']:8} {r['yearly_return']:>+7.1f}% {r['ma50_slope']:>+7.1f}%  {name}")

    # サマリー
    strong = [r for r in results if r['trend_type'] == 'STRONG_TREND']
    weak = [r for r in results if r['trend_type'] == 'WEAK_TREND']
    sideways = [r for r in results if r['trend_type'] == 'SIDEWAYS']
    down = [r for r in results if r['trend_type'] == 'DOWNTREND']

    print("\n" + "-" * 75)
    print(f"【集計】全{len(results)}銘柄中")
    print(f"  🚀 強いトレンド: {len(strong)}銘柄")
    print(f"  📈 弱いトレンド: {len(weak)}銘柄")
    print(f"  ➡️ 横ばい:       {len(sideways)}銘柄")
    print(f"  📉 下降トレンド: {len(down)}銘柄")

    if strong:
        print(f"\n🎯 注目銘柄: {', '.join([r['symbol'] for r in strong[:10]])}")


def save_results(results: list, filename: str = None):
    """結果をCSVに保存"""
    if not results:
        return

    if filename is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"trend_scan_{timestamp}.csv"

    # DataFrameに変換
    data = []
    for r in results:
        data.append({
            'symbol': r['symbol'],
            'name': r.get('name', ''),
            'score': r['score'],
            'trend_type': r['trend_type'],
            'yearly_return': r.get('yearly_return', 0),
            'ma50_slope': r.get('ma50_slope', 0),
            'days_above_ma50': r.get('days_above_ma50', 0),
        })

    df = pd.DataFrame(data)
    df = df.sort_values('score', ascending=False)

    # 保存
    output_path = os.path.join(os.path.dirname(__file__), 'output', filename)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False, encoding='utf-8-sig')

    print(f"\n💾 保存しました: {output_path}")


def main():
    parser = argparse.ArgumentParser(description='トレンド銘柄スキャナー')
    parser.add_argument('symbols', nargs='*', help='銘柄コード（複数可）')
    parser.add_argument('--index', '-i', help='スキャンする指数')
    parser.add_argument('--file', '-f', help='銘柄リストのファイル')
    parser.add_argument('--list', '-l', action='store_true', help='利用可能な指数一覧')
    parser.add_argument('--top', '-t', type=int, default=20, help='表示する上位件数')
    parser.add_argument('--save', '-s', action='store_true', help='結果をCSVに保存')

    args = parser.parse_args()

    # 指数一覧を表示
    if args.list:
        print("\n📋 利用可能な指数:")
        for name, symbols in INDEX_MAP.items():
            print(f"  {name:20} ({len(symbols)}銘柄)")
        print("\n使用例: python scan_trend.py --index nikkei225")
        return

    # 銘柄リストを決定
    symbols = []

    if args.index:
        symbols = get_index(args.index)
        if not symbols:
            print(f"⚠️ 指数 '{args.index}' が見つかりません")
            print("利用可能な指数: " + ", ".join(list_indices()))
            return
        print(f"📊 {args.index}（{len(symbols)}銘柄）をスキャンします")

    elif args.file:
        if not os.path.exists(args.file):
            print(f"⚠️ ファイルが見つかりません: {args.file}")
            return
        symbols = load_symbols_from_file(args.file)
        print(f"📄 {args.file}から{len(symbols)}銘柄を読み込みました")

    elif args.symbols:
        symbols = args.symbols
        # .Tがなければ追加
        symbols = [s if s.endswith('.T') else s + '.T' for s in symbols]

    else:
        parser.print_help()
        print("\n例:")
        print("  python scan_trend.py --index nikkei225")
        print("  python scan_trend.py --index defense")
        print("  python scan_trend.py 7011.T 7013.T")
        return

    # スキャン実行
    results = scan_symbols(symbols)

    # 結果表示
    show_results(results, args.top)

    # 保存
    if args.save:
        save_results(results)


if __name__ == "__main__":
    main()
