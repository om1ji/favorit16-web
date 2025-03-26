"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  fetchBrands,
  selectBrands,
} from "@/redux/features/productsSlice";
import { Brand } from "@/types/api";
import "./TireFilters.scss";

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

  const [selectedWidth, setSelectedWidth] = useState<string>("");
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [selectedDiameter, setSelectedDiameter] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [filtersInitialized, setFiltersInitialized] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(brands.length === 0);

  const loadingBrands = useRef(false);
  const prevFilters = useRef<FilterState>({
    width: undefined,
    profile: undefined,
    diameter: undefined,
    brand: undefined,
  });
  const isResetting = useRef(false);

  const widths = [
    "145",
    "155",
    "165",
    "175",
    "185",
    "195",
    "205",
    "215",
    "225",
    "235",
    "245",
    "255",
    "265",
    "275",
    "285",
    "295",
    "305",
    "315",
  ];
  const profiles = [
    "30",
    "35",
    "40",
    "45",
    "50",
    "55",
    "60",
    "65",
    "70",
    "75",
    "80",
    "85",
  ];
  const diameters = [
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
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

    const currentFilters = {
      width: selectedWidth ? parseInt(selectedWidth) : undefined,
      profile: selectedProfile ? parseInt(selectedProfile) : undefined,
      diameter: selectedDiameter ? parseInt(selectedDiameter) : undefined,
      brand: selectedBrand || undefined,
    };

    const filtersChanged =
      currentFilters.width !== prevFilters.current.width ||
      currentFilters.profile !== prevFilters.current.profile ||
      currentFilters.diameter !== prevFilters.current.diameter ||
      currentFilters.brand !== prevFilters.current.brand;

    if (filtersChanged) {
      console.log("Filters changed, updating");
      prevFilters.current = { ...currentFilters };

      onFilterChange(currentFilters);
    }
  }, [
    selectedWidth,
    selectedProfile,
    selectedDiameter,
    selectedBrand,
    filtersInitialized,
    isLoading,
    onFilterChange,
  ]);

  const handleResetFilters = () => {
    isResetting.current = true;

    setSelectedWidth("");
    setSelectedProfile("");
    setSelectedDiameter("");
    setSelectedBrand("");

    prevFilters.current = {
      width: undefined,
      profile: undefined,
      diameter: undefined,
      brand: undefined,
    };

    onFilterChange({
      width: undefined,
      profile: undefined,
      diameter: undefined,
      brand: undefined,
    });
  };

  return (
    <div className="tire-filters">
      <h3>Параметры</h3>

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

          <button className="reset-filters" onClick={handleResetFilters}>
            Сбросить фильтры
          </button>
        </>
      )}
    </div>
  );
};

export default TireFilters;
