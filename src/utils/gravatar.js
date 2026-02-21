import md5 from 'blueimp-md5';

export const getGravatarUrl = (email = '', size = 72) => {
  const normalizedEmail = email.trim().toLowerCase();
  const hash = md5(normalizedEmail);
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
};
