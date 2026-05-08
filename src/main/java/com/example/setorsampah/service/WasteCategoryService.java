package com.example.setorsampah.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.setorsampah.model.WasteCategory;
import com.example.setorsampah.repository.WasteCategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WasteCategoryService {

    private final WasteCategoryRepository categoryRepository;

    public WasteCategory createCategory(WasteCategory category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Kategori sampah sudah ada");
        }
        return categoryRepository.save(category);
    }

    public List<WasteCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<WasteCategory> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public WasteCategory updateCategory(Long id, WasteCategory categoryDetails) {
        return categoryRepository.findById(id).map(category -> {
            category.setName(categoryDetails.getName());
            category.setPointPerKg(categoryDetails.getPointPerKg());
            category.setDescription(categoryDetails.getDescription());
            return categoryRepository.save(category);
        }).orElseThrow(() -> new RuntimeException("Kategori sampah tidak ditemukan"));
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
