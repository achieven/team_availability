# NestJS Backend Debugging Guide

## 🚀 **Quick Start Debugging**

### **Option 1: VS Code Debugger (Recommended)**

1. **Open VS Code** in the project root
2. **Set breakpoints** in your TypeScript files
3. **Press F5** or go to Run & Debug panel
4. **Select "Debug NestJS Backend"** configuration
5. **Start debugging** - the app will pause at breakpoints

### **Option 2: Command Line Debugging**

```bash
# Start with debugger attached
cd backend
npm run debug

# Or with watch mode
npm run debug:watch
```

### **Option 3: Chrome DevTools**

1. **Start the debug server:**
   ```bash
   cd backend
   npm run debug
   ```

2. **Open Chrome** and go to `chrome://inspect`

3. **Click "Open dedicated DevTools for Node"**

4. **Set breakpoints** in the DevTools Sources panel

## 🔧 **Debugging Features**

### **Automatic Logging**
The app now includes automatic logging for:
- ✅ **API Requests** (method, URL, body, params)
- ✅ **API Responses** (status, response time, data)
- ✅ **Database Operations** (queries, data)
- ✅ **Errors** (stack traces, context)

### **Debug Service**
Use the `DebugService` in your components:

```typescript
import { DebugService } from '../debug/debug.service';

constructor(private debugService: DebugService) {}

// Log different levels
this.debugService.log('Info message');
this.debugService.debug('Debug message');
this.debugService.error('Error message', error.stack);

// Log API requests
this.debugService.logRequest('POST', '/api/auth/login', body);

// Log database operations
this.debugService.logDbOperation('INSERT', 'users', userData);
```

## 🎯 **Setting Breakpoints**

### **VS Code Breakpoints**
- **Line breakpoints**: Click on line numbers
- **Conditional breakpoints**: Right-click → Add Conditional Breakpoint
- **Log points**: Right-click → Add Logpoint

### **Common Breakpoint Locations**
```typescript
// Auth flow
backend/src/auth/auth.service.ts:validateUser()
backend/src/auth/auth.controller.ts:login()

// Database operations
backend/src/database/database.service.ts:query()
backend/src/status/status.service.ts:updateStatus()

// Request/Response
backend/src/debug/debug.interceptor.ts:intercept()
```

## 🔍 **Debugging Tips**

### **1. Environment Variables**
All environment variables are set in the VS Code debug configuration:
- Database connections
- JWT secrets
- Port configurations

### **2. Hot Reload**
The debugger supports hot reload - changes will restart the app automatically.

### **3. Console Output**
Check the Debug Console in VS Code for:
- Log messages
- Error stack traces
- Database query results

### **4. Variables Inspection**
In VS Code debugger, you can inspect:
- Request objects
- Database query results
- JWT tokens
- User data

## 🐛 **Common Debugging Scenarios**

### **Authentication Issues**
```typescript
// Set breakpoint in auth.service.ts
async validateUser(email: string, password: string) {
  // Check if user exists
  const user = await this.findUserByEmail(email);
  
  // Check password validation
  if (user && await bcrypt.compare(password, user.password)) {
    // Success path
  }
}
```

### **Database Connection Issues**
```typescript
// Set breakpoint in database.service.ts
async onModuleInit() {
  // Check connection
  this.cluster = await couchbase.connect(connectionString, {
    username,
    password,
  });
  
  // Check bucket access
  this.bucket = this.cluster.bucket(bucketName);
}
```

### **API Request Issues**
```typescript
// Set breakpoint in debug.interceptor.ts
intercept(context: ExecutionContext, next: CallHandler) {
  const request = context.switchToHttp().getRequest();
  // Inspect request object
  const { method, url, body, params, query } = request;
}
```

## 📊 **Performance Debugging**

### **Response Time Monitoring**
The debug interceptor automatically logs response times:
```
✅ POST /api/auth/login - 245ms
❌ GET /api/status/current - 1200ms - Database connection failed
```

### **Database Query Performance**
Add timing to database operations:
```typescript
const startTime = Date.now();
const result = await this.databaseService.query(query, params);
const queryTime = Date.now() - startTime;
this.debugService.log(`Query took ${queryTime}ms`);
```

## 🛠 **Advanced Debugging**

### **Custom Debug Configurations**
Add to `.vscode/launch.json`:
```json
{
  "name": "Debug Specific Test",
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/backend/node_modules/.bin/jest",
  "args": ["--testNamePattern", "auth.service"],
  "console": "integratedTerminal"
}
```

### **Remote Debugging**
For debugging in Docker containers:
```json
{
  "name": "Debug in Docker",
  "type": "node",
  "request": "attach",
  "port": 9229,
  "address": "localhost",
  "localRoot": "${workspaceFolder}/backend",
  "remoteRoot": "/app"
}
```

## 🎉 **Ready to Debug!**

Your NestJS backend is now fully configured for debugging with:
- ✅ VS Code integration
- ✅ Automatic logging
- ✅ Performance monitoring
- ✅ Error tracking
- ✅ Database operation logging

Start debugging by pressing **F5** in VS Code! 🚀
