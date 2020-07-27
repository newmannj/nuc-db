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
            result = "fail"
            break;
    }
    return result;
}

function collectGetResults(items, requestedDay) {
    let result = {};
    for(doc_idx in items) {
        if(items[doc_idx][requestedDay]) {
            const key = items[doc_idx]._id;
            result[key] = {};
            result[key].times = items[doc_idx][requestedDay];
            result[key].building = items[doc_idx]['building'];
            result[key].room = items[doc_idx]['room'];
        } else {
            const key = items[doc_idx]._id;
            result[key] = {};
            result[key].times = [];
            result[key].building = items[doc_idx]['building'];
            result[key].room = items[doc_idx]['room'];
        }
    }
    return result;
}

module.exports = {
    getDayString, 
    collectGetResults
}