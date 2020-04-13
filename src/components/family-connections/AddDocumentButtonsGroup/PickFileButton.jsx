import React from 'react';
import Button from './Button';
import PickFileIcon from './PickFileIcon';
import * as DocumentPicker from 'expo-document-picker';
import convertFileToMedia from './convertFileToMedia';
import PickFileLabel from './PickFileLabel';

/**********************************************************/

export default function PickFileButton({ afterAccept }) {
    function pickFile() {
        DocumentPicker.getDocumentAsync({
            /* MIME type */
            type: '*/*',
            /* whether to cache file for other expo APIs to use */
            copyToCacheDirectory: false,
            /* whether to let user select multiple files */
            multiple: false,
        })
            .then((file) => {
                if (file.type === 'success') {
                    afterAccept(convertFileToMedia(file));
                }
            })
            .catch((error) => {
                console.error('--- There was a problem selecting a file. ---');
                console.log(error);
            });
    }

    return (
        <Button onPress={pickFile} testID="pick-file-button">
            <PickFileIcon />
            <PickFileLabel />
        </Button>
    );
}
