interface ManifestWithCategory {
  templateCategory?: 'input-form' | 'standard' | 'free';
  category?: string;
  hasInputFields?: boolean;
  conversionType?: string;
}

export function detectTemplateCategory(
  componentName: string,
  manifest: ManifestWithCategory
): 'input-form' | 'standard' | 'free' {
  if (manifest.templateCategory) {
    console.log(`[detectTemplateCategory] Using templateCategory from manifest: ${manifest.templateCategory}`);
    return manifest.templateCategory;
  }

  if (manifest.category) {
    const categoryMapping: Record<string, 'input-form' | 'standard' | 'free'> = {
      '通版': 'standard',
      '日本無料株': 'free',
      '无料': 'free',
      'free': 'free',
      'standard': 'standard',
      'investor-tracking': 'standard',
      'stock-analysis': 'input-form',
      'Finance': 'input-form'
    };

    if (categoryMapping[manifest.category]) {
      console.log(`[detectTemplateCategory] Mapped category '${manifest.category}' to '${categoryMapping[manifest.category]}'`);
      return categoryMapping[manifest.category];
    }
  }

  if (manifest.hasInputFields === false || manifest.conversionType === 'direct') {
    console.log(`[detectTemplateCategory] Detected as standard based on hasInputFields or conversionType`);
    return 'standard';
  }

  console.log(`[detectTemplateCategory] Defaulting to 'input-form' for ${componentName}`);
  return 'input-form';
}
