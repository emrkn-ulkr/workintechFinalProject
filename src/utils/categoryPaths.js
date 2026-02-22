import { normalizeGenderCode } from './categoryUtils';
import { slugify } from './slugify';

export const genderCodeToSlug = (genderCode = '') => {
  const normalized = normalizeGenderCode(genderCode);

  if (normalized === 'k') {
    return 'kadin';
  }

  if (normalized === 'e') {
    return 'erkek';
  }

  return 'unisex';
};

export const buildCategoryPath = (category) => {
  if (!category) {
    return '/shop';
  }

  const genderSlug = genderCodeToSlug(category.gender);
  const categorySlug = slugify(category.title);
  return `/shop/${genderSlug}/${categorySlug}/${category.id}`;
};

export const buildProductPath = (product, categories = []) => {
  if (!product) {
    return '/shop';
  }

  const productSlug = slugify(product.name);
  const relatedCategory = categories.find((category) => String(category.id) === String(product.category_id));

  if (!relatedCategory) {
    return `/product/${product.id}`;
  }

  return `${buildCategoryPath(relatedCategory)}/${productSlug}/${product.id}`;
};
