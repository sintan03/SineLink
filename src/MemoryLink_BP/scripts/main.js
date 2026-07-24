import { world, system, ItemTypes, ItemType } from "@minecraft/server";
import { CustomForm } from "@minecraft/server-ui";

import { linkData } from "./data.js";

import "./task.js";



system.afterEvents.scriptEventReceive.subscribe(ev => {

    const { id, message } = ev;

    if (id === `memorylink:link`) {

        const data = JSON.parse(message);
        linkData[data.id] = data;

    };
    
});



system.runTimeout(() => {

    for (const key of Object.keys(linkData)) {

        if (key === `memorylink`) continue;

        const data = linkData[key];
        world.sendMessage(`§r§a${data.name} §eの導入に成功しました\nバージョン: §a${data.version.join(".")}\n§e要求アドオン: §a\n${data.features.map(value => `${linkData[value.id].name}: ${value.version.join(".")}`).join("\n")}`);

    };

}, 100);