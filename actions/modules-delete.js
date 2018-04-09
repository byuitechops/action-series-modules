module.exports = (course, module, callback) => {

    /* Modules to be deleted, in LOWER case */
    var doomedItems = [
        /\s*welcome\s*/gi,
        /^\s*resources\s*$/gi,  // ^ and $ to prevent it from deleting "Student Resources" and "Instructor Resources"
        /I-?Learn\s*(3\.0)?\s*Tour/gi,
    ];

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

};
