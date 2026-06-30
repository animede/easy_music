= Easy Music環境変数一覧

//table[chap97t001][Easy Music 環境変数一覧]{
環境変数	型	デフォルト値	CLI引数	説明
------------
ACESTEPAPI_URL	string	http://localhost:8001	--ace-url	ACE-Step APIのURL
ACESTEPAPI_KEY	string	""	—	Bearer Token認証キー
OPENAIBASEURL	string	http://localhost:11434/v1	--llm-url	外部LLMのベースURL
OPENAIAPIKEY	string	YOUROPENAIAPI_KEY	—	外部LLMのAPIキー
OPENAICHATMODEL	string	gemma4:latest	--llm-model	外部LLMのモデル名
USELOCALLLM_ONLY	boolean	false	--local-llm	外部LLM不使用
IMAGEGENERATIONURL	string	http://IMAGE_SERVER_IP:64656	--img-url	背景画像生成APIのURL
IMAGEGENERATIONFALLBACK_URL	string	http://FALLBACK_SERVER_IP:64656	--img-fallback-url	背景画像生成APIのフォールバックURL
IMAGEGENERATIONTIMEOUT	float	90.0	—	背景画像生成タイムアウト（秒）
IMAGEGENERATIONHEALTHCHECKINTERVAL	float	30.0	--img-health-interval	背景画像生成APIのヘルスチェック間隔（秒）
HOST	string	0.0.0.0	--host	サーバーホスト
PORT	integer	8889	--port	サーバーポート
DEBUG	boolean	true	--no-reload	ホットリロード
POLL_INTERVAL	float	1.0	—	ポーリング間隔（秒）
POLL_TIMEOUT	float	300.0	—	ポーリングタイムアウト（秒）
DEFAULTAUDIODURATION	integer	60	—	デフォルト生成秒数
DEFAULT_BPM	integer	120	—	デフォルトBPM
DEFAULT_LANGUAGE	string	ja	—	デフォルト言語
//}
//blankline

== CLI引数とホスト/ポート分割指定

//table[chap97t002][CLI引数とホスト/ポート分割指定の一覧]{
目的	フルURL指定	ホスト/ポート分割指定
------------
ACE-Step API	--ace-url http://ACE_STEP_SERVER_IP:8001	--ace-host ACE_STEP_SERVER_IP --ace-port 8001
外部LLM	--llm-url http://localhost:11434/v1	--llm-host localhost --llm-port 11434
画像生成API	--img-url http://IMAGE_SERVER_IP:64656	--img-host IMAGE_SERVER_IP --img-port 64656
//}
//blankline


付録案内: 続く付録Hでは、Easy Musicの全APIエンドポイントの完全リファレンスをまとめます。

//blankline
