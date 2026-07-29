# MemoryLink

連携システム

連携の情報を送るにはscripteventを使用します
id:"memorylink:link"
送信するデータ(JSON.stringify()で文字列化してmessageで送信)
{
    id: "memorylink", // namespaceのようなもの、アンダーバーも使えるかもしれない
    name: "MemoryLink", // 表示用の名前
    version: [1, 0, 0], // 送信元のアドオンのバージョン(manifestのではなくてもよい、連携部分のシステムが変わったときに変更する)
    features: [ // 前提アドオン、複数書ける
        {
            id: "linktest", // 前提アドオンのid
            name: "LinkTest", // 前提アドオンの名前(違ってもよい)
            version: [1, 0, 0] // 要求するバージョン
        }
    ]
}

正常に導入出来れば"scriptevent memorylink:link_success [id]"が実行されます、上手くいじってあげてください



進捗システム

やっぱりscriptevent
id:"memorylink:task_add"
{
    id: "memorylink", // 翻訳キーに使う
    tasks: [ // 進捗データ、複数書ける
        {
            id: "taskbook", // 翻訳キーに使う
            type: 0, // 進捗:0, 目標:1, 挑戦:2
            xp: 0 // そのまま
        }
    ]
}

headerの翻訳キー:"memorylink.task.header.[id]"
進捗名の翻訳キー:"memorylink.task.[id].[tasks.id].name"
説明文の翻訳キー:"memorylink.task.[id].[tasks.id].description"

同時に入れなくてもよい(データのidが同じなら続きに追加してくれる)