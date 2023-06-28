import { Model } from "./Model";

export interface ViewSettings {
    color_primary: string;
    color_secondary: string;
    color_tertiary: string;
    font_family: string;
    font_size_text: number;
};

export interface View {
    /**
     * Update the view with time
     * @param delta_ms 
     */
    update(delta_ms: number): void;
    /**
     * render the model with this view
     * @param model 
     */
    render(model: Model): void;
}