# Guía de Configuración del Backend (Sin Lambda)

Esta guía explica cómo conectar **API Gateway directamente a DynamoDB**. Es más ligero (no pagas por Lambda) y muy rápido, aunque la configuración es un poco más técnica en Amazon.

---

## 1. Crear la Tabla en DynamoDB
1.  Ve a **DynamoDB** -> **Tablas** -> **Crear tabla**.
2.  **Nombre de la tabla**: `TaskTable`.
3.  **Clave de partición**: `userId` (Cadena).
4.  **Clave de ordenación**: `id` (Cadena).
5.  Clica en **Crear tabla**.

---

## 2. Crear el Rol de Permisos (IAM)
Como no hay Lambda, el propio API Gateway necesita permiso para escribir en la tabla.

1.  Ve a **IAM** -> **Roles** -> **Crear rol**.
2.  Selecciona **Servicio de AWS**.
3.  En el buscador de servicios, elige **API Gateway**.
4.  Selecciona **API Gateway - Allows API Gateway to push logs to CloudWatch** (luego le daremos más permisos).
5.  Nombre: `APIGatewayDynamoDirectRole`. Créalo.
6.  Ahora busca el rol que creaste, clica en **Agregar permisos** -> **Asociar políticas**.
7.  Busca `AmazonDynamoDBFullAccess` y asóciala.

---

## 3. Configurar API Gateway Directo
Aquí viene lo importante: mapear la petición directamente a la base de datos.

1.  Ve a **API Gateway** -> **Crear API** -> **API de REST** (Importante: NO la "HTTP API", tiene que ser "REST API").
2.  **Configurar Autorizador**: (Igual que antes)
    - Crea un autorizador de tipo **Cognito** usando tu User Pool.
    - Token: `Authorization`.
3.  **Crear Recurso `/tasks`**:
    - Crea el método **POST**.
    - **Tipo de integración**: **Servicio de AWS**.
    - **Región**: (La tuya, ej: `sa-east-1`).
    - **Servicio**: **DynamoDB**.
    - **Método HTTP**: **POST**. (⚠️ ¡IMPORTANTE! Aunque el método externo sea GET, la comunicación interna con DynamoDB siempre debe ser POST).
    - **Acción**: `PutItem`.
    - **Rol de ejecución**: Pega el ARN del rol `APIGatewayDynamoDirectRole` que creaste en el paso anterior.
    
4.  **Mapeo de Seguridad (VTL)**:
    - En el método POST, ve a **Integración de solicitud** -> **Plantillas de mapeo**.
    - Añade una plantilla para `application/json`.
    - Pega este código (Esto inyecta tu ID de usuario de forma segura):

```json
{
    "TableName": "TaskTable",
    "Item": {
        "userId": { "S": "$context.authorizer.claims.sub" },
        "id": { "S": "$input.path('$.id')" },
        "name": { "S": "$input.path('$.name')" },
        "createdAt": { "S": "$input.path('$.createdAt')" },
        "priority": { "S": "$input.path('$.priority')" },
        "progress": { "N": "$input.path('$.progress')" },
        "description": { "S": "$input.path('$.description')" }
    }
}
```

5.  **Repetir para GET**:
    - Crea un método **GET** en `/tasks`.
    - Acción: `Query`.
    - Plantilla de mapeo:
```json
{
    "TableName": "TaskTable",
    "KeyConditionExpression": "userId = :v1",
    "ExpressionAttributeValues": {
        ":v1": { "S": "$context.authorizer.claims.sub" }
    }
}
```

---

## 4. Configurar el método DELETE
Para poder borrar tareas, necesitamos un recurso con el ID.

1.  En el recurso `/tasks` de API Gateway, clica en **Crear recurso**.
2.  **Nombre del recurso**: `taskId`.
    **Ruta del recurso**: `{id}` (esto crea `/tasks/{id}`).
3.  Crea un método **DELETE** dentro de `{id}`.
4.  **Tipo de integración**: Servicio de AWS -> DynamoDB -> DELETE.
5.  **Acción**: `DeleteItem`.
6.  **Plantilla de mapeo (VTL)** para `application/json`:
```json
{
    "TableName": "TaskTable",
    "Key": {
        "userId": { "S": "$context.authorizer.claims.sub" },
        "id": { "S": "$method.request.path.id" }
    }
}
```

---

## 5. Implementación y CORS
1.  Activa **CORS** en el recurso `/tasks` y también en el nivel de `{id}`.
2.  **Implementar API** en una etapa llamada `prod`.
3.  Copia la URL y ponla en tu `.env`.

---

## 6. Solucionar el Error de CORS
Si ves el error de "Blocked by CORS policy", es porque API Gateway no está enviando el permiso de vuelta al navegador.

### Paso A: Botón Mágico de CORS
1.  En API Gateway, selecciona el recurso `/tasks`.
2.  Clica en el botón **"Habilitar CORS"** (Enable CORS).
3.  En **Gateways de respuesta**, marca las casillas de "4xx" y "5xx" (para ver errores también).
4.  En **Access-Control-Allow-Headers**, asegúrate de que diga: `'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'`. (Importante que esté `Authorization`).
5.  En **Access-Control-Allow-Origin**, puedes poner `'*'` para probar, o `'http://localhost:4321'`.
6.  Clica en **Guardar**.

### Paso B: Mapeo Manual (Solo si el paso A no basta)
En integraciones directas, a veces hay que forzar el header en la respuesta:
1.  Entra en tu método (ej: POST).
2.  Ve a **Respuesta de método** -> Clica en el `200`.
3.  En **Encabezados de respuesta HTTP**, añade `Access-Control-Allow-Origin`.
4.  Luego ve a **Respuesta de integración** -> Clica en la flechita del `200`.
5.  En **Mapeo de encabezados**, busca `Access-Control-Allow-Origin` y ponle de valor `'*'` (con comillas simples).

---

## 7. ¡IMPORTANTE! Implementar cambios
Cada vez que toques algo en API Gateway (CORS, Autorizador, Plantillas):
1.  Clica en el botón naranja **"Implementar API"** (Deploy API).
2.  Selecciona la etapa `prod`.
3.  Dale a **Implementar**.

Sin este paso, los cambios no existen para el navegador.
