import Vue from 'vue';
import moment from 'moment';
import where from 'filter-where';
import { AccessService } from '@deip/access-service';

const accessService = AccessService.getInstance();


Vue.filter('employmentOrEducation', (enrichedProfile) => {
  const hasEmployment = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.employment && enrichedProfile.profile.employment.length;
  const hasActiveEmployment = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.employment && enrichedProfile.profile.employment.some((e) => e.isActive);
  const employment = hasActiveEmployment
    ? enrichedProfile.profile.employment.find((e) => e.isActive)
    : hasEmployment
      ? enrichedProfile.profile.employment[enrichedProfile.profile.employment.length - 1]
      : null;

  const hasEducation = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.education && enrichedProfile.profile.education.length;
  const hasActiveEducation = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.education && enrichedProfile.profile.education.some((e) => e.isActive);
  const education = hasActiveEducation
    ? enrichedProfile.profile.education.find((e) => e.isActive)
    : hasEducation
      ? enrichedProfile.profile.education[enrichedProfile.profile.education.length - 1]
      : null;

  if (!education && !employment) {
    return '';
  }

  return `${education ? education.educationalInstitution : ''}${education && employment ? ', ' : ''}${employment ? employment.company : ''}`;
});


Vue.filter('dateFormat', (value, format, fromUtcToLocal = false) => (!fromUtcToLocal
  ? moment(value).format(format)
  : moment.utc(value).local().format(format)));

Vue.filter('shortHash', (value) => (value ? value.substring(0, 8) : ''));

Vue.filter('joinByKey', (value, key, separator = ', ') => {
  if (!value) return '';
  return value.map((el) => el[key]).join(separator);
});

Vue.filter('commaNumber', (value, separator = ',') => {
  if (!value && value !== 0) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
});

// Vue.filter('where', (value, f = {}) => {
//   if (!value) return '';
//   return value.filter(where(f));
// });

Vue.filter('numDir', (value) => {
  if (!value) return '';
  return parseFloat(value) >= 0 ? `+${value}` : value;
});

Vue.filter('checkVal', (value) => value || '—');

Vue.filter('numDirClass', (value, type = 'foreground') => {
  if (!value || parseFloat(value) === 0) return '';

  if (type === 'background') {
    return parseFloat(value) > 0
      ? 'success lighten-3'
      : 'error lighten-3';
  }

  return parseFloat(value) > 0
    ? 'success--text'
    : 'error--text';
});

Vue.filter('timeLeft', (value) => {
  const now = moment.utc().local();
  const start = moment.utc(value).local();

  const months = Math.floor(moment.duration(start.diff(now)).asMonths());
  if (months > 1) return `${months} months`;

  const days = Math.floor(moment.duration(start.diff(now)).asDays());
  if (days > 1) return `${days} days`;

  const hours = Math.floor(moment.duration(start.diff(now)).asHours());
  if (hours > 1) return `${hours} hours`;

  const minutes = Math.floor(moment.duration(start.diff(now)).asMinutes());
  if (minutes > 1) return `${minutes} mins`;

  const seconds = Math.floor(moment.duration(start.diff(now)).asSeconds());
  return `${seconds} secs`;
});
