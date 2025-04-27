# Configuração CORS para permitir comunicação entre frontend e backend

Para garantir que o frontend React possa se comunicar corretamente com o backend Spring, é necessário configurar o CORS (Cross-Origin Resource Sharing) no lado do servidor Spring. Abaixo está um exemplo de como configurar o CORS em uma aplicação Spring Boot:

```java
package com.example.alunosapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Permite requisições de qualquer origem durante o desenvolvimento
        config.addAllowedOrigin("*");
        
        // Em ambiente de produção, especifique a origem exata:
        // config.addAllowedOrigin("http://seu-dominio-frontend.com");
        
        config.addAllowedHeader("*");
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
```

Esta configuração deve ser adicionada ao seu projeto Spring para permitir que o frontend React se comunique com a API.
