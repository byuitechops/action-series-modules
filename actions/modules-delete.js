/******************************************************************************
 * Modules Delete
 * Description: Create an array of module titles and set their delete 
 * attribute on the TechOps class to true. If the delete attribute is set to 
 * true, the module will be deleted in action-series-master main.js 
 ******************************************************************************/
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

        /* Modules to be deleted, in LOWER case */
        var doomedItems = [];
        if (course.settings.platform === 'campus') {
            doomedItems = [
                /I-?Learn\s*(3\.0)?\s*Tour/gi,
            ];
        } else {
            doomedItems = [
                /\s*welcome\s*/gi,
                /^\s*resources\s*$/gi, // ^ and $ to prevent it from deleting "Student Resources" and "Instructor Resources"
            ];
        }

        /* The test returns TRUE or FALSE - action() is called if true */
        var found = doomedItems.find(item => item.test(module.name));

        /* This is the action that happens if the test is passed */
        function action() {
            module.techops.delete = true;
            module.techops.log('Modules - Deleted', {
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