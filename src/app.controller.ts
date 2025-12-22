import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getHome(@Res() res: Response) {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TPMail API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
    .container { text-align: center; padding: 40px; }
    .logo {
      width: 80px;
      height: 80px;
      background: rgba(255,255,255,0.2);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      backdrop-filter: blur(10px);
    }
    .logo svg { width: 40px; height: 40px; }
    h1 { font-size: 3rem; margin-bottom: 10px; font-weight: 700; }
    p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 40px; }
    .buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
    a {
      padding: 14px 28px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
    }
    .primary { background: #fff; color: #667eea; }
    .primary:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
    .secondary { background: rgba(255,255,255,0.2); color: #fff; backdrop-filter: blur(10px); }
    .secondary:hover { background: rgba(255,255,255,0.3); }
    .status { margin-top: 50px; font-size: 0.9rem; opacity: 0.8; }
    .status span { color: #4ade80; }
    .footer { margin-top: 60px; font-size: 0.85rem; opacity: 0.7; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
    <h1>TPMail API</h1>
    <p>Temporary Email Service REST API</p>
    <div class="buttons">
      <a href="/api/docs" class="primary">📚 API Documentation</a>
      <a href="/api/health" class="secondary">💚 Health Check</a>
    </div>
    <div class="status"><span>●</span> Server Running</div>
    <div class="footer">© 2025 ArvoreCloud. All rights reserved.</div>
  </div>
</body>
</html>
    `);
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'TPMail API',
      version: '1.0.0'
    };
  }

  @Get('docs')
  getDocs(@Res() res: Response) {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Documentation - TPMail</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
    }
    
    /* Layout */
    .layout { display: flex; min-height: 100vh; }
    
    /* Sidebar */
    .sidebar {
      width: 280px;
      background: #fff;
      border-right: 1px solid #e2e8f0;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
      padding: 24px 0;
    }
    .sidebar-header {
      padding: 0 24px 24px;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 16px;
    }
    .sidebar-header h1 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #6366f1;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .sidebar-header p { font-size: 0.875rem; color: #64748b; margin-top: 4px; }
    
    .nav-section { margin-bottom: 24px; }
    .nav-section h3 {
      font-size: 0.75rem;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0 24px;
      margin-bottom: 8px;
    }
    .nav-section a {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 24px;
      color: #475569;
      text-decoration: none;
      font-size: 0.875rem;
      transition: all 0.15s;
    }
    .nav-section a:hover { background: #f1f5f9; color: #1e293b; }
    .nav-section a.active { background: #eef2ff; color: #6366f1; border-right: 2px solid #6366f1; }
    
    .method-badge {
      font-size: 0.65rem;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
    .method-badge.get { background: #dcfce7; color: #166534; }
    .method-badge.post { background: #dbeafe; color: #1e40af; }
    .method-badge.patch { background: #fed7aa; color: #9a3412; }
    .method-badge.delete { background: #fecaca; color: #991b1b; }
    
    /* Main Content */
    .main { flex: 1; margin-left: 280px; padding: 40px; max-width: 900px; }
    
    .section { margin-bottom: 48px; scroll-margin-top: 24px; }
    .section h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 8px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e2e8f0;
    }
    .section > p { color: #64748b; margin-bottom: 24px; }
    
    .endpoint {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .endpoint-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .endpoint-method {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 6px;
      font-family: monospace;
    }
    .endpoint-method.get { background: #dcfce7; color: #166534; }
    .endpoint-method.post { background: #dbeafe; color: #1e40af; }
    .endpoint-method.patch { background: #fed7aa; color: #9a3412; }
    .endpoint-method.delete { background: #fecaca; color: #991b1b; }
    .endpoint-path {
      font-family: 'SF Mono', Monaco, monospace;
      font-size: 0.95rem;
      font-weight: 500;
    }
    .endpoint > p { color: #64748b; margin-bottom: 16px; }
    
    .code-block { margin-bottom: 16px; }
    .code-block h4 {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    pre {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
      font-size: 0.85rem;
      font-family: 'SF Mono', Monaco, monospace;
    }
    pre.dark { background: #1e293b; border-color: #334155; }
    pre.dark code { color: #e2e8f0; }
    code { color: #1e293b; }
    
    .note {
      background: #fef3c7;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      padding: 16px;
      font-size: 0.875rem;
      color: #92400e;
    }
    
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #6366f1;
      text-decoration: none;
      font-size: 0.875rem;
      margin-bottom: 24px;
    }
    .back-link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1>📧 TPMail API</h1>
        <p>v1.0.0 Documentation</p>
      </div>
      
      <div class="nav-section">
        <h3>Getting Started</h3>
        <a href="#authentication">🔐 Authentication</a>
        <a href="#overview">📖 Overview</a>
      </div>
      
      <div class="nav-section">
        <h3>Public API</h3>
        <a href="#get-domains"><span class="method-badge get">GET</span> List Domains</a>
        <a href="#generate-email"><span class="method-badge post">POST</span> Generate Random Email</a>
        <a href="#create-email"><span class="method-badge post">POST</span> Create Custom Email</a>
        <a href="#get-messages"><span class="method-badge get">GET</span> Get Messages</a>
      </div>
      
      <div class="nav-section">
        <h3>Admin API</h3>
        <a href="#admin-login"><span class="method-badge post">POST</span> Login</a>
        <a href="#admin-stats"><span class="method-badge get">GET</span> Statistics</a>
        <a href="#admin-domains"><span class="method-badge get">GET</span> List Domains</a>
        <a href="#create-domain"><span class="method-badge post">POST</span> Create Domain</a>
        <a href="#update-domain"><span class="method-badge patch">PATCH</span> Update Domain</a>
        <a href="#delete-domain"><span class="method-badge delete">DEL</span> Delete Domain</a>
      </div>
      
      <div class="nav-section">
        <h3>API Keys</h3>
        <a href="#list-keys"><span class="method-badge get">GET</span> List Keys</a>
        <a href="#create-key"><span class="method-badge post">POST</span> Create Key</a>
        <a href="#delete-key"><span class="method-badge delete">DEL</span> Delete Key</a>
      </div>
      
      <div class="nav-section">
        <h3>Utilities</h3>
        <a href="#test-imap"><span class="method-badge post">POST</span> Test IMAP</a>
      </div>
    </aside>
    
    <!-- Main Content -->
    <main class="main">
      <a href="/" class="back-link">← Back to Home</a>
      
      <!-- Authentication -->
      <section class="section" id="authentication">
        <h2>🔐 Authentication</h2>
        <p>The API uses two authentication methods depending on the endpoint type.</p>
        
        <div class="endpoint">
          <h3 style="font-weight:600;margin-bottom:12px;">Public API (X-API-KEY)</h3>
          <p>All public endpoints require an API key passed via header.</p>
          <div class="code-block">
            <h4>Required Header</h4>
            <pre><code>X-API-KEY: mk_your_api_key_here</code></pre>
          </div>
        </div>
        
        <div class="endpoint">
          <h3 style="font-weight:600;margin-bottom:12px;">Admin API (JWT Bearer)</h3>
          <p>Admin endpoints require JWT token from login endpoint.</p>
          <div class="code-block">
            <h4>Required Header</h4>
            <pre><code>Authorization: Bearer eyJhbGciOiJIUzI1NiIs...</code></pre>
          </div>
        </div>
      </section>
      
      <!-- Overview -->
      <section class="section" id="overview">
        <h2>📖 Overview</h2>
        <p>TPMail is a temporary email service API. Generate disposable email addresses and receive messages.</p>
        
        <div class="endpoint">
          <p><strong>Base URL:</strong> <code>https://your-domain.com/api</code></p>
          <p style="margin-top:8px;"><strong>Response Format:</strong> JSON</p>
        </div>
      </section>
      
      <!-- Public API -->
      <section class="section" id="get-domains">
        <h2>Public API</h2>
        
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="endpoint-method get">GET</span>
            <span class="endpoint-path">/api/emails/domains</span>
          </div>
          <p>List all available active domains for email generation.</p>
          <div class="code-block">
            <h4>Request</h4>
            <pre class="dark"><code>curl -X GET https://your-domain.com/api/emails/domains \\
  -H "X-API-KEY: mk_your_api_key"</code></pre>
          </div>
          <div class="code-block">
            <h4>Response</h4>
            <pre><code>["gencutaraka.xyz", "example.com"]</code></pre>
          </div>
        </div>
      </section>
      
      <section class="section" id="generate-email">
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="endpoint-method post">POST</span>
            <span class="endpoint-path">/api/emails/generate</span>
          </div>
          <p>Generate a random temporary email with format: firstname + random number (e.g., anna123@domain.com). Expires after 24 hours.</p>
          <div class="code-block">
            <h4>Request (Optional Body)</h4>
            <pre><code>{ "domain": "gencutaraka.xyz" }</code></pre>
          </div>
          <div class="code-block">
            <h4>cURL Example</h4>
            <pre class="dark"><code>curl -X POST https://your-domain.com/api/emails/generate \\
  -H "X-API-KEY: mk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"domain": "gencutaraka.xyz"}'</code></pre>
          </div>
          <div class="code-block">
            <h4>Response</h4>
            <pre><code>{
  "email": "sarah456@gencutaraka.xyz",
  "expires_at": "2025-12-22T10:00:00.000Z"
}</code></pre>
          </div>
        </div>
      </section>
      
      <section class="section" id="create-email">
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="endpoint-method post">POST</span>
            <span class="endpoint-path">/api/emails/create</span>
          </div>
          <p>Create a temporary email with a custom name. Name must be at least 3 characters (letters, numbers, dots, underscores only).</p>
          <div class="code-block">
            <h4>Request Body</h4>
            <pre><code>{
  "name": "myemail",
  "domain": "gencutaraka.xyz"  // optional
}</code></pre>
          </div>
          <div class="code-block">
            <h4>cURL Example</h4>
            <pre class="dark"><code>curl -X POST https://your-domain.com/api/emails/create \\
  -H "X-API-KEY: mk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "myemail", "domain": "gencutaraka.xyz"}'</code></pre>
          </div>
          <div class="code-block">
            <h4>Response</h4>
            <pre><code>{
  "email": "myemail@gencutaraka.xyz",
  "expires_at": "2025-12-22T10:00:00.000Z"
}</code></pre>
          </div>
          <div class="note"><strong>Note:</strong> Returns 409 Conflict if email already exists. Returns 400 Bad Request if name is invalid.</div>
        </div>
      </section>
      
      <section class="section" id="get-messages">
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="endpoint-method get">GET</span>
            <span class="endpoint-path">/api/emails/:email/messages</span>
          </div>
          <p>Retrieve all messages received by a temporary email.</p>
          <div class="code-block">
            <h4>cURL Example</h4>
            <pre class="dark"><code>curl -X GET https://your-domain.com/api/emails/abc@domain.com/messages \\
  -H "X-API-KEY: mk_your_api_key"</code></pre>
          </div>
          <div class="code-block">
            <h4>Response</h4>
            <pre><code>[
  {
    "from": "sender@example.com",
    "subject": "Welcome!",
    "body": "&lt;html&gt;...&lt;/html&gt;",
    "received_at": "2025-12-21T10:30:00.000Z"
  }
]</code></pre>
          </div>
        </div>
      </section>
      
      <!-- Admin API -->
      <section class="section" id="admin-login">
        <h2>Admin API</h2>
        
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="endpoint-method post">POST</span>
            <span class="endpoint-path">/api/admin/login</span>
          </div>
          <p>Authenticate as admin and receive JWT token.</p>
          <div class="code-block">
            <h4>Request Body</h4>
            <pre><code>{
  "email": "admin@example.com",
  "password": "admin123"
}</code></pre>
          </div>
          <div class="code-block">
            <h4>Response</h4>
            <pre><code>{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 3600
}</code></pre>
          </div>
        </div>
      </section>
      
      <section class="section" id="admin-stats">
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="endpoint-method get">GET</span>
            <span class="endpoint-path">/api/admin/stats</span>
          </div>
          <p>Get dashboard statistics. Requires JWT authentication.</p>
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
      </section>
      
      <section class="section" id="admin-domains">
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="endpoint-method get">GET</span>
            <span class="endpoint-path">/api/admin/domains</span>
          </div>
          <p>List all registered domains with IMAP configuration.</p>
        </div>
      </section>
      
      <section class="section" id="create-domain">
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="endpoint-method post">POST</span>
            <span class="endpoint-path">/api/admin/domains</span>
          </div>
          <p>Create a new domain with IMAP settings.</p>
          <div class="code-block">
            <h4>Request Body</h4>
            <pre><code>{
  "domain": "newdomain.com",
  "imap_host": "mail.newdomain.com",
  "imap_port": 993,
  "imap_user": "catch@newdomain.com",
  "imap_password": "password"
}</code></pre>
          </div>
        </div>
      </section>
      
      <section class="section" id="update-domain">
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="endpoint-method patch">PATCH</span>
            <span class="endpoint-path">/api/admin/domains/:id</span>
          </div>
          <p>Update domain configuration. All fields are optional.</p>
        </div>
      </section>
      
      <section class="section" id="delete-domain">
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="endpoint-method delete">DELETE</span>
            <span class="endpoint-path">/api/admin/domains/:id</span>
          </div>
          <p>Delete a domain. Also deletes all associated emails and messages.</p>
        </div>
      </section>
      
      <!-- API Keys -->
      <section class="section" id="list-keys">
        <h2>API Keys</h2>
        
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="endpoint-method get">GET</span>
            <span class="endpoint-path">/api/admin/api-keys</span>
          </div>
          <p>List all API keys. Keys are partially masked for security.</p>
        </div>
      </section>
      
      <section class="section" id="create-key">
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="endpoint-method post">POST</span>
            <span class="endpoint-path">/api/admin/api-keys</span>
          </div>
          <p>Generate a new API key. Full key is only shown once!</p>
          <div class="code-block">
            <h4>Request Body</h4>
            <pre><code>{ "name": "Production API Key" }</code></pre>
          </div>
          <div class="code-block">
            <h4>Response</h4>
            <pre><code>{
  "id": "uuid",
  "name": "Production API Key",
  "key": "mk_full_key_shown_only_once"
}</code></pre>
          </div>
          <div class="note">
            <strong>⚠️ Important:</strong> The full API key is only shown once. Store it securely!
          </div>
        </div>
      </section>
      
      <section class="section" id="delete-key">
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="endpoint-method delete">DELETE</span>
            <span class="endpoint-path">/api/admin/api-keys/:id</span>
          </div>
          <p>Revoke and delete an API key.</p>
        </div>
      </section>
      
      <!-- Utilities -->
      <section class="section" id="test-imap">
        <h2>Utilities</h2>
        
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="endpoint-method post">POST</span>
            <span class="endpoint-path">/api/admin/imap/test</span>
          </div>
          <p>Test IMAP connection before adding a new domain.</p>
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
      </section>
      
    </main>
  </div>
  
  <script>
    // Highlight active nav item based on scroll
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-section a');
    
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 100) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
  </script>
</body>
</html>
    `);
  }
}
