import { AssetManager } from "../../library";
import { Game } from "../base/Game";
import { PlayerBuilding } from "./PlayerBuilding";
import { PlayerBuildingFactory } from "./PlayerBuildingFactory";
import { PlayerUnit } from "./PlayerUnit";
import { PlayerUnitFactory } from "./PlayerUnitFactory";

export class Player {
    public units: Array<WeakRef<PlayerUnit>> = [];
    public buildings: Array<WeakRef<PlayerBuilding>> = [];
    public live: number = 100;
    public money: number = 500;

    public unit_factory: PlayerUnitFactory;
    public building_factory: PlayerBuildingFactory;

    constructor(
        game: Game
    ) {
        this.unit_factory = new PlayerUnitFactory(game, this);
        this.building_factory = new PlayerBuildingFactory(game, this);
    }

    public restart() {
        this.units = [];
        this.buildings = [];
        this.live = 100;
        this.money = 500;
    }
}