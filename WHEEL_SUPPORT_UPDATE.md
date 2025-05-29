# Обновление фронтенда для поддержки дисков

## 🎯 Обзор изменений

Фронтенд был полностью обновлен для поддержки новых полей дисков в API. Теперь приложение корректно работает как с шинами, так и с дисками, автоматически определяя тип категории и показывая соответствующие поля и фильтры.

## 📋 Обновленные файлы

### 1. Типы данных

#### `src/types/product.ts`
- ✅ Добавлены поля для дисков в интерфейс `Product`
- ✅ Обновлен интерфейс `ProductsFilter` с фильтрами для дисков

#### `src/types/api.ts`
- ✅ Добавлены поля для дисков в интерфейс `Product`
- ✅ Обновлен интерфейс `ProductFilters` с фильтрами для дисков

### 2. Форма создания/редактирования продуктов

#### `src/app/admin/products/components/ProductForm.tsx`
- ✅ Добавлены поля для дисков в интерфейс `ProductFormData`
- ✅ Реализована логика определения типа категории (`tire` | `wheel` | `other`)
- ✅ Условное отображение полей в зависимости от типа категории
- ✅ Обновлена логика отправки данных с новыми полями дисков

**Новые поля для дисков:**
- `wheel_width` - ширина диска (дюймы)
- `et_offset` - вылет ET (мм)
- `pcd` - PCD (мм)
- `bolt_count` - количество болтов
- `center_bore` - центральное отверстие (мм)

### 3. Компонент фильтров

#### `src/components/filters/ProductFilters.tsx` (переименован из TireFilters)
- ✅ Переименован компонент `TireFilters` → `ProductFilters`
- ✅ Добавлена поддержка фильтрации дисков
- ✅ Условное отображение фильтров в зависимости от `categoryType`
- ✅ Добавлены константы для фильтрации дисков

**Новые фильтры для дисков:**
- Ширина диска (5.5" - 12")
- Вылет ET (-20мм до +60мм)
- PCD (98мм - 150мм)
- Количество болтов (4, 5, 6, 8)
- Центральное отверстие (54.1мм - 74.1мм)

### 4. Отображение продуктов

#### `src/components/product/ProductCard.tsx`
- ✅ Добавлено отображение `wheel_size` для дисков
- ✅ Цветовая дифференциация: синий для шин, зеленый для дисков

### 5. Каталог

#### `src/app/catalog/page.tsx`
- ✅ Обновлен импорт компонента фильтров
- ✅ Добавлена логика определения типа категории
- ✅ Передача `categoryType` в компонент фильтров

## 🔧 Логика определения типа категории

```typescript
const getCategoryType = (categorySlug: string): 'tire' | 'wheel' | 'other' => {
  const category = categories.find(cat => cat.slug === categorySlug);
  if (!category) return 'other';
  
  const categoryName = category.name.toLowerCase();
  if (categoryName.includes('шин') || categoryName.includes('tire')) {
    return 'tire';
  }
  if (categoryName.includes('диск') || categoryName.includes('wheel') || categoryName.includes('колес')) {
    return 'wheel';
  }
  return 'other';
};
```

## 📊 Новые поля в интерфейсах

### Product Interface
```typescript
export interface Product {
  // ... существующие поля
  
  // Common fields
  diameter: number | null;

  // Tire specific fields
  width: number | null;
  profile: number | null;
  tire_size: string | null;

  // Wheel specific fields
  wheel_width: number | null;
  et_offset: number | null;
  pcd: number | null;
  bolt_count: number | null;
  center_bore: number | null;
  wheel_size: string | null;
}
```

### ProductFilters Interface
```typescript
export interface ProductFilters {
  // ... существующие поля
  
  // Common filters
  diameter?: number;
  min_diameter?: number;
  max_diameter?: number;

  // Tire specific filters
  width?: number;
  min_width?: number;
  max_width?: number;
  profile?: number;
  min_profile?: number;
  max_profile?: number;

  // Wheel specific filters
  wheel_width?: number;
  min_wheel_width?: number;
  max_wheel_width?: number;
  et_offset?: number;
  min_et_offset?: number;
  max_et_offset?: number;
  pcd?: number;
  min_pcd?: number;
  max_pcd?: number;
  bolt_count?: number;
  center_bore?: number;
  min_center_bore?: number;
  max_center_bore?: number;
}
```

## 🎨 UX улучшения

### 1. Форма создания продукта
- **Условные поля**: Показываются только релевантные поля в зависимости от категории
- **Диаметр обязательный**: Для шин и дисков диаметр стал обязательным полем
- **Улучшенные лейблы**: Более точные описания полей с единицами измерения

### 2. Фильтры в каталоге
- **Адаптивные фильтры**: Показываются только релевантные фильтры
- **Динамический заголовок**: "Параметры шин" или "Параметры дисков"
- **Сброс фильтров**: Корректно сбрасывает все поля в зависимости от типа

### 3. Карточки продуктов
- **Цветовая индикация**: 
  - 🔵 Синий бейдж для шин (`tire_size`)
  - 🟢 Зеленый бейдж для дисков (`wheel_size`)
- **Форматированные размеры**: Используются готовые поля `tire_size` и `wheel_size`

## 🔄 Примеры использования

### Создание шины
```json
{
  "name": "Continental ContiPremiumContact 5",
  "category": "tires-category-uuid",
  "brand": "continental-brand-uuid",
  "diameter": 17,
  "width": 225,
  "profile": 45,
  "price": "15999.99"
}
```

### Создание диска
```json
{
  "name": "BBS CH-R",
  "category": "wheels-category-uuid", 
  "brand": "bbs-brand-uuid",
  "diameter": 18,
  "wheel_width": 8.5,
  "et_offset": 35,
  "pcd": 114.3,
  "bolt_count": 5,
  "center_bore": 66.6,
  "price": "25999.99"
}
```

### Фильтрация шин
```
/catalog/шины?width=225&profile=45&diameter=17&brand=continental-uuid
```

### Фильтрация дисков
```
/catalog/диски?wheel_width=8.5&et_offset=35&bolt_count=5&brand=bbs-uuid
```

## ✅ Результат

1. **Полная поддержка дисков**: Все функции работают как для шин, так и для дисков
2. **Условная логика**: Поля и фильтры показываются только для соответствующих категорий
3. **Обратная совместимость**: Все существующие функции для шин продолжают работать
4. **Улучшенный UX**: Более интуитивный интерфейс с адаптивными элементами
5. **Типобезопасность**: Все новые поля покрыты TypeScript типами

## 🚀 Готовность к продакшену

- ✅ Сборка проходит без ошибок
- ✅ Все типы обновлены
- ✅ Компоненты протестированы
- ✅ Обратная совместимость сохранена
- ✅ Документация создана

Фронтенд готов к работе с обновленным API и полностью поддерживает как шины, так и диски! 🎉 