import { slugify } from './slugify';

const FEMALE_CODES = new Set(['k', 'kadin', 'kadın', 'woman', 'women', 'female', 'f']);
const MALE_CODES = new Set(['e', 'erkek', 'man', 'men', 'male', 'm']);

const CATEGORY_LABELS = {
  't-shirt': { tr: 'Tisort', en: 'T-Shirt' },
  't-shirts': { tr: 'Tisort', en: 'T-Shirts' },
  shirt: { tr: 'Gomlek', en: 'Shirt' },
  shirts: { tr: 'Gomlek', en: 'Shirts' },
  sweatshirt: { tr: 'Sweatshirt', en: 'Sweatshirt' },
  sweatshirts: { tr: 'Sweatshirt', en: 'Sweatshirts' },
  hoodie: { tr: 'Kapusonlu', en: 'Hoodie' },
  hoodies: { tr: 'Kapusonlu', en: 'Hoodies' },
  dress: { tr: 'Elbise', en: 'Dress' },
  dresses: { tr: 'Elbise', en: 'Dresses' },
  skirt: { tr: 'Etek', en: 'Skirt' },
  skirts: { tr: 'Etek', en: 'Skirts' },
  pants: { tr: 'Pantolon', en: 'Pants' },
  trouser: { tr: 'Pantolon', en: 'Trouser' },
  trousers: { tr: 'Pantolon', en: 'Trousers' },
  jeans: { tr: 'Jean', en: 'Jeans' },
  jacket: { tr: 'Ceket', en: 'Jacket' },
  jackets: { tr: 'Ceket', en: 'Jackets' },
  coat: { tr: 'Kaban', en: 'Coat' },
  coats: { tr: 'Kaban', en: 'Coats' },
  shoe: { tr: 'Ayakkabi', en: 'Shoe' },
  shoes: { tr: 'Ayakkabi', en: 'Shoes' },
  sneaker: { tr: 'Spor Ayakkabi', en: 'Sneaker' },
  sneakers: { tr: 'Spor Ayakkabi', en: 'Sneakers' },
  bag: { tr: 'Canta', en: 'Bag' },
  bags: { tr: 'Canta', en: 'Bags' },
  accessory: { tr: 'Aksesuar', en: 'Accessory' },
  accessories: { tr: 'Aksesuar', en: 'Accessories' },
  knitwear: { tr: 'Triko', en: 'Knitwear' },
};

const GENDER_SORT_ORDER = {
  k: 0,
  e: 1,
  u: 2,
};

export const normalizeGenderCode = (genderCode = '') => {
  const normalized = String(genderCode).trim().toLocaleLowerCase('tr');

  if (FEMALE_CODES.has(normalized)) {
    return 'k';
  }

  if (MALE_CODES.has(normalized)) {
    return 'e';
  }

  return 'u';
};

export const genderSlugToCode = (genderSlug = '') => {
  const normalized = String(genderSlug).trim().toLocaleLowerCase('tr');

  if (!normalized) {
    return '';
  }

  if (['kadin', 'kadinlar', 'women', 'woman', 'female', 'k', 'f'].includes(normalized)) {
    return 'k';
  }

  if (['erkek', 'erkekler', 'men', 'man', 'male', 'e', 'm'].includes(normalized)) {
    return 'e';
  }

  return '';
};

export const normalizeCategory = (category) => ({
  ...category,
  id: category?.id,
  title: String(category?.title || '').trim(),
  gender: normalizeGenderCode(category?.gender),
  rating: Number.isFinite(Number(category?.rating)) ? Number(category.rating) : 0,
});

export const normalizeAndSortCategories = (categories = []) =>
  [...categories]
    .map(normalizeCategory)
    .filter((category) => category.id !== undefined && category.id !== null && category.title)
    .sort((left, right) => {
      const leftGenderOrder = GENDER_SORT_ORDER[left.gender] ?? 99;
      const rightGenderOrder = GENDER_SORT_ORDER[right.gender] ?? 99;

      if (leftGenderOrder !== rightGenderOrder) {
        return leftGenderOrder - rightGenderOrder;
      }

      return left.title.localeCompare(right.title, 'tr');
    });

export const getLocalizedCategoryTitle = (categoryTitle = '', language = 'tr') => {
  const slug = slugify(categoryTitle);
  const localized = CATEGORY_LABELS[slug]?.[language];
  return localized || categoryTitle;
};

