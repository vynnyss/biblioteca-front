# Problema de CORS Identificado

## Sintoma
Os testes E2E estão falhando com o erro:
```
REQUEST FAILED: net::ERR_ABORTED
```

## Causa Raiz
O **backend não está configurado para aceitar requisições CORS** do frontend rodando em `http://localhost:4200`.

### Como identificamos:
1. ✅ Backend está rodando em `http://localhost:8080`
2. ✅ Endpoint `/auth/login` funciona via curl
3. ✅ Usuário existe no banco de dados
4. ✅ Requisição é enviada do navegador
5. ❌ **Requisição é abortada com `net::ERR_ABORTED`** = problema de CORS

## Solução

### No Backend (Java Spring Boot)

O backend precisa ter uma configuração de CORS. Procure ou crie uma classe de configuração similar a:

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200") // Frontend URL
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### Ou usando @CrossOrigin nos Controllers

Adicione a anotação nos controllers:

```java
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    // ... seus endpoints
}
```

### Verificar se já existe configuração

Procure no backend por:
- Arquivos com nome `CorsConfig`, `WebConfig` ou similar
- Anotações `@CrossOrigin` nos controllers
- Configurações no `application.properties` ou `application.yml`

## Teste rápido

Após configurar CORS no backend, teste com curl para ver se os headers CORS aparecem:

```bash
curl -X OPTIONS http://localhost:8080/auth/login \
  -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Você deve ver headers como:
```
Access-Control-Allow-Origin: http://localhost:4200
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

## Depois de configurar CORS

Execute os testes novamente:
```bash
npx playwright test
```

## Configuração alternativa para desenvolvimento

Se quiser permitir todas as origens durante desenvolvimento (NÃO recomendado para produção):

```java
.allowedOrigins("*")
```

Mas para produção, sempre especifique as origens permitidas explicitamente.
