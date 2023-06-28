import { Game } from "./game/base/Game";
import * as tgt from "./library/index";

declare global {
    interface Window {
        game: Game;
    }
    var game: Game;
}

(async () => {
    const app = tgt.getElementById('app', HTMLDivElement);
    tgt.preventDefault(app);
    let game: Game = window.game = new Game(app);
    game.init();
    await game.run();
})();