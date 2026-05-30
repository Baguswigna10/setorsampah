package com.example.setorsampah.integration;

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
class TransactionIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WasteBankRepository bankRepository;

    @Autowired
    private WasteCategoryRepository categoryRepository;

    @Autowired
    private BankCapacityRepository capacityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Long wargaId;
    private Long bankId;
    private Long categoryId;

    @BeforeEach
    void setUp() {
        Warga warga = new Warga();
        warga.setNama("Budi");
        warga.setAlamat("Jl. Melati");
        warga.setEmail("budi@test.com");
        warga.setPassword(passwordEncoder.encode("password"));
        warga.setPoint(0.0);
        wargaId = userRepository.save(warga).getId();

        WasteBank bank = new WasteBank();
        bank.setName("Bank Test");
        bank.setAddress("Jl. Bank");
        bankId = bankRepository.save(bank).getId();

        WasteCategory category = new WasteCategory();
        category.setName("Plastik");
        category.setPointPerKg(5.0);
        category.setWasteType(WasteType.ANORGANIK);
        categoryId = categoryRepository.save(category).getId();

        BankCapacity capacity = new BankCapacity();
        capacity.setBank(bank);
        capacity.setCategory(categoryRepository.findById(categoryId).orElseThrow());
        capacity.setMaxCapacity(100.0);
        capacity.setUsedCapacity(0.0);
        capacityRepository.save(capacity);
    }

    @Test
    void wargaCanCreateTransaction() throws Exception {
        String token = login("budi@test.com", "password");

        String body = objectMapper.writeValueAsString(java.util.Map.of(
                "userId", wargaId,
                "bankId", bankId,
                "items", java.util.List.of(java.util.Map.of("categoryId", categoryId, "weight", 10.0))
        ));

        mockMvc.perform(post("/api/transactions")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.totalPoint").value(55.0));
    }

    private String login(String email, String password) throws Exception {
        String body = objectMapper.writeValueAsString(java.util.Map.of("email", email, "password", password));
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }
}
