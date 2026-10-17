import { LitElement, css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ChevronDown, type IconNode } from "lucide";
import { HxElement } from "../../hx-element.js";
import "../icon/hx-icon.js";
import type { HxAccordionVariant } from "./hx-accordion.js";

const variants: Record<HxAccordionVariant, { trigger: string; content: string; separator: string }> = {
    default: { trigger: "px-4 hover:bg-card hover:text-card-foreground", content: "px-4", separator: "" },
    secondary: { trigger: "px-4 hover:bg-accent", content: "px-4", separator: "mx-4" },
};

/**
 * @element hx-accordion-item
 * @slot title - The trigger label.
 * @slot - The collapsible content.
 * @fires hx-accordion-toggle - The item is about to open or close; `event.detail.open` is the new state.
 * Cancelable: `preventDefault()` keeps the current state.
 * @csspart base - The item wrapper.
 * @csspart trigger - The `<button>` that toggles the item.
 * @csspart icon - The `hx-icon` rendered from the `icon` property, before the title.
 * @csspart chevron - The chevron.
 * @csspart content - The content wrapper.
 * @csspart separator - The line under the item (hidden on the last one).
 */
@customElement("hx-accordion-item")
export class HxAccordionItem extends HxElement {
    static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

    static override styles = [
        HxElement.styles,
        css`
            :host {
                display: block;
            }
            :host(:last-of-type) [part="separator"] {
                display: none;
            }
            :host([open]) [part="chevron"] {
                rotate: 180deg;
            }
            ::slotted([slot="title"]) {
                margin: 0;
                font: inherit;
            }
        `,
    ];

    @property({ reflect: true }) value = "";
    @property({ type: Boolean, reflect: true }) open = false;
    @property({ type: Boolean, reflect: true }) disabled = false;
    @property({ reflect: true }) variant: HxAccordionVariant = "default";
    @property({ attribute: false }) icon?: IconNode;

    @query("button") trigger!: HTMLButtonElement;

    private toggle() {
        const open = !this.open;
        const event = new CustomEvent("hx-accordion-toggle", {
            detail: { open },
            bubbles: true,
            composed: true,
            cancelable: true,
        });
        if (this.dispatchEvent(event)) this.open = open;
    }

    override render() {
        const variant = variants[this.variant];
        return html`<div part="base">
            <div role="heading" aria-level="3" class="flex">
                <button
                    part="trigger"
                    id="trigger"
                    type="button"
                    aria-expanded=${this.open}
                    aria-controls="content"
                    ?disabled=${this.disabled}
                    class="${variant.trigger} focus-visible:ring-ring/50 flex flex-1 cursor-pointer items-start justify-between gap-4 py-3 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
                    @click=${this.toggle}
                >
                    <span class="flex items-start gap-2">
                        ${
                            this.icon
                                ? html`<hx-icon
                                      part="icon"
                                      .icon=${this.icon}
                                      class="text-muted-foreground translate-y-0.5"
                                  ></hx-icon>`
                                : nothing
                        }<slot name="title"></slot>
                    </span>
                    <hx-icon
                        part="chevron"
                        .icon=${ChevronDown}
                        class="text-muted-foreground pointer-events-none translate-y-0.5 transition-[rotate] duration-200"
                    ></hx-icon>
                </button>
            </div>
            <div
                part="content"
                id="content"
                role="region"
                aria-labelledby="trigger"
                ?inert=${!this.open}
                class="${
                    this.open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                } grid text-sm transition-[grid-template-rows] duration-200"
            >
                <div class="overflow-hidden">
                    <div class="${variant.content} text-muted-foreground pt-1 pb-3"><slot></slot></div>
                </div>
            </div>
            <div part="separator" class="${variant.separator} bg-border h-px"></div>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "hx-accordion-item": HxAccordionItem;
    }
}
