'use strict';

const DEBUG_MODE = process.env.DEBUG_MODE;
const LOG_LEVEL = process.env.LOG_LEVEL; //2:debug, 1:info, 0: error

function logger(log, level) {
    
    var levels = {
        'DEBUG': 2,
        'INFO': 1,
        'ERROR': 0
    };
    var allowedLevel = (LOG_LEVEL === 'INFO' || LOG_LEVEL === 'ERROR' || LOG_LEVEL === 'DEBUG') ? LOG_LEVEL : 'DEBUG';
    var l = (level === 'INFO' || level === 'ERROR' || level === 'DEBUG') ? l = level : l = 'DEBUG';

    if (DEBUG_MODE==true && (levels[l] <= levels[allowedLevel])) {
        var d = new Date();
        console.log(d, l, (typeof (log) == 'object') ? JSON.stringify(log) : log);
    }

}

module.exports = logger;