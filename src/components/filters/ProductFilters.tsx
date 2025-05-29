"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  fetchBrands,
  selectBrands,
} from "@/redux/features/productsSlice";
import { Brand } from "@/types/api";
import "./ProductFilters.scss";

interface ProductFiltersProps {
  onFilterChange: (filters: any) => void;
  categoryType?: 'tire' | 'wheel' | 'other';
}

interface FilterState {
  // Common filters
  diameter: number | undefined;
  brand: string | undefined;
  
  // Tire specific filters
  width: number | undefined;
  profile: number | undefined;
  
  // Wheel specific filters
  wheel_width: number | undefined;
  et_offset: number | undefined;
  pcd: number | undefined;
  bolt_count: number | undefined;
  center_bore: number | undefined;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ 
  onFilterChange, 
  categoryType = 'tire' 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const brands = useSelector(selectBrands);

  // Common filters
  const [selectedDiameter, setSelectedDiameter] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  
  // Tire specific filters
  const [selectedWidth, setSelectedWidth] = useState<string>("");
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  
  // Wheel specific filters
  const [selectedWheelWidth, setSelectedWheelWidth] = useState<string>("");
  const [selectedEtOffset, setSelectedEtOffset] = useState<string>("");
  const [selectedPcd, setSelectedPcd] = useState<string>("");
  const [selectedBoltCount, setSelectedBoltCount] = useState<string>("");
  const [selectedCenterBore, setSelectedCenterBore] = useState<string>("");
  
  const [filtersInitialized, setFiltersInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(brands.length === 0);

  const loadingBrands = useRef(false);
  const prevFilters = useRef<FilterState>({
    diameter: undefined,
    brand: undefined,
    width: undefined,
    profile: undefined,
    wheel_width: undefined,
    et_offset: undefined,
    pcd: undefined,
    bolt_count: undefined,
    center_bore: undefined,
  });
  const isResetting = useRef(false);

  // Tire specific constants
  const widths = [
    "145", "155", "165", "175", "185", "195", "205", "215", "225", 
    "235", "245", "255", "265", "275", "285", "295", "305", "315",
  ];
  const profiles = [
    "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85",
  ];
  
  // Common constants
  const diameters = [
    "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22",
  ];
  
  // Wheel specific constants
  const wheelWidths = [
    "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12",
  ];
  const etOffsets = [
    "-20", "-15", "-10", "-5", "0", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60",
  ];
  const pcds = [
    "98", "100", "108", "110", "112", "114.3", "115", "120", "130", "139.7", "150",
  ];
  const boltCounts = ["4", "5", "6", "8"];
  const centerBores = [
    "54.1", "56.1", "57.1", "58.1", "60.1", "63.4", "64.1", "65.1", "66.6", "67.1", "70.1", "72.6", "74.1",
  ];

  useEffect(() => {
    const fetchBrandsIfNeeded = async () => {
      if (brands.length === 0 && !loadingBrands.current) {
        console.log("Fetching brands");
        loadingBrands.current = true;
        try {
          await dispatch(fetchBrands());
        } finally {
          loadingBrands.current = false;
          setIsLoading(false);
          setFiltersInitialized(true);
        }
      } else if (!filtersInitialized) {
        setIsLoading(false);
        setFiltersInitialized(true);
      }
    };

    fetchBrandsIfNeeded();
  }, []);
  useEffect(() => {
    if (!filtersInitialized || isLoading) return;

    if (isResetting.current) {
      isResetting.current = false;
      return;
    }

    const currentFilters: FilterState = {
      diameter: selectedDiameter ? parseInt(selectedDiameter) : undefined,
      brand: selectedBrand || undefined,
      width: selectedWidth ? parseInt(selectedWidth) : undefined,
      profile: selectedProfile ? parseInt(selectedProfile) : undefined,
      wheel_width: selectedWheelWidth ? parseFloat(selectedWheelWidth) : undefined,
      et_offset: selectedEtOffset ? parseInt(selectedEtOffset) : undefined,
      pcd: selectedPcd ? parseFloat(selectedPcd) : undefined,
      bolt_count: selectedBoltCount ? parseInt(selectedBoltCount) : undefined,
      center_bore: selectedCenterBore ? parseFloat(selectedCenterBore) : undefined,
    };

    const filtersChanged =
      currentFilters.diameter !== prevFilters.current.diameter ||
      currentFilters.brand !== prevFilters.current.brand ||
      currentFilters.width !== prevFilters.current.width ||
      currentFilters.profile !== prevFilters.current.profile ||
      currentFilters.wheel_width !== prevFilters.current.wheel_width ||
      currentFilters.et_offset !== prevFilters.current.et_offset ||
      currentFilters.pcd !== prevFilters.current.pcd ||
      currentFilters.bolt_count !== prevFilters.current.bolt_count ||
      currentFilters.center_bore !== prevFilters.current.center_bore;

    if (filtersChanged) {
      console.log("Filters changed, updating");
      prevFilters.current = { ...currentFilters };

      // Отправляем только релевантные фильтры в зависимости от типа категории
      const relevantFilters: any = {
        diameter: currentFilters.diameter,
        brand: currentFilters.brand,
      };

      if (categoryType === 'tire') {
        relevantFilters.width = currentFilters.width;
        relevantFilters.profile = currentFilters.profile;
      } else if (categoryType === 'wheel') {
        relevantFilters.wheel_width = currentFilters.wheel_width;
        relevantFilters.et_offset = currentFilters.et_offset;
        relevantFilters.pcd = currentFilters.pcd;
        relevantFilters.bolt_count = currentFilters.bolt_count;
        relevantFilters.center_bore = currentFilters.center_bore;
      }

      onFilterChange(relevantFilters);
    }
  }, [
    selectedDiameter,
    selectedBrand,
    selectedWidth,
    selectedProfile,
    selectedWheelWidth,
    selectedEtOffset,
    selectedPcd,
    selectedBoltCount,
    selectedCenterBore,
    categoryType,
    filtersInitialized,
    isLoading,
    onFilterChange,
  ]);

  const handleResetFilters = () => {
    isResetting.current = true;

    // Reset all filter states
    setSelectedDiameter("");
    setSelectedBrand("");
    setSelectedWidth("");
    setSelectedProfile("");
    setSelectedWheelWidth("");
    setSelectedEtOffset("");
    setSelectedPcd("");
    setSelectedBoltCount("");
    setSelectedCenterBore("");

    const resetFilters: FilterState = {
      diameter: undefined,
      brand: undefined,
      width: undefined,
      profile: undefined,
      wheel_width: undefined,
      et_offset: undefined,
      pcd: undefined,
      bolt_count: undefined,
      center_bore: undefined,
    };

    prevFilters.current = resetFilters;

    // Send only relevant filters based on category type
    const relevantFilters: any = {
      diameter: undefined,
      brand: undefined,
    };

    if (categoryType === 'tire') {
      relevantFilters.width = undefined;
      relevantFilters.profile = undefined;
    } else if (categoryType === 'wheel') {
      relevantFilters.wheel_width = undefined;
      relevantFilters.et_offset = undefined;
      relevantFilters.pcd = undefined;
      relevantFilters.bolt_count = undefined;
      relevantFilters.center_bore = undefined;
    }

    onFilterChange(relevantFilters);
  };

  return (
    <div className="tire-filters">
      <h3>Параметры {categoryType === 'tire' ? 'шин' : categoryType === 'wheel' ? 'дисков' : ''}</h3>

      {isLoading ? (
        <div className="loading-filters">Загрузка фильтров...</div>
      ) : (
        <>
          {/* Общие фильтры */}
          <div className="filter-group">
            <label>Диаметр (дюйм)</label>
            <select
              value={selectedDiameter}
              onChange={(e) => setSelectedDiameter(e.target.value)}
            >
              <option value="">Все</option>
              {diameters.map((diameter) => (
                <option key={diameter} value={diameter}>
                  {diameter}
                </option>
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
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Фильтры для шин */}
          {categoryType === 'tire' && (
            <>
              <div className="filter-group">
                <label>Ширина (мм)</label>
                <select
                  value={selectedWidth}
                  onChange={(e) => setSelectedWidth(e.target.value)}
                >
                  <option value="">Все</option>
                  {widths.map((width) => (
                    <option key={width} value={width}>
                      {width}
                    </option>
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
                  {profiles.map((profile) => (
                    <option key={profile} value={profile}>
                      {profile}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Фильтры для дисков */}
          {categoryType === 'wheel' && (
            <>
              <div className="filter-group">
                <label>Ширина диска (дюйм)</label>
                <select
                  value={selectedWheelWidth}
                  onChange={(e) => setSelectedWheelWidth(e.target.value)}
                >
                  <option value="">Все</option>
                  {wheelWidths.map((width) => (
                    <option key={width} value={width}>
                      {width}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Вылет ET (мм)</label>
                <select
                  value={selectedEtOffset}
                  onChange={(e) => setSelectedEtOffset(e.target.value)}
                >
                  <option value="">Все</option>
                  {etOffsets.map((offset) => (
                    <option key={offset} value={offset}>
                      {offset}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>PCD (мм)</label>
                <select
                  value={selectedPcd}
                  onChange={(e) => setSelectedPcd(e.target.value)}
                >
                  <option value="">Все</option>
                  {pcds.map((pcd) => (
                    <option key={pcd} value={pcd}>
                      {pcd}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Количество болтов</label>
                <select
                  value={selectedBoltCount}
                  onChange={(e) => setSelectedBoltCount(e.target.value)}
                >
                  <option value="">Все</option>
                  {boltCounts.map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Центральное отверстие (мм)</label>
                <select
                  value={selectedCenterBore}
                  onChange={(e) => setSelectedCenterBore(e.target.value)}
                >
                  <option value="">Все</option>
                  {centerBores.map((bore) => (
                    <option key={bore} value={bore}>
                      {bore}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button className="reset-filters" onClick={handleResetFilters}>
            Сбросить фильтры
          </button>
        </>
      )}
    </div>
  );
};

export default ProductFilters;
