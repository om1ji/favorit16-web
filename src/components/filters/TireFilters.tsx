'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  fetchBrands,
  selectBrands,
  selectLoading,
  setCurrentFilters
} from '@/redux/features/productsSlice';
import { Brand } from '@/types/api';
import './TireFilters.scss';

interface TireFiltersProps {
  onFilterChange: (filters: any) => void;
}

interface FilterState {
  width: number | undefined;
  profile: number | undefined;
  diameter: number | undefined;
  brand: string | undefined;
}

const TireFilters: React.FC<TireFiltersProps> = ({ onFilterChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const brands = useSelector(selectBrands);
  const loading = useSelector(selectLoading);
  
  const [selectedWidth, setSelectedWidth] = useState<string>('');
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [selectedDiameter, setSelectedDiameter] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [filtersInitialized, setFiltersInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Локальное состояние загрузки
  
  // Ref для отслеживания загрузки брендов и предотвращения повторных вызовов
  const loadingBrands = useRef(false);
  const filtersApplied = useRef(false);
  const prevFilters = useRef<FilterState>({
    width: undefined, 
    profile: undefined, 
    diameter: undefined, 
    brand: undefined
  });

  // Доступные значения ширины, профиля и диаметра
  const widths = ['145', '155', '165', '175', '185', '195', '205', '215', '225', '235', '245', '255', '265', '275', '285', '295', '305', '315'];
  const profiles = ['30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80', '85'];
  const diameters = ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'];

  // Загружаем бренды только один раз при монтировании компонента
  useEffect(() => {
    if (brands.length === 0 && !loadingBrands.current && !loading) {
      console.log('Fetching brands');
      setIsLoading(true);
      loadingBrands.current = true;
      dispatch(fetchBrands())
        .finally(() => {
          loadingBrands.current = false;
          setIsLoading(false);
        });
    } else {
      // Если бренды уже загружены, просто сбрасываем локальное состояние загрузки
      setIsLoading(false);
    }
    
    // Устанавливаем флаг инициализации после первого рендера
    if (!filtersInitialized) {
      setFiltersInitialized(true);
    }
  }, [dispatch, brands, loading]);

  // Вызываем callback только после инициализации и при изменении значений
  useEffect(() => {
    if (!filtersInitialized || isLoading) return;
    
    const currentFilters = {
      width: selectedWidth ? parseInt(selectedWidth) : undefined,
      profile: selectedProfile ? parseInt(selectedProfile) : undefined,
      diameter: selectedDiameter ? parseInt(selectedDiameter) : undefined,
      brand: selectedBrand || undefined,
    };
    
    // Проверяем, изменились ли фильтры по сравнению с предыдущими
    const filtersChanged = 
      currentFilters.width !== prevFilters.current.width ||
      currentFilters.profile !== prevFilters.current.profile ||
      currentFilters.diameter !== prevFilters.current.diameter ||
      currentFilters.brand !== prevFilters.current.brand;
    
    if (filtersChanged) {
      console.log('Filters changed, updating');
      // Сохраняем фильтры в Redux для кеширования
      dispatch(setCurrentFilters(currentFilters));
      
      // Обновляем предыдущие фильтры
      prevFilters.current = { ...currentFilters };
      
      // Вызываем колбэк с обновленными фильтрами только если фильтры изменились
      onFilterChange(currentFilters);
    }
  }, [selectedWidth, selectedProfile, selectedDiameter, selectedBrand, filtersInitialized, isLoading, dispatch, onFilterChange]);

  return (
    <div className="tire-filters">
      <h3>Параметры шин</h3>
      
      {isLoading ? (
        <div className="loading-filters">Загрузка фильтров...</div>
      ) : (
        <>
          <div className="filter-group">
            <label>Ширина (мм)</label>
            <select 
              value={selectedWidth}
              onChange={(e) => setSelectedWidth(e.target.value)}
            >
              <option value="">Все</option>
              {widths.map(width => (
                <option key={width} value={width}>{width}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Профиль (%)</label>
            <select 
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
            >
              <option value="">Все</option>
              {profiles.map(profile => (
                <option key={profile} value={profile}>{profile}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Диаметр (дюйм)</label>
            <select 
              value={selectedDiameter}
              onChange={(e) => setSelectedDiameter(e.target.value)}
            >
              <option value="">Все</option>
              {diameters.map(diameter => (
                <option key={diameter} value={diameter}>{diameter}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Бренд</label>
            <select 
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              disabled={brands.length === 0}
            >
              <option value="">Все</option>
              {brands.map((brand: Brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>
          
          <button 
            className="reset-filters"
            onClick={() => {
              setSelectedWidth('');
              setSelectedProfile('');
              setSelectedDiameter('');
              setSelectedBrand('');
            }}
          >
            Сбросить фильтры
          </button>
        </>
      )}
    </div>
  );
};

export default TireFilters; 