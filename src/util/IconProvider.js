import * as mdiIcons from '@mdi/js';
import Helper from './Helper';

export const icons = () => {
    const iconOptions = [];
    let count = 0;
    const limit = 100;
    for (const key in mdiIcons) {
        if (key.includes('mdi')) {
            iconOptions.push(Helper.camelCaseToKebabCase(key));
            count++;
            if (count >= limit) {
                break;
            }
        }
    }
    return iconOptions;
}

// const iconOptions = [
//     'mdi-folder',
//     'mdi-folder-outline',
//     'mdi-folder-multiple',
//     'mdi-folder-multiple-outline',
//     'mdi-folder-plus',
//     'mdi-folder-plus-outline',
//     'mdi-folder-star',
//     'mdi-folder-star-outline',
//     'mdi-folder-heart',
//     'mdi-folder-heart-outline',
//     'mdi-folder-lock',
//     'mdi-folder-lock-outline',
//     'mdi-folder-cog',
//     'mdi-folder-cog-outline',
//     'mdi-folder-settings',
//     'mdi-folder-settings-outline',
//     'mdi-folder-sync',
//     'mdi-folder-sync-outline',
//     'mdi-folder-search',
//     'mdi-folder-search-outline',
//     'mdi-folder-download',
//     'mdi-folder-download-outline',
//     'mdi-folder-upload',
//     'mdi-folder-upload-outline',
//     'mdi-folder-move',
//     'mdi-folder-move-outline',
//     'mdi-folder-copy',
//     'mdi-folder-copy-outline',
//     'mdi-folder-remove',
//     'mdi-folder-remove-outline',
//     'mdi-folder-open',
//     'mdi-folder-open-outline',
//     'mdi-folder-zip',
//     'mdi-folder-zip-outline',
//     'mdi-folder-alert',
//     'mdi-folder-alert-outline',
//     'mdi-folder-check',
//     'mdi-folder-check-outline',
//     'mdi-folder-clock',
//     'mdi-folder-clock-outline',
//     'mdi-folder-cancel',
//     'mdi-folder-cancel-outline',
//     'mdi-folder-edit',
//     'mdi-folder-edit-outline',
//     'mdi-folder-key',
//     'mdi-folder-key-outline',
//     'mdi-folder-marker',
//     'mdi-folder-marker-outline',
//     'mdi-folder-minus',
//     'mdi-folder-minus-outline',
//     'mdi-folder-network',
//     'mdi-folder-network-outline',
//     'mdi-folder-off',
//     'mdi-folder-off-outline',
//     'mdi-folder-pound',
//     'mdi-folder-pound-outline',
//     'mdi-folder-question',
//     'mdi-folder-question-outline',
//     'mdi-folder-refresh',
//     'mdi-folder-refresh-outline',
//     'mdi-folder-remove',
//     'mdi-folder-remove-outline',
//     'mdi-folder-restore',
//     'mdi-folder-restore-outline',
//     'mdi-folder-table',
//     'mdi-folder-table-outline',
//     'mdi-folder-text',
//     'mdi-folder-text-outline',
//     'mdi-folder-wrench',
//     'mdi-folder-wrench-outline'
// ];
