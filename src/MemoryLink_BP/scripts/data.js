export const ITEMS = {
    taskBook: "memorylink:task_book"
};

export const taskData = [
    {
        id: "memorylink",
        tasks: [
            {
                id: "taskbook",
                type: 0
            }
        ]
    }
];

export const nameColor = {
    0: `§f`,
    1: `§a`,
    2: `§d`
};

/** @type { Record<String, { id: String, name: String, version: Number[], features: { id: String, name: String, version: Number[] }[] }> } */
export let linkData = {};