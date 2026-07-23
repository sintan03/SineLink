import { world, system, ItemTypes, ItemType } from "@minecraft/server";
import { CustomForm } from "@minecraft/server-ui";

/*

let indexes = [];

const nameColor = {
    0: `§f`,
    1: `§a`,
    2: `§d`
};

function formMain(player) {
    const form = new ActionFormData().title({ translate: `form.sinetask.main.title` });
    const indexes = taskCheck();
    for (const index of indexes) {
        form.button({ translate: `sinetask.${taskData[index].checkId.split(`:`)[0]}.name` });
    };
    form.show(player).then(res => {
        if (res.canceled) return;
        formGroup(player, res.selection);
    });
};

function formGroup(player, index) {
    const form = new ActionFormData().title({ translate: `sinetask.${taskData[index].checkId.split(`:`)[0]}.name` });
    const groupAllTasks = taskData[index].tasks;
    const groupCompletedTasksAmount = groupAllTasks.filter(f => player.hasTag(`sinetask_${f.id}`)).length;
    let allCompleted = 0;
    if (groupCompletedTasksAmount === groupAllTasks.length) allCompleted = 1;
    form.body({ rawtext: [{ text: `${nameColor[allCompleted]}` }, { translate: `form.sinetask.group.completedamount` }, { text: ` ${groupCompletedTasksAmount} / ${groupAllTasks.length} (${Math.floor(1000 * groupCompletedTasksAmount / groupAllTasks.length) / 10}%%)§r§f\n` }] });
    for (const task of groupAllTasks) {
        let complate = `sinetask.uncomplate`;
        if (player.hasTag(`sinetask_${task.id}`)) complate = `sinetask.complate`;
        form.label({ rawtext: [{ translate: complate }, { text: nameColor[task.type] }, { translate: `sinetask.${task.id}.name` }, { text: `§r§f\n` }, { translate: `sinetask.${task.id}.description` }, { text: `\n\n` }] });
    };
    form.button({ translate: `form.sinetask.group.close` });
    form.show(player).then(res => {
        if (res.canceled) return;
    });
};

function taskCheck() {
    if (indexes[0] === undefined) {
        const ItemIds = ItemTypes.getAll();
        let i = -1;
        for (const checkIds of taskData) {
            i++
            if (!ItemIds.find(f => f.id === checkIds.checkId)) continue;
            indexes.push(i);
            continue;
        };
    };
    return indexes;
};

world.afterEvents.itemUse.subscribe(ev => {
    const { source, itemStack } = ev;
    const itemStackId = itemStack.typeId;
    if (itemStackId !== `minecraft:book`) return;
    formMain(source);
});

system.afterEvents.scriptEventReceive.subscribe(ev => {
    const id = ev.id.replace(`sinetask_`, ``);
    for (const tasks of taskData) {
        const find = tasks.tasks.find(f => f.id === id);
        if (find) {
            /** @type { server.Player } *//*
            const entity = ev.sourceEntity;
            if (!entity.hasTag(`sinetask_${find.id}`)) {
                entity.addTag(`sinetask_${find.id}`);
                switch (find.type) {
                    case 0:
                        world.sendMessage({ translate: `sinetask.task.message`, with: { rawtext: [{ text: entity.name }, { translate: `sinetask.${find.id}.name` }] } });
                        break;
                    case 1:
                        world.sendMessage({ translate: `sinetask.goal.message`, with: { rawtext: [{ text: entity.name }, { translate: `sinetask.${find.id}.name` }] } });
                        break;
                    case 2:
                        world.sendMessage({ translate: `sinetask.challenge.message`, with: { rawtext: [{ text: entity.name }, { translate: `sinetask.${find.id}.name` }] } });
                        system.runTimeout(() => entity.playSound(`sinetask.ui.toast.challenge_complete`, entity.location), 20);
                        break;
                };
                entity.playSound(`sinetask.ui.toast.in`, entity.location);
                system.runTimeout(() => entity.playSound(`sinetask.ui.toast.out`, entity.location), 140);
            };
        };
        break;
    };
});
*/