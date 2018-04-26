module.exports = (course, module, callback) => {
    try {
        //only add the platforms your grandchild should run in
        var validPlatforms = ['online', 'pathway', 'campus'];
        var validPlatform = validPlatforms.includes(course.settings.platform);

        /* If the item is marked for deletion or isn't a valid platform type, do nothing */
        if (module.techops.delete === true || validPlatform !== true) {
            callback(null, course, module);
            return;
        }

        /* Modules to be published, in LOWER case */
        var publishSettings = [{
            name: /instructor\s*resources/i,
            publish: false
        }];

        /* The test returns TRUE or FALSE - action() is called if true */
        var found = publishSettings.find(item => item.name.test(module.name));

        /* This is the action that happens if the test is passed */
        function action() {
            module.published = found.publish;
            module.techops.log(`${module.techops.type} - Publish Settings`, {
                'Title': module.name,
                'ID': module.id
            });
            callback(null, course, module);
        }

        if (found !== undefined) {
            action();
        } else {
            callback(null, course, module);
        }
    } catch (e) {
        course.error(new Error(e));
        callback(null, course, module);
    }
};