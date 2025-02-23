"use client";

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { User, getMe } from '@/redux/features/authSlice';
import { authAPI } from '@/services/api';
import './ProfileInfo.scss';

interface ProfileInfoProps {
  user: User | null;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authAPI.updateProfile(formData);
      setIsEditing(false);
      // Обновляем данные пользователя в Redux
      dispatch(getMe() as any);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Произошла ошибка при обновлении профиля'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setError(null);
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-info">
      <div className="section-header">
        <h2>Личные данные</h2>
        <button
          className="edit-button"
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          disabled={loading}
        >
          {isEditing ? 'Отменить' : 'Редактировать'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="name">Имя</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
              minLength={2}
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Телефон</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={loading}
              pattern="[0-9+\-\s]+"
              title="Введите корректный номер телефона"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={handleCancel}
              disabled={loading}
            >
              Отменить
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={loading}
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      ) : (
        <div className="info-display">
          <div className="info-group">
            <span className="label">Имя:</span>
            <span className="value">{user.name}</span>
          </div>
          <div className="info-group">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>
          {user.phone && (
            <div className="info-group">
              <span className="label">Телефон:</span>
              <span className="value">{user.phone}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileInfo; 