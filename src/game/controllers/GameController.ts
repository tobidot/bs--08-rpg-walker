import { Controller } from "../../library/abstract/mvc/Controller";
import { ControllerResponse } from "../../library/abstract/mvc/Response";
import { GameModel } from "../models/GameModel";
import { GameView } from "../views/GameView";

export class GameController implements Controller {

    public constructor(
        public model: GameModel,
    ) {
    }

    /**
     * Start a new game
     */
    public newGame(): ControllerResponse {        
        return null;
    }
    
    public isGameOver() : boolean {
        return false;
    }
    
    public update(delta_seconds: number): ControllerResponse {
        this.model.update(delta_seconds);
        return null;
    }
}