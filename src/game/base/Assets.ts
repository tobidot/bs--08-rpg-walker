import { AssetManager } from "../../library";
import arwin_north_east from "../../../../assets/images/arwin-the-swordsman/arwin-the-swordsman-north-east.png";
import arwin_north_west from "../../../../assets/images/arwin-the-swordsman/arwin-the-swordsman-north-west.png";
import arwin_south_east from "../../../../assets/images/arwin-the-swordsman/arwin-the-swordsman-south-east.png";
import arwin_south_west from "../../../../assets/images/arwin-the-swordsman/arwin-the-swordsman-south-west.png";
import tower from "../../../../assets/images/tower.png";
import heart from "../../../../assets/images/heart.png";
import coin from "../../../../assets/images/coin.png";
import slime_west from "../../../../assets/images/slime/slime-left.png";
import slime_east from "../../../../assets/images/slime/slime-right.png";
import select from "../../../../assets/sounds/select.wav";
import slime_dead from "../../../../assets/sounds/slime-dead.wav";

export const Assets = {
    images: {
        arwin: {
            north_east: arwin_north_east,
            north_west: arwin_north_west,
            south_east: arwin_south_east,
            south_west: arwin_south_west,
        },
        slime: {
            east: slime_east,
            west: slime_west,
        },
        tower: {
            default: tower
        },
        hud: {
            heart,
            coin,
        }
    },
    sounds: {
        select,
        slime_dead
    },
    musics: {
    }
};

export function registerAssets(asset_manager: AssetManager) {
    // Register images
    forEveryString(Assets.images, (key, value) => {
        asset_manager.addImage(value, value);
    });
    forEveryString(Assets.sounds, (key, value) => {
        asset_manager.addSound(value, value);
    });
    forEveryString(Assets.musics, (key, value) => {
        asset_manager.addMusic(value, value);
    });
}

type StringMap = {[key: string]: string|StringMap};

function forEveryString(object:StringMap, callback: (key:string, value:string) => void) {
    for (let key in object) {
        let value = object[key];
        if (typeof value === "string") {
            callback(key, value);
            continue;
        }
        forEveryString(value, callback);
    }
}