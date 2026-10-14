import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HxCheckableElement } from "../../hx-checkable-element.js";

export type HxSwitchSize = "sm" | "md" | "lg";

const sizes: Record<HxSwitchSize, { track: string; thumb: string; on: string; label: string }> = {
    sm: { track: "h-4 w-7", thumb: "size-3", on: "translate-x-3", label: "text-xs" },
    md: { track: "h-5 w-9", thumb: "size-4", on: "translate-x-4", label: "text-sm" },
    lg: { track: "h-6 w-11", thumb: "size-5", on: "translate-x-5", label: "text-base" },
};

/**
 * @element hx-switch
 * @slot - The switch label.
 * @fires input - The checked state changed.
 * @fires change - The checked state changed.
 * @csspart control - The track.
 * @csspart thumb - The sliding thumb.
 * @csspart label - The label wrapper.
 * @cssstate checked - The switch is on.
 */
@customElement("hx-switch")
export class HxSwitch extends HxCheckableElement {
    @property({ reflect: true }) size: HxSwitchSize = "md";

    constructor() {
        super("switch");
    }

    override render() {
        const size = sizes[this.size];
        return html`<span
                part="control"
                class="${size.track} ${
                    this.checked ? "bg-primary" : "bg-input"
                } inline-flex shrink-0 items-center rounded-full border border-transparent p-px shadow-xs transition-colors"
            >
                <span
                    part="thumb"
                    class="${size.thumb} ${
                        this.checked ? size.on : "translate-x-0"
                    } bg-background rounded-full shadow-sm transition-transform"
                ></span>
            </span>
            <span part="label" class="${size.label} text-foreground leading-none font-medium"><slot></slot></span>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "hx-switch": HxSwitch;
    }
}
