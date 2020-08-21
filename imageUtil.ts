/* eslint-disable vars-on-top */
/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable no-continue */
/* eslint-disable no-var */
/* eslint-disable no-loop-func */
/**
 * This handler retrieves the images from the clipboard as a base64 string and returns it in a callback.
 *
 * @param pasteEvent
 * @param callback
 */
export function retrieveImageFromClipboardAsFile(pasteEvent: any, callback: any) {
    if (pasteEvent.clipboardData == false) {
        if (typeof (callback) === 'function') {
            callback(undefined);
        }
    }

    const { items } = pasteEvent.clipboardData;

    if (items == undefined) {
        if (typeof (callback) === 'function') {
            callback(undefined);
        }
    }

    for (let i = 0; i < items.length; i++) {
        // Skip content if not image
        if (items[i].type.indexOf('image') == -1) continue;
        // Retrieve image on clipboard as blob
        const blob = items[i].getAsFile();

        callback(blob);
    }
}

export default null;
