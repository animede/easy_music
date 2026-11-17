= Easy Music環境変数一覧

//table[chap97t001][Easy Music 環境変数一覧]{
環境変数	型	デフォルト値	CLI引数
------------
ACESTEPAPI_URL	string	http://localhost:8001	--ace-url
ACESTEPAPI_KEY	string	""	—
OPENAIBASEURL	string	http://localhost:11434/v1	--llm-url
OPENAIAPIKEY	string	YOUROPENAIAPI_KEY	—
OPENAICHATMODEL	string	gemma4:latest	--llm-model
USELOCALLLM_ONLY	boolean	false	--local-llm
IMAGEGENERATIONURL	string	http://IMAGE_SERVER_IP:64656	--img-url
IMAGEGENERATIONFALLBACK_URL	string	http://FALLBACK_SERVER_IP:64656	--img-fallback-url
IMAGEGENERATIONTIMEOUT	float	90.0	—
IMAGEGENERATIONHEALTHCHECKINTERVAL	float	30.0	--img-health-interval
HOST	string	0.0.0.0	--host
PORT	integer	8889	--port
DEBUG	boolean	true	--no-reload
POLL_INTERVAL	float	1.0	—
POLL_TIMEOUT	float	300.0	—
DEFAULTAUDIODURATION	integer	60	—
DEFAULT_BPM	integer	120	—
DEFAULT_LANGUAGE	string	ja	—
//}
//blankline

 * ACESTEPAPI_URL：ACE-Step APIのURL
 * ACESTEPAPI_KEY：Bearer Token認証キー
 * OPENAIBASEURL：外部LLMのベースURL
 * OPENAIAPIKEY：外部LLMのAPIキー
 * OPENAICHATMODEL：外部LLMのモデル名
 * USELOCALLLM_ONLY：外部LLM不使用
 * IMAGEGENERATIONURL：背景画像生成APIのURL
 * IMAGEGENERATIONFALLBACK_URL：背景画像生成APIのフォールバックURL
 * IMAGEGENERATIONTIMEOUT：背景画像生成タイムアウト（秒）
 * IMAGEGENERATIONHEALTHCHECKINTERVAL：背景画像生成APIのヘルスチェック間隔（秒）
 * HOST：サーバーホスト
 * PORT：サーバーポート
 * DEBUG：ホットリロード
 * POLL_INTERVAL：ポーリング間隔（秒）
 * POLL_TIMEOUT：ポーリングタイムアウト（秒）
 * DEFAULTAUDIODURATION：デフォルト生成秒数
 * DEFAULT_BPM：デフォルトBPM
 * DEFAULT_LANGUAGE：デフォルト言語

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
