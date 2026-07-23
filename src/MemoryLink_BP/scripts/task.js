import { world, system } from "@minecraft/server";
import { CustomForm, ObservableBoolean, ObservableUIRawMessage } from "@minecraft/server-ui";

import { ITEMS, linkData, taskData } from "./data.js";



world.afterEvents.itemUse.subscribe(ev => {

    const { source, itemStack } = ev;
    const itemId = itemStack.typeId;

    if (itemId === ITEMS.taskBook) {

        const title = new ObservableUIRawMessage({ translate: `memorylink.task.form.title` }, { clientWritable: true });
        const form = new CustomForm(source, title);

        /** @type { import("@minecraft/server").RawMessage } */
        const headerDefault = { translate: `memorylink.task.form.header.default` };
        const header = new ObservableUIRawMessage({ translate: `memorylink.task.form.header.default` }, { clientWritable: true });
        const headerVisible = new ObservableBoolean(true, { clientWritable: true });
        form.header(header, { visible: headerVisible });

        /** @type { ObservableUIRawMessage[] } */
        const buttonsLabel = [];

        /** @type { ObservableUIRawMessage[][] } */
        const tasksLabel = [];
        for (let i = 0; i < taskData.length; i++) {

            if (linkData.includes(taskData[i].id)) {

                buttonsLabel.push(new ObservableUIRawMessage({ translate: `memorylink.task.form.header.default` }, { clientWritable: true }));
                form.button(buttonsLabel[buttonsLabel.length - 1], () => {

                });

                for (let j = 0; j < taskData[i].tasks.length; j++) {

                    tasksLabel.push(new ObservableUIRawMessage({ rawtext: [{
                        translate: `memorylink.task.${taskData[i].id}.${taskData[i].tasks[j].id}.name`
                    }]}, { clientWritable: true }));
                    
                };

            };

        };

    };

});