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

import com.example.setorsampah.model.Reward;
import com.example.setorsampah.model.Warga;
import com.example.setorsampah.repository.RewardRepository;
import com.example.setorsampah.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class RewardClaimIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Long wargaId;
    private Long rewardId;

    @BeforeEach
    void setUp() {
        Warga warga = new Warga();
        warga.setNama("Budi");
        warga.setAlamat("Jl. Melati");
        warga.setEmail("budi-claim@test.com");
        warga.setPassword(passwordEncoder.encode("password"));
        warga.setPoint(600.0);
        wargaId = userRepository.save(warga).getId();

        Reward reward = new Reward();
        reward.setName("Voucher Sembako");
        reward.setPointCost(500.0);
        reward.setStock(3);
        rewardId = rewardRepository.save(reward).getId();
    }

    @Test
    void wargaCanClaimReward() throws Exception {
        String token = login("budi-claim@test.com", "password");

        String body = objectMapper.writeValueAsString(java.util.Map.of(
                "userId", wargaId,
                "rewardId", rewardId
        ));

        mockMvc.perform(post("/api/claims")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.status").value("APPROVED"))
                .andExpect(jsonPath("$.data.pointCost").value(500.0));
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
