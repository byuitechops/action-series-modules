module.exports = (course, module, callback) => {
    try {
        //only add the platforms your grandchild should run in
        var validPlatforms = ['online', 'pathway'];
        var validPlatform = validPlatforms.includes(course.settings.platform);

        /* If the item is marked for deletion or isn't a valid platform type, do nothing */
        if (module.techops.delete === true || validPlatform !== true) {
            callback(null, course, module);
            return;
        }

        /* Modules to be left alone, in LOWER case */
        var irrelevantModules = [{
            name: /student\s*resources/gi,
        }, {
            name: /instructor\s*resources/gi,
        }, {
            name: /welcome/gi,
        }, {
            name: /syllabus/gi,
        }];

        /* The test returns TRUE or FALSE - action() is called if true */
        var matchedIrrelevant = irrelevantModules.find(item => item.name.test(module.name));

        /* This is the action that happens if the test is passed */
        function action() {
            var weekNum = '';

            /* If the module doesn't have a name, move to the next grandchild */
            if (!module.name) {
                course.warning('This module has no name');
                callback(null, course, module);
                return;
            }

            var oldName = module.name;
            var moduleName = module.name;
            /* Get each word in the title */
            var titleArray = moduleName.split(' ');
            /* The title description will come after the lesson number */
            var titleDescription = moduleName.split(/\d+\D/)[1];

            /* Get the week number */
            /* Add 0 to week number if not present */
            titleArray.forEach((item, index) => {
                if (/(L|W)(1[0-4]|0?\d)(\D|$)/gi.test(item)) {
                    var eachChar = moduleName.split('');
                    eachChar.forEach(theChar => {
                        if (!isNaN(theChar) && theChar !== ' ') {
                            weekNum += theChar;
                        }
                    });

                    if (weekNum.length === 1) {
                        /* Add 0 to the beginning of the number if single digit */
                        weekNum = weekNum.replace(/^/, '0');
                    }

                } else if (/week|lesson/gi.test(item) && typeof titleArray[index + 1] !== 'undefined') {
                    /* Replace each non-digit with nothing */
                    weekNum = titleArray[index + 1].replace(/\D+/g, '');

                    if (weekNum.length === 1) {
                        /* Add 0 to the beginning of the number if single digit */
                        weekNum = weekNum.replace(/^/, '0');
                    }
                }
            });

            if (titleDescription) {
                module.name = `Week ${weekNum}: ${titleDescription.trim()}`;
            } else {
                module.name = `Week ${weekNum}`;
            }

            module.techops.log(`${module.techops.type} - Naming Conventions`, {
                'Old Title': oldName,
                'New Title': module.name,
                'ID': module.id
            });

            callback(null, course, module);
        }

        /* if the module title is a weekly module name, call action() */
        if (!matchedIrrelevant && /(Week|Lesson|L|W)\s*(\d*(\D|$))/gi.test(module.name)) {
            action();
        } else {
            callback(null, course, module);
        }
    } catch (e) {
        course.error(new Error(e));
        callback(null, course, module);
    }
};