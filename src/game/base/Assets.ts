import { AssetManager } from "../../library";
import ball_blue from "../../../../assets/images/ball-blue.png";
import brick_red from "../../../../assets/images/brick-red.png";
import brick_metal from "../../../../assets/images/brick-metal.png";
import background from "../../../../assets/images/background.png";
import heart from "../../../../assets/images/heart.png";
import sound from "../../../../assets/icons/sound.png";
import music from "../../../../assets/icons/music.png";
import hit_brick from "../../../../assets/sounds/hit-gong.wav";
import hit_wall from "../../../../assets/sounds/hit-bip.wav";
import hit_paddle from "../../../../assets/sounds/hit-bop.wav";
import hit_ball from "../../../../assets/sounds/hit-bip.wav";
import background_music from "../../../../assets/music/chat-gpt-1-retro-rythm-revival.wav";

export const Assets = {
    images: {
    },
    sounds: {
    },
    musics: {
    }
};

export function registerAssets(asset_manager: AssetManager) {
    // Register images
    for( let key in Assets.images) {
        asset_manager.addImage(key, Assets.images[key]);
    };
    for( let key in Assets.sounds) {
        asset_manager.addSound(key, Assets.sounds[key]);
    };
    for( let key in Assets.musics) {
        asset_manager.addMusic(key, Assets.musics[key]);
    };
}