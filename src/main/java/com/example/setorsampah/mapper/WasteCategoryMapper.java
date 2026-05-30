package com.example.setorsampah.mapper;

import com.example.setorsampah.dto.WasteCategoryRequest;
import com.example.setorsampah.dto.WasteCategoryResponse;
import com.example.setorsampah.model.WasteCategory;

public class WasteCategoryMapper {

    public static WasteCategoryResponse toResponse(WasteCategory category) {
        if (category == null) {
            return null;
        }
        return new WasteCategoryResponse(category.getId(), category.getName(), category.getPointPerKg(), category.getDescription(), category.getWasteType());
    }

    public static WasteCategory toEntity(WasteCategoryRequest request) {
        if (request == null) {
            return null;
        }
        WasteCategory category = new WasteCategory();
        category.setName(request.getName());
        category.setPointPerKg(request.getPointPerKg());
        category.setDescription(request.getDescription());
        category.setWasteType(request.getWasteType());
        return category;
    }
}
