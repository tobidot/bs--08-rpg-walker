import { AssetManager } from "../../../../assets";
import { AudioPlayer } from "../../../../audio";

export class MenuGlobals {
    // 
    public next_id = 1;
    // Visual settings
    public primary_color = "#000000";
    public background_color = "#FFFFFF";
    public context: CanvasRenderingContext2D;
    // Audio settings
    public audio_player: AudioPlayer | null = null;
    public select_sound: string | null = null;
    public asset_manager: AssetManager | null = null;

    constructor(
        public readonly ctx: CanvasRenderingContext2D,
    ) {
        this.context = ctx;
    }
}