import cockpit from 'cockpit';

class Nut {
    getAllUps() {
        return new Promise((resolve, reject) => {
            this.getUpsList()
                    .then(upsList => {
                        const promises = upsList.map(ups => {
                            return this.getUpsVariables(ups.name);
                        });

                        Promise.all(promises)
                                .then(allUpsVariables => {
                                    for (let i = 0; i < upsList.length; i++) {
                                        upsList[i].variables = allUpsVariables[i];
                                    }
                                    resolve(upsList);
                                });
                    });
        });
    }

    getUpsList() {
        return new Promise((resolve, reject) => {
            const upsList = [];
            cockpit.spawn(["upsc", "-L"])
                    .stream(data => {
                        data.split("\n").forEach(line => {
                            if (line !== "") {
                                const nameDesc = line.split(": ");
                                upsList.push({
                                    name: nameDesc[0],
                                    description: nameDesc[1]
                                });
                            }
                        });
                    })
                    .then(() => {
                        resolve(upsList);
                    })
                    .catch(reject);
        });
    }

    getUpsVariables(upsName) {
        return new Promise((resolve, reject) => {
            let upsVariables = {};
            cockpit.spawn(["upsc", upsName])
                    .stream(data => {
                        upsVariables = this.mergeObj(upsVariables, this.parseUpscInfoOutput(data));
                    })
                    .then(() => {
                        resolve(upsVariables);
                    })
                    .catch(reject);
        });
    }

    parseUpscInfoOutput(data) {
        let ups = {};
        data.split("\n").forEach(line => {
            ups = this.mergeObj(ups, this.parseLine(line));
        });
        return ups;
    }

    mergeObj(obj1, obj2) {
        if (obj2 == null) {
            return obj1;
        }

        const objMerged = obj1;

        Object.keys(obj2).forEach(key => {
            if (Object.keys(objMerged).includes(key)) {
                this.mergeObj(objMerged[key], obj2[key]);
            } else if (typeof objMerged === 'object') {
                objMerged[key] = obj2[key];
            } else {
                // FIXME : Find a solution for this...
            }
        });

        return objMerged;
    }

    parseLine(line) {
        if (line.length === 0) {
            return null;
        }

        const keyValue = line.split(": ");
        const keys = keyValue[0].split(".");
        const value = keyValue[1];

        const obj = {};

        if (!Array.isArray(keys)) {
            obj[keys] = value;
            return obj;
        }

        let parent = obj;
        keys.forEach(function(key, index, array) {
            if (index === array.length - 1) {
                parent[key] = value;
            } else {
                parent[key] = {};
                parent = parent[key];
            }
        });

        return obj;
    }
}

export default Nut;
