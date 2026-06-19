const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const getAssetUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE}/${path.replace(/^\//, '')}`;
};

/** Wikimedia Commons school uniform fallbacks by category */
export const CATEGORY_FALLBACKS = {
  shirt: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Culcheth_High_School_Uniform.jpg/800px-Culcheth_High_School_Uniform.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/School_uniform_in_ASDA_7926.jpg/800px-School_uniform_in_ASDA_7926.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Eleven_year_old_boy_in_uniform_of_Humberston_Foundation_School_1953.jpg/800px-Eleven_year_old_boy_in_uniform_of_Humberston_Foundation_School_1953.jpg',
  ],
  trouser: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/School_trousers.jpg/800px-School_trousers.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/School_uniform_in_ASDA_7927.jpg/800px-School_uniform_in_ASDA_7927.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/School_uniform_of_Beijing_101_Middle_School%2C_navy_blue_%2820210608163911%29.jpg/800px-School_uniform_of_Beijing_101_Middle_School%2C_navy_blue_%2820210608163911%29.jpg',
  ],
  skirt: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Catholic_school_uniforms.jpg/800px-Catholic_school_uniforms.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Sailor-fuku_for_summer.jpg/800px-Sailor-fuku_for_summer.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/School_uniforms_on_display_at_Guildford_Museum_-_geograph.org.uk_-_1632046.jpg/800px-School_uniforms_on_display_at_Guildford_Museum_-_geograph.org.uk_-_1632046.jpg',
  ],
  dress: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Sailor-fuku_for_summer.jpg/800px-Sailor-fuku_for_summer.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Culcheth_High_School_Uniform.jpg/800px-Culcheth_High_School_Uniform.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Catholic_school_uniforms.jpg/800px-Catholic_school_uniforms.jpg',
  ],
  blazer: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/St_Bons_Black_Blazer.jpg/800px-St_Bons_Black_Blazer.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Scotch_College_YR12_Winter_Uniform_Blazer.jpg/800px-Scotch_College_YR12_Winter_Uniform_Blazer.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/A_pair_of_bluecoats_on_St_Mary_School_-_geograph.org.uk_-_3361534.jpg/800px-A_pair_of_bluecoats_on_St_Mary_School_-_geograph.org.uk_-_3361534.jpg',
  ],
  tie: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Uddingston_Grammar_School_Ties.jpg/800px-Uddingston_Grammar_School_Ties.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/School_uniforms_GBR.jpg/800px-School_uniforms_GBR.jpg',
  ],
  socks: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/School_uniforms_GBR.jpg/800px-School_uniforms_GBR.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/School_uniform_in_ASDA_7926.jpg/800px-School_uniform_in_ASDA_7926.jpg',
  ],
  shoes: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Orthopedic_heavy_duty_black_leather_school_uniform_shoes.jpg/800px-Orthopedic_heavy_duty_black_leather_school_uniform_shoes.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/School_uniforms_GBR.jpg/800px-School_uniforms_GBR.jpg',
  ],
  bag: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Natasha_Schoolwear_-_Northgate_-_geograph.org.uk_-_1829231.jpg/800px-Natasha_Schoolwear_-_Northgate_-_geograph.org.uk_-_1829231.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Backpack_side.jpg/800px-Backpack_side.jpg',
  ],
  accessories: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Uddingston_Grammar_School_Ties.jpg/800px-Uddingston_Grammar_School_Ties.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/School_cap.jpg/800px-School_cap.jpg',
  ],
  set: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/School_uniforms_GBR.jpg/800px-School_uniforms_GBR.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Culcheth_High_School_Uniform.jpg/800px-Culcheth_High_School_Uniform.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Sutton_Grammar_School_Lower_School_pupils.jpg/800px-Sutton_Grammar_School_Lower_School_pupils.jpg',
  ],
  other: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/School_uniforms_on_display_at_Guildford_Museum_-_geograph.org.uk_-_1632046.jpg/800px-School_uniforms_on_display_at_Guildford_Museum_-_geograph.org.uk_-_1632046.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/School_cap.jpg/800px-School_cap.jpg',
  ],
};

const DEFAULT_FALLBACKS = CATEGORY_FALLBACKS.shirt;

export const getCategoryFallbacks = (category) =>
  CATEGORY_FALLBACKS[category] || DEFAULT_FALLBACKS;

export const getProductImageUrls = (images = [], category) => {
  const fromProduct = images.map(getAssetUrl).filter(Boolean);
  if (fromProduct.length > 0) return fromProduct;
  return getCategoryFallbacks(category);
};
