"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
let AppController = class AppController {
    getHome(res) {
        res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Temp Mail API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
    }
    .container { text-align: center; padding: 40px; }
    h1 { font-size: 2.5rem; margin-bottom: 10px; font-weight: 600; }
    p { font-size: 1.1rem; color: #666; margin-bottom: 40px; }
    .buttons { display: flex; gap: 16px; justify-content: center; }
    a {
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
    }
    .primary { background: #000; color: #fff; }
    .primary:hover { background: #333; }
    .secondary { background: #fff; color: #000; border: 1px solid #ddd; }
    .secondary:hover { border-color: #000; }
    .status { margin-top: 50px; font-size: 0.9rem; color: #22c55e; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Temp Mail API</h1>
    <p>Temporary Email Service REST API</p>
    <div class="buttons">
      <a href="/api/docs" class="primary">API References</a>
      <a href="http://localhost:3001" class="secondary">Admin Panel</a>
    </div>
    <div class="status">● Server Running</div>
  </div>
</body>
</html>
    `);
    }
    getDocs(res) {
        res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API References - Temp Mail API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #fff;
      color: #000;
      line-height: 1.7;
    }
    .header {
      padding: 60px 20px;
      text-align: center;
      border-bottom: 1px solid #eee;
    }
    .header h1 { font-size: 2rem; font-weight: 600; margin-bottom: 8px; }
    .header p { color: #666; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .back { color: #000; text-decoration: none; font-size: 0.9rem; }
    .back:hover { text-decoration: underline; }
    
    .section { margin: 50px 0; }
    .section h2 { font-size: 1.3rem; font-weight: 600; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
    .section > p { color: #666; margin-bottom: 20px; }
    
    .endpoint { margin-bottom: 40px; }
    .endpoint-title { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .method {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: monospace;
    }
    .get { background: #e8f5e9; color: #2e7d32; }
    .post { background: #e3f2fd; color: #1565c0; }
    .patch { background: #fff3e0; color: #e65100; }
    .delete { background: #ffebee; color: #c62828; }
    .path { font-family: monospace; font-size: 0.95rem; }
    .endpoint > p { color: #666; margin-bottom: 16px; }
    
    .code-block { margin-bottom: 16px; }
    .code-block h4 { font-size: 0.8rem; color: #999; text-transform: uppercase; margin-bottom: 8px; font-weight: 500; }
    pre {
      background: #fafafa;
      border: 1px solid #eee;
      border-radius: 6px;
      padding: 16px;
      overflow-x: auto;
      font-size: 0.85rem;
      font-family: 'SF Mono', Monaco, monospace;
    }
    code { color: #333; }
    .curl { background: #1a1a1a; border-color: #333; }
    .curl code { color: #fff; }
    
    .divider { height: 1px; background: #eee; margin: 40px 0; }
    .note { background: #fafafa; border: 1px solid #eee; padding: 16px; border-radius: 6px; font-size: 0.9rem; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>API References</h1>
    <p>Temp Mail API Documentation</p>
  </div>
  
  <div class="container">
    <a href="/api" class="back">← Back</a>
    
    <!-- Authentication Section -->
    <div class="section">
      <h2>Authentication</h2>
      <p>All public API endpoints require an API key passed via the X-API-KEY header.</p>
      <div class="code-block">
        <h4>Header</h4>
        <pre><code>X-API-KEY: your-api-key-here</code></pre>
      </div>
    </div>

    <div class="divider"></div>

    <!-- Generate Email -->
    <div class="section">
      <h2>Email Endpoints</h2>
      
      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method post">POST</span>
          <span class="path">/api/emails/generate</span>
        </div>
        <p>Generate a new temporary email address. The email expires after 24 hours.</p>
        
        <div class="code-block">
          <h4>Example Request</h4>
          <pre class="curl"><code>curl -X POST http://localhost:3000/api/emails/generate \\
  -H "X-API-KEY: mk_your_api_key_here"</code></pre>
        </div>
        
        <div class="code-block">
          <h4>Response</h4>
          <pre><code>{
  "email": "a1b2c3d4@yourdomain.com",
  "expires_at": "2025-12-22T10:00:00.000Z"
}</code></pre>
        </div>
      </div>

      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method get">GET</span>
          <span class="path">/api/emails/:email/messages</span>
        </div>
        <p>Retrieve all messages received by a temporary email address.</p>
        
        <div class="code-block">
          <h4>Example Request</h4>
          <pre class="curl"><code>curl -X GET http://localhost:3000/api/emails/a1b2c3d4@yourdomain.com/messages \\
  -H "X-API-KEY: mk_your_api_key_here"</code></pre>
        </div>
        
        <div class="code-block">
          <h4>Response</h4>
          <pre><code>[
  {
    "from": "sender@example.com",
    "subject": "Welcome to our service",
    "received_at": "2025-12-21T10:30:00.000Z",
    "body": "&lt;html&gt;Email content here...&lt;/html&gt;"
  },
  {
    "from": "noreply@example.com",
    "subject": "Your verification code",
    "received_at": "2025-12-21T10:25:00.000Z",
    "body": "Your code is: 123456"
  }
]</code></pre>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <!-- Admin Endpoints -->
    <div class="section">
      <h2>Admin Endpoints</h2>
      <p>Admin endpoints require JWT authentication via Authorization: Bearer &lt;token&gt;</p>

      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method post">POST</span>
          <span class="path">/api/admin/login</span>
        </div>
        <p>Authenticate as admin and receive JWT token.</p>
        
        <div class="code-block">
          <h4>Example Request</h4>
          <pre class="curl"><code>curl -X POST http://localhost:3000/api/admin/login \\
  -H "Content-Type: application/json" \\
  -d '{"email": "admin@example.com", "password": "admin123"}'</code></pre>
        </div>
        
        <div class="code-block">
          <h4>Response</h4>
          <pre><code>{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}</code></pre>
        </div>
      </div>

      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method get">GET</span>
          <span class="path">/api/admin/stats</span>
        </div>
        <p>Get dashboard statistics.</p>
        
        <div class="code-block">
          <h4>Example Request</h4>
          <pre class="curl"><code>curl -X GET http://localhost:3000/api/admin/stats \\
  -H "Authorization: Bearer your_jwt_token"</code></pre>
        </div>
        
        <div class="code-block">
          <h4>Response</h4>
          <pre><code>{
  "total_domains": 2,
  "active_domains": 2,
  "total_emails": 150,
  "active_emails": 45,
  "total_messages": 320
}</code></pre>
        </div>
      </div>

      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method get">GET</span>
          <span class="path">/api/admin/domains</span>
        </div>
        <p>List all registered domains.</p>
        
        <div class="code-block">
          <h4>Response</h4>
          <pre><code>[
  {
    "id": "uuid-here",
    "domain": "example.com",
    "imap_host": "mail.example.com",
    "imap_port": 993,
    "imap_user": "catchall@example.com",
    "active": true,
    "created_at": "2025-12-20T10:00:00.000Z"
  }
]</code></pre>
        </div>
      </div>

      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method post">POST</span>
          <span class="path">/api/admin/domains</span>
        </div>
        <p>Create a new domain.</p>
        
        <div class="code-block">
          <h4>Request Body</h4>
          <pre><code>{
  "domain": "newdomain.com",
  "imap_host": "mail.newdomain.com",
  "imap_port": 993,
  "imap_user": "catchall@newdomain.com",
  "imap_password": "your_password"
}</code></pre>
        </div>
      </div>

      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method patch">PATCH</span>
          <span class="path">/api/admin/domains/:id</span>
        </div>
        <p>Update a domain configuration.</p>
      </div>

      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method delete">DELETE</span>
          <span class="path">/api/admin/domains/:id</span>
        </div>
        <p>Delete a domain.</p>
      </div>

      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method get">GET</span>
          <span class="path">/api/admin/api-keys</span>
        </div>
        <p>List all API keys.</p>
        
        <div class="code-block">
          <h4>Response</h4>
          <pre><code>[
  {
    "id": "uuid-here",
    "name": "Production Key",
    "key": "mk_a930...",
    "active": true,
    "created_at": "2025-12-20T10:00:00.000Z",
    "last_used": "2025-12-21T08:30:00.000Z"
  }
]</code></pre>
        </div>
      </div>

      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method post">POST</span>
          <span class="path">/api/admin/api-keys</span>
        </div>
        <p>Generate a new API key.</p>
        
        <div class="code-block">
          <h4>Request Body</h4>
          <pre><code>{ "name": "My New API Key" }</code></pre>
        </div>
        
        <div class="code-block">
          <h4>Response</h4>
          <pre><code>{
  "id": "uuid-here",
  "name": "My New API Key",
  "key": "mk_full_api_key_shown_only_once",
  "active": true,
  "created_at": "2025-12-21T10:00:00.000Z"
}</code></pre>
        </div>
      </div>

      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method delete">DELETE</span>
          <span class="path">/api/admin/api-keys/:id</span>
        </div>
        <p>Revoke an API key.</p>
      </div>

      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method post">POST</span>
          <span class="path">/api/admin/imap/test</span>
        </div>
        <p>Test IMAP connection before adding a domain.</p>
        
        <div class="code-block">
          <h4>Request Body</h4>
          <pre><code>{
  "host": "mail.example.com",
  "port": 993,
  "user": "user@example.com",
  "password": "password"
}</code></pre>
        </div>
        
        <div class="code-block">
          <h4>Response</h4>
          <pre><code>{
  "success": true,
  "message": "IMAP connection successful"
}</code></pre>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="note">
      <strong>Note:</strong> Full API key is only shown once when created. Store it securely.
    </div>
  </div>
</body>
</html>
    `);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHome", null);
__decorate([
    (0, common_1.Get)('docs'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getDocs", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)()
], AppController);
//# sourceMappingURL=app.controller.js.map