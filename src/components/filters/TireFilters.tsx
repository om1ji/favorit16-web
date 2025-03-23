'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  fetchBrands,
  selectBrands
} from '@/redux/features/productsSlice';
import { Brand } from '@/types/api';
import './TireFilters.scss';

interface TireFiltersProps {
  onFilterChange: (filters: {
    brand?: string;
    diameter?: number;
    min_diameter?: number;
    max_diameter?: number;
    width?: number;
    min_width?: number;
    max_width?: number;
    profile?: number;
    min_profile?: number;
    max_profile?: number;
  }) => void;
}

const TireFilters: React.FC<TireFiltersProps> = ({ onFilterChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const brands = useSelector(selectBrands);
  
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedDiameter, setSelectedDiameter] = useState<string>('');
  const [selectedWidth, setSelectedWidth] = useState<string>('');
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  
  // Массивы значений для фильтров
  const diameters = Array.from({ length: 13 }, (_, i) => i + 13); // от 13 до 25 дюймов
  const widths = [145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325, 335, 345];
  const profiles = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85];

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  useEffect(() => {
    const filters = {
      ...(selectedBrand && { brand: selectedBrand }),
      ...(selectedDiameter && { diameter: parseInt(selectedDiameter) }),
      ...(selectedWidth && { width: parseInt(selectedWidth) }),
      ...(selectedProfile && { profile: parseInt(selectedProfile) }),
    };
    
    onFilterChange(filters);
  }, [selectedBrand, selectedDiameter, selectedWidth, selectedProfile, onFilterChange]);

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
  };

  const handleDiameterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDiameter(e.target.value);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWidth(e.target.value);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProfile(e.target.value);
  };

  const resetFilters = () => {
    setSelectedBrand('');
    setSelectedDiameter('');
    setSelectedWidth('');
    setSelectedProfile('');
  };

  return (
    <div className="tire-filters">
      <h3>Подбор шин</h3>
      
      <div className="filter-group">
        <label>Производитель</label>
        <select value={selectedBrand} onChange={handleBrandChange}>
          <option value="">Все производители</option>
          {brands.map((brand: Brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <label>Диаметр (R)</label>
        <select value={selectedDiameter} onChange={handleDiameterChange}>
          <option value="">Все размеры</option>
          {diameters.map((diameter) => (
            <option key={diameter} value={diameter}>
              R{diameter}
            </option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <label>Ширина (мм)</label>
        <select value={selectedWidth} onChange={handleWidthChange}>
          <option value="">Все значения</option>
          {widths.map((width) => (
            <option key={width} value={width}>
              {width} мм
            </option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <label>Профиль (%)</label>
        <select value={selectedProfile} onChange={handleProfileChange}>
          <option value="">Все значения</option>
          {profiles.map((profile) => (
            <option key={profile} value={profile}>
              {profile}%
            </option>
          ))}
        </select>
      </div>
      
      <button className="reset-filters" onClick={resetFilters}>
        Сбросить фильтры
      </button>
    </div>
  );
};

export default TireFilters; 