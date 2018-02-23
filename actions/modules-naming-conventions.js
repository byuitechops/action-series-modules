module.exports = (course, module, callback) => {

    /* If the item is marked for deletion, or if it already matches the naming convention, do nothing */
    if (module.techops.delete === true || /^week\s(0[1-9]|1[0-4])$/gi.test(moduleTitle)) {
        callback(null, course, module);
        return;
    }

    /* Modules to be left alone, in LOWER case */
    var irrelevantModules = [{
        name: /student\s*resources/gi,
    }, {
        name: /instructor\s*resources/gi,
    }];

    /* The test returns TRUE or FALSE - action() is called if true */
    var matchedIrrelevant = irrelevantModules.find(item => item.name.test(module.name));

    /* This is the action that happens if the test is passed */
    function action() {
        var weekNum = 0;
        var moduleTitle = module.name;
        var titleArray = moduleTitle.split(' ');
    
        /* Get the week number */
        /* Add 0 to week number if not present */
        titleArray.forEach((item, index) => {
            if (/week/gi.test(item) || /lesson/gi.test(item)) {
                /* Replace each non-digit with nothing */
                weekNum = titleArray[index + 1].replace(/\D+/g, '');
    
                if (weekNum.length === 1) {
                    /* Add 0 to the beginning of the number if single digit */
                    weekNum = weekNum.replace(/^/, '0');
                }
            }
        });

        module.name = `Week ${weekNum}`;
        course.log(`${module.techops.type} - Naming Conventions`, {
            'Title': module.name,
            'ID': module.id
        });
        callback(null, course, module);
    }

    /* if the module title is a weekly module name, call action() */
    if (!matchedIrrelevant && /(Week|Lesson)\s*(1[0-4]|0?\d(\D|$))/gi.test(moduleTitle)) {
        action();
    } else {
        callback(null, course, module);
    }

};