package com.example.setorsampah.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import com.example.setorsampah.model.Admin;
import com.example.setorsampah.model.BankCapacity;
import com.example.setorsampah.model.Warga;
import com.example.setorsampah.model.WasteBank;
import com.example.setorsampah.model.WasteCategory;
import com.example.setorsampah.model.WasteType;
import com.example.setorsampah.repository.BankCapacityRepository;
import com.example.setorsampah.repository.UserRepository;
import com.example.setorsampah.repository.WasteBankRepository;
import com.example.setorsampah.repository.WasteCategoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        Admin admin = new Admin();
        admin.setNama("Admin Test");
        admin.setAlamat("Jl. Test");
        admin.setEmail("admin@test.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setPoint(0.0);
        userRepository.save(admin);

        Warga warga = new Warga();
        warga.setNama("Warga Test");
        warga.setAlamat("Jl. Warga");
        warga.setEmail("warga@test.com");
        warga.setPassword(passwordEncoder.encode("password"));
        warga.setPoint(0.0);
        userRepository.save(warga);
    }

    @Test
    void login_returnsJwtToken() throws Exception {
        String body = objectMapper.writeValueAsString(
                java.util.Map.of("email", "warga@test.com", "password", "password"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token").isNotEmpty());
    }

    @Test
    void protectedEndpoint_requiresAuthentication() throws Exception {
        mockMvc.perform(delete("/api/transactions/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminCanAccessProtectedEndpoint() throws Exception {
        String token = loginAndGetToken("admin@test.com", "admin123");

        mockMvc.perform(delete("/api/transactions/999")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    private String loginAndGetToken(String email, String password) throws Exception {
        String body = objectMapper.writeValueAsString(java.util.Map.of("email", email, "password", password));
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("data").get("token").asText();
    }
}
