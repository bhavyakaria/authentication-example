export default function isObjectValid(object: any) {
    let isValid = true;
    for (const key in object) {
        if (object[key] == undefined || object[key] == null || object[key] == "") {
            isValid = false;
            break;
        }
    }
    return isValid;
}