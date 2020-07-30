/**
 * Returns the day string for the int that is passed in. 
 * 0 is Sunday, 6 is Saturday.
 * @param {} i Integer representation of week day.
  */
function getDayString(i) {
    let result = "";
    switch(i) {
        case "0":
            result = "sunday";
            break;
        case "1":
            result = "monday";
            break;
        case "2":
            result = "tuesday";
            break;
        case "3":
            result = "wednesday";
            break;
        case "4":
            result = "thursday";
            break;
        case "5":
            result = "friday";
            break;
        case "6":
            result = "saturday";
            break;
        default:
            result = null;
            break;
    }
    return result;
}

function collectGetResults(items, requestedDay) {
    let result = {
        'roomCount':0,
        'rooms':{}
    };
    for(doc_idx in items) {
        if(items[doc_idx][requestedDay]) {
            const key = items[doc_idx]._id;
            result['rooms'][key] = {};
            result['rooms'][key].times = items[doc_idx][requestedDay];
            result['rooms'][key].building = items[doc_idx]['building'];
            result['rooms'][key].room = items[doc_idx]['room'];
        } else {
            const key = items[doc_idx]._id;
            result['rooms'][key] = {};
            result['rooms'][key].times = [];
            result['rooms'][key].building = items[doc_idx]['building'];
            result['rooms'][key].room = items[doc_idx]['room'];
        }
        result['roomCount'] += 1;
    }
    return result;
}

module.exports = {
    getDayString, 
    collectGetResults
}