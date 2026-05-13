package com.example.setorsampah.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.setorsampah.dto.WasteCategoryRequest;
import com.example.setorsampah.dto.WasteCategoryResponse;

public interface WasteCategoryService {
    Page<WasteCategoryResponse> getCategories(Pageable pageable, String search);
    WasteCategoryResponse getCategoryById(Long id);
    WasteCategoryResponse createCategory(WasteCategoryRequest request);
    WasteCategoryResponse updateCategory(Long id, WasteCategoryRequest request);
    void deleteCategory(Long id);
}
