module.exports = (course, module, callback) => {

    /* If the item is marked for deletion, do nothing */
    if (module.techops.delete == true) {
        callback(null, course, module);
        return;
    }

    /* Pages to be deleted, in LOWER case */
    var publishSettings = [{
        name: /instructor\s*resources/i,
        publish: false
    }];

    /* The test returns TRUE or FALSE - action() is called if true */
    var found = publishSettings.find(item => item.name.test(module.name));

    /* This is the action that happens if the test is passed */
    function action() {
        module.published = found.publish;
        course.log(`${module.techops.type} - Publish Settings`, {
            'Title': module.name,
            'ID': module.id
        });
        callback(null, course, module);
    }

    if (found != undefined) {
        action();
    } else {
        callback(null, course, module);
    }

};
