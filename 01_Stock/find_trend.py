#!/usr/bin/env python3
"""
トレンド銘柄ファインダー

使い方:
    python find_trend.py 7011.T 7013.T    # 指定銘柄を判定
    python find_trend.py                   # 監視リスト全体を判定
    python find_trend.py --scan            # 日経225からトレンド銘柄を探す
"""

import sys
import os
import yfinance as yf
from src.trend_screener import TrendScreener, screen_stock


# 保有銘柄リスト
WATCHLIST = [
    "7011.T",   # 三菱重工業
    "7013.T",   # IHI
    "8306.T",   # 三菱UFJ
    "8750.T",   # 第一生命
    "6701.T",   # NEC
]

# 日経225の一部（主要銘柄）
NIKKEI_SAMPLE = [
    # 自動車
    "7203.T",   # トヨタ
    "7267.T",   # ホンダ
    "7201.T",   # 日産
    # 電機
    "6758.T",   # ソニー
    "6861.T",   # キーエンス
    "6954.T",   # ファナック
    "6501.T",   # 日立
    "6594.T",   # 日本電産
    # 金融
    "8306.T",   # 三菱UFJ
    "8316.T",   # 三井住友FG
    "8411.T",   # みずほFG
    # 商社
    "8058.T",   # 三菱商事
    "8031.T",   # 三井物産
    "8001.T",   # 伊藤忠
    # 通信
    "9432.T",   # NTT
    "9433.T",   # KDDI
    "9434.T",   # ソフトバンク
    # 医薬
    "4502.T",   # 武田薬品
    "4503.T",   # アステラス
    "4519.T",   # 中外製薬
    # 重工・防衛
    "7011.T",   # 三菱重工
    "7012.T",   # 川崎重工
    "7013.T",   # IHI
    # 半導体関連
    "8035.T",   # 東京エレクトロン
    "6723.T",   # ルネサス
    "6857.T",   # アドバンテスト
    # 小売・サービス
    "9983.T",   # ファーストリテイリング
    "4661.T",   # オリエンタルランド
    "7974.T",   # 任天堂
    # その他
    "6902.T",   # デンソー
    "4063.T",   # 信越化学
    "9984.T",   # ソフトバンクG
]


def analyze_symbols(symbols: list, show_all: bool = True) -> list:
    """銘柄リストを分析"""
    results = []
    screener = TrendScreener()

    for symbol in symbols:
        try:
            ticker = yf.Ticker(symbol)
            df = ticker.history(period="2y")

            if df.empty or len(df) < 200:
                continue

            result = screener.analyze(df)
            result['symbol'] = symbol

            # 銘柄名を取得
            try:
                info = ticker.info
                result['name'] = info.get('shortName', symbol)
            except:
                result['name'] = symbol

            results.append(result)

            if show_all:
                screen_stock(symbol, df)

        except Exception as e:
            print(f"⚠️ {symbol}: エラー - {e}")

    return results


def show_summary(results: list):
    """サマリー表示"""
    if not results:
        return

    print("\n" + "=" * 65)
    print("📊 トレンド判定サマリー（スコア順）")
    print("=" * 65)

    # スコア順にソート
    results.sort(key=lambda x: x['score'], reverse=True)

    type_icon = {
        'STRONG_TREND': '🚀',
        'WEAK_TREND': '📈',
        'SIDEWAYS': '➡️',
        'DOWNTREND': '📉',
        'UNKNOWN': '❓'
    }

    for r in results:
        icon = type_icon.get(r['trend_type'], '❓')
        yr = r['metrics'].get('yearly_return', 0)
        print(f"{icon} {r['score']:3d}点 | {r['symbol']:8s} | {yr:+6.1f}% | {r['name'][:20]}")

    # トレンド銘柄をハイライト
    strong = [r for r in results if r['trend_type'] == 'STRONG_TREND']
    if strong:
        print(f"\n🎯 強いトレンド銘柄: {', '.join([r['symbol'] for r in strong])}")
    else:
        print(f"\n💤 強いトレンド銘柄は見つかりませんでした")

    # 統計
    print(f"\n【統計】")
    print(f"  🚀 強いトレンド: {len([r for r in results if r['trend_type'] == 'STRONG_TREND'])}銘柄")
    print(f"  📈 弱いトレンド: {len([r for r in results if r['trend_type'] == 'WEAK_TREND'])}銘柄")
    print(f"  ➡️ 横ばい:      {len([r for r in results if r['trend_type'] == 'SIDEWAYS'])}銘柄")
    print(f"  📉 下降トレンド: {len([r for r in results if r['trend_type'] == 'DOWNTREND'])}銘柄")


def main():
    args = sys.argv[1:]

    if "--scan" in args:
        # 日経主要銘柄をスキャン
        print("🔍 日経主要銘柄からトレンド銘柄を探索中...\n")
        print("（時間がかかります）\n")
        results = analyze_symbols(NIKKEI_SAMPLE, show_all=False)
        show_summary(results)

    elif len(args) > 0:
        # 指定銘柄を判定
        results = analyze_symbols(args, show_all=True)
        if len(results) > 1:
            show_summary(results)

    else:
        # 監視リストを判定
        print("📋 監視リストのトレンド判定...\n")
        results = analyze_symbols(WATCHLIST, show_all=True)
        show_summary(results)


if __name__ == "__main__":
    main()
