package com.example.setorsampah.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.setorsampah.dto.WasteCategoryRequest;
import com.example.setorsampah.dto.WasteCategoryResponse;
import com.example.setorsampah.mapper.WasteCategoryMapper;
import com.example.setorsampah.model.WasteCategory;
import com.example.setorsampah.repository.WasteCategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WasteCategoryServiceImpl implements WasteCategoryService {

    private final WasteCategoryRepository categoryRepository;

    @Override
    public Page<WasteCategoryResponse> getCategories(Pageable pageable, String search) {
        if (search == null || search.isBlank()) {
            return categoryRepository.findAll(pageable).map(WasteCategoryMapper::toResponse);
        }
        return categoryRepository.findByNameContainingIgnoreCase(search, pageable).map(WasteCategoryMapper::toResponse);
    }

    @Override
    public WasteCategoryResponse getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .map(WasteCategoryMapper::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kategori sampah tidak ditemukan"));
    }

    @Override
    public WasteCategoryResponse createCategory(WasteCategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Kategori sampah sudah ada");
        }
        WasteCategory category = WasteCategoryMapper.toEntity(request);
        return WasteCategoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    public WasteCategoryResponse updateCategory(Long id, WasteCategoryRequest request) {
        return categoryRepository.findById(id).map(category -> {
            category.setName(request.getName());
            category.setPointPerKg(request.getPointPerKg());
            category.setDescription(request.getDescription());
            return WasteCategoryMapper.toResponse(categoryRepository.save(category));
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kategori sampah tidak ditemukan"));
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Kategori sampah tidak ditemukan");
        }
        categoryRepository.deleteById(id);
    }
}
