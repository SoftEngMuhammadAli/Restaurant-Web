const objectId = {
  type: 'string',
  pattern: '^[a-fA-F0-9]{24}$',
  example: '66b7f8f2c9a9f3b7a1d2e4c5',
};

const timestamps = {
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
  deletedAt: { type: 'string', format: 'date-time', nullable: true },
};

const successEnvelope = (dataRef, description = 'Successful response') => ({
  description,
  content: {
    'application/json': {
      schema: {
        allOf: [
          { $ref: '#/components/schemas/SuccessEnvelope' },
          {
            type: 'object',
            properties: {
              data: dataRef,
            },
          },
        ],
      },
    },
  },
});

const listEnvelope = (itemRef, description = 'Paginated list response') => ({
  description,
  content: {
    'application/json': {
      schema: {
        allOf: [
          { $ref: '#/components/schemas/SuccessEnvelope' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: itemRef,
              },
              meta: { $ref: '#/components/schemas/PaginationMeta' },
            },
          },
        ],
      },
    },
  },
});

const jsonRequest = (schemaRef, description = 'JSON request body') => ({
  required: true,
  description,
  content: {
    'application/json': {
      schema: schemaRef,
    },
  },
});

const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'MongoDB ObjectId of the resource.',
  schema: objectId,
};

const listParameters = [
  {
    name: 'page',
    in: 'query',
    description: 'Page number for pagination.',
    schema: { type: 'integer', minimum: 1, default: 1 },
  },
  {
    name: 'limit',
    in: 'query',
    description: 'Number of records per page. Maximum is 100.',
    schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
  },
  {
    name: 'search',
    in: 'query',
    description: 'Optional search term. Supported fields depend on the resource.',
    schema: { type: 'string' },
  },
  {
    name: 'sort',
    in: 'query',
    description: 'Mongoose sort string, for example `-createdAt` or `name`.',
    schema: { type: 'string', default: '-createdAt' },
  },
];

const authResponses = {
  Unauthorized: { $ref: '#/components/responses/Unauthorized' },
  Forbidden: { $ref: '#/components/responses/Forbidden' },
  ValidationError: { $ref: '#/components/responses/ValidationError' },
  NotFound: { $ref: '#/components/responses/NotFound' },
};

const secured = [{ bearerAuth: [] }];

const crudResources = [
  {
    path: '/restaurants',
    tag: 'Restaurants',
    name: 'Restaurant',
    schema: 'Restaurant',
    request: 'RestaurantRequest',
    createRoles: 'SUPER_ADMIN only.',
    description: 'Restaurant workspaces/branches. These are global resources and are not scoped by the current restaurant.',
  },
  {
    path: '/roles',
    tag: 'Roles',
    name: 'Role',
    schema: 'Role',
    request: 'RoleRequest',
    createRoles: 'SUPER_ADMIN only.',
    description: 'System and custom role definitions used by RBAC.',
  },
  {
    path: '/categories',
    tag: 'Categories',
    name: 'Category',
    schema: 'Category',
    request: 'CategoryRequest',
    createRoles: 'SUPER_ADMIN, OWNER, MANAGER.',
    description: 'Menu category management. Records are scoped to the authenticated user restaurant.',
  },
  {
    path: '/menu-items',
    tag: 'Menu',
    name: 'Menu item',
    schema: 'MenuItem',
    request: 'MenuItemRequest',
    createRoles: 'SUPER_ADMIN, OWNER, MANAGER.',
    description: 'Sellable menu items with category, pricing, variants, addons, tags, and availability.',
  },
  {
    path: '/addons',
    tag: 'Menu',
    name: 'Addon',
    schema: 'Addon',
    request: 'AddonRequest',
    createRoles: 'SUPER_ADMIN, OWNER, MANAGER.',
    description: 'Optional item add-ons such as extra cheese, sauces, or toppings.',
  },
  {
    path: '/variants',
    tag: 'Menu',
    name: 'Variant',
    schema: 'Variant',
    request: 'VariantRequest',
    createRoles: 'SUPER_ADMIN, OWNER, MANAGER.',
    description: 'Menu item variants such as size, portion, or preparation option.',
  },
  {
    path: '/tables',
    tag: 'Tables',
    name: 'Table',
    schema: 'Table',
    request: 'TableRequest',
    createRoles: 'SUPER_ADMIN, OWNER, MANAGER, CASHIER, WAITER.',
    description: 'Dining room table records with section, capacity, QR code, and status.',
  },
  {
    path: '/reservations',
    tag: 'Reservations',
    name: 'Reservation',
    schema: 'Reservation',
    request: 'ReservationRequest',
    createRoles: 'SUPER_ADMIN, OWNER, MANAGER, CASHIER, WAITER.',
    description: 'Guest bookings with table assignment, party size, date range, and status.',
  },
  {
    path: '/customers',
    tag: 'Customers',
    name: 'Customer',
    schema: 'Customer',
    request: 'CustomerRequest',
    createRoles: 'SUPER_ADMIN, OWNER, MANAGER.',
    description: 'Customer user records scoped to the current restaurant. If role is omitted, CUSTOMER is used.',
  },
  {
    path: '/reviews',
    tag: 'Reviews',
    name: 'Review',
    schema: 'Review',
    request: 'ReviewRequest',
    createRoles: 'SUPER_ADMIN, OWNER, MANAGER, CASHIER, WAITER.',
    description: 'Customer review records linked to restaurant, customer, and optionally order.',
  },
  {
    path: '/notifications',
    tag: 'Notifications',
    name: 'Notification',
    schema: 'Notification',
    request: 'NotificationRequest',
    createRoles: 'SUPER_ADMIN, OWNER, MANAGER, CASHIER, WAITER.',
    description: 'In-app notification records. Realtime notification emits use `notifications:new`.',
  },
];

const crudPaths = Object.fromEntries(
  crudResources.flatMap((resource) => [
    [
      resource.path,
      {
        get: {
          tags: [resource.tag],
          summary: `List ${resource.name.toLowerCase()} records`,
          description: `${resource.description}\n\nRequires authentication. List endpoints return soft-deleted records filtered out by default.`,
          security: secured,
          parameters: listParameters,
          responses: {
            200: listEnvelope({ $ref: `#/components/schemas/${resource.schema}` }),
            401: authResponses.Unauthorized,
          },
        },
        post: {
          tags: [resource.tag],
          summary: `Create a ${resource.name.toLowerCase()}`,
          description: `Creates a new ${resource.name.toLowerCase()}.\n\nAllowed roles: ${resource.createRoles}`,
          security: secured,
          requestBody: jsonRequest({ $ref: `#/components/schemas/${resource.request}` }),
          responses: {
            201: successEnvelope({ $ref: `#/components/schemas/${resource.schema}` }, `${resource.name} created`),
            401: authResponses.Unauthorized,
            403: authResponses.Forbidden,
            422: authResponses.ValidationError,
          },
        },
      },
    ],
    [
      `${resource.path}/{id}`,
      {
        get: {
          tags: [resource.tag],
          summary: `Get one ${resource.name.toLowerCase()}`,
          description: `Returns one non-deleted ${resource.name.toLowerCase()} by id. Restaurant-scoped resources must belong to the authenticated user restaurant.`,
          security: secured,
          parameters: [idParameter],
          responses: {
            200: successEnvelope({ $ref: `#/components/schemas/${resource.schema}` }),
            401: authResponses.Unauthorized,
            404: authResponses.NotFound,
          },
        },
        put: {
          tags: [resource.tag],
          summary: `Update a ${resource.name.toLowerCase()}`,
          description: `Updates a ${resource.name.toLowerCase()} with the same validation rules as create.\n\nAllowed roles: ${resource.createRoles}`,
          security: secured,
          parameters: [idParameter],
          requestBody: jsonRequest({ $ref: `#/components/schemas/${resource.request}` }),
          responses: {
            200: successEnvelope({ $ref: `#/components/schemas/${resource.schema}` }),
            401: authResponses.Unauthorized,
            403: authResponses.Forbidden,
            404: authResponses.NotFound,
            422: authResponses.ValidationError,
          },
        },
        delete: {
          tags: [resource.tag],
          summary: `Soft delete a ${resource.name.toLowerCase()}`,
          description: `Soft deletes the record by setting \`deletedAt\`. The document remains in MongoDB but will not appear in normal reads.`,
          security: secured,
          parameters: [idParameter],
          responses: {
            200: successEnvelope({ nullable: true }),
            401: authResponses.Unauthorized,
            403: authResponses.Forbidden,
            404: authResponses.NotFound,
          },
        },
      },
    ],
  ]),
);

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Restaurant SaaS API',
    version: '1.0.0',
    description:
      'API documentation for the MERN Restaurant Management and Online Ordering Platform. Controllers stay thin, services hold business logic, repositories access MongoDB, and realtime updates are sent through Socket.io restaurant rooms.',
    contact: {
      name: 'Restaurant SaaS Engineering',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local development server',
    },
    {
      url: '/api/v1',
      description: 'Same-origin deployment',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Registration, login, refresh tokens, logout, email verification, and password flows.' },
    { name: 'Restaurants', description: 'Restaurant workspace and branch management.' },
    { name: 'Roles', description: 'RBAC role definitions and permissions.' },
    { name: 'Categories', description: 'Menu category CRUD.' },
    { name: 'Menu', description: 'Menu items, variants, and addons.' },
    { name: 'Tables', description: 'Dining room table CRUD and live status changes.' },
    { name: 'Reservations', description: 'Guest reservation management.' },
    { name: 'Orders', description: 'Order listing, creation, and status workflow.' },
    { name: 'Payments', description: 'Payment creation through strategy providers.' },
    { name: 'Customers', description: 'Customer records and basic CRM data.' },
    { name: 'Reviews', description: 'Customer reviews and owner responses.' },
    { name: 'Notifications', description: 'Notification records and realtime notification events.' },
    { name: 'Analytics', description: 'Dashboard metrics and chart data.' },
    { name: 'Uploads', description: 'Image upload endpoints backed by Cloudinary.' },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register an owner or customer account',
        description:
          'Creates a user, hashes the password, creates a restaurant workspace for OWNER accounts, creates an email verification token, sends verification email when SMTP is configured, sets the HTTP-only refresh cookie, and returns an access token.',
        requestBody: jsonRequest({ $ref: '#/components/schemas/RegisterRequest' }),
        responses: {
          201: successEnvelope({ $ref: '#/components/schemas/AuthSession' }, 'Registered successfully'),
          409: { $ref: '#/components/responses/Conflict' },
          422: authResponses.ValidationError,
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        description:
          'Verifies credentials with bcrypt, updates last login time, stores a hashed refresh token, sets the HTTP-only refresh cookie, and returns a new access token.',
        requestBody: jsonRequest({ $ref: '#/components/schemas/LoginRequest' }),
        responses: {
          200: successEnvelope({ $ref: '#/components/schemas/AuthSession' }, 'Logged in successfully'),
          401: authResponses.Unauthorized,
          422: authResponses.ValidationError,
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh the access token',
        description:
          'Reads the refresh token from the HTTP-only `refreshToken` cookie or `refreshToken` request body, verifies it, rotates the refresh token, and returns a new access token.',
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RefreshRequest' },
            },
          },
        },
        responses: {
          200: successEnvelope({ $ref: '#/components/schemas/AuthSession' }, 'Token refreshed'),
          401: authResponses.Unauthorized,
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout current user',
        description: 'Requires an access token. Clears the stored refresh token hash and removes the refresh cookie.',
        security: secured,
        responses: {
          200: successEnvelope({ nullable: true }, 'Logged out successfully'),
          401: authResponses.Unauthorized,
        },
      },
    },
    '/auth/verify-email': {
      post: {
        tags: ['Auth'],
        summary: 'Verify email address',
        description: 'Marks the user email as verified when the verification token matches the hashed token stored on the user.',
        requestBody: jsonRequest({ $ref: '#/components/schemas/TokenRequest' }),
        responses: {
          200: successEnvelope({ nullable: true }, 'Email verified'),
          400: { $ref: '#/components/responses/BadRequest' },
          422: authResponses.ValidationError,
        },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request password reset',
        description:
          'Creates a short-lived password reset token for an existing user and sends it by email when SMTP is configured. The response is intentionally generic.',
        requestBody: jsonRequest({ $ref: '#/components/schemas/ForgotPasswordRequest' }),
        responses: {
          200: successEnvelope({ nullable: true }, 'Password reset instructions sent'),
          422: authResponses.ValidationError,
        },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password with token',
        description: 'Verifies a reset token, hashes the new password, and clears reset token fields.',
        requestBody: jsonRequest({ $ref: '#/components/schemas/ResetPasswordRequest' }),
        responses: {
          200: successEnvelope({ nullable: true }, 'Password reset successfully'),
          400: { $ref: '#/components/responses/BadRequest' },
          422: authResponses.ValidationError,
        },
      },
    },
    '/auth/change-password': {
      post: {
        tags: ['Auth'],
        summary: 'Change password while logged in',
        description: 'Requires an access token. Verifies the current password, hashes the new password, and saves it.',
        security: secured,
        requestBody: jsonRequest({ $ref: '#/components/schemas/ChangePasswordRequest' }),
        responses: {
          200: successEnvelope({ nullable: true }, 'Password changed successfully'),
          401: authResponses.Unauthorized,
          422: authResponses.ValidationError,
        },
      },
    },
    ...crudPaths,
    '/tables/{id}/status': {
      patch: {
        tags: ['Tables'],
        summary: 'Update table status',
        description:
          'Updates only the table status and emits `tables:update` to the restaurant Socket.io room. Useful for POS, floor view, and wait staff devices.',
        security: secured,
        parameters: [idParameter],
        requestBody: jsonRequest({ $ref: '#/components/schemas/TableStatusRequest' }),
        responses: {
          200: successEnvelope({ $ref: '#/components/schemas/Table' }, 'Table status updated'),
          401: authResponses.Unauthorized,
          403: authResponses.Forbidden,
          404: authResponses.NotFound,
          422: authResponses.ValidationError,
        },
      },
    },
    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'List restaurant orders',
        description: 'Returns orders scoped to the authenticated user restaurant. Use `status` to filter kitchen/POS views.',
        security: secured,
        parameters: [
          ...listParameters,
          {
            name: 'status',
            in: 'query',
            description: 'Optional order status filter.',
            schema: { $ref: '#/components/schemas/OrderStatus' },
          },
        ],
        responses: {
          200: listEnvelope({ $ref: '#/components/schemas/Order' }, 'Order list'),
          401: authResponses.Unauthorized,
        },
      },
      post: {
        tags: ['Orders'],
        summary: 'Create an order',
        description:
          'Creates an order from menu item ids, calculates subtotal and grand total, stores embedded order item snapshots, and emits `orders:new` plus `kitchen:new` to the restaurant Socket.io room.',
        security: secured,
        requestBody: jsonRequest({ $ref: '#/components/schemas/OrderRequest' }),
        responses: {
          201: successEnvelope({ $ref: '#/components/schemas/Order' }, 'Order created'),
          401: authResponses.Unauthorized,
          403: authResponses.Forbidden,
          404: authResponses.NotFound,
          422: authResponses.ValidationError,
        },
      },
    },
    '/orders/{id}/status': {
      patch: {
        tags: ['Orders'],
        summary: 'Update order status',
        description:
          'Moves an order through the operational workflow and emits `orders:update` plus `kitchen:update`. Used by POS, kitchen display, delivery, and cashier screens.',
        security: secured,
        parameters: [idParameter],
        requestBody: jsonRequest({ $ref: '#/components/schemas/OrderStatusRequest' }),
        responses: {
          200: successEnvelope({ $ref: '#/components/schemas/Order' }, 'Order status updated'),
          401: authResponses.Unauthorized,
          403: authResponses.Forbidden,
          404: authResponses.NotFound,
          422: authResponses.ValidationError,
        },
      },
    },
    '/payments': {
      post: {
        tags: ['Payments'],
        summary: 'Create a payment',
        description:
          'Creates a payment for an order. For STRIPE, PAYPAL, JAZZCASH, and EASYPAISA the strategy provider is called, a transaction record is created, and the order payment status is updated when payment is authorized or paid. CASH marks the payment as paid immediately.',
        security: secured,
        requestBody: jsonRequest({ $ref: '#/components/schemas/PaymentRequest' }),
        responses: {
          201: successEnvelope({ $ref: '#/components/schemas/Payment' }, 'Payment created'),
          400: { $ref: '#/components/responses/BadRequest' },
          401: authResponses.Unauthorized,
          403: authResponses.Forbidden,
          404: authResponses.NotFound,
          422: authResponses.ValidationError,
        },
      },
    },
    '/analytics/dashboard': {
      get: {
        tags: ['Analytics'],
        summary: 'Get dashboard analytics',
        description:
          'Returns today revenue, order count, upcoming reservation count, active table count, top selling items, and chart data for dashboard widgets.',
        security: secured,
        responses: {
          200: successEnvelope({ $ref: '#/components/schemas/DashboardAnalytics' }, 'Dashboard analytics'),
          401: authResponses.Unauthorized,
          403: authResponses.Forbidden,
        },
      },
    },
    '/uploads/images': {
      post: {
        tags: ['Uploads'],
        summary: 'Upload an image to Cloudinary',
        description:
          'Accepts a multipart image file named `image`, uploads it to a restaurant-specific Cloudinary folder, and returns the secure URL and public id. Cloudinary environment variables must be configured.',
        security: secured,
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file up to 5MB.',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: successEnvelope({ $ref: '#/components/schemas/ImageUploadResult' }, 'Image uploaded'),
          401: authResponses.Unauthorized,
          403: authResponses.Forbidden,
          422: authResponses.ValidationError,
          503: {
            description: 'Cloudinary is not configured.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Use the access token returned by login/register/refresh. Example: `Bearer eyJhbGciOi...`',
      },
    },
    responses: {
      BadRequest: {
        description: 'Bad request.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } },
      },
      Unauthorized: {
        description: 'Missing, invalid, or expired authentication token.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } },
      },
      Forbidden: {
        description: 'Authenticated user does not have the required role or permission.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } },
      },
      NotFound: {
        description: 'Resource not found or does not belong to the authenticated restaurant scope.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } },
      },
      Conflict: {
        description: 'Duplicate value or resource conflict.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } },
      },
      ValidationError: {
        description: 'Request validation failed.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } },
      },
    },
    schemas: {
      ObjectId: objectId,
      RoleName: {
        type: 'string',
        enum: ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'WAITER', 'CHEF', 'CASHIER', 'CUSTOMER'],
        example: 'OWNER',
      },
      OrderStatus: {
        type: 'string',
        enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELLED'],
        example: 'PREPARING',
      },
      TableStatus: {
        type: 'string',
        enum: ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE'],
        example: 'AVAILABLE',
      },
      SuccessEnvelope: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Success' },
          data: { nullable: true },
          meta: { nullable: true },
        },
      },
      ErrorEnvelope: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
          details: {
            nullable: true,
            oneOf: [{ type: 'array', items: { type: 'string' } }, { type: 'object' }, { type: 'string' }],
          },
          stack: { type: 'string', nullable: true, description: 'Included outside production.' },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 20 },
          total: { type: 'integer', example: 42 },
          pages: { type: 'integer', example: 3 },
        },
      },
      AuthUser: {
        type: 'object',
        properties: {
          id: objectId,
          name: { type: 'string', example: 'Demo Owner' },
          email: { type: 'string', format: 'email', example: 'owner@demo.com' },
          role: { $ref: '#/components/schemas/RoleName' },
          restaurant: objectId,
          isEmailVerified: { type: 'boolean', example: true },
        },
      },
      AuthSession: {
        type: 'object',
        properties: {
          accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            description: 'Also set as HTTP-only `refreshToken` cookie by auth endpoints.',
          },
          user: { $ref: '#/components/schemas/AuthUser' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 80, example: 'Demo Owner' },
          email: { type: 'string', format: 'email', example: 'owner@demo.com' },
          phone: { type: 'string', nullable: true, example: '+15550000001' },
          password: { type: 'string', minLength: 8, maxLength: 128, example: 'Password123!' },
          restaurantName: { type: 'string', example: 'Demo Bistro' },
          role: { type: 'string', enum: ['OWNER', 'CUSTOMER'], example: 'OWNER' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'owner@demo.com' },
          password: { type: 'string', minLength: 8, example: 'Password123!' },
        },
      },
      RefreshRequest: {
        type: 'object',
        properties: {
          refreshToken: { type: 'string', description: 'Optional when the HTTP-only cookie is present.' },
        },
      },
      TokenRequest: {
        type: 'object',
        required: ['token'],
        properties: {
          token: { type: 'string', example: 'raw-token-from-email' },
        },
      },
      ForgotPasswordRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email', example: 'owner@demo.com' },
        },
      },
      ResetPasswordRequest: {
        type: 'object',
        required: ['token', 'password'],
        properties: {
          token: { type: 'string', example: 'raw-reset-token-from-email' },
          password: { type: 'string', minLength: 8, example: 'NewPassword123!' },
        },
      },
      ChangePasswordRequest: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { type: 'string', minLength: 8, example: 'Password123!' },
          newPassword: { type: 'string', minLength: 8, example: 'NewPassword123!' },
        },
      },
      RestaurantRequest: {
        type: 'object',
        required: ['name', 'slug'],
        properties: {
          name: { type: 'string', example: 'Demo Bistro' },
          slug: { type: 'string', example: 'demo-bistro' },
          owner: objectId,
          logoUrl: { type: 'string', format: 'uri', nullable: true },
          coverUrl: { type: 'string', format: 'uri', nullable: true },
          phone: { type: 'string', nullable: true, example: '+15550000001' },
          email: { type: 'string', format: 'email', nullable: true, example: 'hello@demobistro.test' },
          currency: { type: 'string', minLength: 3, maxLength: 3, example: 'USD' },
          timezone: { type: 'string', example: 'America/New_York' },
          address: {
            type: 'object',
            properties: {
              line1: { type: 'string', example: '14 Market Street' },
              city: { type: 'string', example: 'New York' },
              country: { type: 'string', example: 'US' },
            },
          },
          settings: {
            type: 'object',
            properties: {
              taxRate: { type: 'number', example: 8.5 },
              serviceChargeRate: { type: 'number', example: 4 },
              acceptsOnlineOrders: { type: 'boolean', example: true },
            },
          },
        },
      },
      Restaurant: {
        allOf: [
          { $ref: '#/components/schemas/RestaurantRequest' },
          {
            type: 'object',
            properties: {
              _id: objectId,
              ...timestamps,
            },
          },
        ],
      },
      RoleRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { $ref: '#/components/schemas/RoleName' },
          permissions: { type: 'array', items: { type: 'string' }, example: ['orders:manage', 'analytics:read'] },
          system: { type: 'boolean', example: true },
        },
      },
      Role: {
        allOf: [
          { $ref: '#/components/schemas/RoleRequest' },
          { type: 'object', properties: { _id: objectId, ...timestamps } },
        ],
      },
      CategoryRequest: {
        type: 'object',
        required: ['name', 'slug'],
        properties: {
          name: { type: 'string', example: 'Burgers' },
          slug: { type: 'string', example: 'burgers' },
          description: { type: 'string', nullable: true, example: 'Signature burgers and sandwiches.' },
          imageUrl: { type: 'string', format: 'uri', nullable: true },
          sortOrder: { type: 'integer', minimum: 0, example: 1 },
          isActive: { type: 'boolean', example: true },
        },
      },
      Category: {
        allOf: [
          { $ref: '#/components/schemas/CategoryRequest' },
          { type: 'object', properties: { _id: objectId, restaurant: objectId, ...timestamps } },
        ],
      },
      AddonRequest: {
        type: 'object',
        required: ['name', 'price'],
        properties: {
          name: { type: 'string', example: 'Extra cheese' },
          price: { type: 'number', minimum: 0, example: 2.5 },
          isActive: { type: 'boolean', example: true },
        },
      },
      Addon: {
        allOf: [
          { $ref: '#/components/schemas/AddonRequest' },
          { type: 'object', properties: { _id: objectId, restaurant: objectId, ...timestamps } },
        ],
      },
      VariantRequest: {
        type: 'object',
        required: ['name', 'price'],
        properties: {
          menuItem: objectId,
          name: { type: 'string', example: 'Large' },
          price: { type: 'number', minimum: 0, example: 18 },
          sku: { type: 'string', nullable: true, example: 'BURGER-LG' },
          isDefault: { type: 'boolean', example: false },
        },
      },
      Variant: {
        allOf: [
          { $ref: '#/components/schemas/VariantRequest' },
          { type: 'object', properties: { _id: objectId, restaurant: objectId, ...timestamps } },
        ],
      },
      MenuItemRequest: {
        type: 'object',
        required: ['category', 'name', 'slug', 'basePrice'],
        properties: {
          category: objectId,
          name: { type: 'string', example: 'Smash Burger' },
          slug: { type: 'string', example: 'smash-burger' },
          description: { type: 'string', nullable: true, example: 'Double patty, cheddar, pickles, house sauce.' },
          basePrice: { type: 'number', minimum: 0, example: 15 },
          imageUrl: { type: 'string', format: 'uri', nullable: true },
          variants: { type: 'array', items: objectId },
          addons: { type: 'array', items: objectId },
          tags: { type: 'array', items: { type: 'string' }, example: ['popular', 'beef'] },
          prepTimeMinutes: { type: 'integer', minimum: 0, example: 15 },
          isAvailable: { type: 'boolean', example: true },
        },
      },
      MenuItem: {
        allOf: [
          { $ref: '#/components/schemas/MenuItemRequest' },
          { type: 'object', properties: { _id: objectId, restaurant: objectId, ...timestamps } },
        ],
      },
      TableRequest: {
        type: 'object',
        required: ['number', 'seats'],
        properties: {
          number: { type: 'string', example: '12' },
          section: { type: 'string', nullable: true, example: 'Patio' },
          seats: { type: 'integer', minimum: 1, example: 4 },
          status: { $ref: '#/components/schemas/TableStatus' },
        },
      },
      Table: {
        allOf: [
          { $ref: '#/components/schemas/TableRequest' },
          {
            type: 'object',
            properties: {
              _id: objectId,
              restaurant: objectId,
              qrCodeUrl: { type: 'string', nullable: true },
              ...timestamps,
            },
          },
        ],
      },
      TableStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { $ref: '#/components/schemas/TableStatus' },
        },
      },
      ReservationRequest: {
        type: 'object',
        required: ['guestName', 'guestPhone', 'partySize', 'startsAt', 'endsAt'],
        properties: {
          table: objectId,
          customer: objectId,
          guestName: { type: 'string', example: 'Nora Patel' },
          guestPhone: { type: 'string', example: '+15550000022' },
          guestEmail: { type: 'string', format: 'email', nullable: true, example: 'nora@example.com' },
          partySize: { type: 'integer', minimum: 1, example: 4 },
          startsAt: { type: 'string', format: 'date-time', example: '2026-07-01T19:00:00.000Z' },
          endsAt: { type: 'string', format: 'date-time', example: '2026-07-01T21:00:00.000Z' },
          status: {
            type: 'string',
            enum: ['PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
            example: 'CONFIRMED',
          },
          notes: { type: 'string', nullable: true, example: 'Window seat preferred.' },
        },
      },
      Reservation: {
        allOf: [
          { $ref: '#/components/schemas/ReservationRequest' },
          { type: 'object', properties: { _id: objectId, restaurant: objectId, ...timestamps } },
        ],
      },
      CustomerRequest: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', example: 'Ariana Chen' },
          email: { type: 'string', format: 'email', example: 'ariana@example.com' },
          phone: { type: 'string', nullable: true, example: '+15550000033' },
          password: { type: 'string', minLength: 8, default: 'Password123!' },
          role: objectId,
        },
      },
      Customer: {
        type: 'object',
        properties: {
          _id: objectId,
          name: { type: 'string', example: 'Ariana Chen' },
          email: { type: 'string', format: 'email', example: 'ariana@example.com' },
          phone: { type: 'string', nullable: true },
          role: objectId,
          restaurant: objectId,
          isEmailVerified: { type: 'boolean', example: true },
          status: { type: 'string', example: 'ACTIVE' },
          ...timestamps,
        },
      },
      ReviewRequest: {
        type: 'object',
        required: ['rating'],
        properties: {
          customer: objectId,
          order: objectId,
          rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
          comment: { type: 'string', nullable: true, example: 'Excellent dinner service.' },
          response: { type: 'string', nullable: true, example: 'Thank you for visiting us.' },
          isPublished: { type: 'boolean', example: true },
        },
      },
      Review: {
        allOf: [
          { $ref: '#/components/schemas/ReviewRequest' },
          { type: 'object', properties: { _id: objectId, restaurant: objectId, ...timestamps } },
        ],
      },
      NotificationRequest: {
        type: 'object',
        required: ['type', 'title'],
        properties: {
          user: objectId,
          type: { type: 'string', example: 'ORDER_READY' },
          title: { type: 'string', example: 'Order ready' },
          body: { type: 'string', nullable: true, example: 'Order ORD-1943 is ready for pickup.' },
          data: { type: 'object', additionalProperties: true },
          readAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      Notification: {
        allOf: [
          { $ref: '#/components/schemas/NotificationRequest' },
          { type: 'object', properties: { _id: objectId, restaurant: objectId, ...timestamps } },
        ],
      },
      OrderItemInput: {
        type: 'object',
        required: ['menuItem', 'quantity'],
        properties: {
          menuItem: objectId,
          quantity: { type: 'integer', minimum: 1, example: 2 },
          unitPrice: { type: 'number', minimum: 0, example: 15 },
          variant: { type: 'object', additionalProperties: true },
          addons: { type: 'array', items: { type: 'object', additionalProperties: true } },
          notes: { type: 'string', nullable: true, example: 'No onions.' },
        },
      },
      OrderItem: {
        type: 'object',
        properties: {
          _id: objectId,
          menuItem: objectId,
          name: { type: 'string', example: 'Smash Burger' },
          quantity: { type: 'integer', example: 2 },
          unitPrice: { type: 'number', example: 15 },
          status: { type: 'string', enum: ['QUEUED', 'FIRE', 'READY', 'SERVED'], example: 'QUEUED' },
          notes: { type: 'string', nullable: true },
        },
      },
      OrderRequest: {
        type: 'object',
        required: ['type', 'items'],
        properties: {
          type: { type: 'string', enum: ['DINE_IN', 'TAKEAWAY', 'DELIVERY', 'ONLINE'], example: 'DINE_IN' },
          table: objectId,
          customer: objectId,
          items: { type: 'array', minItems: 1, items: { $ref: '#/components/schemas/OrderItemInput' } },
          taxTotal: { type: 'number', minimum: 0, example: 2.55 },
          discountTotal: { type: 'number', minimum: 0, example: 0 },
          serviceCharge: { type: 'number', minimum: 0, example: 1.5 },
          notes: { type: 'string', nullable: true, example: 'Birthday table.' },
        },
      },
      Order: {
        type: 'object',
        properties: {
          _id: objectId,
          restaurant: objectId,
          orderNumber: { type: 'string', example: 'ORD-1782400000000' },
          type: { type: 'string', example: 'DINE_IN' },
          table: objectId,
          customer: objectId,
          items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
          status: { $ref: '#/components/schemas/OrderStatus' },
          subtotal: { type: 'number', example: 30 },
          discountTotal: { type: 'number', example: 0 },
          taxTotal: { type: 'number', example: 2.55 },
          serviceCharge: { type: 'number', example: 1.5 },
          grandTotal: { type: 'number', example: 34.05 },
          paymentStatus: { type: 'string', enum: ['UNPAID', 'PARTIAL', 'PAID', 'REFUNDED'], example: 'UNPAID' },
          notes: { type: 'string', nullable: true },
          placedAt: { type: 'string', format: 'date-time' },
          ...timestamps,
        },
      },
      OrderStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { $ref: '#/components/schemas/OrderStatus' },
        },
      },
      PaymentRequest: {
        type: 'object',
        required: ['order', 'provider'],
        properties: {
          order: objectId,
          provider: { type: 'string', enum: ['STRIPE', 'PAYPAL', 'JAZZCASH', 'EASYPAISA', 'CASH'], example: 'STRIPE' },
          amount: { type: 'number', minimum: 0, example: 34.05 },
          currency: { type: 'string', minLength: 3, maxLength: 3, example: 'USD' },
        },
      },
      Payment: {
        type: 'object',
        properties: {
          _id: objectId,
          restaurant: objectId,
          order: objectId,
          provider: { type: 'string', example: 'STRIPE' },
          amount: { type: 'number', example: 34.05 },
          currency: { type: 'string', example: 'USD' },
          status: { type: 'string', enum: ['PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'REFUNDED'], example: 'AUTHORIZED' },
          providerReference: { type: 'string', nullable: true, example: 'stripe_1782400000000' },
          metadata: { type: 'object', additionalProperties: true },
          ...timestamps,
        },
      },
      DashboardAnalytics: {
        type: 'object',
        properties: {
          revenue: { type: 'number', example: 18400 },
          orders: { type: 'integer', example: 328 },
          reservations: { type: 'integer', example: 46 },
          activeTables: { type: 'integer', example: 17 },
          topItems: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: 'Smash Burger' },
                quantity: { type: 'integer', example: 82 },
                revenue: { type: 'number', example: 1230 },
              },
            },
          },
          chart: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Mon' },
                revenue: { type: 'number', example: 4200 },
                orders: { type: 'integer', example: 44 },
              },
            },
          },
        },
      },
      ImageUploadResult: {
        type: 'object',
        properties: {
          url: { type: 'string', format: 'uri', example: 'https://res.cloudinary.com/demo/image/upload/example.jpg' },
          publicId: { type: 'string', example: 'restaurant-saas/demo-bistro/example' },
        },
      },
    },
  },
};
