"""
買いタイミング判定モジュール

役割：選んだ銘柄の「いつ買うか」を判断する
戦略：押し目買い（上昇トレンド中の一時的な下落を狙う）
"""

import pandas as pd
import numpy as np


class BuyTimingAnalyzer:
    """買いタイミングを分析するクラス"""

    def __init__(self):
        # パラメータ
        self.rsi_oversold = 35  # RSIがこれ以下で「売られすぎ」
        self.rsi_period = 14
        self.ma_short = 20  # 短期移動平均
        self.ma_long = 50   # 長期移動平均

    def analyze(self, df: pd.DataFrame) -> dict:
        """
        買いタイミングを分析

        Returns:
            dict: {
                'signal': 'BUY_NOW' | 'WAIT' | 'NOT_YET',
                'score': 0-100,
                'reasons': [...],
                'conditions': {...}
            }
        """
        if len(df) < self.ma_long:
            return {
                'signal': 'NOT_YET',
                'score': 0,
                'reasons': ['データ不足（50日以上必要）'],
                'conditions': {}
            }

        # 指標を計算
        conditions = self._calculate_conditions(df)

        # スコアリング
        score, reasons = self._calculate_score(conditions)

        # シグナル判定
        if score >= 70:
            signal = 'BUY_NOW'  # 今が買い時
        elif score >= 50:
            signal = 'WAIT'     # もう少し待て
        else:
            signal = 'NOT_YET'  # まだ早い

        return {
            'signal': signal,
            'score': score,
            'reasons': reasons,
            'conditions': conditions
        }

    def _calculate_conditions(self, df: pd.DataFrame) -> dict:
        """各種条件を計算"""
        close = df['Close'].values
        high = df['High'].values
        low = df['Low'].values
        volume = df['Volume'].values if 'Volume' in df.columns else None

        # 移動平均
        ma20 = pd.Series(close).rolling(self.ma_short).mean().values
        ma50 = pd.Series(close).rolling(self.ma_long).mean().values

        # RSI
        rsi = self._calculate_rsi(close, self.rsi_period)

        # ATR（ボラティリティ）
        atr = self._calculate_atr(high, low, close, 14)

        # 現在値
        current_price = close[-1]
        current_ma20 = ma20[-1]
        current_ma50 = ma50[-1]
        current_rsi = rsi[-1]
        current_atr = atr[-1]

        # 過去20日の高値からの下落率
        high_20d = np.max(high[-20:])
        pullback_pct = (high_20d - current_price) / high_20d * 100

        # トレンド判定（MA50の傾き）
        ma50_slope = (ma50[-1] - ma50[-10]) / ma50[-10] * 100 if ma50[-10] > 0 else 0

        # 出来高（平均比）
        vol_ratio = 1.0
        if volume is not None and len(volume) >= 20:
            avg_vol = np.mean(volume[-20:])
            if avg_vol > 0:
                vol_ratio = volume[-1] / avg_vol

        return {
            'current_price': current_price,
            'ma20': current_ma20,
            'ma50': current_ma50,
            'rsi': current_rsi,
            'atr': current_atr,
            'pullback_pct': pullback_pct,
            'ma50_slope': ma50_slope,
            'vol_ratio': vol_ratio,
            'price_vs_ma20': (current_price - current_ma20) / current_ma20 * 100,
            'price_vs_ma50': (current_price - current_ma50) / current_ma50 * 100,
        }

    def _calculate_score(self, c: dict) -> tuple:
        """スコアと理由を計算"""
        score = 0
        reasons = []

        # 1. 上昇トレンド中か？（MA50が上向き）[20点]
        if c['ma50_slope'] > 1:
            score += 20
            reasons.append(f"✓ 上昇トレンド中（MA50傾き +{c['ma50_slope']:.1f}%）")
        elif c['ma50_slope'] > 0:
            score += 10
            reasons.append(f"△ 緩やかな上昇トレンド（MA50傾き +{c['ma50_slope']:.1f}%）")
        else:
            reasons.append(f"✗ 下降トレンド（MA50傾き {c['ma50_slope']:.1f}%）")

        # 2. 押し目の深さ（高値から5-15%下落が理想）[25点]
        pb = c['pullback_pct']
        if 5 <= pb <= 15:
            score += 25
            reasons.append(f"✓ 理想的な押し目（高値から -{pb:.1f}%）")
        elif 3 <= pb < 5:
            score += 15
            reasons.append(f"△ 浅い押し目（高値から -{pb:.1f}%）")
        elif 15 < pb <= 25:
            score += 15
            reasons.append(f"△ やや深い押し目（高値から -{pb:.1f}%）")
        elif pb < 3:
            score += 5
            reasons.append(f"✗ 高値圏（高値から -{pb:.1f}%）")
        else:
            reasons.append(f"✗ 下落しすぎ（高値から -{pb:.1f}%）")

        # 3. MA20との位置関係（MA20近辺か下が理想）[20点]
        price_ma20 = c['price_vs_ma20']
        if -5 <= price_ma20 <= 2:
            score += 20
            reasons.append(f"✓ MA20サポート圏内（{price_ma20:+.1f}%）")
        elif -10 <= price_ma20 < -5:
            score += 15
            reasons.append(f"△ MA20を下回る（{price_ma20:+.1f}%）")
        elif 2 < price_ma20 <= 5:
            score += 10
            reasons.append(f"△ MA20からやや乖離（{price_ma20:+.1f}%）")
        else:
            reasons.append(f"✗ MA20から大きく乖離（{price_ma20:+.1f}%）")

        # 4. RSI（売られすぎからの反発）[20点]
        rsi = c['rsi']
        if 30 <= rsi <= 45:
            score += 20
            reasons.append(f"✓ RSI反発ゾーン（RSI={rsi:.0f}）")
        elif 25 <= rsi < 30:
            score += 15
            reasons.append(f"△ RSI売られすぎ、反発待ち（RSI={rsi:.0f}）")
        elif 45 < rsi <= 55:
            score += 10
            reasons.append(f"△ RSI中立（RSI={rsi:.0f}）")
        elif rsi > 70:
            reasons.append(f"✗ RSI買われすぎ（RSI={rsi:.0f}）")
        else:
            score += 5
            reasons.append(f"RSI={rsi:.0f}")

        # 5. MA50より上にいるか（長期トレンド）[15点]
        if c['price_vs_ma50'] > 0:
            score += 15
            reasons.append(f"✓ MA50より上（長期上昇トレンド）")
        elif c['price_vs_ma50'] > -5:
            score += 10
            reasons.append(f"△ MA50付近")
        else:
            reasons.append(f"✗ MA50より下（長期トレンド弱い）")

        return score, reasons

    def _calculate_rsi(self, prices: np.ndarray, period: int = 14) -> np.ndarray:
        """RSIを計算"""
        deltas = np.diff(prices)
        gains = np.where(deltas > 0, deltas, 0)
        losses = np.where(deltas < 0, -deltas, 0)

        avg_gain = pd.Series(gains).rolling(period).mean().values
        avg_loss = pd.Series(losses).rolling(period).mean().values

        rs = np.where(avg_loss != 0, avg_gain / avg_loss, 0)
        rsi = 100 - (100 / (1 + rs))

        return np.concatenate([[50], rsi])  # 最初の1つはダミー

    def _calculate_atr(self, high: np.ndarray, low: np.ndarray,
                       close: np.ndarray, period: int = 14) -> np.ndarray:
        """ATRを計算"""
        tr1 = high - low
        tr2 = np.abs(high - np.roll(close, 1))
        tr3 = np.abs(low - np.roll(close, 1))
        tr = np.maximum(np.maximum(tr1, tr2), tr3)
        tr[0] = tr1[0]

        atr = pd.Series(tr).rolling(period).mean().values
        return atr


def check_buy_timing(symbol: str, df: pd.DataFrame) -> None:
    """買いタイミングをチェックして表示"""
    analyzer = BuyTimingAnalyzer()
    result = analyzer.analyze(df)

    # シグナル表示
    signal_display = {
        'BUY_NOW': '🟢 今が買い時！',
        'WAIT': '🟡 もう少し待て',
        'NOT_YET': '🔴 まだ早い'
    }

    print(f"\n{'='*50}")
    print(f"📊 {symbol} 買いタイミング分析")
    print(f"{'='*50}")
    print(f"\n判定: {signal_display.get(result['signal'], result['signal'])}")
    print(f"スコア: {result['score']}/100点")
    print(f"\n【判断理由】")
    for reason in result['reasons']:
        print(f"  {reason}")

    # 現在値情報
    c = result['conditions']
    if c:
        print(f"\n【現在の状況】")
        print(f"  現在値: ¥{c['current_price']:,.0f}")
        print(f"  MA20: ¥{c['ma20']:,.0f} ({c['price_vs_ma20']:+.1f}%)")
        print(f"  MA50: ¥{c['ma50']:,.0f} ({c['price_vs_ma50']:+.1f}%)")
        print(f"  RSI: {c['rsi']:.0f}")
        print(f"  高値からの下落: -{c['pullback_pct']:.1f}%")


# テスト用
if __name__ == "__main__":
    import yfinance as yf

    # テスト銘柄
    test_symbols = ["7011.T", "7013.T", "6723.T"]

    for symbol in test_symbols:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period="6mo")

        if not df.empty:
            check_buy_timing(symbol, df)
