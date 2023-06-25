import { GameController } from "../controllers/GameController";
import { GameModel } from "../models/GameModel";
import { GameView } from "../views/GameView";
import * as tgt from "../../library/index";
import { registerAssets } from "./Assets";

export class Game extends tgt.GameTemplate<
    GameModel,
    GameView,
    GameController
> {

    public on_game_finished: null | (() => void) = null;

    public constructor(app: HTMLElement) {
        super(app);
    }

    /**
     * Create the Initial Model View and Controller
     * @param context 
     * @returns 
     */
    protected initMvc(context: CanvasRenderingContext2D): this {
        this.model = new GameModel();
        this.controller = new GameController(this.model);
        this.view = new GameView(context);
        return this;
    }

    /**
     * Register the required Assets
     * @param assets 
     */
    protected registerAssets(assets: tgt.AssetManager): void {
        registerAssets(assets);
    }

    /**
     * Prepare for a new Game
     * @param resolve 
     * @param reject 
     */
    protected newGame(
        resolve: () => void,
        reject: (reason?: any) => void
    ): void {
    }
}