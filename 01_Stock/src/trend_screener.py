"""
トレンド銘柄スクリーナー

役割：銘柄がトレンド銘柄かどうかを判定する
目的：横ばい銘柄を避け、トレンド銘柄に集中投資するため
"""

import pandas as pd
import numpy as np


class TrendScreener:
    """トレンド銘柄を判定するクラス"""

    def __init__(self):
        # パラメータ
        self.ma_short = 20
        self.ma_mid = 50
        self.ma_long = 200

    def analyze(self, df: pd.DataFrame) -> dict:
        """
        トレンド強度を分析

        Returns:
            dict: {
                'trend_type': 'STRONG_TREND' | 'WEAK_TREND' | 'SIDEWAYS' | 'DOWNTREND',
                'score': 0-100,
                'reasons': [...],
                'metrics': {...}
            }
        """
        if len(df) < self.ma_long:
            return {
                'trend_type': 'UNKNOWN',
                'score': 0,
                'reasons': ['データ不足（200日以上必要）'],
                'metrics': {}
            }

        # 各種メトリクスを計算
        metrics = self._calculate_metrics(df)

        # スコアリング
        score, reasons = self._calculate_score(metrics)

        # トレンドタイプ判定
        if score >= 75:
            trend_type = 'STRONG_TREND'  # 強いトレンド銘柄
        elif score >= 50:
            trend_type = 'WEAK_TREND'    # 弱いトレンド
        elif score >= 25:
            trend_type = 'SIDEWAYS'      # 横ばい
        else:
            trend_type = 'DOWNTREND'     # 下降トレンド

        return {
            'trend_type': trend_type,
            'score': score,
            'reasons': reasons,
            'metrics': metrics
        }

    def _calculate_metrics(self, df: pd.DataFrame) -> dict:
        """トレンド判定用のメトリクスを計算"""
        close = df['Close'].values
        high = df['High'].values
        low = df['Low'].values

        # 移動平均
        ma20 = pd.Series(close).rolling(self.ma_short).mean().values
        ma50 = pd.Series(close).rolling(self.ma_mid).mean().values
        ma200 = pd.Series(close).rolling(self.ma_long).mean().values

        current_price = close[-1]
        current_ma20 = ma20[-1]
        current_ma50 = ma50[-1]
        current_ma200 = ma200[-1]

        # 1. MAの傾き（トレンドの方向と強さ）
        ma50_slope_1m = (ma50[-1] - ma50[-20]) / ma50[-20] * 100 if ma50[-20] > 0 else 0
        ma50_slope_3m = (ma50[-1] - ma50[-60]) / ma50[-60] * 100 if len(ma50) > 60 and ma50[-60] > 0 else 0
        ma200_slope = (ma200[-1] - ma200[-60]) / ma200[-60] * 100 if len(ma200) > 60 and ma200[-60] > 0 else 0

        # 2. 価格とMAの位置関係
        price_vs_ma20 = (current_price - current_ma20) / current_ma20 * 100
        price_vs_ma50 = (current_price - current_ma50) / current_ma50 * 100
        price_vs_ma200 = (current_price - current_ma200) / current_ma200 * 100

        # 3. MAの並び順（パーフェクトオーダー）
        perfect_order = current_price > current_ma20 > current_ma50 > current_ma200

        # 4. 高値・安値の切り上げ（過去6ヶ月を3期間に分割）
        period = len(close) // 3
        if period > 20:
            highs_p1 = np.max(high[-period*3:-period*2])
            highs_p2 = np.max(high[-period*2:-period])
            highs_p3 = np.max(high[-period:])
            lows_p1 = np.min(low[-period*3:-period*2])
            lows_p2 = np.min(low[-period*2:-period])
            lows_p3 = np.min(low[-period:])
            higher_highs = highs_p1 < highs_p2 < highs_p3
            higher_lows = lows_p1 < lows_p2 < lows_p3
        else:
            higher_highs = False
            higher_lows = False

        # 5. 年初来パフォーマンス
        ytd_start_idx = 0
        for i, date in enumerate(df.index):
            if hasattr(date, 'year') and date.year == df.index[-1].year:
                ytd_start_idx = i
                break
        ytd_return = (current_price - close[ytd_start_idx]) / close[ytd_start_idx] * 100 if close[ytd_start_idx] > 0 else 0

        # 6. 過去1年のパフォーマンス
        yearly_return = (current_price - close[0]) / close[0] * 100 if close[0] > 0 else 0

        # 7. ボラティリティ（ATR比率）
        atr = self._calculate_atr(high, low, close, 14)
        atr_pct = atr[-1] / current_price * 100 if current_price > 0 else 0

        # 8. トレンドの一貫性（MA50を上回っている日数の割合）
        days_above_ma50 = np.sum(close[-120:] > ma50[-120:]) / 120 * 100 if len(close) >= 120 else 0

        return {
            'current_price': current_price,
            'ma20': current_ma20,
            'ma50': current_ma50,
            'ma200': current_ma200,
            'ma50_slope_1m': ma50_slope_1m,
            'ma50_slope_3m': ma50_slope_3m,
            'ma200_slope': ma200_slope,
            'price_vs_ma20': price_vs_ma20,
            'price_vs_ma50': price_vs_ma50,
            'price_vs_ma200': price_vs_ma200,
            'perfect_order': perfect_order,
            'higher_highs': higher_highs,
            'higher_lows': higher_lows,
            'ytd_return': ytd_return,
            'yearly_return': yearly_return,
            'atr_pct': atr_pct,
            'days_above_ma50': days_above_ma50,
        }

    def _calculate_score(self, m: dict) -> tuple:
        """スコアと理由を計算"""
        score = 0
        reasons = []

        # 1. パーフェクトオーダー（価格 > MA20 > MA50 > MA200）[15点]
        if m['perfect_order']:
            score += 15
            reasons.append("✓ パーフェクトオーダー（価格>MA20>MA50>MA200）")
        else:
            reasons.append("✗ パーフェクトオーダーではない")

        # 2. MA50の傾き（3ヶ月）[20点]
        slope = m['ma50_slope_3m']
        if slope > 10:
            score += 20
            reasons.append(f"✓ MA50が強く上昇中（3ヶ月で+{slope:.1f}%）")
        elif slope > 5:
            score += 15
            reasons.append(f"○ MA50が上昇中（3ヶ月で+{slope:.1f}%）")
        elif slope > 0:
            score += 8
            reasons.append(f"△ MA50がやや上昇（3ヶ月で+{slope:.1f}%）")
        elif slope > -5:
            score += 3
            reasons.append(f"△ MA50が横ばい（3ヶ月で{slope:.1f}%）")
        else:
            reasons.append(f"✗ MA50が下落中（3ヶ月で{slope:.1f}%）")

        # 3. MA200の傾き [15点]
        slope200 = m['ma200_slope']
        if slope200 > 5:
            score += 15
            reasons.append(f"✓ 長期トレンド上昇（MA200: +{slope200:.1f}%）")
        elif slope200 > 0:
            score += 10
            reasons.append(f"○ 長期トレンドやや上昇（MA200: +{slope200:.1f}%）")
        elif slope200 > -3:
            score += 5
            reasons.append(f"△ 長期トレンド横ばい（MA200: {slope200:.1f}%）")
        else:
            reasons.append(f"✗ 長期トレンド下落（MA200: {slope200:.1f}%）")

        # 4. 高値・安値の切り上げ [15点]
        if m['higher_highs'] and m['higher_lows']:
            score += 15
            reasons.append("✓ 高値・安値ともに切り上げ")
        elif m['higher_highs']:
            score += 10
            reasons.append("○ 高値は切り上げ")
        elif m['higher_lows']:
            score += 8
            reasons.append("○ 安値は切り上げ")
        else:
            reasons.append("✗ 高値・安値の切り上げなし")

        # 5. 年間パフォーマンス [20点]
        yr = m['yearly_return']
        if yr > 50:
            score += 20
            reasons.append(f"✓ 年間パフォーマンス優秀（+{yr:.0f}%）")
        elif yr > 20:
            score += 15
            reasons.append(f"○ 年間パフォーマンス良好（+{yr:.0f}%）")
        elif yr > 0:
            score += 8
            reasons.append(f"△ 年間プラス（+{yr:.0f}%）")
        else:
            reasons.append(f"✗ 年間マイナス（{yr:.0f}%）")

        # 6. MA50より上にいる日数の割合 [15点]
        days = m['days_above_ma50']
        if days > 80:
            score += 15
            reasons.append(f"✓ 一貫してMA50上（{days:.0f}%の日数）")
        elif days > 60:
            score += 10
            reasons.append(f"○ 概ねMA50上（{days:.0f}%の日数）")
        elif days > 40:
            score += 5
            reasons.append(f"△ MA50上下を行き来（{days:.0f}%の日数）")
        else:
            reasons.append(f"✗ MA50下が多い（{days:.0f}%の日数）")

        return score, reasons

    def _calculate_atr(self, high, low, close, period=14):
        """ATRを計算"""
        tr1 = high - low
        tr2 = np.abs(high - np.roll(close, 1))
        tr3 = np.abs(low - np.roll(close, 1))
        tr = np.maximum(np.maximum(tr1, tr2), tr3)
        tr[0] = tr1[0]
        return pd.Series(tr).rolling(period).mean().values


def screen_stock(symbol: str, df: pd.DataFrame) -> None:
    """銘柄のトレンド判定を表示"""
    screener = TrendScreener()
    result = screener.analyze(df)

    # タイプ表示
    type_display = {
        'STRONG_TREND': '🚀 強いトレンド銘柄',
        'WEAK_TREND': '📈 弱いトレンド',
        'SIDEWAYS': '➡️ 横ばい銘柄',
        'DOWNTREND': '📉 下降トレンド',
        'UNKNOWN': '❓ 判定不能'
    }

    print(f"\n{'='*55}")
    print(f"📊 {symbol} トレンド判定")
    print(f"{'='*55}")
    print(f"\n判定: {type_display.get(result['trend_type'], result['trend_type'])}")
    print(f"スコア: {result['score']}/100点")
    print(f"\n【判断理由】")
    for reason in result['reasons']:
        print(f"  {reason}")

    # メトリクス
    m = result['metrics']
    if m:
        print(f"\n【主要指標】")
        print(f"  年間リターン: {m['yearly_return']:+.1f}%")
        print(f"  MA50傾き(3ヶ月): {m['ma50_slope_3m']:+.1f}%")
        print(f"  MA200傾き: {m['ma200_slope']:+.1f}%")
        print(f"  MA50上の日数: {m['days_above_ma50']:.0f}%")


if __name__ == "__main__":
    import yfinance as yf

    test_symbols = ["7011.T", "7013.T", "6723.T", "9432.T"]

    for symbol in test_symbols:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period="2y")
        if not df.empty:
            screen_stock(symbol, df)
