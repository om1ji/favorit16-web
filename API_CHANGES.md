# Изменения в API для создания продуктов

## Обновленный контракт создания продукта

### Основные изменения:
1. **Поле `brand` стало обязательным** - теперь каждый продукт должен иметь бренд
2. **Бренд должен принадлежать той же категории** - добавлена валидация на бэкенде
3. **Новый эндпоинт для получения брендов по категории** - `/products-admin/brands/?category={categoryId}`

### Новый контракт API:

```json
POST /products-admin/products/
Content-Type: application/json

{
    "name": "Continental ContiPremiumContact 5",
    "category": "123e4567-e89b-12d3-a456-426614174000",
    "brand": "123e4567-e89b-12d3-a456-426614174001",    // ОБЯЗАТЕЛЬНОЕ поле
    "price": "15999.99",
    "old_price": "16999.99",
    "description": "Летняя шина премиум-класса",
    "in_stock": true,
    "quantity": 10,
    "diameter": 17,
    "width": 225,
    "profile": 45,
    "images": [
        {
            "id": "123e4567-e89b-12d3-a456-426614174002",
            "is_feature": true,
            "alt_text": "Continental ContiPremiumContact 5"
        }
    ]
}
```

## Изменения в фронтенде

### 1. Новый API метод
Добавлен метод `getBrandsByCategory(categoryId)` в `src/services/api.ts`:

```typescript
getBrandsByCategory: async (categoryId: string) => {
  const response = await api.get<{ count: number; results: Array<{ id: string; name: string; logo: string }> }>(
    `/products-admin/brands/?category=${categoryId}`,
  );
  return response.data;
}
```

### 2. Обновленная форма создания продукта
В `src/app/admin/products/components/ProductForm.tsx`:

- **Поле brand стало обязательным** - добавлен атрибут `required`
- **Динамическая загрузка брендов** - бренды загружаются при выборе категории
- **Валидация на фронтенде** - проверка выбора бренда перед отправкой
- **UX улучшения** - поле бренда заблокировано до выбора категории

### 3. Логика работы формы

1. **Пользователь выбирает категорию** → автоматически загружаются бренды для этой категории
2. **При смене категории** → список брендов обновляется, текущий выбор сбрасывается если бренд не принадлежит новой категории
3. **Валидация** → форма не отправляется без выбора бренда
4. **Отправка данных** → поле `brand` всегда включается в JSON запрос

## Пример использования

```typescript
// 1. Получаем категории
const categories = await adminAPI.getCategoriesForSelect();

// 2. Пользователь выбирает категорию
const selectedCategoryId = "123e4567-e89b-12d3-a456-426614174000";

// 3. Получаем бренды для выбранной категории
const brands = await adminAPI.getBrandsByCategory(selectedCategoryId);

// 4. Создаем продукт с валидным брендом
const productData = {
    name: "Новый продукт",
    category: selectedCategoryId,
    brand: brands.results[0].id,  // Бренд гарантированно принадлежит выбранной категории
    // ... остальные поля
};

const newProduct = await adminAPI.createProductJson(productData);
```

## Преимущества изменений

1. **Целостность данных** - каждый продукт имеет связанный бренд
2. **Валидация связей** - бренд всегда принадлежит категории продукта
3. **Улучшенный UX** - пользователь видит только релевантные бренды
4. **Производительность** - загружаются только нужные бренды
5. **Консистентность** - единообразная структура данных 