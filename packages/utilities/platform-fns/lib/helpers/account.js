import { userAvatarSrc, userFullName, userLocation } from './user';
import { teamLogoSrc } from './team';

// DEPRECATED
export const accountFullName = (model) => {
  const isTeam = model.account.is_research_group || model.account.isResearchGroup;

  return isTeam ? model.name : userFullName(model);
};

// DEPRECATED
export const accountAvatarSrc = (model, width, height, isRound, noCache) => {
  const isTeam = model.account.is_research_group || model.account.isResearchGroup;

  return isTeam
    ? teamLogoSrc(model, width, height, isRound, noCache)
    : userAvatarSrc(model, width, height, isRound, noCache);
};

// DEPRECATED
export const accountLocation = (model) => userLocation(model); // temp?
