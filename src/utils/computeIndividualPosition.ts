import { PowerFlowCardPlusConfig } from "../power-flow-card-plus-config";
import { IndividualObject } from "../states/raw/individual/getIndividualObject";

const filterUnusedIndividualObjs = (individualObjs: IndividualObject[]): IndividualObject[] => {
  const cloneIndividualObjs = JSON.parse(JSON.stringify(individualObjs)) as IndividualObject[];
  const individualObjsWithHas = cloneIndividualObjs.filter((i) => i?.has);
  return individualObjsWithHas;
};

const getIndividualObjSortPowerMode = (individualObjs: IndividualObject[], index: number): IndividualObject | undefined => {
  const filteredIndividualObjs = filterUnusedIndividualObjs(individualObjs);
  return filteredIndividualObjs?.[index] ?? undefined;
};

// Legacy functions for backward compatibility (first 4 positions)
export const getTopLeftIndividual = (individualObjs: IndividualObject[]): IndividualObject | undefined => {
  return getIndividualObjSortPowerMode(individualObjs, 0);
};

export const getBottomLeftIndividual = (individualObjs: IndividualObject[]): IndividualObject | undefined => {
  return getIndividualObjSortPowerMode(individualObjs, 1);
};

export const getTopRightIndividual = (individualObjs: IndividualObject[]): IndividualObject | undefined => {
  return getIndividualObjSortPowerMode(individualObjs, 2);
};

export const getBottomRightIndividual = (individualObjs: IndividualObject[]): IndividualObject | undefined => {
  return getIndividualObjSortPowerMode(individualObjs, 3);
};

// New functions to get all individuals organized by rows and positions
export interface IndividualPositions {
  mainRow: {
    leftTop: IndividualObject | undefined;
    rightTop: IndividualObject | undefined;
  };
  bottomRow: {
    leftBottom: IndividualObject | undefined;
    rightBottom: IndividualObject | undefined;
  };
  extraRows: {
    left: IndividualObject | undefined;
    right: IndividualObject | undefined;
  }[];
}

export const getAllIndividualPositions = (individualObjs: IndividualObject[]): IndividualPositions => {
  const filteredIndividualObjs = filterUnusedIndividualObjs(individualObjs);

  const positions: IndividualPositions = {
    mainRow: {
      leftTop: filteredIndividualObjs[0],
      rightTop: filteredIndividualObjs[2],
    },
    bottomRow: {
      leftBottom: filteredIndividualObjs[1],
      rightBottom: filteredIndividualObjs[3],
    },
    extraRows: [],
  };

  // Add extra rows for additional devices (starting from index 4)
  for (let i = 4; i < filteredIndividualObjs.length; i += 2) {
    positions.extraRows.push({
      left: filteredIndividualObjs[i],
      right: filteredIndividualObjs[i + 1],
    });
  }

  return positions;
};

export const getIndividualAtPosition = (individualObjs: IndividualObject[], position: number): IndividualObject | undefined => {
  return getIndividualObjSortPowerMode(individualObjs, position);
};

export const getVisibleIndividualCount = (individualObjs: IndividualObject[]): number => {
  return filterUnusedIndividualObjs(individualObjs).length;
};

export const checkHasRightIndividual = (individualObjs: IndividualObject[]): boolean =>
  !!getTopRightIndividual(individualObjs) || !!getBottomRightIndividual(individualObjs);

export const checkHasBottomIndividual = (individualObjs: IndividualObject[]): boolean =>
  !!getBottomLeftIndividual(individualObjs) || !!getBottomRightIndividual(individualObjs);

export const checkHasExtraIndividuals = (individualObjs: IndividualObject[]): boolean => {
  return getVisibleIndividualCount(individualObjs) > 4;
};
