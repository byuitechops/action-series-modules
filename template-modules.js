/* Dependencies */
const canvas = require('canvas-wrapper');

/* Actions */
var actions = [
    require('../actions/modules-publish-settings.js'),
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
        this.delete = false;
        this.type = 'Module';
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
        'name': module.display_name,
        'published': module.published,
        'unlock_at': module.unlock_at,
        'position': module.position
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
    if (module.delete == true) {
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