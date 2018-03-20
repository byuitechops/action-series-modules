/* Dependencies */
const canvas = require('canvas-wrapper');

/* Actions */
var actions = [
    require('./actions/modules-publish-settings.js'),
    require('./actions/modules-naming-conventions.js'),
    require('./actions/modules-delete'), // Delete after running all child modules
];

class TechOps {
    constructor() {
        this.getHTML = getHTML;
        this.setHTML = setHTML;
        this.getPosition = getPosition;
        this.setPosition = setPosition;
        this.getTitle = getTitle;
        this.setTitle = setTitle;
        this.getID = getID;
        this.logs = [];
        this.delete = false;
        this.type = 'Module';
    }

    log(title, details) {
        this.logs.push({ title, details });
    }

    message(message) {
        this.logs.push({ title: 'message', details: { message: message }});
    }

    warning(warning) {
        this.logs.push({ title: 'warning', details: { warning: warning }});
    }

    error(error) {
        this.logs.push({ error: error });
    }
}

/* Retrieve all items of the type */
function getItems(course, callback) {
    /* Get all of the items from Canvas */
    canvas.getModules(course.info.canvasOU, (err, items) => {
        if (err) {
            callback(err);
            return;
        }
        /* Give each item the TechOps helper class */
        items.forEach(it => {
            it.techops = new TechOps();
        });

        callback(null, items);
    });
}

/* Build the PUT object for an item */
function buildPutObj(module) {
    return {
        'module': {
            'name': module.name,
            'published': module.published,
            'position': module.position,
        }
    };
}

function deleteItem(course, module, callback) {
    canvas.delete(`/api/v1/courses/${course.info.canvasOU}/modules/${module.id}`, (err) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, null);
    });
}

/* PUT an item back into Canvas with updates */
function putItem(course, module, callback) {
    if (module.techops.delete === true) {
        deleteItem(course, module, callback);
        return;
    }
    var putObj = buildPutObj(module);
    canvas.put(`/api/v1/courses/${course.info.canvasOU}/modules/${module.id}`, putObj, (err, newItem) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, newItem);
    });
}

function getHTML(item) {
    return null;
}

function setHTML(item, newHTML) {
    return null;
}

function getTitle(item) {
    return item.name;
}

function setTitle(item, newTitle) {
    item.name = newTitle;
}

function getPosition(item) {
    return item.position;
}

function setPosition(item, newPosition) {
    item.name = newPosition;
}

function getID(item) {
    return item.id;
}

module.exports = {
    actions: actions,
    getItems: getItems,
    putItem: putItem,
};