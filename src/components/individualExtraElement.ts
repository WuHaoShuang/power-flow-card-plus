import { html } from "lit";
import { individualSecondarySpan } from "./spans/individualSecondarySpan";
import { NewDur, TemplatesObj } from "../type";
import { PowerFlowCardPlusConfig } from "../power-flow-card-plus-config";
import { IndividualObject } from "../states/raw/individual/getIndividualObject";
import { PowerFlowCardPlus } from "../power-flow-card-plus";
import { displayValue } from "../utils/displayValue";

interface IndividualExtra {
  individualObj: IndividualObject;
  templatesObj: TemplatesObj;
  newDur: NewDur;
  position: "left" | "right";
  rowIndex: number;
}

const getIndividualDisplayState = (field?: IndividualObject, hass?: any, config?: PowerFlowCardPlusConfig) => {
  if (!field || !hass || !config) return "0 W";
  return displayValue(hass, config, field.state, {
    decimals: field.decimals,
    unit: field.unit,
    unitWhiteSpace: field.unit_white_space,
    watt_threshold: config.watt_threshold,
  });
};

export const individualExtraElement = (
  main: PowerFlowCardPlus,
  config: PowerFlowCardPlusConfig,
  { individualObj, templatesObj, newDur, position, rowIndex }: IndividualExtra
) => {
  if (!individualObj) return html`<div class="spacer"></div>`;

  const indexOfIndividual = config?.entities?.individual?.findIndex((e) => e.entity === individualObj.entity) || 0;
  const duration = newDur.individual[indexOfIndividual] || 1.66;
  const positionClass = `individual-extra-${position}`;
  const rowClass = `individual-extra-row-${rowIndex}`;
  const displayState = getIndividualDisplayState(individualObj, main.hass, config);

  return html`<div class="circle-container individual-extra ${positionClass} ${rowClass}">
    <span class="label">${individualObj.name}</span>
    <div
      class="circle"
      @click=${(e: { stopPropagation: () => void; target: HTMLElement }) => {
        main.openDetails(e, individualObj?.field?.tap_action, individualObj?.entity);
      }}
      @keyDown=${(e: { key: string; stopPropagation: () => void; target: HTMLElement }) => {
        if (e.key === "Enter") {
          main.openDetails(e, individualObj?.field?.tap_action, individualObj?.entity);
        }
      }}
    >
      ${individualSecondarySpan(main.hass, main, config, templatesObj, individualObj, indexOfIndividual, `extra-${position}-${rowIndex}` as any)}
      ${individualObj.icon !== " " ? html` <ha-icon id="individual-extra-${position}-${rowIndex}-icon" .icon=${individualObj.icon} />` : null}
      ${individualObj?.field?.display_zero_state !== false || (individualObj.state || 0) > (individualObj.displayZeroTolerance ?? 0)
        ? html` <span class="individual-extra ${positionClass}">
            ${individualObj?.showDirection
              ? html`<ha-icon class="small" .icon=${individualObj.invertAnimation ? "mdi:arrow-down" : "mdi:arrow-up"}></ha-icon>`
              : ""}${displayState}
          </span>`
        : ""}
    </div>
  </div>`;
};
