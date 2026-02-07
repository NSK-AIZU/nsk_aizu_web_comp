#!/usr/bin/env python3
"""
株価データダウンロード

使い方:
    python download_data.py
"""

import os
import yfinance as yf

# 監視銘柄
SYMBOLS = [
    "7011.T",   # 三菱重工業
    "7013.T",   # IHI
    "8306.T",   # 三菱UFJ
    "8750.T",   # 第一生命
    "6723.T",   # ルネサス
    "9432.T",   # NTT
    "218A.T",   # Liberaware
    "280A.T",   # TMH
]

def main():
    # dataフォルダ作成
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(data_dir, exist_ok=True)

    print("📥 株価データをダウンロード中...\n")

    for symbol in SYMBOLS:
        try:
            print(f"  {symbol}...", end=" ")
            ticker = yf.Ticker(symbol)
            df = ticker.history(period="3y")  # 3年分

            if df.empty:
                print("❌ データなし")
                continue

            # CSV保存
            filepath = os.path.join(data_dir, f"{symbol}.csv")
            df.to_csv(filepath)
            print(f"✅ {len(df)}日分")

        except Exception as e:
            print(f"❌ エラー: {e}")

    print("\n✅ 完了！")
    print(f"保存先: {data_dir}/")


if __name__ == "__main__":
    main()
