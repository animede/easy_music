# ACE-Step 1.5 XL モデル運用ガイド

XL（4B DiT）モデルのダウンロード、比較、VRAM見積もり、48GB GPU での運用方法をまとめる。

## モデルダウンロード

### 手動ダウンロード（huggingface-cli）

```bash
# XL Turbo
huggingface-cli download ACE-Step/acestep-v15-xl-turbo \
  --local-dir ./checkpoints/acestep-v15-xl-turbo

# XL SFT
huggingface-cli download ACE-Step/acestep-v15-xl-sft \
  --local-dir ./checkpoints/acestep-v15-xl-sft

# XL Base
huggingface-cli download ACE-Step/acestep-v15-xl-base \
  --local-dir ./checkpoints/acestep-v15-xl-base

# LLM 4B（XL と組み合わせ推奨）
huggingface-cli download ACE-Step/acestep-5Hz-lm-4B \
  --local-dir ./checkpoints/acestep-5Hz-lm-4B

# LLM 0.6B（軽量版）
huggingface-cli download ACE-Step/acestep-5Hz-lm-0.6B \
  --local-dir ./checkpoints/acestep-5Hz-lm-0.6B
```

> **重要**: `--local-dir` で必ず `checkpoints/acestep-v15-*` 形式のディレクトリを指定すること。
> モデル発見は `checkpoints/` 内の `acestep-v15-*` プレフィックスのディレクトリをスキャンする。

### 自動ダウンロード

サーバー起動時にモデルが見つからない場合、`SUBMODEL_REGISTRY` に登録済みのモデルは自動ダウンロードされる。

**XL モデルの自動ダウンロード対応状況:**

| モデル名 | レジストリ登録 | HuggingFace リポジトリ |
|---------|--------------|----------------------|
| `acestep-v15-xl-turbo` | ✅ | `ACE-Step/acestep-v15-xl-turbo` |
| `acestep-v15-xl-sft` | ✅ | `ACE-Step/acestep-v15-xl-sft` |
| `acestep-v15-xl-base` | ✅ | `ACE-Step/acestep-v15-xl-base` |
| `acestep-5Hz-lm-4B` | ✅ | `ACE-Step/acestep-5Hz-lm-4B` |
| `acestep-5Hz-lm-0.6B` | ✅ | `ACE-Step/acestep-5Hz-lm-0.6B` |

自動ダウンロードは以下のタイミングで実行される：

1. `ensure_dit_model()` — DiT モデル初期化時に呼ばれる
2. `ensure_lm_model()` — LLM モデル初期化時に呼ばれる
3. `ensure_main_model()` — メインモデル（vae, text_encoder, turbo 2B, lm-1.7B）が未取得の場合

ダウンロード元は HuggingFace Hub を優先し、失敗時に ModelScope にフォールバックする。

### model_downloader CLI

```bash
# 利用可能なモデル一覧を表示
uv run python -m acestep.model_downloader --list

# 特定のモデルをダウンロード
uv run python -m acestep.model_downloader --model acestep-v15-xl-turbo

# すべてのモデルをダウンロード
uv run python -m acestep.model_downloader --all

# ModelScope からダウンロード（中国国内推奨）
uv run python -m acestep.model_downloader --model acestep-v15-xl-turbo --source modelscope
```

### メインモデル（必須）

XL モデルを使う場合でも、以下のメインモデルコンポーネントは必須：

| コンポーネント | 含まれるリポジトリ | 用途 |
|---------------|-----------------|------|
| `vae` | ACE-Step/Ace-Step1.5 | 音声エンコード/デコード |
| `Qwen3-Embedding-0.6B` | ACE-Step/Ace-Step1.5 | テキストエンコーダ |
| `acestep-5Hz-lm-1.7B` | ACE-Step/Ace-Step1.5 | デフォルト LLM |
| `acestep-v15-turbo` | ACE-Step/Ace-Step1.5 | デフォルト DiT (2B) |

メインモデルが未取得の場合は起動時に自動ダウンロードされる。

### チェックポイントディレクトリ構成例

```
checkpoints/
├── vae/                          # VAE（メインモデルに含まれる）
├── Qwen3-Embedding-0.6B/        # テキストエンコーダ（メインモデル）
├── acestep-5Hz-lm-1.7B/         # LLM 1.7B（メインモデル）
├── acestep-5Hz-lm-4B/           # LLM 4B（別途ダウンロード）
├── acestep-v15-turbo/            # DiT 2B Turbo（メインモデル）
├── acestep-v15-xl-turbo/         # DiT 4B XL Turbo
│   ├── config.json
│   ├── configuration_acestep_v15.py
│   ├── modeling_acestep_v15_xl_turbo.py
│   ├── model.safetensors.index.json
│   ├── model-00001-of-00004.safetensors
│   ├── model-00002-of-00004.safetensors
│   ├── model-00003-of-00004.safetensors
│   ├── model-00004-of-00004.safetensors
│   └── silence_latent.pt
└── acestep-v15-xl-sft/           # DiT 4B XL SFT
    ├── config.json
    ├── ...（同様の構成）
    └── silence_latent.pt
```

### カスタムチェックポイントディレクトリ

デフォルトはプロジェクトルートの `checkpoints/` だが、環境変数で変更可能：

```bash
# 共有ディレクトリを指定（複数インストールでモデルを共有）
export ACESTEP_CHECKPOINTS_DIR=/mnt/models/acestep

# プロジェクトルート自体を変更
export ACESTEP_PROJECT_ROOT=/opt/acestep
```

## モデル比較

### XL モデル一覧

| モデル | CFG | ステップ | Quality | Diversity | 用途 |
|--------|-----|---------|---------|-----------|------|
| xl-base | ✅ | 50 | High | High | extract, lego, complete 対応 |
| xl-sft | ✅ | 50 | Very High | Medium | 標準生成（最高品質） |
| xl-turbo | ❌ | 8 | Very High | Medium | 標準生成（最速） |

### Quality の実質的な差

公式表では SFT・Turbo ともに "Very High" だが、モデルカードでは明確に差をつけている：

- **XL SFT**: "Highest Quality" — SFT + 4B = 最高品質バリアント
- **XL Turbo**: "Higher Quality" — 2B turbo より高品質

### SFT vs Turbo 詳細比較

| 観点 | XL SFT | XL Turbo |
|------|--------|----------|
| 音質の上限 | 最高 (Highest) | 非常に高い (Higher) |
| CFG（ガイダンス制御） | ✅ guidance_scale で微調整可能 | ❌ 蒸留済みで固定 |
| 推論ステップ | 50 | 8（自動制限） |
| 速度 | 約 6 倍遅い | 最速 |
| 細部の表現力 | 楽器分離感が良い傾向 | やや劣る |
| 適した用途 | 最終出力・品質重視 | ラフ生成・大量生成 |

### LLM モデルとの組み合わせ

XL DiT はすべての LLM と互換：

| LLM | パラメータ | VRAM (bf16) | 歌詞理解力 | プロンプト追従 |
|-----|-----------|-------------|-----------|---------------|
| lm-0.6B | 0.6B | ~1.2GB | Medium | Medium |
| lm-1.7B | 1.7B | ~3.4GB | Medium | Medium |
| lm-4B | 4B | ~8GB | Strong | Strong |

## VRAM 見積もり

### 静的コンポーネント

| コンポーネント | VRAM (bf16) |
|---------------|-------------|
| XL DiT（1 モデル） | ~10GB |
| T5 Text Encoder | ~1.2GB |
| VAE | ~0.3GB |
| LLM 4B | ~8GB |
| LLM 1.7B | ~3.4GB |

### 活性化メモリの目安

活性化メモリは batch_size × duration × モデルサイズに比例する。
CFG ありの場合（SFT）は実効バッチが 2 倍になる。

**XL Turbo（CFG なし）:**

| batch | 120s | 240s |
|-------|------|------|
| 1 | ~2-3GB | ~4-5GB |
| 4 | ~8-10GB | ~14-18GB |
| 8 | ~16-20GB | ~28-36GB |

**XL SFT（CFG あり、実効 batch×2）:**

| batch | 120s | 240s |
|-------|------|------|
| 1 | ~4-5GB | ~6-8GB |
| 2 | ~6-8GB | ~12-16GB |
| 4 | ~12-16GB | ~24-32GB |

## 48GB GPU 運用パターン

### パターン A：両モデル同時ロード（推奨）

```bash
ACESTEP_CONFIG_PATH=acestep-v15-xl-turbo \
ACESTEP_CONFIG_PATH2=acestep-v15-xl-sft \
ACESTEP_NO_INIT=false \
./run_api_server_multimodel.sh
```

**静的 VRAM:**

| 項目 | VRAM |
|------|------|
| XL Turbo DiT | ~10GB |
| XL SFT DiT | ~10GB |
| T5 + VAE（共有） | ~1.5GB |
| LLM 4B | ~8GB |
| **合計** | **~29.5GB** |
| **推論用残り** | **~18.5GB** |

**リクエストごとの推奨設定:**

| モデル | batch_size | duration | 活性化 | 判定 |
|--------|-----------|----------|--------|------|
| Turbo | 4 | 240s | ~14-18GB | ✅ ギリ OK |
| Turbo | 4 | 120s | ~8-10GB | ✅ 余裕 |
| SFT | 1 | 240s | ~6-8GB | ✅ 余裕 |
| SFT | 2 | 120s | ~6-8GB | ✅ 余裕 |
| SFT | 2 | 240s | ~12-16GB | ✅ OK |
| SFT | 4 | 120s | ~12-16GB | ✅ OK |
| SFT | 4 | 240s | ~24-32GB | ❌ OOM 危険 |

### パターン B：SFT のみ + LLM オフロード

```bash
ACESTEP_CONFIG_PATH=acestep-v15-xl-sft \
ACESTEP_OFFLOAD_TO_CPU=true \
ACESTEP_NO_INIT=false \
./start_api_server.sh
```

**静的 VRAM:** ~11.5GB（DiT 10G + T5 1.2G + VAE 0.3G）
**推論用残り:** ~36.5GB

| batch | duration | 活性化 | 判定 |
|-------|----------|--------|------|
| 4 | 240s | ~24-32GB | ✅ OK |
| 8 | 120s | ~24-32GB | ✅ OK |
| 8 | 240s | ~48-64GB | ❌ OOM |

### パターン C：Turbo のみ（最大スループット）

```bash
ACESTEP_CONFIG_PATH=acestep-v15-xl-turbo \
ACESTEP_NO_INIT=false \
./start_api_server.sh
```

**静的 VRAM:** ~19.5GB
**推論用残り:** ~28.5GB

| batch | duration | 活性化 | 判定 |
|-------|----------|--------|------|
| 4 | 240s | ~14-18GB | ✅ 余裕 |
| 8 | 120s | ~16-20GB | ✅ OK |
| 8 | 240s | ~28-36GB | ⚠️ ギリ |

## API リクエスト例

### モデル指定フィールド

`model` フィールドでリクエストごとにモデルを切り替える。
エイリアス: `model`, `model_name`, `modelName`, `dit_model`, `ditModel`

### XL Turbo でラフ生成

```json
{
  "model": "acestep-v15-xl-turbo",
  "batch_size": 4,
  "audio_duration": 120,
  "caption": "upbeat pop, female vocal, 120bpm, C major",
  "lyrics": "[verse]\nHello world..."
}
```

### XL SFT で高品質仕上げ

```json
{
  "model": "acestep-v15-xl-sft",
  "batch_size": 1,
  "audio_duration": 240,
  "caption": "upbeat pop, female vocal, 120bpm, C major",
  "lyrics": "[verse]\nHello world..."
}
```

### パラメータ一覧（主要）

| パラメータ | エイリアス | 型 | デフォルト | 備考 |
|-----------|-----------|-----|-----------|------|
| `model` | `model_name`, `dit_model` | string | primary handler | モデル選択 |
| `batch_size` | — | int | 2 | 1〜8（上限自動クランプ） |
| `audio_duration` | `duration`, `target_duration` | float | auto | 秒。0 以下は LLM 自動判定 |
| `guidance_scale` | — | float | モデル既定 | SFT のみ有効。Turbo は無視 |
| `inference_steps` | — | int | モデル既定 | Turbo は自動で 8 に制限 |

## サーバー側安全装置

| ガード | 内容 |
|--------|------|
| batch ハードキャップ | batch_size > 8 → 8 にクランプ |
| VRAM 動的ガード | duration × モデルサイズから必要 VRAM を推定し、空き VRAM に収まるよう batch を自動削減 |
| Turbo ステップ制限 | turbo モデルは inference_steps を自動で 8 に制限 |
| フォールバック | 指定モデルが見つからない場合はプライマリにフォールバック（エラーにならない） |

## 推奨ワークフロー（48GB 両モデル同時運用）

1. **Turbo batch=4** でラフ生成、方向性を確認（高速）
2. 気に入ったプロンプトを **SFT batch=1** で高品質仕上げ
3. 必要に応じて SFT の `guidance_scale` を調整してプロンプト忠実度を微調整

## 95GB GPU での運用（参考）

RTX PRO 6000 Blackwell (95GB) など：

- 両モデル同時ロードで静的 ~29.5GB、残り ~65GB
- Turbo batch=8, 240s も余裕
- SFT batch=4, 240s も余裕
- 事実上すべての組み合わせが制限なく動作

---

## Easy Music アプリ側の XL 対応

Easy Music（フロントエンド + バックエンド）は、2B / XL / 将来のモデルを区別なくサポートする
**動的モデル検出アーキテクチャ**を採用している。

### 動的モデルセレクター

起動時に ACE-Step サーバーの `/v1/models` エンドポイントを自動問い合わせし、
利用可能なモデルをドロップダウンに動的反映する。

```
                        ┌─────────────────────────────┐
   Easy Music (Browser) │  DOMContentLoaded            │
                        │    └→ loadAvailableModels()  │
                        │         └→ GET /api/models   │
                        └──────────┬──────────────────-┘
                                   ▼
                        ┌─────────────────────────────┐
   Easy Music (Python)  │  GET /api/models (proxy)     │
                        │    └→ ace_step_client        │
                        │         .get_models()        │
                        └──────────┬──────────────────-┘
                                   ▼
                        ┌─────────────────────────────┐
   ACE-Step Server      │  GET /v1/models              │
                        │  → { models: [...],          │
                        │     default_model: "..." }   │
                        └─────────────────────────────┘
```

#### `/v1/models` レスポンス例

```json
{
  "data": {
    "models": [
      { "name": "acestep-v15-turbo",    "is_default": true },
      { "name": "acestep-v15-base",     "is_default": false }
    ],
    "default_model": "acestep-v15-turbo"
  }
}
```

XL サーバーの場合：

```json
{
  "data": {
    "models": [
      { "name": "acestep-v15-xl-turbo", "is_default": true,  "is_loaded": true },
      { "name": "acestep-v15-xl-sft",   "is_default": false, "is_loaded": true }
    ],
    "default_model": "acestep-v15-xl-turbo"
  }
}
```

#### 表示ラベルの自動マッピング

モデル名に含まれるキーワードで表示ラベルが自動決定される：

| モデル名に含まれる文字列 | 日本語ラベル | 英語ラベル |
|------------------------|------------|-----------|
| `xl-turbo` | XL TURBO (高速) | XL TURBO (Fast) |
| `xl-sft` | XL SFT (高品質) | XL SFT (High Quality) |
| `xl-base` | XL Base (標準) | XL Base (Standard) |
| `turbo` | TURBO (高速) | TURBO (Fast) |
| `sft` | SFT (高品質) | SFT (High Quality) |
| `base` | Base (標準) | Base (Standard) |
| 上記以外 | モデル名をそのまま表示 | （同左） |

#### ロード状態の表示

- `is_loaded` が明示的に `false` → ラベル末尾に `⏳` マーク
- `is_loaded` が `true` または未定義 → マークなし（ロード済み扱い）

> **注意**: 古い ACE-Step バージョンでは `is_loaded` フィールドが返されない場合がある。
> その場合もロード済みとして扱い、`⏳` は表示しない。

#### フォールバック

サーバーに接続できない場合は、静的フォールバック選択肢を表示：

- `acestep-v15-xl-turbo` → TURBO (高速)
- `acestep-v15-xl-sft` → SFT (高品質)

### フロントエンド自動パラメータ調整

モデル切替時、以下のパラメータが自動調整される：

| パラメータ | Turbo 系 | SFT / Base 系 | 判定ロジック |
|-----------|----------|---------------|------------|
| STEP（推論ステップ） | 8 に自動設定 | 50 に自動設定 | `isTurboModel()` — 名前に `turbo` を含むか |
| guidance_scale (CFG) | 3.0（CFG は蒸留済みで不要） | 7.0（CFG で品質制御） | `needsCfgModel()` — 名前に `sft` または `base` を含むか |
| 曲数（バッチ） | 1 / 2 / 4 全て選択可 | 最大 2 に制限（4 は無効化） | `isSftModel()` — 名前に `sft` を含むか |

> **設計思想**: Turbo は蒸留モデルのため CFG 不要（guidance_scale を上げても効果がない）。
> SFT / Base は CFG が有効で、`guidance_scale` で品質とプロンプト忠実度を制御できる。

#### 判定関数一覧

```javascript
// CFG が必要なモデルか（SFT / Base 系）
function needsCfgModel(modelName) {
    const n = modelName.toLowerCase();
    return n.includes('sft') || n.includes('base');
}

// SFT 系か（バッチ制限の適用対象）
function isSftModel(modelName) {
    return modelName.toLowerCase().includes('sft');
}

// Turbo 系か（ステップ自動切替の判定）
function isTurboModel(modelName) {
    return modelName.toLowerCase().includes('turbo');
}
```

### バックエンド安全装置（SFT バッチクランプ）

Easy Music バックエンド（`routers/generate.py`）にも SFT モデル用のバッチ制限ガードがある。
フロントエンドのUI制限をバイパスした API 直接呼び出しでも OOM を防止する。

```python
SFT_MAX_BATCH_SIZE = 2

def clamp_batch_for_sft(model: Optional[str], batch_size: int) -> int:
    """SFT モデル選択時はバッチサイズを制限する（OOM 防止）"""
    if model and "sft" in model.lower() and batch_size > SFT_MAX_BATCH_SIZE:
        return SFT_MAX_BATCH_SIZE
    return batch_size
```

**適用箇所:**

| エンドポイント | 説明 |
|---------------|------|
| `POST /api/generate` | 通常の音楽生成 |
| `POST /api/generate_and_wait` | 同期版音楽生成 |
| `POST /api/generate_cover` | カバーモード |
| `POST /api/generate_repaint` | リペイントモード |

> **Base モデルへのバッチ制限は不適用**: Base は CFG ありだが、2B Base は XL SFT ほど
> VRAM を消費しないため、バックエンド側でのクランプは SFT 限定としている。

### 時間推定への反映

フロントエンドの生成時間推定（`estimateGenerationTime()`）もモデル種別を考慮する：

```javascript
const isSft = needsCfgModel(params.model);
// SFT/Base: ステップ数が多く CFG で実効バッチ×2 → 約 1.5 倍遅い
const ditTime = steps * duration * (isSft ? 0.009 : 0.006);
```

### 言語切替時のラベル更新

`applyI18n()` 時に `refreshModelLabels()` が呼ばれ、
動的に構築されたモデルセレクターのラベルも現在の言語（日本語 / English）に更新される。

### 変更ファイル一覧

| ファイル | 変更内容 |
|---------|---------|
| `templates/index.html` | モデル `<select>` を静的オプションから動的プレースホルダーに変更 |
| `static/app.js` | `loadAvailableModels()`, `getModelDisplayLabel()`, `needsCfgModel()`, `isSftModel()`, `isTurboModel()`, `applyModelBatchRestriction()`, `refreshModelLabels()` を追加。`getAceModel()` がフルモデル名を返すよう変更。全生成関数の `guidance_scale` 判定を `needsCfgModel()` に統一 |
| `routers/generate.py` | `clamp_batch_for_sft()` ガード関数を追加。全4エンドポイントに適用 |
