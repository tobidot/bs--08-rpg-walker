import { AssetManager } from "../../library";
import arwin_north_east from "../../../../assets/images/arwin-the-swordsman/arwin-the-swordsman-north-east.png";
import arwin_north_west from "../../../../assets/images/arwin-the-swordsman/arwin-the-swordsman-north-west.png";
import arwin_south_east from "../../../../assets/images/arwin-the-swordsman/arwin-the-swordsman-south-east.png";
import arwin_south_west from "../../../../assets/images/arwin-the-swordsman/arwin-the-swordsman-south-west.png";
import vfx_hit from "../../../../assets/images/effects/hit.png";
import tower from "../../../../assets/images/tower.png";
import heart from "../../../../assets/images/heart.png";
import coin from "../../../../assets/images/coin.png";
import tree1 from "../../../../assets/images/tree-1.png";
import tree2 from "../../../../assets/images/tree-2.png";
import tree3 from "../../../../assets/images/tree-3.png";
import tree4 from "../../../../assets/images/tree-4.png";
import worker from "../../../../assets/images/worker/worker.png";
import magic_missle1 from "../../../../assets/images/effects/magic-missle-1.png";
import magic_missle2 from "../../../../assets/images/effects/magic-missle-2.png";
import gras from "../../../../assets/images/gras.png";
import slime from "../../../../assets/images/slime/slime-simple.png";
import monster1 from "../../../../assets/images/monsters/monster-1.png";
import monster2 from "../../../../assets/images/monsters/monster-2.png";
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
        worker: worker,
        slime,
        fire_slime: monster1,
        slime_mother: monster2,
        tower: {
            default: tower
        },
        hud: {
            heart,
            coin,
        },
        effects: {
            hit: vfx_hit,
            magic_missle: [
                magic_missle1,
                magic_missle2,
            ],
        },
        tree: [
            tree1,
            tree2,
            tree3,
            tree4,
        ],
        terrain: {
            gras,
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

type StringMap = { [key: string]: string | string[] | StringMap };

function forEveryString(object: StringMap|Array<string>, callback: (key: string, value: string) => void) {
    for (let key in object) {
        let value = object[key];
        if (typeof value === "string") {
            callback(key, value);
            continue;
        }
        forEveryString(value, callback);
    }
}