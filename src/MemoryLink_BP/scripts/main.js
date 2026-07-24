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

        world.sendMessage({
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
                            text: `${data.features.map(value => `§d${value.name}: ${value.version.join(".")}`).join("\n")}`
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