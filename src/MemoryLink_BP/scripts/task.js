import { world, system, Player } from "@minecraft/server";
import { CustomForm, ObservableBoolean, ObservableUIRawMessage } from "@minecraft/server-ui";

import { ITEMS, nameColor, taskData } from "./data.js";



world.afterEvents.itemUse.subscribe(ev => {

    const { source, itemStack } = ev;
    const itemId = itemStack.typeId;

    if (itemId === ITEMS.taskBook) {

        source.runCommand(`scriptevent memorylink:task_achieve memorylink_taskbook`);

        const title = new ObservableUIRawMessage({ translate: `memorylink.task.title` }, { clientWritable: true });
        const form = new CustomForm(source, title);

        /** @type { import("@minecraft/server").RawMessage } */
        const headerDefault = { translate: `memorylink.task.header.default` };
        const header = new ObservableUIRawMessage({ rawtext: [{ translate: `memorylink.task.header.default` }, { text: `\n` }] }, { clientWritable: true });
        const headerVisible = new ObservableBoolean(true, { clientWritable: true });
        form.header(header, { visible: headerVisible });

        /** @type { ObservableUIRawMessage[] } */
        const buttonsLabel = [];

        /** @type { ObservableUIRawMessage[] } */
        const completedLabel = [];
        /** @type { ObservableBoolean[] } */
        const completedLabelVisible = [];

        /** @type { ObservableUIRawMessage[][] } */
        const tasksLabel = [];
        /** @type { ObservableBoolean[][] } */
        const tasksLabelVisible = [];

        for (let i = 0; i < taskData.length; i++) {

            const tasksComplated = taskData[i].tasks.map(value => {
                return source.hasTag(`memorylink_task_${taskData[i].id}_${value.id}`);
            });
            const tasksComplatedAmount = tasksComplated.reduce((previous, current) => previous + (current ? 1 : 0), 0);

            buttonsLabel.push(new ObservableUIRawMessage({ rawtext: [{ translate: `memorylink.task.header.${taskData[i].id}` }, { text: `\n` }] }, { clientWritable: true }));
            form.button(buttonsLabel[i], () => {

                for (let k = 0; k < completedLabelVisible.length; k++) {

                    if (i === k) {

                        if (completedLabelVisible[k].getData()) {
                            header.setData({ rawtext: [{ translate: `memorylink.task.header.default` }, { text: `\n` }] });
                        } else {
                            header.setData({ rawtext: [{ translate: `memorylink.task.header.${taskData[i].id}` }, { text: `\n` }] });
                        };

                        completedLabelVisible[k].setData(!completedLabelVisible[k].getData());
                        for (let l = 0; l < tasksLabelVisible[k].length; l++) {
                            tasksLabelVisible[k][l].setData(!tasksLabelVisible[k][l].getData());
                        };

                    } else {

                        completedLabelVisible[k].setData(false);
                        for (let l = 0; l < tasksLabelVisible[k].length; l++) {
                            tasksLabelVisible[k][l].setData(false);
                        };

                    };

                };

            });

            completedLabel.push(new ObservableUIRawMessage({
                rawtext: [
                    { text: `\n` },
                    { translate: `memorylink.task.completedamount` },
                    { text: `${tasksComplatedAmount}/${tasksComplated.length} (${Math.round(tasksComplatedAmount / tasksComplated.length * 10000) / 100}%)\n` },
                ]
            }, { clientWritable: true }));
            completedLabelVisible.push(new ObservableBoolean(false, { clientWritable: true }));
            form.label(completedLabel[i], { visible: completedLabelVisible[i] });

            tasksLabel.push([]);
            tasksLabelVisible.push([]);

            for (let j = 0; j < taskData[i].tasks.length; j++) {

                tasksLabel[i][j] = new ObservableUIRawMessage({
                    rawtext: [
                        { translate: `memorylink.task.${tasksComplated[j] ? "complate" : "uncomplate"}` },
                        { text: nameColor[taskData[i].tasks[j].type] },
                        { translate: `memorylink.task.${taskData[i].id}.${taskData[i].tasks[j].id}.name` },
                        { text: `§r§f\n` },
                        { translate: `memorylink.task.${taskData[i].id}.${taskData[i].tasks[j].id}.description` },
                        { text: `\n` },
                    ]
                }, { clientWritable: true });
                tasksLabelVisible[i][j] = new ObservableBoolean(false, { clientWritable: true });
                form.label(tasksLabel[i][j], { visible: tasksLabelVisible[i][j] });

            };

        };

        form.closeButton();

        form.show();

    };

});

system.afterEvents.scriptEventReceive.subscribe(ev => {

    const { sourceEntity, id, message } = ev;

    if (id === `memorylink:task_achieve`) {

        if (!sourceEntity || !(sourceEntity instanceof Player)) return;

        const tagName = `memorylink_task_${message}`;
        if (!sourceEntity.hasTag(tagName)) {

            const messageSplit = message.split("_");
            const taskId = messageSplit[0];
            const taskName = messageSplit.filter((value, index) => index !== 0).join("_");
            const foundData = taskData.find(value => value.id === taskId).tasks.find(value => value.id === taskName);
            if (!foundData) return;
            
            const taskType = foundData.type;

            world.sendMessage({ translate: `memorylink.task.${taskType}.message`, with: { rawtext: [{ text: sourceEntity.nameTag }, { translate: `memorylink.task.${taskId}.${taskName}.name` }] } });
            sourceEntity.addExperience(foundData.xp || 0);
            sourceEntity.playSound(`sinetask.ui.toast.in`, sourceEntity.location);
            system.runTimeout(() => {
                sourceEntity.playSound(`sinetask.ui.toast.out`, sourceEntity.location);
            }, 140);
            if (taskType === 2) {
                system.runTimeout(() => {
                    sourceEntity.playSound(`sinetask.ui.toast.challenge_complete`, sourceEntity.location);
                }, 20);
            };
            sourceEntity.addTag(tagName);

        };

    } else if (id === `memorylink:task_add`) {

        const parsed = JSON.parse(message);
        const foundData = taskData.find(value => value.id === parsed.id);
        if (foundData === undefined) {
            taskData.push(parsed);
        } else {
            foundData.tasks.push(...parsed.tasks);
        };

    };

});

world.afterEvents.playerSpawn.subscribe(ev => {

    const { player, initialSpawn } = ev;
    if (!initialSpawn) return;
    if (!player.hasTag(`memorylink_initial`)) {

        player.runCommand(`give @s memorylink:task_book`);
        player.addTag(`memorylink_initial`);

    };

});