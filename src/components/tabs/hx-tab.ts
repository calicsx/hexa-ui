import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HxElement } from "../../hx-element.js";
import type { HxTabsDirection, HxTabsVariant } from "./hx-tabs.js";

const variants: Record<HxTabsVariant, { selected: string; idle: string } & Record<HxTabsDirection, string>> = {
    default: {
        horizontal: "justify-center rounded-md border border-transparent px-2 py-1",
        vertical: "justify-start rounded-md border border-transparent px-2 py-1",
        selected: "bg-background text-foreground shadow-sm",
        idle: "hover:text-foreground",
    },
    secondary: {
        horizontal: "justify-center -mb-px border-b-2 px-3 py-2",
        vertical: "justify-start -ml-px border-l-2 px-3 py-2",
        selected: "border-primary text-foreground",
        idle: "border-transparent text-muted-foreground hover:text-foreground",
    },
};

/**
 * @element hx-tab
 * @slot - The tab label (text, icon…).
 * @csspart base - The tab wrapper.
 */
@customElement("hx-tab")
export class HxTab extends HxElement {
    static override styles = [
        HxElement.styles,
        css`
            :host {
                display: flex;
                outline: none;
            }
            :host([disabled]) {
                pointer-events: none;
                opacity: 0.5;
            }
            :host(:focus-visible) [part="base"] {
                box-shadow: 0 0 0 3px color-mix(in oklab, var(--hx-ring) 50%, transparent);
            }
        `,
    ];

    @property({ reflect: true }) value = "";
    @property({ type: Boolean, reflect: true }) selected = false;
    @property({ type: Boolean, reflect: true }) disabled = false;
    @property({ reflect: true }) variant: HxTabsVariant = "default";
    @property({ reflect: true }) direction: HxTabsDirection = "horizontal";

    private internals = this.attachInternals();

    constructor() {
        super();
        this.internals.role = "tab";
    }

    override connectedCallback() {
        super.connectedCallback();
        this.slot = "nav";
    }

    protected override updated() {
        this.internals.ariaSelected = String(this.selected);
        this.internals.ariaDisabled = String(this.disabled);
    }

    override render() {
        const variant = variants[this.variant];
        return html`<div
            part="base"
            class="${variant[this.direction]} ${
                this.selected ? variant.selected : variant.idle
            } inline-flex flex-1 cursor-pointer items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-[color,box-shadow]"
        >
            <slot></slot>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "hx-tab": HxTab;
    }
}
