package com.github.sangueamigo.infrastructure.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s-> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> {
                            auth.requestMatchers(
                                    "/auth/cadastro-usuario",
                                    "/auth/login",
                                    "/auth/refresh",
                                    "/auth/recuperar-senha",
                                    "/auth/redefinir-senha",
                                    "/swagger-ui/**",
                                    "/v3/api-docs/**"
                                    ).permitAll();
                            auth.requestMatchers(HttpMethod.GET, "/hemocentros").permitAll();
                            auth.requestMatchers(HttpMethod.GET, "/hemocentros/*").permitAll();
                            auth.requestMatchers(HttpMethod.GET, "/hemocentros/*/horarios").permitAll();
                            auth.requestMatchers(HttpMethod.GET, "/campanhas").permitAll();
                            auth.requestMatchers(HttpMethod.GET, "/campanhas/*").permitAll();
                            auth.requestMatchers(HttpMethod.GET, "/orientacoes/**").permitAll();
                            auth.requestMatchers("/assistente-ia/**").permitAll();
                            auth.anyRequest().authenticated();
                })
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager (AuthenticationConfiguration confg) throws Exception {
        return confg.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
