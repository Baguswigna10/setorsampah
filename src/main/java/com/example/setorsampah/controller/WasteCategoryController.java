package com.example.setorsampah.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.setorsampah.dto.ApiResponse;
import com.example.setorsampah.dto.WasteCategoryRequest;
import com.example.setorsampah.dto.WasteCategoryResponse;
import com.example.setorsampah.service.WasteCategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Validated
public class WasteCategoryController {

    private final WasteCategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<WasteCategoryResponse>>> getCategories(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<WasteCategoryResponse> categories = categoryService.getCategories(pageable, search);
        return ResponseEntity.ok(ApiResponse.successWithPage(categories, "Daftar kategori berhasil diambil"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WasteCategoryResponse>> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getCategoryById(id), "Kategori ditemukan"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WasteCategoryResponse>> createCategory(@Valid @RequestBody WasteCategoryRequest request) {
        return new ResponseEntity<>(ApiResponse.success(categoryService.createCategory(request), "Kategori berhasil dibuat"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WasteCategoryResponse>> updateCategory(@PathVariable Long id, @Valid @RequestBody WasteCategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.updateCategory(id, request), "Kategori berhasil diperbarui"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Kategori berhasil dihapus"));
    }
}
