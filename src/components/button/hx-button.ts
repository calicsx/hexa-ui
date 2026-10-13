import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HxElement } from "../../hx-element.js";

export type HxButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
export type HxButtonSize = "sm" | "md" | "lg";

const base =
    "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<HxButtonVariant, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
    ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-white hover:bg-destructive/90",
};

const sizes: Record<HxButtonSize, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-11 px-6 text-base",
};

const squareSizes: Record<HxButtonSize, string> = {
    sm: "size-8 text-xs",
    md: "size-9 text-sm",
    lg: "size-11 text-base",
};

/**
 * @element hx-button
 * @slot - The button label (text, icon…).
 * @csspart base - The inner `<button>` element.
 */
@customElement("hx-button")
export class HxButton extends HxElement {
    static formAssociated = true;
    static override shadowRootOptions = { ...HxElement.shadowRootOptions, delegatesFocus: true };
    static override styles = [
        HxElement.styles,
        css`
            :host {
                display: inline-flex;
            }
        `,
    ];

    @property({ reflect: true }) variant: HxButtonVariant = "primary";
    @property({ reflect: true }) size: HxButtonSize = "md";
    @property() type: "button" | "submit" | "reset" = "button";
    @property({ type: Boolean, reflect: true }) disabled = false;
    @property({ type: Boolean, reflect: true }) square = false;

    private internals = this.attachInternals();

    constructor() {
        super();
        this.addEventListener("click", (event) => {
            if (this.disabled) return event.stopImmediatePropagation();
            if (this.type === "submit") this.internals.form?.requestSubmit();
            if (this.type === "reset") this.internals.form?.reset();
        });
    }

    override render() {
        return html`<button
            part="base"
            class="${base} ${variants[this.variant]} ${(this.square ? squareSizes : sizes)[this.size]}"
            type="button"
            ?disabled=${this.disabled}
        >
            <slot></slot>
        </button>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "hx-button": HxButton;
    }
}
