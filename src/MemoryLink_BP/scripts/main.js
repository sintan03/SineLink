import { world, system, ItemTypes, ItemType } from "@minecraft/server";
import { CustomForm } from "@minecraft/server-ui";

import { linkData } from "./data.js";

import "./task.js";

/*

連携システム

連携の情報を送るにはscripteventを使用します
idは"memorylink:link"です
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

残念ながら、このアドオンには正常に導入されたか確認する機能はまだないので、自分で確認する必要がある

*/

system.runTimeout(() => {

    const init = JSON.stringify({
        id: "memorylink",
        name: "MemoryLink",
        version: [1, 0, 0],
        features: []
    });

    system.sendScriptEvent(`memorylink:link`, init);

}, 10);

system.afterEvents.scriptEventReceive.subscribe(ev => {

    const { id, message } = ev;

    if (id === `memorylink:link`) {

        const data = JSON.parse(message);
        linkData[data.id] = data;

    };

});

world.afterEvents.playerSpawn.subscribe(ev => {

    const { player, initialSpawn } = ev;
    if (!initialSpawn) return;

    system.runTimeout(() => {

        let i = 0;
        for (const key of Object.keys(linkData)) {

            i++;

            /** @type { { id: String, name: String, version: Number[], features: { id: String, name: String, version: Number[] }[] } } */
            const data = linkData[key];
            const success = data.features.every(value => {
                let forceTrue = false;
                return value.version.every((element, index) => {
                    if (!forceTrue) {
                        forceTrue = element < (linkData[value.id]?.version[index] ?? -1);
                    };
                    if (forceTrue) return true;
                    return element === (linkData[value.id]?.version[index] ?? -1);
                });
            });

            player.sendMessage({
                rawtext: [{
                    translate: `memorylink.link.${success ? "success" : "fail"}`, with: {
                        rawtext: [
                            {
                                text: `${data.name}`
                            },
                            {
                                text: `${data.version.join(".")}`
                            },
                            {
                                text: `${data.features.length === 0 ? "" : "\n"}${data.features.map(value => `§d${value.name}: ${value.version.join(".")}`).join("\n")}`
                            }
                        ]
                    },
                },
                {
                    text: `${i === Object.keys(linkData).length ? "\n§e------------" : ""}`
                }]
            });

        };

    }, 100);

});