import { Game } from "./game/base/Game";
import * as tgt from "./library/index";

(async () => {
    const app = tgt.getElementById('app', HTMLDivElement);
    tgt.preventDefault(app);
    let game: Game = new Game(app);
    await game.run();
})();