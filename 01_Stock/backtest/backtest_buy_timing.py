"""
買いタイミングのバックテスト

比較:
1. 押し目買い戦略（BUY_NOWシグナルで買う）
2. 即時Buy & Hold（最初から買う）

検証：「買いタイミングを待つ」意味があるか？
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pandas as pd
import numpy as np
from src.buy_timing import BuyTimingAnalyzer


def load_stock_data(symbol: str, data_dir: str = "data") -> pd.DataFrame:
    """CSVからデータを読み込む"""
    filepath = os.path.join(os.path.dirname(os.path.dirname(__file__)), data_dir, f"{symbol}.csv")
    if not os.path.exists(filepath):
        print(f"⚠️ {filepath} が見つかりません")
        return pd.DataFrame()

    df = pd.read_csv(filepath, index_col=0, parse_dates=True)
    return df


def calculate_trailing_stop_exit(df: pd.DataFrame, entry_idx: int, atr_multiplier: float = 2.0) -> int:
    """トレーリングストップで売却するインデックスを返す"""
    if entry_idx >= len(df) - 1:
        return len(df) - 1

    prices = df['Close'].values
    highs = df['High'].values
    lows = df['Low'].values

    # ATR計算用
    def calc_atr(idx, period=14):
        if idx < period:
            return (highs[idx] - lows[idx])
        tr_sum = 0
        for i in range(idx - period + 1, idx + 1):
            tr = max(
                highs[i] - lows[i],
                abs(highs[i] - prices[i-1]) if i > 0 else 0,
                abs(lows[i] - prices[i-1]) if i > 0 else 0
            )
            tr_sum += tr
        return tr_sum / period

    trailing_high = prices[entry_idx]

    for i in range(entry_idx + 1, len(df)):
        # 高値更新
        if prices[i] > trailing_high:
            trailing_high = prices[i]

        # ATR計算
        atr = calc_atr(i)
        stop_price = trailing_high - (atr * atr_multiplier)

        # ストップにかかったら売却
        if prices[i] < stop_price:
            return i

    # 最後まで保有
    return len(df) - 1


def backtest_buy_timing(symbol: str, df: pd.DataFrame) -> dict:
    """
    買いタイミング戦略のバックテスト

    戦略:
    - BUY_NOWシグナルが出たら買う
    - トレーリングストップで売る
    - 売ったら次のBUY_NOWを待つ
    """
    if len(df) < 60:
        return None

    analyzer = BuyTimingAnalyzer()
    prices = df['Close'].values

    # 押し目買い戦略
    trades = []
    position = None
    cash = 1000000  # 100万円スタート
    shares = 0

    # 最初の50日はウォームアップ期間
    for i in range(50, len(df)):
        current_df = df.iloc[:i+1]
        result = analyzer.analyze(current_df)
        current_price = prices[i]

        if position is None:
            # ポジションなし → BUY_NOWを待つ
            if result['signal'] == 'BUY_NOW':
                # 買い
                shares = cash // current_price
                cost = shares * current_price
                cash -= cost
                position = {
                    'entry_idx': i,
                    'entry_price': current_price,
                    'shares': shares,
                    'trailing_high': current_price
                }
        else:
            # ポジションあり → トレーリングストップ判定
            if current_price > position['trailing_high']:
                position['trailing_high'] = current_price

            # ATR計算（簡易版）
            recent_high = df['High'].iloc[max(0,i-14):i+1].values
            recent_low = df['Low'].iloc[max(0,i-14):i+1].values
            atr = np.mean(recent_high - recent_low)
            stop_price = position['trailing_high'] - (atr * 2)

            if current_price < stop_price:
                # 売り
                proceeds = shares * current_price
                cash += proceeds
                pnl_pct = (current_price - position['entry_price']) / position['entry_price'] * 100
                trades.append({
                    'entry_date': df.index[position['entry_idx']],
                    'exit_date': df.index[i],
                    'entry_price': position['entry_price'],
                    'exit_price': current_price,
                    'pnl_pct': pnl_pct
                })
                position = None
                shares = 0

    # 最終評価
    final_value_timing = cash
    if position is not None:
        final_value_timing += shares * prices[-1]

    # Buy & Hold（最初から買う）
    initial_shares = 1000000 // prices[50]
    final_value_bh = initial_shares * prices[-1]

    # リターン計算
    return_timing = (final_value_timing - 1000000) / 1000000 * 100
    return_bh = (final_value_bh - 1000000) / 1000000 * 100

    return {
        'symbol': symbol,
        'timing_return': return_timing,
        'bh_return': return_bh,
        'difference': return_timing - return_bh,
        'num_trades': len(trades),
        'trades': trades,
        'final_value_timing': final_value_timing,
        'final_value_bh': final_value_bh
    }


def main():
    """メイン実行"""
    symbols = [
        ("7011.T", "三菱重工業"),
        ("7013.T", "IHI"),
        ("8306.T", "MUFG"),
        ("8750.T", "第一生命"),
    ]

    print("=" * 70)
    print("📊 買いタイミング戦略 バックテスト")
    print("=" * 70)
    print("\n比較:")
    print("  A) 押し目買い: BUY_NOWシグナルで買う + トレーリングストップ")
    print("  B) 即Buy&Hold: 最初から買って持ち続ける")
    print()

    results = []

    for symbol, name in symbols:
        df = load_stock_data(symbol)
        if df.empty:
            continue

        result = backtest_buy_timing(symbol, df)
        if result:
            result['name'] = name
            results.append(result)

            print(f"\n【{symbol} {name}】")
            print(f"  押し目買い戦略: {result['timing_return']:+.1f}%（取引回数: {result['num_trades']}）")
            print(f"  即Buy&Hold:    {result['bh_return']:+.1f}%")
            print(f"  差分:          {result['difference']:+.1f}%", end="")
            if result['difference'] > 0:
                print(" ← 押し目買いの勝ち 🎉")
            else:
                print(" ← Buy&Holdの勝ち")

    # サマリー
    if results:
        print("\n" + "=" * 70)
        print("📊 サマリー")
        print("=" * 70)

        total_timing = sum(r['timing_return'] for r in results)
        total_bh = sum(r['bh_return'] for r in results)
        avg_timing = total_timing / len(results)
        avg_bh = total_bh / len(results)

        wins = sum(1 for r in results if r['difference'] > 0)

        print(f"\n平均リターン:")
        print(f"  押し目買い戦略: {avg_timing:+.1f}%")
        print(f"  即Buy&Hold:    {avg_bh:+.1f}%")
        print(f"\n勝敗: 押し目買い {wins}勝 - {len(results)-wins}敗 Buy&Hold")

        if avg_timing > avg_bh:
            print(f"\n✅ 結論: 押し目買い戦略が {avg_timing - avg_bh:+.1f}% 優位")
        else:
            print(f"\n❌ 結論: Buy&Holdが {avg_bh - avg_timing:+.1f}% 優位")
            print("   → この期間は押し目を待たずに買った方が良かった")


if __name__ == "__main__":
    main()
