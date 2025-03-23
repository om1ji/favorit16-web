'use server';

import { revalidatePath } from 'next/cache';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function submitContactForm(formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    // Извлекаем данные из формы
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    // Валидация данных
    if (!name || !email || !message) {
      return {
        success: false,
        message: 'Пожалуйста, заполните все обязательные поля'
      };
    }
    
    // В реальном приложении здесь был бы API-запрос к бэкенду
    // Имитируем задержку обработки
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Имитация отправки данных на сервер
    console.log('Отправка контактной формы:', { name, email, phone, message });
    
    // Очищаем кеш страницы
    revalidatePath('/contacts');
    
    return {
      success: true,
      message: 'Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.'
    };
  } catch (error) {
    console.error('Ошибка при отправке формы:', error);
    return {
      success: false,
      message: 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.'
    };
  }
} 