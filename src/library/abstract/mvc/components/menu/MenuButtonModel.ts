import { MenuModel } from "./MenuModel";
import { MenuGlobals } from "./MenuGlobals";

export class MenuButtonModel extends MenuModel {
    public icon: string|null = null;
    public label: string;

    public constructor(
        globals: MenuGlobals,
        name: string,
        width?: number,
        height?: number
    ) {
        super(globals, name, width, height);
        this.label ??= name;
    }
}